import { prisma } from "@/lib/db"
import { isDuplicateEvent } from "../utils/deduplication"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleAppMention({ event, say, client }: any) {



    try {
        const eventId = `app_mention-${event.channel}-${event.user}`
        const eventTs = event.event_ts || event.ts


        if (isDuplicateEvent(eventId, eventTs)) {
            return
        }


        const authTest = await client.auth.test()
        if (event.user === authTest.user_id) {
            return
        }

        const slackUserId = event.user

        if (!slackUserId) {
            return
        }


        const text = event.text || ""

        // remove the bot name 
        const cleanText = text.replace(/<@[^>]+>/g, '').trim()

        if (!cleanText) {
            await say({
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "👋 *Hi! I'm Aurisia - your AI meeting assistant.* I'm here to help you get the most out of your meetings."
                        }
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "*Try asking me something like:*\n• _\"What were the key decisions in yesterday's sync?\"_\n• _\"Summarize the action items for the product team.\"_\n• _\"Who was present during the architecture review?\"_"
                        }
                    }
                ]
            })
            return
        }

        // note: security check
        const userInfo = await client.users.info({ user: slackUserId })
        const userEmail = userInfo.user?.profile?.email

        if (!userEmail) {
            await say("Sorry, I cant access your email. Please make sure your slack email is visible on your profile settings.")
            return
        }

        const user = await prisma.user.findFirst({
            where: { email: userEmail }
        })

        if (!user) {
            await say({
                text: "Account not found",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `👋 Hi! I cant find an account with email *${userEmail}*.\n\nPlease sign up first, then you can chat with me here!`
                        }
                    },
                    {
                        type: "context",
                        elements: [{
                            type: "mrkdwn",
                            text: "Once you have an account, I can help you with meeting summaries, action items, and many more!"
                        }]
                    }
                ]
            })
            return
        }



        const { team_id: teamId } = await client.auth.test()

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                slackUserId: slackUserId,
                slackTeamId: teamId as string,
                slackConnected: true
            }
        })
        await say({
            text: "Searching through your meetings...",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "🔍 *Searching through your meetings...*"
                    }
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "I'm scanning your recent transcripts and summaries to find the best answer."
                        }
                    ]
                }
            ]
        })




        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rag/chat-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: cleanText,
                userId: user.id
            })
        })


        if (!response.ok) {
            throw new Error(`RAG API failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.answer) {
            const answer = data.answer

            await say({
                thread_ts: event.ts,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*Aurisia*\n\n${answer}`
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "✨ _Answer generated from your meeting history. Feel free to ask follow-up questions!_"
                            }
                        ]
                    }
                ]
            })


        } else {
            await say({
                thread_ts: event.ts,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "*Aurisia*\n\nI'm sorry, but I couldn't find an answer to your question."
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "💡 Ask me about meetings, decisions, action items or participants"
                            }
                        ]
                    }
                ]
            })
        }


    } catch (error) {
        console.error("Error handling app mention:", error)

        await say({
            thread_ts: event.ts,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "*Aurisia*\n\nI'm having trouble processing your request right now. Please try again later."
                    }
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "💡 Ask me about meetings, decisions, action items or participants"
                        }
                    ]
                }
            ]
        })
    }

}