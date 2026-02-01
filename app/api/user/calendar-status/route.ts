import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ connected: false });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        calendarConnected: true,
        googleAccessToken: true,
      },
    });

    return NextResponse.json({
      connected: user?.calendarConnected && !!user.googleAccessToken,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ connected: false });
  }
}
