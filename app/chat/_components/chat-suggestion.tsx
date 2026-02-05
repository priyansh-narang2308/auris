"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const ChatSuggestion = ({
  suggestions,
  onSuggestionClick,
}: ChatSuggestionsProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-2xl mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">
          How can I help you{" "}
          <span className="bg-linear-to-br from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
            today?
          </span>
        </h2>

        <p className="text-base text-muted-foreground leading-relaxed">
          I have access to all your transcribed meetings. Ask me to find
          specific decisions, summarize multiple catch-ups, or reveal hidden
          insights.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="flex items-center justify-between p-5 bg-white dark:bg-card/50 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-2xl hover:bg-orange-50/50 dark:hover:bg-muted/50 hover:border-orange-500/30 transition-all text-left group cursor-pointer shadow-sm hover:shadow-md active:scale-98"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-foreground group-hover:text-orange-500 transition-colors">
                {suggestion}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestion;
