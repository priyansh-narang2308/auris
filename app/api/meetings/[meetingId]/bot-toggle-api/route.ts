import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { meetingId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { meetingId } = await params;
    const { botScheduled } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const meeting = await prisma.meeting.update({
      where: {
        id: meetingId,
        userId: user?.id,
      },
      data: {
        botScheduled: botScheduled,
      },
    });

    return NextResponse.json({
      success: true,
      botScheduled: meeting.botScheduled,
      message: `Bot ${botScheduled ? "enabled" : "disabled"} for the meeting`,
    });
  } catch (error) {
    console.error("Bot toggle error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
