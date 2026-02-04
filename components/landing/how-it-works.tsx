"use client";

import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const circle: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

const HowItWorks = () => {
  return (
    <section id="howitworks" className="relative  py-28 md:py-36">
      <motion.div
        className="mx-auto max-w-7xl px-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
      >
        <motion.div variants={item} className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">
            How It {" "}
            <span className="bg-linear-to-r from-foreground via-orange-400/60 to-muted-foreground bg-clip-text text-transparent">
              Works
            </span>

          </h2>
          <p className="mt-6 text-lg text-zinc-400">
            Get started in minutes with our simple 3-step process
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-10 hidden h-px w-[70%] -translate-x-1/2 bg-linear-to-r from-transparent via-orange-500/40 to-transparent md:block origin-center"
          />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-20">
            <Step
              step="1"
              title="Connect Calendar"
              desc="Link your Google Calendar and we’ll automatically detect your meetings."
            />

            <Step
              step="2"
              title="Bot Joins Meeting"
              desc="Our AI bot joins, records, and transcribes meetings automatically."
            />

            <Step
              step="3"
              title="Get Insights"
              desc="Receive summaries, action items, and push them to your tools instantly."
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;

const Step = ({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) => {
  return (
    <motion.div
      variants={item}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        variants={circle}
        whileHover={{ scale: 1.1 }}
        className="relative mb-8 flex size-20 items-center justify-center rounded-full border border-orange-500/40 text-2xl font-medium text-orange-400 bg-black"
      >
        <span className="relative z-10">{step}</span>
        <span className="absolute inset-0 rounded-full bg-orange-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed max-w-sm">{desc}</p>
    </motion.div>
  );
};
