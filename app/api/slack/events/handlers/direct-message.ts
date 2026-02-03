import { prisma } from "@/lib/db"
import { isDuplicateEvent } from "../utils/deduplication"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleMessage({ message, say, client }: any) {

    try {
        if (message.subtype === 'bot message' || !('user' in message) || !('text' in message)) {
            return
        }
        if (message.user && message.user.startsWith('B')) {
            return
        }

        // check the user
        const authTest = await client.auth.test()


        if (message.user == authTest.user_id) {
            return
        }


        const text = message.text || ''

        if (text.includes(`<@${authTest.user_id}>`)) {
            return
        }

        const eventId = `message-${message.channel}-${message.user}`
        const eventTs = message.ts

        if (isDuplicateEvent(eventId, eventTs)) {
            return
        }



        const slackUserId = message.user

        if (!slackUserId) {
            return
        }

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



        const userInfo = await client.users.info({ user: slackUserId })
        const userEmail = userInfo.user?.profile?.email

        if (!userEmail) {
            await say("Sorry, I cant access your email. Please make sure your slack email is visible on your profile settings.")
            return
        }


        const user = await prisma.user.findFirst({
            where: {
                email: userEmail
            }
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
                thread_ts: message.ts,
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
                thread_ts: message.ts,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: "*Aurisia*\n\nI couldn't find any relevant information in your meeting history for that question."
                        }
                    },
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "_Try asking about a specific meeting or topic you remember!_"
                            }
                        ]
                    }
                ]
            })
        }
    } catch (error) {

        console.error('Error handling message:', error)

        await say({
            thread_ts: message.ts,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "❌ *Something went wrong*"
                    }
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "I'm having trouble processing that request right now. Please try again in a moment."
                        }
                    ]
                }
            ]
        })


    }




}