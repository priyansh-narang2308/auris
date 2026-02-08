/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authorized" },
        { status: 401 },
      );
    }

    const { text } = await request.json();

    const { meetingId } = await params;

    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        user: { clerkId: userId },
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found. Please try again later." },
        { status: 404 },
      );
    }

    const existingItems = (meeting.actionItems as any[]) || [];

    const nextId =
      existingItems.length > 0
        ? Math.max(...existingItems.map((item: any) => item.id || 0)) + 1
        : 1;

    const newActionItem = {
      id: nextId,
      text,
    };

    const updatedActionItems = [...existingItems, newActionItem];

    await prisma.meeting.update({
      where: {
        id: meetingId,
      },
      data: {
        actionItems: updatedActionItems,
      },
    });

    return NextResponse.json(newActionItem);
  } catch (error) {
    console.error("Error adding action item", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
