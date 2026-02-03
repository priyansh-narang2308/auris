import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { WebClient } from "@slack/web-api";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    let dbUser = null //use let as changed


    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
        }


        // fetch all the action items to display
        const { meetingId, summary, actionItems } = await request.json()

        if (!meetingId || !summary || !actionItems) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }


        dbUser = await prisma.user.findFirst({
            where: {
                clerkId: user.id
            }
        })

        if (!dbUser || !dbUser.slackTeamId || !dbUser.slackConnected) {
            return NextResponse.json({ error: 'User not connected to Slack' }, { status: 400 })
        }

        const slackInstallation = await prisma.slackInstallation.findFirst({
            where: {
                teamId: dbUser.slackTeamId
            }
        })

        if (!slackInstallation) {
            return NextResponse.json({ error: 'Slack Workspace not found' }, { status: 404 })
        }

        const slack = new WebClient(slackInstallation.botToken);

        const targetChanneell = dbUser.preferredChannelId || "#general"

        const meeting = await prisma.meeting.findUnique({
            where: {
                id: meetingId
            }
        })

        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
        }



        const meetingTitle = meeting?.title

        await slack.chat.postMessage({
            channel: targetChanneell,
            text: meetingTitle,
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "📝 Meeting Summary",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*📌 Meeting:*\n${meetingTitle}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*🕒 Date:*\n${new Date(meeting.startTime).toLocaleString()}`
                        }
                    ]
                },
                {
                    type: "divider"
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*📄 Summary:*\n${summary}`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*✅ Action Items:*\n${actionItems}`
                    }
                },

                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                text: "View Full Meeting",
                                emoji: true
                            },
                            style: "primary",
                            url: `${process.env.NEXT_PUBLIC_APP_URL}/meetings/${meetingId}`
                        }
                    ]
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: `Posted by ${user.firstName || 'User'} · ${new Date().toLocaleString()}`
                        }
                    ]
                }
            ]
        })

        return NextResponse.json({
            success: true,
            message: `Meeting summary posted to ${dbUser.preferredChannelName || '#general'}`
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to post meeting summary' }, { status: 500 })
    }
}