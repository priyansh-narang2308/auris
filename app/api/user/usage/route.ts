import { prisma } from "@/lib/db";
import { auth, createClerkClient } from "@clerk/nextjs/server";
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

    // Fetching the user from the database
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
        name: true,
        email: true,
      },
    });

    if (!user) {
      const clerk = await createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const clerkUser = await clerk.users.getUser(userId);
      
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null;

      const created = await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
          email,
          name,
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
