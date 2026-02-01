import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        calendarConnected: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const now = new Date();
    const upcomingMeetings = await prisma.meeting.findMany({
      where: {
        userId: user?.id,
        startTime: { gte: now },
        isFromCalendar: true,
      },
      orderBy: {
        startTime: "asc",
      },
      take: 20, //take only 20 events ok
    });

    // this is from the calendarEvents
    const events = upcomingMeetings.map((meeting: any) => ({
      id: meeting.calendarEventId || meeting.id,
      summary: meeting.title,
      start: {
        dateTime: meeting.startTime.toISOString(),
      },
      end: {
        dateTime: meeting.endTime.toISOString(),
      },
      //   in the database it is as a json so we are parsing it
      attendees: (() => {
        if (!meeting.attendees) return [];

        if (Array.isArray(meeting.attendees)) {
          return meeting.attendees;
        }

        if (typeof meeting.attendees === "string") {
          try {
            return JSON.parse(meeting.attendees);
          } catch {
            return [meeting.attendees];
          }
        }

        return [];
      })(),

      hangoutLink: meeting.meetingUrl,
      conferenceData: meeting.meetingUrl //conference entry points, derived from the `meetingUrl`
        ? { entryPoints: [{ uri: meeting.meetingUrl }] }
        : null,
      botScheduled: meeting.botScheduled,
      meetingId: meeting.id,
    }));

    return NextResponse.json({
      events,
      connected: user.calendarConnected,
      source: "database",
    });
  } catch (error) {
    console.error(`Failed to fetch the calendar info of the user: ${error}`);
    return NextResponse.json(
      {
        error: "Failed to fetch the calendar information of the user.",
        events: [],
        connected: false,
      },
      { status: 500 }
    );
  }
}
