/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Gemini } from "@/components/logos";
import { LogoIcon } from "@/components/logo";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { motion } from "framer-motion";
import { Database, ShieldCheck, Cpu } from "lucide-react";
import { useState, useEffect } from "react";

const integrations = [
  {
    name: "Jira",
    icon: "/jira.png",
    size: 32,
    category: "Productivity",
    delay: 0,
  },
  {
    name: "Slack",
    icon: "/slack.png",
    size: 32,
    category: "Communication",
    delay: 0.1,
  },
  {
    name: "Asana",
    icon: "/asana.png",
    size: 32,
    category: "Management",
    delay: 0.2,
  },
  {
    name: "Google Calendar",
    icon: "/gcal.png",
    size: 36,
    category: "Scheduling",
    delay: 0.3,
  },
  {
    name: "Trello",
    icon: "/trello.png",
    size: 32,
    category: "Organization",
    delay: 0.4,
  },
  {
    name: "Gemini AI",
    component: <Gemini />,
    size: 32,
    category: "Intelligence",
    delay: 0.5,
  },
];

export default function IntegrationsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 md:size-200 bg-orange-500/5 blur-[60px] md:blur-[100px] rounded-full will-change-[filter]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[48px_48px] md:bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="flex flex-col gap-12 md:gap-24">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-balance text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Everything your meetings <br />
              <span className="bg-linear-to-r from-foreground via-orange-400/60 to-muted-foreground bg-clip-text text-transparent">
                connect to.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-xl leading-relaxed text-muted-foreground mx-auto max-w-2xl font-medium"
            >
              Auris orchestrates your favorite tools, turning every word spoken
              into actionable tasks, updated documents, and synced calendars.
            </motion.p>
          </div>

          <div className="relative flex flex-col items-center justify-center min-h-125 md:min-h-175">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-75 md:size-100 border border-orange-500/10 rounded-full" />
              <div className="absolute size-125 md:size-162.5 border border-foreground/5 rounded-full" />
              <div className="absolute size-175 md:size-225 border border-foreground/2 rounded-full" />

              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.1, 0.05] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute size-70 md:size-112.5 border-2 border-orange-500/10 rounded-full blur-sm"
              />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="group relative z-40 flex size-24 md:size-48 items-center justify-center rounded-2xl md:rounded-[2.5rem] border-2 border-orange-500/30 bg-background shadow-[0_0_60px_rgba(234,88,12,0.15)] transition-all duration-700 hover:rotate-6 hover:scale-105 cursor-pointer will-change-transform"
            >
              <LogoIcon className="size-12 md:size-24" />
              <div className="absolute -inset-2 rounded-[2.5rem] bg-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="absolute inset-x-0 top-1/2 -z-10 h-px w-screen bg-linear-to-r from-transparent via-orange-500/10 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 -z-10 w-px h-screen bg-linear-to-b from-transparent via-orange-500/5 to-transparent pointer-events-none" />
            </motion.div>

            {integrations.map((item, i) => (
              <IntegrationNode
                key={item.name}
                item={item}
                index={i}
                total={integrations.length}
              />
            ))}

            <div className="hidden lg:block">
              <FloatingFeature
                icon={<Database className="size-5 text-orange-600" />}
                text="Bi-directional Sync"
                className="top-1/4 left-[10%] cursor-pointer"
                delay={0}
              />
              <FloatingFeature
                icon={<ShieldCheck className="size-5 text-blue-600" />}
                text="Enterprise SSO"
                className="bottom-1/4 right-[10%] cursor-pointer"
                delay={0.5}
              />
              <FloatingFeature
                icon={<Cpu className="size-5 text-purple-600" />}
                text="Auto-contextualization"
                className="top-1/3 right-[5%] cursor-pointer"
                delay={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationNode({
  item,
  index,
  total,
}: {
  item: any;
  index: number;
  total: number;
}) {
  const angle = (index / total) * Math.PI * 2;
  const [radius, setRadius] = useState(280);

  useEffect(() => {
    const updateRadius = () => {
      setRadius(window.innerWidth < 768 ? 130 : 280);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        animate={{
          x: [
            Math.cos(angle) * (radius - 5),
            Math.cos(angle) * (radius + 5),
            Math.cos(angle) * (radius - 5),
          ],
          y: [
            Math.sin(angle) * (radius - 5),
            Math.sin(angle) * (radius + 5),
            Math.sin(angle) * (radius - 5),
          ],
        }}
        transition={{
          opacity: { delay: item.delay, duration: 0.6 },
          scale: { delay: item.delay, duration: 0.6, type: "spring" },
          x: { duration: 10 + index, repeat: Infinity, ease: "linear" },
          y: { duration: 10 + index, repeat: Infinity, ease: "linear" },
        }}
        className="will-change-transform"
      >
        <motion.div
          whileHover={{ scale: 1.1, y: -5, rotate: index % 2 === 0 ? 3 : -3 }}
          className="flex size-14 md:size-24 items-center justify-center rounded-xl md:rounded-[2rem] border bg-background shadow-xl cursor-pointer group transition-colors hover:border-orange-500/30"
        >
          <div className="absolute -inset-4 scale-125 bg-orange-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />

          {item.component ? (
            <div className="*:size-7 md:*:size-11">{item.component}</div>
          ) : (
            <Image
              src={item.icon}
              alt={item.name}
              width={item.size}
              height={item.size}
              className="size-7 md:size-11 object-contain filter transition-all group-hover:drop-shadow-[0_0_15px_rgba(234,88,12,0.4)]"
            />
          )}

          {/* Label on Hover */}
          <div className="absolute -bottom-14 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-300">
            <div className="px-3 py-1.5 rounded-full border bg-background shadow-lg text-[11px] font-black uppercase tracking-widest text-orange-600">
              {item.name}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FloatingFeature({
  icon,
  text,
  className,
  delay,
}: {
  icon: React.ReactNode;
  text: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      animate={{ y: [0, -15, 0] }}
      transition={{
        opacity: { delay, duration: 1 },
        x: { delay, duration: 1 },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={cn(
        "absolute z-10 flex items-center gap-3 px-5 py-3 rounded-2xl border bg-background shadow-lg border-foreground/5 will-change-transform",
        className
      )}
    >
      <div className="size-10 rounded-xl border bg-background flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{text}</span>
    </motion.div>
  );
}
