import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, ShieldAlert, Ban } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Terms of Service
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12">
          {/* Acceptance */}
          <section className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              By accessing or using Auris, you agree to be bound by these Terms
              of Service. Please read them carefully before using our platform.
            </p>
          </section>

          {/* Use of Service */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <FileText className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold m-0">1. Use of Service</h2>
            </div>
            <p>
              Auris provides an AI-powered meeting assistant designed to
              transcribe, summarize, and analyze audio and video meetings. You
              are granted a non-exclusive, non-transferable right to use the
              service for personal or professional purposes in accordance with
              these terms.
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <Scale className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold m-0">
                2. User Responsibilities
              </h2>
            </div>
            <p>As a user of Auris, you are responsible for:</p>
            <ul className="space-y-3">
              <li>
                <strong>Compliance:</strong> Ensuring your use of the service
                complies with all local and international laws regarding
                recording and transcription.
              </li>
              <li>
                <strong>Consent:</strong> Obtaining necessary consent from all
                meeting participants before recording or transcribing any
                conversation.
              </li>
              <li>
                <strong>Account Security:</strong> Maintaining the
                confidentiality of your account credentials.
              </li>
              <li>
                <strong>Content:</strong> All data, audio, and information you
                upload or process through the service.
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold m-0">
                3. Limitation of Liability
              </h2>
            </div>
            <p>
              Auris is provided &quot;as is&quot; and &quot;as available&quot;.
              We do not guarantee 100% accuracy in transcriptions or
              AI-generated summaries. To the maximum extent permitted by law,
              Auris shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the service.
            </p>
          </section>

          {/* Termination */}
          <section className="space-y-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <Ban className="h-5 w-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold m-0">4. Termination</h2>
            </div>
            <p>
              We reserve the right to suspend or terminate your access to the
              service at our sole discretion, without notice, for conduct that
              we believe violates these Terms of Service or is harmful to other
              users, us, or third parties.
            </p>
          </section>

          {/* Contact info for terms */}
          <section className="bg-muted/50 border border-border/50 rounded-[32px] p-8 text-center">
            <p className="text-sm text-muted-foreground m-0">
              Questions about these terms? Contact us at{" "}
              <Link
                href="mailto:priyanshnarang23@gmail.com"
                className="text-orange-500 font-bold hover:underline"
              >
                priyanshnarang23@gmail.com
              </Link>
            </p>
          </section>
        </div>
      </main>

      {/* Footer link back to Privacy */}
      <footer className="max-w-3xl mx-auto px-6 pb-20 flex justify-center">
        <Link
          href="/privacy"
          className="text-sm text-muted-foreground hover:text-orange-500 transition-colors underline underline-offset-4"
        >
          View Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
