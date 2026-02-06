import { prisma } from "./db";

export async function joinMeetingBot(meetingId: string) {
    try {
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { user: true },
        });

        if (!meeting) {
            throw new Error("Meeting not found");
        }

        if (!meeting.meetingUrl) {
            throw new Error("Meeting URL is missing");
        }

        // Check plan limits
        const canSchedule = await canUserScheduleMeeting(meeting.user);
        if (!canSchedule.allowed) {
            throw new Error(canSchedule.reason);
        }

        const requestBody: any = {
            meeting_url: meeting.meetingUrl,
            bot_name: meeting.user.botName || 'Aurisia',
            reserved: false,
            recording_mode: 'speaker_view',
            speech_to_text: { provider: "Default" },
            webhook_url: process.env.WEBHOOK_URL,
            extra: {
                meeting_id: meeting.id,
                user_id: meeting.userId
            }
        };

        if (meeting.user.botImageUrl) {
            requestBody.bot_image = meeting.user.botImageUrl;
        }

        const response = await fetch('https://api.meetingbaas.com/bots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-meeting-baas-api-key': process.env.MEETING_BAAS_API_KEY!
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Meeting Baas API failed: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                botSent: true,
                botId: data.bot_id,
                botJoinedAt: new Date(),
                botScheduled: true
            }
        });

        // Increment usage
        await prisma.user.update({
            where: { id: meeting.userId },
            data: {
                meetingsThisMonth: {
                    increment: 1
                }
            }
        });

        return { success: true, botId: data.bot_id };
    } catch (error: any) {
        console.error(`Error joining bot for meeting ${meetingId}:`, error.message);
        throw error;
    }
}

export async function getBotStatus(botId: string) {
    const response = await fetch(`https://api.meetingbaas.com/bots/${botId}`, {
        method: "GET",
        headers: {
            "x-meeting-baas-api-key": process.env.MEETING_BAAS_API_KEY!,
        },
    });

    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch bot status: ${response.status}`);
    }

    return await response.json();
}

export async function syncMeetingStatus(meetingId: string) {
    const meeting = await prisma.meeting.findUnique({
        where: { id: meetingId },
    });

    if (!meeting || !meeting.botId) return { success: false, error: "No bot associated" };

    const botData = await getBotStatus(meeting.botId);
    if (!botData) return { success: false, error: "Bot not found on Meeting Baas" };

    // If the bot is finished, update our DB
    if (botData.bot?.status?.code === "complete" || botData.bot?.transcript) {
        await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                meetingEnded: true,
                transcriptReady: true,
                transcript: botData.bot.transcript || null,
                recordingUrl: botData.bot.mp4 || null,
                speakers: botData.bot.speakers || null,
            },
        });
        return { success: true, status: "completed", updated: true };
    }

    return { success: true, status: botData.bot?.status?.code, updated: false };
}

async function canUserScheduleMeeting(user: any) {
    const PLAN_LIMITS: any = {
        free: { meetings: 3 },
        starter: { meetings: 10 },
        pro: { meetings: 30 },
        premium: { meetings: -1 }
    };
    const limits = PLAN_LIMITS[user.currentPlan] || PLAN_LIMITS.free;

    if (user.currentPlan !== 'free' && user.subscriptionStatus !== 'active') {
        return {
            allowed: false,
            reason: "Inactive subscription - upgrade required"
        };
    }

    if (limits.meetings !== -1 && user.meetingsThisMonth >= limits.meetings) {
        return {
            allowed: false,
            reason: `Monthly limit reached (${user.meetingsThisMonth}/${limits.meetings})`
        };
    }
    return { allowed: true };
}
