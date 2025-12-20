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
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
        className="fixed left-3 top-3 z-50 text-white/60 hover:text-white bg-white/5 border border-white/10 hover:bg-white/6"
      >
        <PanelLeftIcon />
      </Button>
    </div>
  );
}
