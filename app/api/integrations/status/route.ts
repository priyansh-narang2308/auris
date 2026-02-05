import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserIntegration } from "@prisma/client";

export const runtime = "nodejs";

type IntegrationStatus = {
  platform: string;
  name: string;
  logo: string;
  connected: boolean;
  boardName?: string | null;
  projectName?: string | null;
  channelName?: string;
};

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized user" },
        { status: 401 }
      );
    }

    // Properly typed integrations
    const integrations: UserIntegration[] =
      await prisma.userIntegration.findMany({
        where: {
          userId: user.id,
        },
      });

    const allPlatformsIntegrated = [
      { platform: "trello", name: "Trello", logo: "🔷" },
      { platform: "jira", name: "Jira", logo: "🔵" },
      { platform: "asana", name: "Asana", logo: "🟠" },
    ];

    const result: IntegrationStatus[] = allPlatformsIntegrated.map(
      (platform) => {
        const integration = integrations.find(
          (inte: UserIntegration) => inte.platform === platform.platform
        );

        return {
          ...platform,
          connected: Boolean(integration),
          boardName: integration?.boardName ?? null,
          projectName: integration?.projectName ?? null,
        };
      }
    );

    const dbUser = await prisma.user.findFirst({
      where: {
        clerkId: user.id,
      },
      select: {
        slackConnected: true,
        preferredChannelName: true,
      },
    });

    result.push({
      platform: "slack",
      name: "Slack",
      logo: "💬",
      connected: Boolean(dbUser?.slackConnected),
      channelName: dbUser?.slackConnected
        ? dbUser.preferredChannelName || "Not set"
        : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching integration status:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
