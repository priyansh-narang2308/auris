import { prisma } from "@/lib/db";
import { chatWithAllMeetings } from "@/lib/rag";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question, userId: slackUserId } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is missing. Please provide a question to answer." },
        { status: 400 },
      );
    }

    let targetUserId = slackUserId;

    if (!slackUserId) {
      const { userId: clerkUserId } = await auth();
      if (!clerkUserId) {
        return NextResponse.json({ error: "User not authorized. Please try again later." }, { status: 401 });
      }

      targetUserId = clerkUserId;
    } else {
      const user = await prisma.user.findFirst({
        where: {
          id: slackUserId,
        },
        select: {
          clerkId: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      targetUserId = user.clerkId;
    }

    const response = await chatWithAllMeetings(targetUserId, question);

    return NextResponse.json(response);
  } catch (error) {
    console.error("error in chat:", error);
    return NextResponse.json(
      {
        error: "Failed to process the provided question",
        answer:
          "I encountered an error while searching your meetings. Please try again.",
      },
      { status: 500 },
    );
  }
}
