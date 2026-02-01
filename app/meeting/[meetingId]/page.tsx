"use client";

import { Button } from "@/components/ui/button";
import MeetingHeader from "../_components/meeting-header";
import MeetingInfo from "../_components/meeting-info";
import { useMeetingDetail } from "./hooks/useMeetingDetail";
import ActionItems from "../_components/action-items/action-items";
import DisplayTranscript from "../_components/display-transcript";
import ChatSidebar from "../_components/chat-sidebar";
import CustomAudioPlayer from "../_components/audio-player";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bot } from "lucide-react";

function MeetingDetail() {
  const {
    meetingId,
    isOwner,
    userChecked,
    chatInput,
    messages,
    showSuggestions,
    activeTab,
    setActiveTab,
    meetingData,
    loading,
    handleSendMessage,
    handleSuggestionClick,
    handleInputChange,
    deleteActionItem,
    addActionItem,
    displayActionItems,
    meetingInfoData,
  } = useMeetingDetail();

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <MeetingHeader
        title={meetingData?.title || "Meeting"}
        meetingId={meetingId}
        summary={meetingData?.summary}
        actionItems={
          meetingData?.actionItems
            ?.map((item) => `• ${item.text}`)
            .join("\n") || ""
        }
        isOwner={isOwner}
        isLoading={!userChecked}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div
          data-lenis-prevent
          className={`flex-1 overflow-y-auto pb-32 no-scrollbar ${!userChecked ? "" : !isOwner ? "max-w-4xl mx-auto" : ""
            }`}
        >
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 pt-8 mb-6">
            <MeetingInfo meetingData={meetingInfoData} isOwner={isOwner} />

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("summary")}
                className={`px-6 py-3 text-sm font-semibold border-b-2 rounded-none shadow-none transition-all cursor-pointer
                                ${activeTab === "summary"
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                style={{ boxShadow: "none" }}
                type="button"
              >
                Summary
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab("transcript")}
                className={`px-6 py-3 text-sm font-semibold border-b-2 rounded-none shadow-none transition-all cursor-pointer
                                ${activeTab === "transcript"
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                style={{ boxShadow: "none" }}
                type="button"
              >
                Transcript
              </Button>
            </div>
          </div>

          <div className="px-6">
            <div className="mt-2">
              {activeTab === "summary" && (
                <div className="pb-10">
                  {loading ? (
                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">
                        Loading meeting data..
                      </p>
                    </div>
                  ) : meetingData?.processed ? (
                    <div className="space-y-8">
                      {meetingData.summary && (
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                          <h3 className="text-xl font-bold text-foreground mb-4">
                            Meeting Summary
                          </h3>
                          <p className="text-muted-foreground leading-relaxed text-base">
                            {meetingData.summary}
                          </p>
                        </div>
                      )}

                      {!userChecked ? (
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                          <div className="animate-pulse">
                            <div className="h-5 bg-muted rounded w-1/4 mb-6"></div>
                            <div className="space-y-3">
                              <div className="h-4 bg-muted rounded w-full"></div>
                              <div className="h-4 bg-muted rounded w-5/6"></div>
                              <div className="h-4 bg-muted rounded w-4/6"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {isOwner && displayActionItems.length > 0 && (
                            <div className="space-y-4">
                              <ActionItems
                                actionItems={displayActionItems}
                                onDeleteItem={deleteActionItem}
                                onAddItem={addActionItem}
                                meetingId={meetingId}
                              />
                            </div>
                          )}

                          {!isOwner && displayActionItems.length > 0 && (
                            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                              <h3 className="text-xl font-bold text-foreground mb-6">
                                Action Items
                              </h3>
                              <div className="space-y-4">
                                {displayActionItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start gap-4 group"
                                  >
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.4)]"></div>
                                    <p className="text-base text-foreground/90 group-hover:text-foreground transition-colors">
                                      {item.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Processing Meeting</h3>
                      <p className="text-muted-foreground mb-4">
                        Our AI is currently analyzing your transcript...
                      </p>
                      <p className="text-sm text-primary/60 font-medium">
                        You&apos;ll receive an email the moment it&apos;s ready!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "transcript" && (
                <div className="pb-10">
                  {loading ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading transcript...</p>
                    </div>
                  ) : meetingData?.transcript ? (
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                      <DisplayTranscript transcript={meetingData.transcript} />
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl p-12 border border-border text-center shadow-sm">
                      <p className="text-muted-foreground font-medium">
                        No transcript available for this meeting.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Logic */}
        {!userChecked ? (
          <div className="hidden md:block w-96 shrink-0 border-l border-border p-6 bg-card">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded-xl"></div>
                <div className="h-24 bg-muted rounded-xl"></div>
                <div className="h-12 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        ) : (
          isOwner && (
            <>
              {/* Desktop Sidebar */}
              <div className="hidden md:flex h-full shrink-0">
                <ChatSidebar
                  messages={messages.map((msg) => ({
                    ...msg,
                    timestamp: new Date(),
                  }))}
                  chatInput={chatInput}
                  showSuggestions={showSuggestions}
                  onInputChange={handleInputChange}
                  onSendMessage={handleSendMessage}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>

              {/* Mobile Floating Trigger & Sheet */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      size="icon"
                      className="fixed bottom-32 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-all"
                    >
                      <Bot className="h-6 w-6" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-background"></span>
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0 w-full sm:max-w-md border-none">
                    <ChatSidebar
                      messages={messages.map((msg) => ({
                        ...msg,
                        timestamp: new Date(),
                      }))}
                      chatInput={chatInput}
                      showSuggestions={showSuggestions}
                      onInputChange={handleInputChange}
                      onSendMessage={handleSendMessage}
                      onSuggestionClick={handleSuggestionClick}
                      hideBorder
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )
        )}
      </div>

      <CustomAudioPlayer
        recordingUrl={meetingData?.recordingUrl}
        isOwner={isOwner}
      />
    </div>
  );
}

export default MeetingDetail;
