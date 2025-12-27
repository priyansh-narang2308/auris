"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Calendar,
  MessageSquare,
  BotIcon,
  MailIcon,
  Share2,
  Slack,
} from "lucide-react";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

export const container: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const item: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className=" py-32 md:py-36 dark:bg-transparent">
      <motion.div
        className="@container mx-auto max-w-6xl px-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={item} className="mx-auto max-w-5xl text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            A smarter way to capture and{" "}
            <span className="bg-linear-to-r from-foreground via-orange-400/60 to-muted-foreground bg-clip-text text-transparent">
              run meetings.
            </span>
          </h2>
          <p className="mt-6 text-muted-foreground relative inline-block">
            From AI summaries to seamless integrations, we&apos;ve got every
            aspect covered.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <FeatureCard
            icon={<BotIcon className="size-6 text-yellow-400" />}
            title="AI Meeting Summaries"
            desc="Automatically generates clear summaries, key points, and action items after every meeting."
          />

          <FeatureCard
            icon={<Calendar className="size-6 text-blue-400" />}
            title="Smart Calendar Integration"
            desc="Syncs with Google Calendar and joins scheduled meetings without manual setup."
          />

          <FeatureCard
            icon={<MailIcon className="size-6 text-purple-400" />}
            title="Automated Email Reports"
            desc="Delivers structured meeting summaries and follow-ups directly to your inbox without any delay."
          />

          <FeatureCard
            icon={<MessageSquare className="size-6 text-emerald-400" />}
            title="Chat with Meetings"
            desc="Ask questions and retrieve insights from past meetings using contextual search."
          />

          <FeatureCard
            icon={<Share2 className="size-6 text-pink-400" />}
            title="One-Click Integrations"
            desc="Send action items and notes to Slack, Jira, Asana, or Trello instantly."
          />

          <FeatureCard
            icon={<Slack className="size-6 text-red-400" />}
            title="Slack Bot Integration"
            desc="Interact with meetings, summaries, and insights directly inside Slack."
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) => (
  <motion.div variants={item}>
    <Card className="group shadow-zinc-950/5">
      <CardHeader className="pb-4 text-center">
        <CardDecorator>{icon}</CardDecorator>
        <h3 className="mt-6 font-medium">{title}</h3>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
