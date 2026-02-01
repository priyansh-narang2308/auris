"use client";

import * as React from "react";
import { PanelLeftIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";

export default function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
        className="fixed left-4 top-4 z-60 bg-background shadow-md border-border/50 hover:bg-muted cursor-pointer"
      >
        <PanelLeftIcon className="h-5 w-5 text-foreground" />
      </Button>
    </div>
  );
}
