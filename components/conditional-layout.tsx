import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "./ui/sidebar";
import AppSidebar from "./app-sidebar";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const { isSignedIn } = useAuth();

  const showSidebar =
    pathName !== "/" && !(pathName.startsWith("/meeting/") && !isSignedIn);

  if (!showSidebar) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
