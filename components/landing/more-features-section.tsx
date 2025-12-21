"use client";

import { Download, Settings, BarChart3 } from "lucide-react";
import { VercelCard } from "../ui/vercel-card";

const features = [
  {
    icon: Download,
    title: "Complete Meeting Exports",
    desc: "Download audio MP3, transcripts, summaries, and action items.",
  },
  {
    icon: Settings,
    title: "Full Customization",
    desc: "Customize bot name, image, and control when the bot joins meetings.",
  },
  {
    icon: BarChart3,
    title: "Meeting Analytics",
    desc: "Track meeting patterns, participation rates, and productivity.",
  },
];

const MoreFeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-950 dark:text-white">
            Plus{" "}
            <span className="text-blue-600 dark:text-blue-400">
              More Features
            </span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 dark:text-zinc-400">
            Everything you need for complete meeting management
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <VercelCard
              key={i}
               animateOnHover
               glowEffect
              className="h-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm dark:shadow-none"
            >
              <div className="flex flex-col gap-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <feature.icon className="size-6" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </VercelCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreFeaturesSection;
