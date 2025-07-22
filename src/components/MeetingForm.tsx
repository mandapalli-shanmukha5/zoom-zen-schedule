import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Clock, Video, Users, Settings, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MeetingFormData {
  title: string;
  zoomLink: string;
  meetingId: string;
  passcode: string;
  time: string;
  date: Date | undefined;
  isRecurring: boolean;
  repeatDays: string[];
  notes: string;
}

const weekDays = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

export function MeetingForm({ onSubmit }: { onSubmit: (data: MeetingFormData) => void }) {
  const [formData, setFormData] = useState<MeetingFormData>({
    title: "",
    zoomLink: "",
    meetingId: "",
    passcode: "",
    time: "",
    date: undefined,
    isRecurring: false,
    repeatDays: [],
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleRepeatDayChange = (dayId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      repeatDays: checked 
        ? [...prev.repeatDays, dayId]
        : prev.repeatDays.filter(d => d !== dayId)
    }));
  };

  return (
    <Card className="bg-gradient-card shadow-medium border-0 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plus className="w-5 h-5 text-primary" />
          Schedule New Meeting
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Meeting Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Weekly team standup"
              className="bg-background/50 border-border/50 focus:bg-background transition-colors"
              required
            />
          </div>

          {/* Zoom Link */}
          <div className="space-y-2">
            <Label htmlFor="zoomLink" className="text-sm font-medium flex items-center gap-2">
              <Video className="w-4 h-4" />
              Zoom Link *
            </Label>
            <Input
              id="zoomLink"
              type="url"
              value={formData.zoomLink}
              onChange={(e) => setFormData(prev => ({ ...prev, zoomLink: e.target.value }))}
              placeholder="https://zoom.us/j/1234567890"
              className="bg-background/50 border-border/50 focus:bg-background transition-colors"
              required
            />
          </div>

          {/* Meeting ID and Passcode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingId" className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Meeting ID
              </Label>
              <Input
                id="meetingId"
                value={formData.meetingId}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingId: e.target.value }))}
                placeholder="123 456 7890"
                className="bg-background/50 border-border/50 focus:bg-background transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passcode" className="text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Passcode
              </Label>
              <Input
                id="passcode"
                value={formData.passcode}
                onChange={(e) => setFormData(prev => ({ ...prev, passcode: e.target.value }))}
                placeholder="Optional"
                className="bg-background/50 border-border/50 focus:bg-background transition-colors"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 border-border/50",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                required
              />
            </div>
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
            <div>
              <Label className="text-sm font-medium">Recurring Meeting</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Repeat this meeting on selected days
              </p>
            </div>
            <Switch
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
            />
          </div>

          {/* Repeat Days */}
          {formData.isRecurring && (
            <div className="space-y-3 animate-slide-up">
              <Label className="text-sm font-medium">Repeat on</Label>
              <div className="flex gap-2 flex-wrap">
                {weekDays.map((day) => (
                  <label
                    key={day.id}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                      formData.repeatDays.includes(day.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/50 border-border/50 hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={formData.repeatDays.includes(day.id)}
                      onCheckedChange={(checked) => handleRepeatDayChange(day.id, !!checked)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Meeting agenda, important notes..."
              className="bg-background/50 border-border/50 focus:bg-background transition-colors resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}