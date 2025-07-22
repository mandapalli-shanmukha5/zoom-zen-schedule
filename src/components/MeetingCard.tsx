import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Clock, 
  Calendar, 
  Repeat, 
  Edit, 
  Trash2, 
  ExternalLink,
  Bell,
  BellOff
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

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
  onJoin: (meeting: Meeting) => void;
  onToggleNotifications: (id: string) => void;
}

export function MeetingCard({ 
  meeting, 
  onEdit, 
  onDelete, 
  onJoin, 
  onToggleNotifications 
}: MeetingCardProps) {
  const isUpcoming = meeting.date > new Date();
  const timeString = meeting.time;
  
  return (
    <Card className="group bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
              {meeting.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(meeting.date, "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {timeString}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {meeting.isRecurring && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                Recurring
              </Badge>
            )}
            {isUpcoming && (
              <Badge variant="outline" className="border-warning text-warning">
                Upcoming
              </Badge>
            )}
          </div>
        </div>

        {meeting.notes && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {meeting.notes}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onJoin(meeting)}
              size="sm"
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(meeting.zoomLink, '_blank')}
              className="border-border/50"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleNotifications(meeting.id)}
              className="hover:bg-muted/50"
            >
              {meeting.notificationsEnabled ? (
                <Bell className="w-4 h-4 text-primary" />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(meeting)}
              className="hover:bg-muted/50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(meeting.id)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {meeting.meetingId && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>ID: {meeting.meetingId}</span>
              {meeting.passcode && <span>Passcode: {meeting.passcode}</span>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}