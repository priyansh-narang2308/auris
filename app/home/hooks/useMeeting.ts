/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export interface CalendarEvent {
  id: string;
  summary?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{ email: string }>;
  location?: string;
  hangoutLink?: string;
  conferenceData?: any;
  botScheduled?: boolean;
  meetingId?: string;
}

export interface PastMeeting {
  id: string;
  title: string;
  description?: string | null;
  meetingUrl: string | null;
  startTime: Date;
  endTime: Date;
  attendees?: any;
  transcriptReady: boolean;
  recordingUrl?: string | null;
  speakers?: any;
}

export function useMeetings() {
  const { userId } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [pastMeetings, setPastMeetings] = useState<PastMeeting[]>([]);

  const [loading, setLoading] = useState(false);
  const [pastLoading, setPastLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // For calendar connected part it is
  const [connected, setConnected] = useState(false);

  const [error, setError] = useState<string>("");

  const [botToggles, setBotToggles] = useState<{ [key: string]: boolean }>({}); //this key is a pointer to see if sceheduled or not

  useEffect(() => {
    if (userId) {
      fetchUpcomingEvents();
      fetchPastMeetings();
    }
  }, [userId]);

  const fetchUpcomingEvents = async () => {
    setLoading(true);
    setError("");

    try {
      const statusResponse = await fetch("/api/user/calendar-status");
      const statusData = await statusResponse.json();

      // if the user is not connected
      if (!statusData.connected) {
        setConnected(false);
        setUpcomingEvents([]);
        setError(
          "Calendar not connected for auto-sync. Connect your google calendar for auto-syncing."
        );
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Trigger a sync if connected
      if (statusData.connected) {
        await fetch("/api/meetings/sync", { method: "POST" });
      }

      const response = await fetch("/api/meetings/upcoming-meetings");
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to fetch user meetings!");
        setConnected(false);
        setInitialLoading(false);
        return;
      }

      setUpcomingEvents(result.events as CalendarEvent[]);
      setConnected(result.connected);

      // Create a toggles object to track whether the bot is scheduled for each event
      const toggles: { [key: string]: boolean } = {};
      result.events.forEach((event: CalendarEvent) => {
        // For each event, set the toggle value based on the botScheduled property (default to true if undefined)
        toggles[event.id] = event.botScheduled ?? true;
      });

      setBotToggles(toggles);
    } catch (error) {
      console.error(`Failed to fetch user calendar events: ${error}`);
      setError("Failed to fetch calendar events. Please try again later.");
      setConnected(false);
    }

    setLoading(false);
    setInitialLoading(false);
  };

  const fetchPastMeetings = async () => {
    setPastLoading(true);

    try {
      const response = await fetch("/api/meetings/past-meetings");
      const result = await response.json();
      if (!response.ok) {
        console.error(
          "Failed to fetch the past meetings of the user:",
          result.error
        );
        return;
      }

      if (result.error) {
        return;
      }

      setPastMeetings(result.meetings as PastMeeting[]);
    } catch (error) {
      console.error("Failed to fetch the past meetings of the user: ", error);
    }

    setPastLoading(false);
  };

  const toggleBot = async (eventId: string) => {
    try {
      // find the event and then change the api response
      const event = upcomingEvents.find((e) => e.id === eventId);
      if (!event) {
        return;
      }

      setBotToggles((prev) => ({
        ...prev,
        [eventId]: !prev[eventId], //negate it
      }));

      const response = await fetch(
        `/api/meetings/${event.meetingId}/bot-toggle-api`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            botScheduled: !botToggles[eventId],
          }),
        }
      );

      if (!response.ok) {
        setBotToggles((prev) => ({
          ...prev,
          [eventId]: !prev[eventId],
        }));
      }
    } catch (error) {
      console.error("Error in toggling bot: ", error);
      setBotToggles((prev) => ({
        ...prev,
        [eventId]: !prev[eventId],
      }));
    }
  };

  // To make a new refresh token
  const directOAuth = async () => {
    setLoading(true);
    try {
      window.location.href = "/api/auth/google/direct-connect";
    } catch (error) {
      console.error("Failed to start the authentication: ", error);
      setError("Failed to start direct OAuth");
      setLoading(false);
    }
  };

  const getAttendeeList = (attendees: any): string[] => {
    if (!attendees) return [];

    if (Array.isArray(attendees)) {
      return attendees
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (typeof attendees === "string") {
      try {
        const parsed = JSON.parse(attendees);
        if (Array.isArray(parsed)) {
          return parsed
            .map(String)
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } catch { }

      return attendees
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [String(attendees).trim()].filter(Boolean);
  };

  // for getting the name to display
  const getInitialsOfTheUser = (name: string): string => {
    if (!name.trim()) return "";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return {
    userId,
    upcomingEvents,
    pastMeetings,
    loading,
    pastLoading,
    connected,
    error,
    botToggles,
    initialLoading,
    fetchUpcomingEvents,
    fetchPastMeetings,
    toggleBot,
    directOAuth,
    getAttendeeList,
    getInitialsOfTheUser,
  };
}
