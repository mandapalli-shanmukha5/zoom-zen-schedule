import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, Timer, Coffee } from "lucide-react";
import { format, differenceInMinutes, differenceInSeconds } from "date-fns";

interface Meeting {
  id: string;
  title: string;
  zoomLink: string;
  time: string;
  date: Date;
}

interface NextMeetingWidgetProps {
  nextMeeting: Meeting | null;
  onJoin: (meeting: Meeting) => void;
  onSnooze: (meeting: Meeting) => void;
}

export function NextMeetingWidget({ nextMeeting, onJoin, onSnooze }: NextMeetingWidgetProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!nextMeeting) return;

    const updateCountdown = () => {
      const now = new Date();
      const meetingTime = new Date(nextMeeting.date);
      const minutesLeft = differenceInMinutes(meetingTime, now);
      const secondsLeft = differenceInSeconds(meetingTime, now);

      if (secondsLeft <= 0) {
        setTimeLeft("Meeting time!");
        setIsUrgent(true);
      } else if (minutesLeft < 60) {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        setTimeLeft(`${mins}m ${secs}s`);
        setIsUrgent(minutesLeft <= 5);
      } else if (minutesLeft < 1440) { // Less than 24 hours
        const hours = Math.floor(minutesLeft / 60);
        const mins = minutesLeft % 60;
        setTimeLeft(`${hours}h ${mins}m`);
        setIsUrgent(false);
      } else {
        const days = Math.floor(minutesLeft / 1440);
        const hours = Math.floor((minutesLeft % 1440) / 60);
        setTimeLeft(`${days}d ${hours}h`);
        setIsUrgent(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextMeeting]);

  if (!nextMeeting) {
    return (
      <Card className="bg-gradient-card border-0 shadow-medium">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Coffee className="w-12 h-12 mx-auto text-muted-foreground/50" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-2">No upcoming meetings</h3>
          <p className="text-sm text-muted-foreground">
            You're all caught up! Time for a coffee break.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-0 shadow-medium transition-all duration-300 ${
      isUrgent 
        ? "bg-gradient-to-br from-warning/10 to-warning/5 animate-pulse-glow" 
        : "bg-gradient-card"
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Timer className={`w-5 h-5 ${isUrgent ? "text-warning" : "text-primary"}`} />
          Next Meeting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{nextMeeting.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {format(nextMeeting.date, "MMM d, yyyy 'at' h:mm a")}
          </div>
        </div>

        <div className="text-center py-4">
          <div className={`text-3xl font-bold mb-2 ${
            isUrgent ? "text-warning" : "text-primary"
          }`}>
            {timeLeft}
          </div>
          <Badge variant={isUrgent ? "destructive" : "secondary"} className="text-xs">
            {isUrgent ? "Starting soon!" : "until meeting"}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onJoin(nextMeeting)}
            className={`flex-1 ${
              isUrgent 
                ? "bg-warning hover:bg-warning/90 text-warning-foreground" 
                : "bg-gradient-primary hover:shadow-glow"
            } transition-all duration-300`}
          >
            <Video className="w-4 h-4 mr-2" />
            Join Now
          </Button>
          <Button
            variant="outline"
            onClick={() => onSnooze(nextMeeting)}
            className="border-border/50"
          >
            <Timer className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}