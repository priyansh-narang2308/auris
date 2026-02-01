/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/db";
import { canUserChat, incrementChatUsage } from "@/lib/usage";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated. Please login to continue" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        currentPlan: true,
        subscriptionStatus: true,
        chatMessagesToday: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chattingChecking = await canUserChat(user.id);

    if (!chattingChecking.allowed) {
      return NextResponse.json(
        {
          error: chattingChecking.reason,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    await incrementChatUsage(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to increment chat usage of user" },
      { status: 500 }
    );
  }
}
