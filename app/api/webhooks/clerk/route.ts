import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();

    const headers = {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    };

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const wh = new Webhook(webhookSecret);
    try {
      wh.verify(payload, headers);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(payload);
    console.log("Clerk Webhook Received:", event.type);

    if (event.type === "user.created") {
      const {
        id,
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name,
      } = event.data;

      const primaryEmail = email_addresses?.find(
        (email: { id: string; email_address: string }) =>
          email.id === primary_email_address_id
      )?.email_address;

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      const newUser = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail || null,
          name,
        },
        create: {
          id: id,
          clerkId: id,
          email: primaryEmail || null,
          name,
        },
      });

      console.log("User upserted:", newUser.id);
      return NextResponse.json({ message: "User created successfully" });
    }

    return NextResponse.json({ message: "Webhook received" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
