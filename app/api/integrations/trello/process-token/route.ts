import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const { token } = await request.json();

  if (!userId || !token) {
    return NextResponse.json(
      { error: "Missing user id or the token. Please review." },
      { status: 400 }
    );
  }

  try {
    await prisma.userIntegration.upsert({
      where: {
        userId_platform: {
          userId,
          platform: "trello",
        },
      },
      update: {
        accessToken: token,
        updatedAt: new Date(),
      },
      create: {
        userId,
        platform: "trello",
        accessToken: token,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving trello integration:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
