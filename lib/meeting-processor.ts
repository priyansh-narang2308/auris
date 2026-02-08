/* eslint-disable @typescript-eslint/no-explicit-any */
import { processMeetingTranscript } from "@/lib/ai-processor";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { sendMeetingSummaryEmail } from "@/lib/email-service-free";
import { processTranscript as processForRAG } from "@/lib/rag";
import { incrementMeetingUsage } from "@/lib/usage";

export async function processCompletedMeeting(botId: string, transcript: any[] | string | null, mp4: string | null, speakers: any) {
    const meeting = await prisma.meeting.findFirst({
        where: { botId },
        include: { user: true }
    });

    if (!meeting) {
        console.error('Meeting not found for bot id:', botId);
        return { success: false, error: 'Meeting not found' };
    }

    // Update meeting with basic data
    await prisma.meeting.update({
        where: { id: meeting.id },
        data: {
            meetingEnded: true,
            transcriptReady: true,
            transcript: (transcript || Prisma.DbNull) as any,
            recordingUrl: mp4 || null,
            speakers: (speakers || Prisma.DbNull) as any
        }
    });

    // If already processed, don't re-process
    if (meeting.processed || !transcript) {
        return { success: true, meetingId: meeting.id, alreadyProcessed: !!meeting.processed };
    }

    try {
        await incrementMeetingUsage(meeting.userId);

        const processed = await processMeetingTranscript(transcript);

        let transcriptText = '';
        if (Array.isArray(transcript)) {
            transcriptText = (transcript as any[])
                .map((item: any) => `${item.speaker || 'Speaker'}: ${item.words.map((w: any) => w.word).join(' ')}`)
                .join('\n');
        } else {
            transcriptText = transcript;
        }

        // Send Email
        if (meeting.user.email && !meeting.emailSent) {
            try {
                await sendMeetingSummaryEmail({
                    userEmail: meeting.user.email,
                    userName: meeting.user.name || 'User',
                    meetingTitle: meeting.title,
                    summary: processed.summary,
                    actionItems: processed.actionItems,
                    meetingId: meeting.id,
                    meetingDate: meeting.startTime.toLocaleDateString()
                });

                await prisma.meeting.update({
                    where: { id: meeting.id },
                    data: {
                        emailSent: true,
                        emailSentAt: new Date()
                    }
                });
            } catch (emailError) {
                console.error('Failed to send the email:', emailError);
            }
        }

        // RAG processing
        await processForRAG(meeting.id, meeting.userId, transcriptText, meeting.title);

        // Final update
        await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                summary: processed.summary,
                actionItems: processed.actionItems,
                processed: true,
                processedAt: new Date(),
                ragProcessed: true,
                ragProcessedAt: new Date()
            }
        });

        return { success: true, meetingId: meeting.id };
    } catch (error) {
        console.error('Failed to process the transcript:', error);

        await prisma.meeting.update({
            where: { id: meeting.id },
            data: {
                processed: true,
                processedAt: new Date(),
                summary: 'Processing failed. Please check the transcript manually.',
                actionItems: []
            }
        });

        return { success: false, error: 'Processing failed', meetingId: meeting.id };
    }
}
