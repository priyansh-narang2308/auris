import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
  }

  try {
    await prisma.userIntegration.delete({
      where: {
        userId_platform: {
          userId: userId,
          platform: "jira",
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting the user from jira:", error);
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 }
    );
  }
}
