"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, ReactNode, useState } from "react";

interface PlanLimits {
  meetings: number;
  chatMessages: number;
}

// To check the active or inactive and cancellation as well
interface UsageData {
  currentPlan: string;
  subscriptionStatus: string; //active or inactive
  meetingsThisMonth: number; //to check how many meetings attented here
  billingPeriodStart: string | null;
}

interface UsageContextType {
  usage: UsageData | null;
  loading: boolean;
  canChat: boolean; //to check if the user can update
  canScheduleMeeting: boolean;
  limits: PlanLimits;
  incrementChatUsage: () => Promise<void>;
  incrementMeetingUsage: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

// Key value type
const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: { meetings: 0, chatMessages: 0 },
  starter: { meetings: 10, chatMessages: 30 },
  pro: { meetings: 30, chatMessages: 100 },
  premium: { meetings: -1, chatMessages: -1 }, //unlimited plan
};

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export function UsageProvider({ children }: { children: ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const limits = usage
    ? PLAN_LIMITS[usage.currentPlan] || PLAN_LIMITS.free
    : PLAN_LIMITS.free;

  // Not on free plan
  const canChat = usage
    ? usage.currentPlan !== "free" &&
      usage.subscriptionStatus === "active" &&
      (limits.chatMessages === -1 || usage.meetingsThisMonth < limits.meetings)
    : false;

  const canScheduleMeeting = usage
    ? usage.currentPlan !== "free" &&
      usage.subscriptionStatus === "active" &&
      (limits.meetings === -1 || usage.meetingsThisMonth < limits.meetings)
    : false;

  const fetchUsage = {};
}
