import { useUsage } from "@/app/contexts/usage-context";
import { Bot, DollarSign, Home, Layers3, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
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
} from "./ui/sidebar";
import { Logo } from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";

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

  const meetingProgress =
    usage && limits.meetings !== -1
      ? Math.min((usage.meetingsThisMonth / limits.meetings) * 100, 100) //check with the total number of the meetings to be there in a month
      : 0;

  const chatProgress =
    usage && limits.chatMessages !== -1
      ? Math.min((usage.chatMessagesToday / limits.chatMessages) * 100, 100) //total number of chats that can be done in a meeting today
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
          title: "You're on Premium broski!",
          description: "Enjoying unlimited access to all features",
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
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border h-screen"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="flex-1 p-4 ">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === item.url}
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 mt-auto">
        {usage && (
          <div className="rounded-lg bg-sidebar-accent/50 p-3 mb-3">
            <p className="text-xs font-medium text-sidebar-accent-foreground mb-3">
              Current Plan: {usage.currentPlan.toUpperCase()}
            </p>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-sidebar-accent-foreground/70">
                  Meetings
                </span>
                <span className="text-xs text-sidebar-accent-foreground/70">
                  {usage.meetingsThisMonth}/
                  {limits.meetings === -1 ? "∞" : limits.meetings}
                </span>
              </div>

              {limits.meetings !== -1 && (
                <div className="w-full bg-sidebar-accent/30 rounded-full h-2">
                  <div
                    className="bg-sidebar-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${meetingProgress}%` }}
                  >
                    {" "}
                  </div>
                </div>
              )}

              {limits.meetings === -1 && (
                <div className="text-xs text-sidebar-accent-foreground/50 italic">
                  Unlimited
                </div>
              )}
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-sidebar-accent-foreground/70">
                  Chat Messages
                </span>
                <span className="text-xs text-sidebar-accent-foreground/70">
                  {usage.chatMessagesToday}/
                  {limits.chatMessages === -1 ? "∞" : limits.chatMessages}
                </span>
              </div>

              {limits.chatMessages !== -1 && (
                <div className="w-full bg-sidebar-accent/30 rounded-full h-2">
                  <div
                    className="bg-sidebar-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${chatProgress}%` }}
                  >
                    {" "}
                  </div>
                </div>
              )}

              {limits.chatMessages === -1 && (
                <div className="text-xs text-sidebar-accent-foreground/50 italic">
                  Unlimited
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upgrade Information  */}
        {upgradeInfo && (
          <div className="rounded-lg bg-sidebar-accent p-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-sidebar-accent-foreground">
                  {upgradeInfo.title}
                </p>
                <p className="text-xs text-sidebar-accent-foreground/70">
                  {upgradeInfo.description}
                </p>
              </div>

              {upgradeInfo.showButton && (
                <Link href="/pricing">
                  <Button className="w-full rounded-md bg-sidebar-primary px-3 py-2 text-xs font-medium text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90 cursor-pointer">
                    {upgradeInfo.title}
                  </Button>
                </Link>
              )}

              {!upgradeInfo.showButton && (
                <div className="text-center py-2">
                  <span className="text-xs text-sidebar-accent-foreground/60">
                    🎉 Thank you for your support!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
