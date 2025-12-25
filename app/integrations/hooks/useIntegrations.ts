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
      channelName: undefined,
      logo: "/slack.png",
    },
    {
      platform: "trello",
      name: "Trello",
      description:
        "Turn meeting insights into visual task cards and organize them across your trello team boards.",
      connected: false,
      boardName: undefined,
      logo: "/trello.png",
    },
    {
      platform: "jira",
      name: "Jira",
      description:
        "Automate ticket creation and keep your development backlog updated with technical requirements.",
      connected: false,
      projectName: undefined,
      logo: "/jira.png",
    },
    {
      platform: "asana",
      name: "Asana",
      description:
        "Transform discussion points into trackable tasks and assign them to your team instantly.",
      connected: false,
      projectName: undefined,
      logo: "/asana.png",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [setupData, setSetupData] = useState<any>(null);
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchIntegration();
    }

    // we want to redirect to /setup=asana for eg righ
    const urlParams = new URLSearchParams(window.location.search);
    const setup = urlParams.get("setup");
    if (setup && ["trello", "jira", "asana", "slack"].includes(setup)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSetupMode(setup);
      fetchSetupData(setup);
    }
  }, [userId]);
}
