import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { UsageProvider } from "./contexts/usage-context";
import { ConditionalLayout } from "@/components/conditional-layout";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "auris",
  description:
    "An AI-Based Notetaker + Meeting Bot similar to Fireflies.ai and Otter.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: "simple",
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppins.className}`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UsageProvider>
              <SmoothScrollProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
                <Toaster richColors />
              </SmoothScrollProvider>
            </UsageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
