import { chatWithMeeting } from "@/lib/rag";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated." },
      { status: 401 },
    );
  }

  const { meetingId, question } = await request.json();

  if (!meetingId || !question) {
    return NextResponse.json(
      { error: "Missing meetingId or the question. Kindly check." },
      { status: 400 },
    );
  }

  try {
    const resp = await chatWithMeeting(userId, meetingId, question);

    return NextResponse.json(resp);
  } catch (error) {
    console.error("Error in the chat with the meeting:", error);
    return NextResponse.json(
      { error: "Faled to process the question. Please try again later." },
      { status: 500 },
    );
  }
}
