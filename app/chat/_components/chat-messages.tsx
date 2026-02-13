"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  useEffect(() => {
    // Initial scroll
    const timer = setTimeout(() => scrollToBottom("auto"), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      // Use a small delay to ensure DOM has updated and animations are starting
      const timer = setTimeout(() => scrollToBottom("smooth"), 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 150;
    setShowScrollButton(!isAtBottom);
  };

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <div
        className="flex-1 overflow-y-auto px-4 pt-20 pb-12 md:px-8 scroll-smooth"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Bot className="h-12 w-12 mb-4" />
              <p className="font-bold uppercase tracking-[0.2em] text-xs text-foreground">
                Awaiting Query
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message, idx) => {
              const showAvatar =
                idx === 0 || messages[idx - 1].isBot !== message.isBot;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 md:gap-4 ${
                    message.isBot ? "justify-start" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      message.isBot
                        ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                        : "bg-primary/10 border-primary/20 text-primary"
                    } ${showAvatar ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                  >
                    {message.isBot ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>

                  <div
                    className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%] ${
                      message.isBot ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`relative px-5 py-3.5 rounded-[22px] text-[15px] leading-[1.6] shadow-sm ${
                        message.isBot
                          ? "bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 text-foreground rounded-tl-none"
                          : "bg-orange-500 text-white rounded-tr-none shadow-md shadow-orange-500/10"
                      }`}
                    >
                      <div
                        className={`prose prose-sm max-w-none ${
                          message.isBot
                            ? "dark:prose-invert"
                            : "prose-p:text-white prose-headings:text-white prose-strong:text-white"
                        }`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider px-2">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-orange-500" />
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-4xl rounded-tl-none px-5 py-3 shadow-sm flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="w-1.5 h-1.5 bg-orange-500/60 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="w-1.5 h-1.5 bg-orange-500/30 rounded-full"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest leading-none">
                    Analyzing
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} className="h-4" />
        </div>
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-6 right-6 z-20"
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-2xl bg-white/90 dark:bg-background/90 backdrop-blur-md border border-black/5 dark:border-border/50 hover:bg-muted cursor-pointer transition-all active:scale-95"
              onClick={() => scrollToBottom()}
            >
              <ChevronDown className="h-5 w-5 text-foreground" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatMessages;
