import { PlanLimits } from "@/app/contexts/usage-context";
import { prisma } from "./db";

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: { meetings: 0, chatMessages: 0 },
  starter: { meetings: 10, chatMessages: 30 },
  pro: { meetings: 30, chatMessages: 100 },
  premium: { meetings: -1, chatMessages: -1 }, //unlimited plan
};

export async function canUserChat(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  if (user.currentPlan === "free" || user.subscriptionStatus === "expired") {
    return {
      allowed: false,
      reason: "Upgrade your plan to chat with the AI Bot.",
    };
  }

  const limits = PLAN_LIMITS[user.currentPlan];
  if (!limits) {
    return { allowed: false, reason: "Invalid subscription plan" };
  }

  if (
    limits.chatMessages !== -1 &&
    user.chatMessagesToday >= limits.chatMessages
  ) {
    return {
      allowed: false,
      reason: `You've reached your daily limit of ${limits.chatMessages} messages. Please subscribe to chat more.`,
    };
  }

  // excluding these all the changes the user can chat
  return { allowed: true };
}

export async function incrementChatUsage(userId: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      chatMessagesToday: {
        increment: 1,
      },
    },
  });
}

export async function incrementMeetingUsage(userId: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      meetingsThisMonth: {
        increment: 1,
      },
    },
  });
}

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}
