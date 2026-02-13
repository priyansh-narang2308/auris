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
import { useState } from "react";
import { X, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MeetingDetail() {
  const [isChatOpen, setIsChatOpen] = useState(false);
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
          className={`flex-1 overflow-y-auto no-scrollbar pb-32 ${!userChecked ? "" : !isOwner ? "max-w-4xl mx-auto" : ""
            }`}
        >
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 px-6 pt-8 mb-6">
            <div className="flex justify-between items-start">
              <MeetingInfo meetingData={meetingInfoData} isOwner={isOwner} />
              {userChecked && isOwner && (
                <div className="relative group mt-1 hidden md:block">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse group-hover:bg-primary/40 transition-all duration-700"></div>

                  <Button
                    onClick={() => setIsChatOpen(true)}
                    size="icon"
                    className="
    group relative h-16 w-16 rounded-full cursor-pointer
    bg-linear-to-tr from-orange-400 via-amber-500 to-orange-600
    text-white
    shadow-[0_0_30px_rgba(249,115,22,0.6)]
    hover:shadow-[0_0_60px_rgba(249,115,22,0.9)]
    hover:scale-110 active:scale-95
    transition-all duration-300
    border border-orange-300/40
    overflow-visible
  "
                  >
                    <span className="
    absolute inset-0 rounded-full
    bg-linear-to-tr from-orange-400 via-amber-500 to-orange-600
    blur-2xl opacity-60
    animate-pulse
    -z-10
  " />

                    <Bot className="h-8 w-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />

                    <div className="absolute -top-1 -right-1 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-300 border-2 border-white shadow-md"></span>
                    </div>

                    <div className="
    absolute right-full mr-4 top-1/2 -translate-y-1/2
    px-4 py-2 rounded-xl
    bg-linear-to-r from-orange-500 via-amber-500 to-orange-600
    text-white text-sm font-semibold
    opacity-0 group-hover:opacity-100
    translate-x-4 group-hover:translate-x-0
    transition-all duration-300
    whitespace-nowrap
    shadow-2xl
  ">
                      Chat with AI
                    </div>
                  </Button>

                </div>
              )}
            </div>

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

        {/* Center Modal Meeting Assistant (PC) */}
        {userChecked && isOwner && (
          <>
            {/* Desktop Center Modal */}
            <div className="hidden md:block">
              <AnimatePresence>
                {isChatOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsChatOpen(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      data-lenis-prevent
                      className="relative w-full max-w-[700px] h-[85vh] rounded-[40px] overflow-hidden border border-white/20 dark:border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl flex flex-col"
                    >
                      <div className="absolute top-6 right-8 z-50 flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setIsChatOpen(false)}
                          className="h-10 w-10 rounded-full hover:bg-white/20 dark:hover:bg-black/20 text-foreground cursor-pointer transition-all active:scale-95"
                        >
                          <X className="h-6 w-6" />
                        </Button>
                      </div>

                      <div className="flex-1 min-h-0 flex flex-col">
                        <ChatSidebar
                          messages={messages.map((msg) => ({
                            ...msg,
                            timestamp: msg.timeStamp,
                          }))}
                          chatInput={chatInput}
                          showSuggestions={showSuggestions}
                          onInputChange={handleInputChange}
                          onSendMessage={handleSendMessage}
                          onSuggestionClick={handleSuggestionClick}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>

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
                      timestamp: msg.timeStamp,
                    }))}
                    chatInput={chatInput}
                    showSuggestions={showSuggestions}
                    onInputChange={handleInputChange}
                    onSendMessage={handleSendMessage}
                    onSuggestionClick={handleSuggestionClick}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>

      <CustomAudioPlayer
        recordingUrl={meetingData?.recordingUrl}
      />
    </div>
  );
}

export default MeetingDetail;
