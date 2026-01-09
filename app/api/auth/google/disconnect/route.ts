import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        // make eveyrhting false for that
        calendarConnected: false,
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Call disconnected succesfully 🎉",
    });
  } catch (error) {
    console.error("Error in disconnecting the call: ", error);
    return NextResponse.json(
      {
        error:
          "Error in disconnecting the calendar and call. Please try again later.",
      },
      { status: 500 }
    );
  }
}
