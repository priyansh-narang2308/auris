"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export interface Integration {
  platform: "google-calendar" | "trello" | "jira" | "asana" | "slack";
  name: string;
  description: string;
  connected: boolean;
  boardName?: string;
  projectName?: string;
  channelName?: string;
  logo: string;
}

const SETUP_PLATFORMS = ["trello", "jira", "asana", "slack"] as const;

export function useIntegrations() {
  const { userId } = useAuth();

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      platform: "google-calendar",
      name: "Google Calendar",
      description:
        "Sync your schedule and automatically attach meeting notes to your calendar events.",
      connected: false,
      logo: "/gcal.png",
    },
    {
      platform: "slack",
      name: "Slack",
      description:
        "Streamline communication by pushing real-time summaries and action items to your slack team channels.",
      connected: false,
      logo: "/slack.png",
    },
    {
      platform: "trello",
      name: "Trello",
      description:
        "Turn meeting insights into visual task cards and organize them across your trello team boards.",
      connected: false,
      logo: "/trello.png",
    },
    {
      platform: "jira",
      name: "Jira",
      description:
        "Automate ticket creation and keep your development backlog updated with technical requirements.",
      connected: false,
      logo: "/jira.png",
    },
    {
      platform: "asana",
      name: "Asana",
      description:
        "Transform discussion points into trackable tasks and assign them to your team instantly.",
      connected: false,
      logo: "/asana.png",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<any>(null);
  const [setupLoading, setSetupLoading] = useState(false);

  const fetchIntegrations = async () => {
    try {
      const [integrationRes, calendarRes] = await Promise.all([
        fetch("/api/integrations/status"),
        fetch("/api/user/calendar-status"),
      ]);

      const integrationData = await integrationRes.json();
      const calendarData = await calendarRes.json();

      setIntegrations((prev) =>
        prev.map((integration) => {
          if (integration.platform === "google-calendar") {
            return {
              ...integration,
              connected: Boolean(calendarData?.connected),
            };
          }

          const status = integrationData.find(
            (d: any) => d.platform === integration.platform
          );

          return {
            ...integration,
            connected: Boolean(status?.connected),
            boardName: status?.boardName,
            projectName: status?.projectName,
            channelName: status?.channelName,
          };
        })
      );
    } catch (err) {
      console.error("Error fetching integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSetupData = async (platform: string) => {
    try {
      setSetupLoading(true);
      const res = await fetch(`/api/integrations/${platform}/setup`);
      const data = await res.json();
      setSetupData(data);
    } catch (err) {
      console.error(`Error fetching ${platform} setup data:`, err);
      setSetupData(null);
    } finally {
      setSetupLoading(false);
    }
  };

  const handleConnect = (
    platform: "google-calendar" | "trello" | "jira" | "asana" | "slack"
  ) => {
    if (platform === "slack") {
      window.location.href = "/api/slack/install?return=integrations";
      return;
    }

    if (platform === "google-calendar") {
      window.location.href = "/api/auth.google/direct-connect";
      return;
    }

    window.location.href = `/api/integrations/${platform}/auth`;
  };

  const handleDisconnect = async (
    platform: "google-calendar" | "trello" | "jira" | "asana" | "slack"
  ) => {
    try {
      if (platform === "google-calendar") {
        await fetch("/api/auth/google/disconnect", {
          method: "POST",
        });
      } else {
        await fetch(`/api/integrations/${platform}/disconnect`, {
          method: "POST",
        });
      }

      fetchIntegrations(); //thisis beause to show the disconected and connected on the page
    } catch (error) {
      console.error(`Error disconnecting the ${platform} platform: `, error);
    }
  };

  const handleSetupSubmit = async (
    platform: "google-calendar" | "trello" | "jira" | "asana" | "slack",
    config: any
  ) => {
    setSetupLoading(true);
    try {
      const response = await fetch(`/api/integrations/${platform}/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        setSetupMode(null);

        setSetupData(null);

        fetchIntegrations();
        window.history.replaceState({}, "/integrations");
      }
    } catch (error) {
      console.error("Error saving the setup of the user: ", error);
    } finally {
      setSetupLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchIntegrations();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const setup = params.get("setup");

      if (setup && SETUP_PLATFORMS.includes(setup as any)) {
        setSetupMode(setup);
        fetchSetupData(setup);
      }
    }
  }, [userId]);

  return {
    integrations,
    loading,
    setupMode,
    setSetupMode,
    setupData,
    setSetupData,
    setupLoading,
    setSetupLoading,
    fetchIntegrations,
    fetchSetupData,
    handleConnect,
    handleDisconnect,
    handleSetupSubmit,
  };
}
