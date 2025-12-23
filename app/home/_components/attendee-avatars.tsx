"use client";

import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

interface AttendeeAvatarsProps {
  attendees: unknown;
  getAttendeeList: (attendees: unknown) => string[];
  getInitialsOfTheUser: (name: string) => string;
}


export default function AttendeeAvatars({
  attendees,
  getAttendeeList,
  getInitialsOfTheUser,
}: AttendeeAvatarsProps) {
  const attendeeList = getAttendeeList(attendees);

  const tooltipItems = attendeeList.slice(0, 4).map((email, index) => ({
    id: index,
    name: email,
    initials: getInitialsOfTheUser(email),
  }));

  return (
    <div className="flex items-center">
      <AnimatedTooltip items={tooltipItems} />

      {attendeeList.length > 4 && (
        <div className="-ml-2 h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
          +{attendeeList.length - 4}
        </div>
      )}
    </div>
  );
}
