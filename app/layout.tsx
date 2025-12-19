import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { UsageProvider } from "./contexts/usage-context";

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
        theme: dark,
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
            <UsageProvider>{children}</UsageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
