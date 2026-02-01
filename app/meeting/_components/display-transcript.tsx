"use client";

import { useState } from "react";
import { Search, Copy, Check, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

interface TranscriptSegment {
  words: TranscriptWord[];
  offset: number;
  speaker: string;
}

interface TranscriptDisplayProps {
  transcript: TranscriptSegment[];
}

export default function DisplayTranscript({
  transcript,
}: TranscriptDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getSpeakerSegmentTime = (segment: TranscriptSegment) => {
    const startTime = segment.offset;
    const endTime =
      segment.words[segment.words.length - 1]?.end || segment.offset;
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const getSegmentText = (segment: TranscriptSegment) => {
    return segment.words.map((word) => word.word).join(" ");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTranscript = (transcript || []).filter(
    (segment) =>
      getSegmentText(segment)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      segment.speaker.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!transcript || transcript.length === 0) {
    return (
      <div className="bg-card/50 rounded-2xl p-12 border border-border flex flex-col items-center justify-center text-center backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          No transcript found
        </h3>
        <p className="text-muted-foreground mt-2 max-w-xs text-sm">
          This meeting hasn&apos;t been transcribed yet or the transcript is
          empty.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md h-full">
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                Meeting Transcript
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                {transcript.length} Segments
              </p>
            </div>
          </div>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search in transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/30 border-none transition-all focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-visible"> {/** Removed internal ScrollArea to use page-level scroll */}
        <div className="p-4 space-y-8">
          {filteredTranscript.map((segment, index) => {
            const text = getSegmentText(segment);
            return (
              <div
                key={index}
                className="group relative flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Avatar className="w-9 h-9 border border-border/50 shadow-sm shrink-0">
                  <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                    {getInitials(segment.speaker)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs text-foreground tracking-tight">
                      {segment.speaker}
                    </span>
                    <span className="text-[9px] font-medium text-muted-foreground tabular-nums">
                      {getSpeakerSegmentTime(segment)}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 ml-auto opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-primary/10 hover:text-primary cursor-pointer active:scale-90"
                      onClick={() => handleCopy(text, index)}
                      title="Copy segment text"
                    >
                      {copiedId === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground transition-colors" />
                      )}
                    </Button>
                  </div>

                  <p
                    className={cn(
                      "text-[13px] leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/90",
                      searchQuery && "selection:bg-primary/20",
                    )}
                  >
                    {searchQuery
                      ? text
                        .split(new RegExp(`(${searchQuery})`, "gi"))
                        .map((part, i) =>
                          part.toLowerCase() === searchQuery.toLowerCase() ? (
                            <mark
                              key={i}
                              className="bg-primary/20 text-foreground rounded-[2px] px-0.5 font-medium"
                            >
                              {part}
                            </mark>
                          ) : (
                            part
                          ),
                        )
                      : text}
                  </p>
                </div>
              </div>
            );
          })}

          {filteredTranscript.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                No matches found for &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-1 text-primary"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
