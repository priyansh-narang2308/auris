import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> },
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const { meetingId } = await params;

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: meetingId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            clerkId: true,
          },
        },
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found. Please try again later." },
        { status: 404 },
      );
    }

    const reepssDataaa = {
      ...meeting,
      isOwner: clerkUserId === meeting.user?.clerkId,
    };

    return NextResponse.json(reepssDataaa);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { meetingId: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const { meetingId } = params;

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: meetingId,
      },
      include: {
        user: true,
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found. Please try again." },
        { status: 404 },
      );
    }

    if (meeting.user.clerkId !== userId) {
      return NextResponse.json(
        { error: "User not authorized to delete this meeting" },
        { status: 403 },
      );
    }

    await prisma.meeting.delete({
      where: {
        id: meetingId,
      },
    });

    // Delete that particular id ITSELF!
    return NextResponse.json({
      success: true,
      message: "Meeting deleted succesfully.",
    });
  } catch (error) {
    console.error("failed to delere meeting", error);
    return NextResponse.json(
      { error: "failed to delete meeting" },
      { status: 500 },
    );
  }
}
