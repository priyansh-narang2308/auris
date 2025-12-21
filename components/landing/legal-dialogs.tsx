"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function LegalDialog({
  title,
  trigger,
  children,
}: {
  title: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyPolicyDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <LegalDialog title="Privacy Policy" trigger={trigger}>
      <p>
        Auris automatically joins meetings on your behalf to generate summaries
        and actionable items. We process audio, transcripts, and metadata only
        for this purpose.
      </p>

      <p>
        We do not sell personal data. Meeting content is never used for model
        training without explicit consent. Data is encrypted in transit and at
        rest.
      </p>

      <p>
        You remain the owner of your meeting data. You can delete your data at
        any time from your account settings.
      </p>

      <p>
        By using Auris, you confirm that you have permission to invite an AI
        assistant into your meetings.
      </p>
    </LegalDialog>
  );
}

export function TermsDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <LegalDialog title="Terms of Service" trigger={trigger}>
      <p>
        Auris is an AI meeting assistant that joins calls, listens, and
        generates summaries and action items.
      </p>

      <p>
        You are responsible for ensuring compliance with local laws and meeting
        consent requirements when using the service.
      </p>

      <p>
        Auris is provided on an “as-is” basis. We do not guarantee accuracy,
        completeness, or suitability of generated outputs.
      </p>

      <p>
        Misuse of the service, including unauthorized meeting access, may result
        in suspension or termination.
      </p>
    </LegalDialog>
  );
}
