import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Mail, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  const lastUpdated = "February 13, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
              <ArrowLeft className="h-4 w-4 text-orange-500" />
            </div>
            <span className="font-bold tracking-tight text-sm">
              Back to Home
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Privacy Policy
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              At Auris, we take your privacy seriously. This policy describes
              how we collect, use, and handle your information when you use our
              AI-powered meeting assistant.
            </p>
          </section>

          {/* Data Collection */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <Eye className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold m-0">What Data We Collect</h2>
            </div>
            <p>
              To provide our services, we collect minimal information through
              your Google authentication:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              <li className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Google Email Address</span>
              </li>
              <li className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Full Name</span>
              </li>
              <li className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Profile Photo</span>
              </li>
              <li className="bg-muted/50 p-4 rounded-2xl border border-border/50 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Meeting Transcripts</span>
              </li>
            </ul>
          </section>

          {/* How We Use It */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <Lock className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold m-0">
                How We Use Your Information
              </h2>
            </div>
            <p>
              We use the collected data exclusively for the following purposes:
            </p>
            <ul className="space-y-3">
              <li>
                <strong>Authentication:</strong> To identify you and secure your
                account access.
              </li>
              <li>
                <strong>Personalization:</strong> To display your profile
                information within the application.
              </li>
              <li>
                <strong>Service Delivery:</strong> To transcribe, analyze, and
                summarize your meetings using AI.
              </li>
              <li>
                <strong>Communication:</strong> To send you meeting summaries
                and important account updates.
              </li>
            </ul>
          </section>

          {/* Data Selling Policy */}
          <section className="bg-orange-500/5 border border-orange-500/20 rounded-[32px] p-8 md:p-10 text-center space-y-4">
            <h2 className="text-2xl font-bold m-0 text-orange-500">
              We Do Not Sell Your Data
            </h2>
            <p className="text-muted-foreground m-0 max-w-xl mx-auto">
              Your data is yours. We do not sell, trade, or rent your personal
              information to third parties. Your meeting transcripts and
              summaries are private and only accessible to you.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <Mail className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold m-0">Contact Us</h2>
            </div>
            <p>
              If you have any questions about this Privacy Policy or how we
              handle your data, please reach out to us:
            </p>
            <Link
              href="mailto:priyanshnarang23@gmail.com"
              className="inline-flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 transition-opacity font-bold"
            >
              priyanshnarang23@gmail.com
            </Link>
          </section>
        </div>
      </main>

      {/* Footer link to Terms */}
      <footer className="max-w-3xl mx-auto px-6 pb-20 flex justify-center">
        <Link
          href="/terms"
          className="text-sm text-muted-foreground hover:text-orange-500 transition-colors underline underline-offset-4"
        >
          View Terms of Service
        </Link>
      </footer>
    </div>
  );
}
