"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Platform =
  | "google-calendar"
  | "trello"
  | "jira"
  | "asana"
  | "slack";

export interface Integration {
  platform: Platform;
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
  const [setupMode, setSetupMode] = useState<Platform | null>(null);
  const [setupData, setSetupData] = useState<any>(null);
  const [isFetchingSetup, setIsFetchingSetup] = useState(false);
  const [isSubmittingSetup, setIsSubmittingSetup] = useState(false);

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

          const status = Array.isArray(integrationData)
            ? integrationData.find(
                (d: any) => d.platform === integration.platform,
              )
            : undefined;

          return {
            ...integration,
            connected: Boolean(status?.connected),
            boardName: status?.boardName,
            projectName: status?.projectName,
            channelName: status?.channelName,
          };
        }),
      );
    } catch (err) {
      console.error("Error fetching integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSetupData = async (platform: Platform) => {
    try {
      setIsFetchingSetup(true);
      const res = await fetch(`/api/integrations/${platform}/setup`);
      const data = await res.json();
      setSetupData(data);
    } catch (err) {
      console.error(`Error fetching ${platform} setup data:`, err);
      setSetupData(null);
    } finally {
      setIsFetchingSetup(false);
    }
  };

  const handleConnect = (platform: Platform) => {
    if (platform === "slack") {
      window.location.href = "/api/slack/install?return=integrations";
      return;
    }

    if (platform === "google-calendar") {
      window.location.href = "/api/auth/google/direct-connect";
      return;
    }

    window.location.href = `/api/integrations/${platform}/auth`;
  };

  const handleDisconnect = async (platform: Platform) => {
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

  const handleSetupSubmit = async (platform: Platform, config: any) => {
    setIsSubmittingSetup(true);
    try {
      const response = await fetch(`/api/integrations/${platform}/setup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const itemName =
          config.boardName || config.projectName || config.channelName;
        const platformName =
          platform.charAt(0).toUpperCase() + platform.slice(1);
        const itemLabel =
          platform === "trello"
            ? "board"
            : platform === "slack"
              ? "channel"
              : "project";

        if (config.createNew) {
          toast.success(
            `New ${itemLabel} created in ${platformName} dashboard!`,
            {
              description: `Target: ${itemName}`,
            },
          );
        } else {
          toast.success(`${itemName} has been selected!`, {
            description: `Successfully connected to ${platformName}`,
          });
        }

        setSetupMode(null);
        setSetupData(null);
        fetchIntegrations();
        window.history.replaceState({}, "", "/integrations");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || `Failed to setup ${platform}`);
      }
    } catch (error) {
      console.error("Error saving the setup of the user: ", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmittingSetup(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchIntegrations();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const setup = params.get("setup");

      if (setup && SETUP_PLATFORMS.includes(setup as any)) {
        const platform = setup as Platform;
        setSetupMode(platform);
        fetchSetupData(platform);
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
    isFetchingSetup,
    isSubmittingSetup,
    fetchIntegrations,
    fetchSetupData,
    handleConnect,
    handleDisconnect,
    handleSetupSubmit,
  };
}
