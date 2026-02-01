"use client";

import { useUsage } from "@/app/contexts/usage-context";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  chatInput: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

const ChatInput = ({
  chatInput,
  onInputChange,
  onSendMessage,
  isLoading,
}: ChatInputProps) => {
  const { canChat, usage, limits } = useUsage();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <AnimatePresence>
        {!canChat && usage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-4 p-4 bg-orange-500/5 rounded-2xl flex items-center gap-3 backdrop-blur-sm"
          >
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Zap className="h-4 w-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Daily Limit Reached
              </p>
              <p className="text-xs text-muted-foreground">
                You&apos;ve used {usage.chatMessagesToday}/{limits.chatMessages}{" "}
                messages today.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs font-bold border-orange-500/20 hover:bg-orange-500/10 cursor-pointer"
              asChild
            >
              <a href="/pricing">Upgrade Plan</a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-amber-500 rounded-[28px] blur opacity-15 group-hover:opacity-25 transition duration-500"></div>
        <div className="relative flex items-center gap-2 p-1.5 bg-background/80 backdrop-blur-xl  rounded-[24px] shadow-2xl">
          <div className="pl-4 hidden sm:block">
            <Sparkles className="h-5 w-5 " />
          </div>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                chatInput.trim() &&
                !isLoading &&
                canChat
              ) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder={
              canChat
                ? "Ask anything about your meetings..."
                : "Daily limit reached - upgrade to continue"
            }
            disabled={isLoading || !canChat}
            className="
    flex-1 h-12 px-2 text-base
    bg-transparent
text-white
    border-0 outline-none ring-0
    shadow-none
    focus:ring-0 focus-visible:ring-0
    focus:outline-none
  "
          />

          <Button
            onClick={onSendMessage}
            disabled={isLoading || !canChat || !chatInput.trim()}
            className="h-10 w-10 sm:w-auto sm:px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              </motion.div>
            ) : (
              <>
                <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
