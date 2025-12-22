import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CalendarEvent } from "../hooks/useMeeting";
import { Clock, RefreshCcw, Calendar, PlugZap } from "lucide-react";
import { format } from "date-fns";

interface UpcomingMeetingProps {
  upcomingEvents: CalendarEvent[];
  connected: boolean;
  error: string;
  loading: boolean;
  initialLoading: boolean;
  botToggles: { [key: string]: boolean };
  onRefresh: () => void;
  onToggleBot: (eventId: string) => void;
  onConnectCalendar: () => void;
}

const UpcomingMeetings = ({
  upcomingEvents,
  connected,
  error,
  loading,
  initialLoading,
  botToggles,
  onRefresh,
  onToggleBot,
  onConnectCalendar,
}: UpcomingMeetingProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Upcoming Meetings
        </h2>
        <Badge variant="outline" className="text-muted-foreground">
          {upcomingEvents.length}
        </Badge>
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="p-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {initialLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse rounded-xl border-border">
              <CardContent className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-5 w-10 bg-muted rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!initialLoading && !connected && (
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-foreground">
              Connect your calendar
            </h3>
            <p className="text-sm text-muted-foreground">
              Link Google Calendar to view and manage upcoming meetings.
            </p>
            <Button
              onClick={onConnectCalendar}
              disabled={loading}
              className="w-full bg-orange-500 text-white cursor-pointer hover:bg-orange-500/90"
            >
              {loading ? "Connecting…" : "Connect Google Calendar"}
            </Button>
          </CardContent>
        </Card>
      )}

      {!initialLoading && connected && upcomingEvents.length === 0 && (
        <Card className="rounded-xl border-border bg-card">
          <CardContent className="p-6 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              No upcoming meetings
            </h3>
            <p className="text-xs text-muted-foreground">
              Your calendar is clear for now.
            </p>
          </CardContent>
        </Card>
      )}

      {!initialLoading && connected && upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="w-full flex items-center gap-2"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing…" : "Refresh"}
          </Button>

          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="rounded-xl border-border transition hover:border-orange-500/30 hover:bg-orange-500/3"
            >
              <CardContent className="p-4 space-y-3 relative">
                <div className="absolute top-4 right-4">
                  <Switch
                    checked={!!botToggles[event.id]} //negates the vlaue so give true or false
                    onCheckedChange={() => onToggleBot(event.id)}
                    aria-label="Toggle bot for the meeting"
                  />
                </div>

                <div className="pr-12">
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                    {event.summary || "Untitled meeting"}
                  </h4>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(
                        new Date(
                          event.start?.dateTime || event.start?.date || ""
                        ),
                        "MMM d, h:mm a"
                      )}
                    </span>
                  </div>

                  {event.attendees && (
                    <span>{event.attendees.length} attendees</span>
                  )}
                </div>

                {(event.hangoutLink || event.location) && (
                  <a
                    href={event.hangoutLink || event.location || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-orange-500 text-white hover:bg-orange-500/90 flex items-center gap-2"
                    >
                      <PlugZap className="h-4 w-4" />
                      Join meeting
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMeetings;
