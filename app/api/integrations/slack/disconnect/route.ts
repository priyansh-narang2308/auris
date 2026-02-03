import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {  NextResponse } from "next/server";


export async function POST() {

    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
        }


        await prisma.user.updateMany({
            where: {
                clerkId: userId
            },
            data: {
                slackConnected: false,
                slackUserId: null,
                slackTeamId: null,
                preferredChannelId: null,
                preferredChannelName: null
            }
        })


        return NextResponse.json({ success: true })


    } catch (error) {
        console.log("Error in disconnecting slack", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }




}