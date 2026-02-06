import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncUserCalendar } from "@/lib/calendar-sync";

export async function POST() {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const result = await syncUserCalendar(user.id);

        if (result.success) {
            return NextResponse.json({ success: true, count: result.count });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Sync API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
