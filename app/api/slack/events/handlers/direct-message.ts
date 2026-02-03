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
                email: {
                    equals: userEmail,
                    mode: 'insensitive'
                }
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
                            text: `👋 Hi! I can't find an account linked to *${userEmail}*.\n\nPlease <${process.env.NEXT_PUBLIC_APP_URL}/sign-up|sign up on Auris> using this *same email address* to access your meeting assistant.`
                        }
                    },
                    {
                        type: "context",
                        elements: [{
                            type: "mrkdwn",
                            text: "Once you've signed up, come back here and say hello! 👋"
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


        // Check if it's a greeting to decide whether to show "Searching..."
        const greetings = ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'thanks', 'thank you']
        const isGreeting = greetings.some(g => cleanText.toLowerCase().includes(g) && cleanText.length < 20)

        // Only show "Searching..." if it's NOT a simple greeting
        if (!isGreeting) {
            await say({
                text: "Searching through your meetings...",
                blocks: [
                    {
                        type: "context",
                        elements: [
                            {
                                type: "mrkdwn",
                                text: "🔍 *Searching through your meetings...*"
                            }
                        ]
                    }
                ]
            })
        }

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
            // Fix Slack Markdown: Replace **bold** with *bold*
            const answer = data.answer.replace(/\*\*(.*?)\*\*/g, '*$1*')

            await say({
                text: answer, // Fallback for notifications
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
                                text: "_Answer generated from your meeting history. Feel free to ask follow-up questions!_"
                            }
                        ]
                    }
                ]
            })
        } else {
            await say({
                text: "I couldn't find any relevant information.",
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
            text: "Something went wrong",
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