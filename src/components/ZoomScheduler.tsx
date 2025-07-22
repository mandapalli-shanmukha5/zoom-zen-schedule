import { useState, useEffect } from "react";
import { MeetingForm } from "./MeetingForm";
import { MeetingCard } from "./MeetingCard";
import { NextMeetingWidget } from "./NextMeetingWidget";
import { SearchAndFilter } from "./SearchAndFilter";
import { SettingsPanel } from "./SettingsPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Plus, 
  Settings, 
  Video, 
  Clock,
  Zap
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  zoomLink: string;
  meetingId?: string;
  passcode?: string;
  time: string;
  date: Date;
  isRecurring: boolean;
  repeatDays?: string[];
  notes?: string;
  notificationsEnabled: boolean;
}

interface SettingsData {
  timeFormat: "12" | "24";
  defaultReminderTime: number;
  joinMethod: "browser" | "app";
  desktopNotifications: boolean;
  darkMode: boolean;
  autoJoin: boolean;
}

export function ZoomScheduler() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [settings, setSettings] = useState<SettingsData>({
    timeFormat: "12",
    defaultReminderTime: 10,
    joinMethod: "browser",
    desktopNotifications: true,
    darkMode: false,
    autoJoin: false,
  });
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMeetings = localStorage.getItem('zoomMeetings');
    const savedSettings = localStorage.getItem('zoomSettings');
    
    if (savedMeetings) {
      const parsedMeetings = JSON.parse(savedMeetings).map((m: any) => ({
        ...m,
        date: new Date(m.date)
      }));
      setMeetings(parsedMeetings);
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to localStorage whenever meetings or settings change
  useEffect(() => {
    localStorage.setItem('zoomMeetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('zoomSettings', JSON.stringify(settings));
    
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const handleAddMeeting = (formData: any) => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...formData,
      notificationsEnabled: settings.desktopNotifications,
    };
    
    setMeetings(prev => [...prev, newMeeting]);
    toast({
      title: "Meeting scheduled!",
      description: `"${formData.title}" has been added to your calendar.`,
    });
  };

  const handleEditMeeting = (meeting: Meeting) => {
    toast({
      title: "Edit meeting",
      description: "Meeting editing will be available soon!",
    });
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Meeting deleted",
      description: "The meeting has been removed from your schedule.",
      variant: "destructive",
    });
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    if (settings.joinMethod === "app") {
      window.open(`zoommtg://zoom.us/join?confno=${meeting.meetingId}`, '_blank');
    } else {
      window.open(meeting.zoomLink, '_blank');
    }
    
    toast({
      title: "Joining meeting",
      description: `Opening "${meeting.title}" in ${settings.joinMethod === "app" ? "Zoom app" : "browser"}...`,
    });
  };

  const handleToggleNotifications = (id: string) => {
    setMeetings(prev => prev.map(m => 
      m.id === id ? { ...m, notificationsEnabled: !m.notificationsEnabled } : m
    ));
  };

  const handleSnooze = (meeting: Meeting) => {
    toast({
      title: "Meeting snoozed",
      description: "You'll be reminded again in 5 minutes.",
    });
  };

  const handleExportData = () => {
    const data = {
      meetings,
      settings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zoom-scheduler-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your meetings and settings have been saved to a file.",
    });
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.meetings) {
            const importedMeetings = data.meetings.map((m: any) => ({
              ...m,
              date: new Date(m.date)
            }));
            setMeetings(importedMeetings);
          }
          if (data.settings) {
            setSettings(data.settings);
          }
          
          toast({
            title: "Data imported",
            description: "Your meetings and settings have been restored.",
          });
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The file format is invalid or corrupted.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Filter meetings based on search and filter criteria
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const meetingDate = new Date(meeting.date.getFullYear(), meeting.date.getMonth(), meeting.date.getDate());
    
    switch (activeFilter) {
      case "today":
        return matchesSearch && meetingDate.getTime() === today.getTime();
      case "recurring":
        return matchesSearch && meeting.isRecurring;
      case "expired":
        return matchesSearch && meeting.date < now;
      default:
        return matchesSearch;
    }
  });

  // Get next upcoming meeting
  const upcomingMeetings = meetings
    .filter(m => m.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextMeeting = upcomingMeetings[0] || null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Video className="w-6 h-6 text-primary-foreground" />
                </div>
                Zoom Scheduler
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your Zoom meetings with ease
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {meetings.length} meetings scheduled
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Meeting
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Next Meeting Widget */}
              <div className="lg:col-span-1">
                <NextMeetingWidget
                  nextMeeting={nextMeeting}
                  onJoin={handleJoinMeeting}
                  onSnooze={handleSnooze}
                />
              </div>
              
              {/* Statistics Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-card p-4 rounded-lg border-0 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{meetings.length}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-card p-4 rounded-lg border-0 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Clock className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-card p-4 rounded-lg border-0 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {meetings.filter(m => m.isRecurring).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Recurring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <SearchAndFilter
              onSearch={setSearchQuery}
              onFilter={setActiveFilter}
              activeFilter={activeFilter}
              searchQuery={searchQuery}
            />

            {/* Meetings List */}
            <div className="space-y-4">
              {filteredMeetings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchQuery || activeFilter !== "all" ? "No meetings found" : "No meetings scheduled"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || activeFilter !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by adding your first meeting"
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMeetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onEdit={handleEditMeeting}
                      onDelete={handleDeleteMeeting}
                      onJoin={handleJoinMeeting}
                      onToggleNotifications={handleToggleNotifications}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="add">
            <div className="max-w-2xl mx-auto">
              <MeetingForm onSubmit={handleAddMeeting} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl mx-auto">
              <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
                onExportData={handleExportData}
                onImportData={handleImportData}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}