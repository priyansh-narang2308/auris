import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
        }


        const dbUser = await prisma.user.findUnique({
            where: {
                clerkId: user.id
            },
            select: {
                botName: true,
                botImageUrl: true,
                currentPlan: true
            }
        })

        return NextResponse.json({
            botName: dbUser?.botName || 'Aurisia',
            botImageUrl: dbUser?.botImageUrl || null,
            plan: dbUser?.currentPlan || 'free'
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: Request) {


    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
        }

        const { botName, botImageUrl } = await request.json()

        const dbUser = await prisma.user.update({
            where: {
                clerkId: user.id
            },
            data: {
                botName: botName || 'Aurisia',
                botImageUrl: botImageUrl
            }
        })

        return NextResponse.json({
            botName: dbUser.botName,
            botImageUrl: dbUser.botImageUrl,
            plan: dbUser.currentPlan
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }


}