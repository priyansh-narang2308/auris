"use client";

import { useUsage } from "@/app/contexts/usage-context";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, AlertCircle } from "lucide-react";
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
            className="mb-4 p-4 bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-[0_8px_30px_rgb(249,115,22,0.05)]"
          >
            <div className="p-2 bg-orange-500/20 rounded-full">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Upgrade to Starter
              </p>
              <p className="text-xs text-muted-foreground">
                To use the chat function
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs font-bold border-orange-500/30 hover:bg-orange-500/10 bg-background/50 cursor-pointer transition-all"
              asChild
            >
              <a href="/pricing">Upgrade Plan</a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-orange-500/20 to-amber-500/20 dark:from-orange-500/15 dark:to-amber-500/15 rounded-[30px] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
        <div className="relative flex items-center gap-2 p-2 bg-white dark:bg-card/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-[26px] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all group-hover:shadow-[0_15px_50px_-10px_rgba(249,115,22,0.12)] group-focus-within:ring-2 ring-orange-500/20">
          <div className="pl-4 hidden sm:block">
            <Sparkles className="h-5 w-5 text-orange-500 dark:text-orange-400" />
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
                : "Upgrade to Starter to use the chat function"
            }
            disabled={isLoading || !canChat}
            className="
    flex-1 h-12 px-3 text-base
    bg-transparent
    text-foreground placeholder:text-muted-foreground/50
    border-0 outline-none ring-0
    shadow-none
    focus:ring-0 focus-visible:ring-0
    focus:outline-none
  "
          />

          <Button
            onClick={onSendMessage}
            disabled={isLoading || !canChat || !chatInput.trim()}
            className="h-11 w-11 sm:w-auto sm:px-7 rounded-[20px] bg-linear-to-br from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-500/30 text-white transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:grayscale"
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
