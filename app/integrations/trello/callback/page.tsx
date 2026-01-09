"use client"

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TrelloCallback = () => {
  const router = useRouter();
  const [status, setStatus] = useState("Connecting your Trello account…");

  useEffect(() => {
    const processToken = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("token");

        if (!token) {
          setStatus("No authorization token found.");
          setTimeout(() => router.push("/integrations?error=no_token"), 2000);
          return;
        }

        setStatus("Saving your connection…");

        const response = await fetch("/api/integrations/trello/process-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus("Connected successfully. Redirecting…");
          setTimeout(() => {
            router.push("/integrations?success=trello_connected&setup=trello");
          }, 1200);
        } else {
          setStatus("Failed to save connection. Please try again.");
          setTimeout(
            () => router.push("/integrations?error=save_failed"),
            2000
          );
        }
      } catch (error) {
        console.error(error);
        setStatus("Something went wrong. Please try again.");
        setTimeout(
          () => router.push("/integrations?error=unexpected_error"),
          2000
        );
      }
    };

    processToken();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-neutral-900 to-black">
      <div className="relative w-full max-w-md rounded-2xl border border-orange-500/20 bg-neutral-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="absolute -inset-px rounded-2xl bg-orange-500/10 blur-xl" />

        <div className="relative z-10 text-center">
          <div className="relative mx-auto mb-6 h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>

          <h2 className="mb-2 text-xl font-semibold tracking-tight text-white">
            Connecting Trello
          </h2>

          <p className="text-sm text-orange-200/80">{status}</p>

          <p className="mt-4 text-xs text-neutral-500">
            Please don&apos;t close this window
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrelloCallback;
