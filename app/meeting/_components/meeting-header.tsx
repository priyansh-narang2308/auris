"use client";

import { Button } from "@/components/ui/button";
import {
  Check,
  Eye,
  Share2,
  Trash2,
  Slack,
  ChevronLeft,
  Loader2,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface MeetingHeaderProps {
  title: string;
  meetingId?: string;
  summary?: string;
  actionItems?: string;
  isOwner: boolean;
  isLoading?: boolean;
}

const MeetingHeader = ({
  title,
  meetingId,
  summary,
  actionItems,
  isOwner,
  isLoading = false,
}: MeetingHeaderProps) => {
  const [isPosting, setIsPosting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handlePostToSlack = async () => {
    if (!meetingId) return;

    try {
      setIsPosting(true);
      const loadingToast = toast.loading("Posting to Slack...");

      const resp = await fetch("/api/slack/post-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId,
          summary: summary || "Meeting summary not available",
          actionItems: actionItems || "No action items recorded",
        }),
      });

      const data = await resp.json();
      toast.dismiss(loadingToast);

      if (resp.ok) {
        toast.success("Succesfully posted to Slack!");
      } else {
        toast.error(`Error: ${data.message || "Could not post to Slack"}`);
      }
    } catch (err) {
      toast.error("An unexpected error occurred while posting to Slack");
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleShare = async () => {
    if (!meetingId) return;

    try {
      const shareUrl = `${window.location.origin}/meeting/${meetingId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!meetingId) return;

    try {
      setIsDeleting(true);
      const deleteToast = toast.loading("Deleting meeting...");

      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: "DELETE",
      });

      toast.dismiss(deleteToast);

      if (response.ok) {
        toast.success("Meeting deleted");
        router.push("/home");
      } else {
        toast.error("Failed to delete meeting");
      }
    } catch (err) {
      toast.error("Error deleting meeting");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hidden md:flex shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-base md:text-lg font-bold text-foreground truncate max-w-40 xs:max-w-[200px] md:max-w-md">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              <Calendar className="h-3 w-3" />
              <span>Meeting Recap</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground animate-pulse bg-muted/50 rounded-full">
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </div>
          ) : isOwner ? (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 md:gap-3"
              >
                <Button
                  onClick={handlePostToSlack}
                  disabled={isPosting || !meetingId}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-2 bg-slack/5 border-slack/20 text-foreground hover:bg-slack/10 hover:border-slack/30 transition-all duration-200"
                >
                  <Slack className="h-4 w-4 text-[#4A154B]" />
                  <span>{isPosting ? "Posting..." : "Slack"}</span>
                </Button>

                <Button
                  onClick={handleShare}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-secondary/80 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="hidden md:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      <span className="hidden md:inline">Share</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              <Eye className="h-3.5 w-3.5" />
              <span>Read Only Mode</span>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default MeetingHeader;
