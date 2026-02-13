"use client";

import { useUsage } from "@/app/contexts/usage-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Sparkles,
  AlertCircle,
  Loader2,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
}

const ChatSidebar = ({
  messages,
  chatInput,
  showSuggestions,
  onInputChange,
  onSendMessage,
  onSuggestionClick,
}: ChatSidebarProps) => {
  const { canChat } = useUsage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => scrollToBottom("smooth"), 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    // Initial scroll
    const timer = setTimeout(() => scrollToBottom("auto"), 100);
    return () => clearTimeout(timer);
  }, []);

  const chatSuggestions = [
    "What deadlines were discussed?",
    "Summarize key action items",
    "Write a follow-up email",
    "What were the main topics?",
  ];

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden bg-transparent`}>
      <div className="p-6 border-b border-white/10 dark:border-white/5 bg-white/10 dark:bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/20 rounded-2xl shadow-[0_0_15px_rgba(var(--primary),0.3)]">
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
        className="flex-1 min-h-0 p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && showSuggestions && (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 px-6 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative">

                
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  
                  Hi, Did you miss me?
                </h3>
                <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed mx-auto">
                  Ask me anything about this meeting&apos;s summary, action items, or specific details.
                </p>
              </div>

              <div className="w-full flex flex-col gap-2 pt-2">

                {chatSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary), 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSuggestionClick(suggestion)}
                    disabled={!canChat}
                    className="group flex items-center gap-3 w-full p-3.5 text-left rounded-2xl border border-white/10 dark:border-white/5 bg-white/5 dark:bg-zinc-900/40 hover:border-primary/30 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">
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
              <div className={`flex flex-col gap-1.5 max-w-[85%]`}>
                <div
                  className={`relative px-5 py-3.5 rounded-[28px] shadow-lg text-[14px] leading-relaxed ${message.isBot
                    ? "bg-white/80 dark:bg-zinc-900/80 border border-white/20 dark:border-white/10 text-foreground rounded-tl-none backdrop-blur-sm"
                    : "bg-orange-500 text-white rounded-tr-none shadow-[0_8px_20px_rgba(249,115,22,0.3)]"
                    }`}
                >
                  <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-black/10 prose-pre:text-foreground prose-pre:p-3 prose-pre:rounded-xl max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wider uppercase text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity ${message.isBot ? "text-left ml-3" : "text-right mr-3"}`}
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

      <div className="p-6 border-t border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/10 backdrop-blur-md">
        {!canChat ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-xs font-bold text-destructive">
                Daily Limit Reached
              </p>
              <p className="text-[10px] text-destructive/80">
                Upgrade for unlimited assistant access.
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 text-[10px] font-bold rounded-xl"
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
            placeholder={canChat ? "Ask anything..." : "Limit reached"}
            className="flex-1 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 pr-14 h-14 rounded-[20px] focus-visible:ring-primary/20 transition-all font-medium text-sm shadow-inner"
            disabled={!canChat}
          />

          <Button
            type="button"
            size="icon"
            onClick={onSendMessage}
            disabled={!chatInput.trim() || !canChat}
            className="absolute right-2 h-10 w-10 bg-primary text-primary-foreground rounded-2xl shadow-[0_4px_12px_rgba(var(--primary),0.4)] hover:shadow-primary/20 transition-all active:scale-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ChatSidebar;
