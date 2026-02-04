import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover"
})

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { stripeCustomerId: true }
        });

        if (!user || !user.stripeCustomerId) {
            return NextResponse.json({ error: "No customer ID found" }, { status: 404 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error("Stripe portal error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
