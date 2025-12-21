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

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const pastMeetings = await prisma.meeting.findMany({
      where: {
        userId: user?.id,
        meetingEnded: true,
      },
      orderBy: {
        endTime: "desc",
      },
      take: 10,
    });

    return NextResponse.json({ meetings: pastMeetings });
  } catch (error) {
    console.error(`Failed to fetch the past meetings of the user: ${error}`);
    return NextResponse.json(
      {
        error: "Failed to fetch the past meetings of the user.",
        meetings: [],
      },
      { status: 500 }
    );
  }
}
