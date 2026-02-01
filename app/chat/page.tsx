"use client";

import React from "react";
import { useChatCore } from "@/app/hooks/chat/useChatCore";
import ChatInput from "./_components/chat-input";
import ChatMessages from "./_components/chat-messages";
import ChatSuggestion from "./_components/chat-suggestion";
import { AnimatePresence, motion } from "framer-motion";

const ChatPage = () => {
  const {
    chatInput,
    messages,
    showSuggestions,
    isLoading,
    handleSendMessage,
    handleSuggestionClick,
    handleInputChange,
  } = useChatCore({
    apiEndpoint: "/api/rag/chat-all",
    getRequestBody: (input) => ({
      question: input,
    }),
  });

  const suggestions = [
    "What were the key decisions in my recent meetings?",
    "Summarize all my project update meetings from this week",
    "Find any mentions of 'deadlines' across my recordings",
    "Who was the most active participant in my last call?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-61px)] bg-background overflow-hidden">
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          {showSuggestions && messages.length === 0 ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              <ChatSuggestion
                suggestions={suggestions}
                onSuggestionClick={(s) => {
                  handleSuggestionClick(s);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <ChatMessages
                messages={messages.map((m) => ({
                  id: m.id,
                  content: m.content,
                  isBot: m.isBot,
                  timestamp: m.timeStamp,
                }))}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <ChatInput
          chatInput={chatInput}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatPage;
