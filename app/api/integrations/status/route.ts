/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const integrations = await prisma.userIntegration.findMany({
      where: {
        userId: user.id,
      },
    });

    const allPlatformsIntegrated = [
      { platform: "trello", name: "Trello", logo: "🔷", connected: false },
      { platform: "jira", name: "Jira", logo: "🔵", connected: false },
      { platform: "asana", name: "Asana", logo: "🟠", connected: false },
    ];

    const result: any[] = allPlatformsIntegrated.map((platform) => {
      const integration = integrations.find(
        (inte) => inte.platform === platform.platform
      );
      return {
        ...platform,
        connected: Boolean(integration),
        boardName: integration?.boardName,
        projectName: integration?.projectName,
      };
    });

    const dbUser = await prisma.user.findFirst({
      where: {
        clerkId: user.id,
      },
    });

    if (dbUser?.slackConnected) {
      result.push({
        platform: "slack",
        name: "Slack",
        logo: "💬",
        connected: Boolean(dbUser.slackConnected),
        channelName: dbUser.slackConnected
          ? dbUser.preferredChannelName || "Not set"
          : undefined,
      });
    } else {
      result.push({
        platform: "slack",
        name: "Slack",
        logo: "💬",
        connected: false,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching integration status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
