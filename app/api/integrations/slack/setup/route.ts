import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { WebClient } from "@slack/web-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user?.slackTeamId) {
      return NextResponse.json(
        {
          error: "User does not have a Slack team ID",
        },
        {
          status: 400,
        },
      );
    }

    const installation = await prisma.slackInstallation.findUnique({
      where: {
        teamId: user.slackTeamId,
      },
    });

    if (!installation) {
      return NextResponse.json(
        { error: "Slack installation not found" },
        { status: 400 },
      );
    }

    const slack = new WebClient(installation.botToken);

    const channels = await slack.conversations.list({
      types: "public_channel",
      limit: 50,
    });

    return NextResponse.json({
      channels:
        channels.channels?.map((channell) => ({
          id: channell.id,
          name: channell.name,
        })) || [],
    });
  } catch (error) {
    console.error("Error fetching Slack channels:", error);
    return NextResponse.json(
      { error: "Failed to fetch Slack channels" },
      { status: 500 },
    );
  }
}

export async function Position(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const { channelId, channelName } = await request.json();

    await prisma.user.updateMany({
      where: {
        clerkId: userId,
      },
      data: {
        preferredChannelId: channelId,
        preferredChannelName: channelName,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting preferred Slack channel:", error);
    return NextResponse.json(
      { error: "Failed to set preferred Slack channel" },
      { status: 500 },
    );
  }
}
