import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Clock, 
  Bell, 
  Monitor, 
  Download, 
  Upload, 
  Moon, 
  Sun 
} from "lucide-react";

interface SettingsData {
  timeFormat: "12" | "24";
  defaultReminderTime: number;
  joinMethod: "browser" | "app";
  desktopNotifications: boolean;
  darkMode: boolean;
  autoJoin: boolean;
}

interface SettingsPanelProps {
  settings: SettingsData;
  onSettingsChange: (settings: SettingsData) => void;
  onExportData: () => void;
  onImportData: () => void;
}

export function SettingsPanel({ 
  settings, 
  onSettingsChange, 
  onExportData, 
  onImportData 
}: SettingsPanelProps) {
  const updateSetting = (key: keyof SettingsData, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-medium animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Format */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Format
          </Label>
          <Select 
            value={settings.timeFormat} 
            onValueChange={(value: "12" | "24") => updateSetting("timeFormat", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12-hour (AM/PM)</SelectItem>
              <SelectItem value="24">24-hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Default Reminder Time */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Default Reminder
          </Label>
          <Select 
            value={settings.defaultReminderTime.toString()} 
            onValueChange={(value) => updateSetting("defaultReminderTime", parseInt(value))}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes before</SelectItem>
              <SelectItem value="10">10 minutes before</SelectItem>
              <SelectItem value="15">15 minutes before</SelectItem>
              <SelectItem value="30">30 minutes before</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Join Method */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Join Method
          </Label>
          <Select 
            value={settings.joinMethod} 
            onValueChange={(value: "browser" | "app") => updateSetting("joinMethod", value)}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="browser">Browser</SelectItem>
              <SelectItem value="app">Zoom App</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-border/30" />

        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Desktop Notifications</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Show notifications for upcoming meetings
              </p>
            </div>
            <Switch
              checked={settings.desktopNotifications}
              onCheckedChange={(checked) => updateSetting("desktopNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-join Meetings</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically open meeting links at scheduled time
              </p>
            </div>
            <Switch
              checked={settings.autoJoin}
              onCheckedChange={(checked) => updateSetting("autoJoin", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Dark Mode
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting("darkMode", checked)}
            />
          </div>
        </div>

        <Separator className="bg-border/30" />

        {/* Data Management */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Data Management</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
              className="flex-1 border-border/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onImportData}
              className="flex-1 border-border/50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}