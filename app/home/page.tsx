import React from "react";
import { useMeetings } from "./hooks/useMeeting";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Home = () => {
  const {
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
  } = useMeetings();

  const router = useRouter();
  const handleMeetingClick = (meetingId: string) => {
    router.push(`/meeting/${meetingId}`);
  };

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <h1 className="text-lg font-semibold">Authentication required</h1>

          <p className="text-sm text-muted-foreground">
            Please sign in to access this page.
          </p>

          <SignInButton>
            <Button className="mt-2">Sign in</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex gap-6 p-6">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Past Meetings
            </h2>
          </div>

          {/* Past Meeting component */}
        </div>

        <div className="w-px bg-border self-stretch" />

        <div className="w-96">
          <div className="sticky top-6">
            {/* Upcoming meetings component */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
