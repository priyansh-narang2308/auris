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
    endRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, isLoading]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 150;
    setShowScrollButton(!isAtBottom);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full min-h-0 overflow-hidden">
      <div
        className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scroll-smooth h-full"
        onScroll={handleScroll}
        ref={scrollRef}
      >
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Bot className="h-12 w-12 mb-4" />
              <p className="font-bold uppercase tracking-[0.2em] text-xs text-foreground">Awaiting Query</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message, idx) => {
              const showAvatar = idx === 0 || messages[idx - 1].isBot !== message.isBot;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 md:gap-5 ${message.isBot ? "justify-start" : "justify-end flex-row-reverse"
                    }`}
                >
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${message.isBot
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                      : "bg-primary/10 border-primary/20 text-primary"
                    } ${showAvatar ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                  >
                    {message.isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>

                  <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[70%] ${message.isBot ? "items-start" : "items-end"
                    }`}>
                    <div
                      className={`relative px-5 py-4 rounded-[26px] text-[15px] leading-[1.6] shadow-md ${message.isBot
                          ? "bg-card border border-border/60 text-foreground rounded-tl-none ring-1 ring-black/5 dark:ring-white/5"
                          : "bg-linear-to-br from-orange-500 to-amber-500 text-white rounded-tr-none shadow-orange-500/20"
                        }`}
                    >
                      <div className={`prose prose-sm max-w-none ${message.isBot ? "dark:prose-invert" : "prose-p:text-white prose-headings:text-white prose-strong:text-white"
                        }`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest px-2 group-hover:opacity-100 transition-opacity">
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
                className="flex items-start gap-5"
              >
                <div className="w-9 h-9 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-orange-500" />
                </div>
                <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[22px] rounded-tl-none px-6 py-4 shadow-xl flex items-center gap-3">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-orange-500/60 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-orange-500/30 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-black text-orange-500/80 uppercase tracking-widest leading-none">Analyzing</span>
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
              className="h-10 w-10 rounded-full shadow-2xl bg-background/90 backdrop-blur-md border border-border/50 hover:bg-muted cursor-pointer transition-all active:scale-95"
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
