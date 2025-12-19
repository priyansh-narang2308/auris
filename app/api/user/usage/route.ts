import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated. Please login to continue" },
        { status: 401 }
      );
    }

    // Fetching the user fromt the database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        currentPlan: true,
        subscriptionStatus: true,
        meetingsThisMonth: true,
        chatMessagesToday: true,
        billingPeriodStart: true,
      },
    });

    if (!user) {
      const created = await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
        },
        select: {
          currentPlan: true,
          subscriptionStatus: true,
          meetingsThisMonth: true,
          chatMessagesToday: true,
          billingPeriodStart: true,
        },
      });

      return NextResponse.json(created);
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch the user, ${error}` },
      { status: 500 }
    );
  }
}
