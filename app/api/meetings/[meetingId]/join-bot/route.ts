import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { joinMeetingBot } from "@/lib/meeting-baas";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ meetingId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { meetingId } = await params;

        const result = await joinMeetingBot(meetingId);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Join bot API error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
