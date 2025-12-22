"use client";

import { useUsage } from "@/app/contexts/usage-context";
import {
  Bot,
  Crown,
  DollarSign,
  Home,
  Layers3,
  Settings,
  Zap,
  ChevronsUpDown,
  LogOut,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./ui/sidebar";
import { Logo } from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

const ITEMS = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Layers3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Chat with AI",
    url: "/chat",
    icon: Bot,
  },
  {
    title: "Pricing",
    url: "/pricing",
    icon: DollarSign,
  },
];

const AppSidebar = () => {
  const pathName = usePathname();
  const { usage, limits } = useUsage();
  const { user } = useUser();
  const { setTheme, theme } = useTheme();
  const { signOut } = useClerk();

  const meetingProgress =
    usage && limits.meetings !== -1
      ? Math.min((usage.meetingsThisMonth / limits.meetings) * 100, 100)
      : 0;

  const chatProgress =
    usage && limits.chatMessages !== -1
      ? Math.min((usage.chatMessagesToday / limits.chatMessages) * 100, 100)
      : 0;

  const getTheUpgradeInfo = () => {
    if (!usage) {
      return null;
    }

    switch (usage.currentPlan) {
      case "free":
        return {
          title: "Upgrade to Starter",
          description: "Get 10 meetings per month and 30 daily chat messages",
          showButton: true,
        };
      case "starter":
        return {
          title: "Upgrade to Pro",
          description: "Get 30 meetings per month and 100 daily chat messages",
          showButton: true,
        };

      case "pro":
        return {
          title: "Upgrade to Premium",
          description: "Get unlimited meetings and chat messages",
          showButton: true,
        };
      case "premium":
        return {
          title: "Premium Plan Active",
          description: "You have unlimited access to all features",
          showButton: false,
        };
      default:
        return {
          title: "Upgrade Your Plan",
          description: "Get access to more features",
          showButton: true,
        };
    }
  };

  const upgradeInfo = getTheUpgradeInfo();

  return (
    <Sidebar collapsible="icon" className="h-screen border-r border-border">
      <SidebarHeader className="border-b border-border px-3 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <Logo />
          </Link>
          <SidebarTrigger className="text-muted-foreground hover:text-foreground cursor-pointer transition" />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 py-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === item.url}
                    className="group w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground data-[active=true]:bg-orange-500/15 data-[active=true]:text-orange-400 group-data-[state=collapsed]:justify-center"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="truncate group-data-[state=collapsed]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-3 pb-8">
        <div className="hidden group-data-[state=collapsed]:flex flex-col items-center gap-3 py-2">
          {usage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-lg border border-border bg-card hover:bg-muted transition-colors cursor-pointer"
                      aria-label="Current plan and usage"
                    >
                      <Crown className="h-5 w-5 text-orange-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    className="w-64 rounded-xl border border-border bg-card text-foreground p-3"
                  >
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-orange-400">
                        Current Plan: {usage.currentPlan.toUpperCase()}
                      </p>
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Meetings</span>
                            <span>
                              {usage.meetingsThisMonth}/
                              {limits.meetings === -1 ? "∞" : limits.meetings}
                            </span>
                          </div>
                          {limits.meetings !== -1 && (
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-orange-400 transition-all"
                                style={{ width: `${meetingProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Chat Messages</span>
                            <span>
                              {usage.chatMessagesToday}/
                              {limits.chatMessages === -1
                                ? "∞"
                                : limits.chatMessages}
                            </span>
                          </div>
                          {limits.chatMessages !== -1 && (
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-orange-300 transition-all"
                                style={{ width: `${chatProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TooltipTrigger>
              <TooltipContent side="right">Current plan & usage</TooltipContent>
            </Tooltip>
          )}

          {upgradeInfo && (
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-colors cursor-pointer"
                      aria-label="Upgrade plan"
                    >
                      <Zap className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <div className="p-2">
                      <div className="px-2 py-1">
                        <p className="text-sm font-medium text-foreground">
                          {upgradeInfo.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {upgradeInfo.description}
                        </p>
                      </div>
                      <div className="mt-2">
                        {upgradeInfo.showButton ? (
                          <DropdownMenuItem asChild>
                            <Link
                              href="/pricing"
                              className="block w-full rounded-md bg-orange-500 text-black text-center text-xs font-semibold py-2 hover:bg-orange-400 transition"
                            >
                              {upgradeInfo.title}
                            </Link>
                          </DropdownMenuItem>
                        ) : (
                          <div className="px-2 py-1 text-center text-xs text-muted-foreground">
                            Premium Plan Active
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">Upgrade plan</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="group-data-[state=collapsed]:hidden space-y-3">
          {usage && (
            <div className="rounded-xl border border-border bg-card backdrop-blur-md p-3">
              <p className="mb-3 text-xs font-medium text-foreground/80">
                Current Plan:{" "}
                <span className="text-orange-400">
                  {usage.currentPlan.toUpperCase()}
                </span>
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs text-white/60">
                  <span>Meetings</span>
                  <span>
                    {usage.meetingsThisMonth}/
                    {limits.meetings === -1 ? "∞" : limits.meetings}
                  </span>
                </div>
                {limits.meetings !== -1 && (
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-orange-400 transition-all duration-500"
                      style={{ width: `${meetingProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/60">
                  <span>Chat Messages</span>
                  <span>
                    {usage.chatMessagesToday}/
                    {limits.chatMessages === -1 ? "∞" : limits.chatMessages}
                  </span>
                </div>
                {limits.chatMessages !== -1 && (
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-orange-300 transition-all duration-500"
                      style={{ width: `${chatProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {upgradeInfo && (
            <div className="rounded-xl border border-orange-500/20 bg-linear-to-br from-orange-500/10 to-orange-500/5 p-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">
                    {upgradeInfo.title}
                  </p>
                  <p className="text-xs text-white/60">
                    {upgradeInfo.description}
                  </p>
                </div>
                {upgradeInfo.showButton && (
                  <Link href="/pricing">
                    <Button className="w-full rounded-md cursor-pointer bg-orange-500 text-black text-xs font-semibold hover:bg-orange-400">
                      {upgradeInfo.title}
                    </Button>
                  </Link>
                )}
                {!upgradeInfo.showButton && (
                  <div className="py-2 text-center text-xs text-white/50">
                    Premium Plan Active
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="group-data-[state=collapsed]:flex hidden justify-center py-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 rounded-lg",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>

              <div className="group-data-[state=collapsed]:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      variant="outline"
                      className="h-auto w-full justify-start gap-3 rounded-xl border border-border bg-card p-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:bg-accent hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] active:scale-[0.98]"
                    >
                      <Avatar className="h-9 w-9 rounded-lg border border-border">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                        <AvatarFallback className="rounded-lg bg-orange-500/10 text-orange-500">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col truncate text-left leading-tight">
                        <span className="truncate text-sm font-semibold text-foreground">
                          {user?.fullName || "User"}
                        </span>
                        <span className="truncate text-[11px] text-muted-foreground/70">
                          {user?.primaryEmailAddress?.emailAddress || ""}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/40" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="end"
                    sideOffset={12}
                    className="w-64 rounded-xl border border-border bg-popover p-2 shadow-xl"
                  >
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-10 w-10 rounded-lg border border-border">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                        <AvatarFallback className="rounded-lg bg-orange-500/10 text-orange-500">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5 truncate">
                        <p className="truncate text-sm font-bold text-foreground">
                          {user?.fullName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-foreground">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted/50">
                          {theme === "dark" ? (
                            <Moon className="size-4 text-orange-400" />
                          ) : theme === "light" ? (
                            <Sun className="size-4 text-orange-500" />
                          ) : (
                            <Monitor className="size-4 text-blue-400" />
                          )}
                        </div>
                        <span className="flex-1 font-medium">Appearance</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-40 rounded-xl border border-border bg-popover p-1 shadow-xl">
                          <DropdownMenuItem
                            onClick={() => setTheme("light")}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <Sun className="size-4 text-orange-500" />
                            <span>Light</span>
                            {theme === "light" && <div className="ml-auto size-1.5 rounded-full bg-orange-500" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setTheme("dark")}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <Moon className="size-4 text-orange-400" />
                            <span>Dark</span>
                            {theme === "dark" && <div className="ml-auto size-1.5 rounded-full bg-orange-400" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setTheme("system")}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <Monitor className="size-4 text-blue-400" />
                            <span>System</span>
                            {theme === "system" && <div className="ml-auto size-1.5 rounded-full bg-blue-400" />}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 text-destructive">
                        <LogOut className="size-4" />
                      </div>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
