"use client";

import { useAuth } from "@clerk/nextjs";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface PlanLimits {
  meetings: number;
  chatMessages: number;
}

// To check the active or inactive and cancellation as well
interface UsageData {
  currentPlan: string;
  subscriptionStatus: string; //active or inactive
  meetingsThisMonth: number; //to check how many meetings attented here
  chatMessagesToday: number;
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

  // Fetching the user from the database
  const fetchUsage = async () => {
    if (!userId) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/usage");
      if (response.ok) {
        const dataa = await response.json();
        setUsage(dataa);
      }
    } catch (error) {
      console.error("Failed to fetch the user usage: ", error);
    } finally {
      setLoading(false);
    }
  };

  // increment the chat usage by the user
  const incrementChatUsage = async () => {
    if (!canChat) {
      // todo:add toast
      return;
    }
    try {
      const resp = await fetch("/api/user/increment-chat", {
        method: "POST",
        headers: { "Content-type": "application/json" },
      });

      if (resp.ok) {
        setUsage((prev) =>
          prev
            ? {
                ...prev,
                chatMessagesToday: prev.chatMessagesToday + 1,
              }
            : null
        );
      } else {
        const dataa = await resp.json();
        if (dataa.upgradeRequired) {
          console.log(dataa.error);
        }
      }
    } catch (error) {
      console.error("Failed to increment the chat usage of the user: ", error);
    }
  };

  const incrementMeetingUsage = async () => {
    if (!canScheduleMeeting) {
      // todo:add toast
      return;
    }

    try {
      const repsonse = await fetch("/api/user/increment-meeting", {
        method: "POST",
        headers: { "Content-type": "application/json" },
      });

      if (repsonse.ok) {
        setUsage((prev) =>
          prev
            ? {
                ...prev,
                meetingsThisMonth: prev.meetingsThisMonth + 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error(
        "Failed to increment the meeting usage of the user: ",
        error
      );
    }
  };

  const refreshUsage = async () => {
    await fetchUsage();
  };

  useEffect(() => {
    if (isLoaded && userId) {
      fetchUsage();
    } else if (isLoaded && !userId) {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isLoaded]);

  return (
    <UsageContext.Provider
      value={{
        usage,
        loading,
        canChat,
        canScheduleMeeting,
        limits,
        incrementChatUsage,
        incrementMeetingUsage,
        refreshUsage,
      }}
    >
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const context = useContext(UsageContext);

  if (context === undefined) {
    throw new Error("UseUsage must be defined");
  }

  return context;
}
