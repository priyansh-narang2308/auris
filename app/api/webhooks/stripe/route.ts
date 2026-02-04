import { prisma } from "@/lib/db";
import { headers } from "next/headers"
import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover"
})


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
    try {

        const body = await request.text()
        const headersList = await headers();
        const signature = headersList.get("stripe-signature")!

        let stripeEvent: Stripe.Event;

        try {
            stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (error) {
            console.log("Error in stripe webhook", error)
            return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
        }

        // switch (stripeEvent.type) {
        //     case 'customer.subscription.created':
        //         await handleSubscriptionCreated(stripeEvent.data.object)
        //         break
        //     case 'customer.subscription.updated':
        //         await handleSubscriptionUpdated(stripeEvent.data.object)
        //         break
        //     case 'customer.subscription.deleted':
        //         await handleSubscriptionCancelled(stripeEvent.data.object)
        //         break
        //     case 'invoice.payment_succeeded':
        //         await handlePaymentSucceeded(stripeEvent.data.object)
        //         break

        //     default:
        //         console.log(`unhandle type event: ${stripeEvent.type}`)
        // }


        return NextResponse.json({ received: true })

    } catch (error) {
        console.error('Error in stripe webhook:', error)
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
    }
}


async function handleSubscriptionCreated(subscription: Stripe.Subscription) {

    try {
        const customerId = subscription.customer as string
        const planName = getPlanFromSubscription(subscription)

        const user = await prisma.user.findFirst({
            where: {
                stripeCustomerId: customerId
            }
        })

        if (user && planName) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    currentPlan: planName,
                    subscriptionStatus: 'active',
                    stripeSubscriptionId: subscription.id,
                    billingPeriodStart: new Date(),
                    meetingsThisMonth: 0,
                    chatMessagesToday: 0
                }
            })
        }

    } catch (error) {
        console.log("Error in handling stripe subscription creation", error)
    }
}

function getPlanFromSubscription(subscription: Stripe.Subscription) {
    const priceId = subscription.items.data[0]?.price.id

    const priceToPlan: Record<string, string> = {
        'price_1Swo47CDquGj0mAdsbY3Mi0c': 'starter',
        'price_1Swo47CDquGj0mAdlAymJitb': 'pro',
        'price_1Swo47CDquGj0mAdZSlPJ4bp': 'premium'
    }

    return priceToPlan[priceId] || "Invalid"
}

