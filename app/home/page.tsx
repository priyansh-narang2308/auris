"use client";

import { useMeetings } from "./hooks/useMeeting";
import { useRouter } from "next/navigation";
import PastMeetings from "./_components/past-meetings";
import UpcomingMeetings from "./_components/upcoming-meetings";
import { Loader } from "@/components/ui/loader";

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
    joinBot,
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
        <Loader variant="default"></Loader>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:flex-row">
        <div className="flex-1">
          <div className="mb-4 sm:mb-1 md:mt-3 mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Past Meetings
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed italic">
              Your completed meetings are stored here.
            </p>
          </div>

          <PastMeetings
            pastMeetings={pastMeetings}
            pastLoading={pastLoading}
            onMeetingClick={handleMeetingClick}
            onRefresh={fetchPastMeetings}
            getAttendeeList={getAttendeeList}
            getInitialsOfTheUser={getInitialsOfTheUser}
          />
        </div>

        <div className="hidden lg:block w-px bg-border self-stretch" />

        <div className="w-full lg:w-96">
          <div className="lg:sticky lg:top-6">
            <UpcomingMeetings
              upcomingEvents={upcomingEvents}
              connected={connected}
              error={error}
              loading={loading}
              initialLoading={initialLoading}
              botToggles={botToggles}
              onRefresh={fetchUpcomingEvents}
              onToggleBot={toggleBot}
              onJoinBot={joinBot}
              onConnectCalendar={directOAuth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
