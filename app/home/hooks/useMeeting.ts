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
  const [upcomingMeetings, setUpcomingMeetings] = useState<CalendarEvent[]>([]);
  const [pastMeetings, setPastMeetings] = useState<PastMeeting[]>([]);

  const [loading, setLoading] = useState(false);
  const [pastLoading, setPastLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // For calendar connected part it is
  const [connected, setConnected] = useState(false);

  const [error, setError] = useState<string>("");

  const [botToggles, setBotToggles] = useState<{ [key: string]: boolean }>({}); //this key is a pointer to see if sceheduled or not
  
  useEffect(()=>{
    if(userId){
      fetchUpcomingEvents()
      fetchPastMeetings()
    }
  },[userId])

  const fetchUpcomingEvents=async()=>
  {
setLoading(true)
setError("")

try {
  const statusResponse=await fetch("/api/user/calendar-status")
} catch (error) {
  
}
  }




}
