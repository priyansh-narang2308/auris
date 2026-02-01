"use client";

import { useUsage } from "@/app/contexts/usage-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Loader2,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface Message {
  id: number;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatSidebarProps {
  messages: Message[];
  chatInput: string;
  showSuggestions: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onSuggestionClick: (suggestion: string) => void;
  hideBorder?: boolean;
}

const ChatSidebar = ({
  messages,
  chatInput,
  showSuggestions,
  onInputChange,
  onSendMessage,
  onSuggestionClick,
  hideBorder = false,
}: ChatSidebarProps) => {
  const { canChat } = useUsage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatSuggestions = [
    "What deadlines were discussed?",
    "Summarize key action items",
    "Write a follow-up email",
    "What were the main topics?",
  ];

  return (
    <div className={`w-full md:w-96 ${hideBorder ? "" : "border-l border-border/50"} bg-background/50 backdrop-blur-xl flex flex-col h-full overflow-hidden shadow-2xl`}>
      <div className="p-5 border-b border-border/50 bg-card/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm tracking-tight">
              Meeting Assistant
            </h3>
          </div>
        </div>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto space-y-6 scroll-smooth no-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && showSuggestions && (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 px-4 text-center">
              <div className="p-4 bg-muted/40 rounded-full border border-border/50 shadow-inner">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  No questions yet
                </p>
                <p className="text-xs text-muted-foreground max-w-50">
                  Ask about summaries, action items, or specific details from
                  the meeting.
                </p>
              </div>

              <div className="w-full grid grid-cols-1 gap-2 pt-4">
                {chatSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSuggestionClick(suggestion)}
                    disabled={!canChat}
                    className="group flex items-center gap-3 w-full p-3 text-left rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">
                      {suggestion}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.isBot ? -10 : 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.isBot ? "justify-start" : "justify-end"} group`}
            >
              <div className={`flex flex-col gap-1 max-w-[85%]`}>
                <div
                  className={`relative px-4 py-3 rounded-2xl shadow-sm text-sm ${message.isBot
                    ? "bg-card border border-border/50 text-foreground rounded-tl-none"
                    : "bg-primary text-primary-foreground rounded-tr-none"
                    }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                </div>
                <span
                  className={`text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ${message.isBot ? "text-left ml-2" : "text-right mr-2"}`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}

          {messages.length > 0 && !messages[messages.length - 1].isBot && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted/50 backdrop-blur-sm border border-border/50 text-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <p className="text-xs font-medium italic opacity-70">
                  Thinking...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 border-t border-border/50 bg-card/30">
        {!canChat ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-xs font-bold text-destructive">
                Limit Reached
              </p>
              <p className="text-[10px] text-destructive/80">
                Upgrade for unlimited assistant access.
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 text-[10px]"
              asChild
            >
              <a href="/pricing">Upgrade</a>
            </Button>
          </motion.div>
        ) : null}

        <div className="relative flex items-center gap-2">
          <Input
            type="text"
            value={chatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && chatInput.trim() && canChat) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder={canChat ? "Ask a question..." : "Daily limit reached"}
            className="flex-1 bg-background/50 border-border/50 pr-12 h-12 rounded-2xl focus-visible:ring-primary/20 transition-all font-medium text-sm"
            disabled={!canChat}
          />

          <Button
            type="button"
            size="icon"
            onClick={onSendMessage}
            disabled={!chatInput.trim() || !canChat}
            className="absolute right-1.5 h-9 w-9 bg-primary text-primary-foreground rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-3 text-[10px] text-center text-muted-foreground font-medium opacity-50">
          Press Enter to send
        </p>
      </div>
    </div>
  );
};

export default ChatSidebar;
