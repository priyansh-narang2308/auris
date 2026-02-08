import { processCompletedMeeting } from "@/lib/meeting-processor";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const webhook = await request.json()

        if (webhook.event === 'complete') {
            const webhookData = webhook.data

            const result = await processCompletedMeeting(
                webhookData.bot_id,
                webhookData.transcript,
                webhookData.mp4,
                webhookData.speakers
            );

            if (!result.success && result.error === 'Meeting not found') {
                return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
            }

            return NextResponse.json({
                success: true,
                message: 'Meeting processed succesfully',
                meetingId: result.meetingId
            })
        }
        return NextResponse.json({
            success: true,
            message: 'Webhook recieved but no action needed.'
        })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}