"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogoIcon } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative px-6 py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-125 bg-orange-500/10 blur-[120px] rounded-full opacity-50 dark:opacity-50 opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-30 opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl"
      >
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-zinc-950/50 px-6 py-16 text-center backdrop-blur-xl md:px-12 md:py-24 shadow-2xl shadow-orange-500/5 dark:shadow-none">
          <div className="absolute -right-20 -top-20 size-64 rounded-full bg-orange-600/10 dark:bg-orange-600/20 blur-[80px] transition-all duration-700 group-hover:bg-orange-600/20 dark:group-hover:bg-orange-600/30" />
          <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-orange-600/5 dark:bg-orange-600/10 blur-[80px] transition-all duration-700 group-hover:bg-orange-600/10 dark:group-hover:bg-orange-600/20" />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 flex size-16 items-center justify-center rounded-2xl border border-orange-500/10 dark:border-white/10 bg-white dark:bg-white/5 shadow-xl shadow-orange-500/10 dark:shadow-none backdrop-blur-sm"
            >
              <LogoIcon className="size-10 text-orange-500" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-6xl"
            >
              Ready to revolutionize <br />{" "}
              <span className="bg-linear-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                your meetings?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400 md:text-xl"
            >
              Join forward-thinking teams using auris to turn conversations into
              clarity, action, and results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-2xl bg-orange-500 px-8 text-lg font-semibold text-white transition-all hover:bg-orange-600 hover:scale-105 active:scale-95"
              >
                <Link href="/home" className="flex items-center gap-2">
                  Get Started for Free
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
