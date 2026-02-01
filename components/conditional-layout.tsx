"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "./ui/sidebar";
import AppSidebar from "./app-sidebar";
import MobileSidebarToggle from "./mobile-sidebar-toggle";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  // On initial load, isLoaded is false. We should assume the sidebar should be shown 
  // if we are not on the landing page, to prevent layout shifts/flickering.
  const showSidebar = pathName !== "/" && (
    isLoaded
      ? !(pathName.startsWith("/meeting/") && !isSignedIn)
      : true // Keep it showing while loading to prevent unmount/remount
  );

  if (!showSidebar) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background transition-all">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-h-screen">
          <MobileSidebarToggle />

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
