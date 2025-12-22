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
import { Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface PastMeetingsProps {
  pastMeetings: PastMeeting[];
  pastLoading: boolean;
  onMeetingClick: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAttendeeList: (attendees: any) => string[];
  getInitialsOfTheUser: (name: string) => string;
}

const PastMeetings = ({
  pastMeetings,
  pastLoading,
  onMeetingClick,
  getAttendeeList,
  getInitialsOfTheUser,
}: PastMeetingsProps) => {
  if (pastLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-4 animate-pulse"
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
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pastMeetings.length === 0) {
    return (
      <Empty className="border border-border rounded-lg bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
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
            quick reference.
          </p>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {pastMeetings.map((meeting) => (
        <div
          className="bg-card rounded-lg p-4 border-border border hover:shadow-md transition-shadow cursor-pointer"
          key={meeting.id}
          onClick={() => onMeetingClick(meeting.id)}
        >
          <div className="flex justify-between  items-start mb-3">
            <div className="flex items-center gap-3 flex-1">
              <h3 className="font-semibold text-lg text-foreground">
                {meeting.title}
              </h3>
              {meeting.attendees && (
                <AttendeeAvatars
                  attendees={meeting.attendees}
                  getAttendeeList={getAttendeeList}
                  getInitialsOfTheUser={getInitialsOfTheUser}
                />
              )}
            </div>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full ">
              Completed
            </span>
          </div>

          {meeting.description && (
            <p className="text-sm text-muted-foreground mb-3">
              {meeting.description}
            </p>
          )}

          <div className="text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(meeting.startTime), "PPp")} -{" "}
                {format(new Date(meeting.endTime), "pp")}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            <Button
              variant={"link"}
              className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors h-6 cursor-pointer"
              onClick={() => onMeetingClick(meeting.id)}
            >
              <ExternalLink className="h-3 w-3" />
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastMeetings;
