import { IconCalendarOff } from "@tabler/icons-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { PastMeeting } from "../hooks/useMeeting";
import AttendeeAvatars from "./attendee-avatars";
import { Clock, ExternalLink, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PastMeetingsProps {
  pastMeetings: PastMeeting[];
  pastLoading: boolean;
  onMeetingClick: (id: string) => void;
  onRefresh?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAttendeeList: (attendees: any) => string[];
  getInitialsOfTheUser: (name: string) => string;
}

const PastMeetings = ({
  pastMeetings,
  pastLoading,
  onMeetingClick,
  onRefresh,
  getAttendeeList,
  getInitialsOfTheUser,
}: PastMeetingsProps) => {
  if (pastLoading) {
    return (
      <div className="space-y-8 mt-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="h-5 w-48 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-6 rounded-full bg-muted" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pastMeetings.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-end">
          {onRefresh && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              className="text-white/80 cursor-pointer hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Empty className="rounded-xl border border-border bg-card">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="text-orange-500/80">
              <IconCalendarOff />
            </EmptyMedia>
            <EmptyTitle>No past meetings</EmptyTitle>
            <EmptyDescription>
              Meetings you&apos;ve already attended will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <p className="text-sm text-muted-foreground">
              Once you start or join meetings, we&apos;ll keep a record here for
              quick access.
            </p>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        {onRefresh && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            className="text-white/80 hover:bg-white/5"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {pastMeetings.map((meeting) => (
        <Card
          key={meeting.id}
          onClick={() => onMeetingClick(meeting.id)}
          className="
  group cursor-pointer rounded-xl border border-border
  transition-all
  hover:border-orange-500/40
  hover:bg-orange-500/5
"

        >
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-base font-semibold text-foreground">
                  {meeting.title}
                </h3>
                <Badge
                  variant="outline"
                  className="border-green-500/40 text-green-500"
                >
                  Completed
                </Badge>
              </div>
              {meeting.attendees && (
                <AttendeeAvatars
                  attendees={meeting.attendees}
                  getAttendeeList={getAttendeeList}
                  getInitialsOfTheUser={getInitialsOfTheUser}
                />
              )}
            </div>

            {meeting.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {meeting.description}
              </p>
            )}

            <Separator />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {format(new Date(meeting.startTime), "PPp")} –{" "}
                  {format(new Date(meeting.endTime), "pp")}
                </span>
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 flex items-center gap-1"
                  onClick={() => onMeetingClick(meeting.id)}
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PastMeetings;
