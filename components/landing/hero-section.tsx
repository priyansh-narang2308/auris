"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { HeroHeader } from "./header";
import { ShinyButton } from "../ui/shiny-button";
import { SignUpButton, useAuth } from "@clerk/nextjs";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <ShinyButton className="cursor-pointer">
                    AI - Powered Meeting Assistant
                  </ShinyButton>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-4xl max-md:font-semibold md:text-6xl lg:mt-16 xl:text-[5rem]"
                >
                  AI that turns meetings into clear outcomes.
                </TextEffect>

                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                >
                  Automatic summaries, action items, and intelligent insights
                  that ensure every meeting ends with clarity and direction.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    className={`rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5 transition-opacity duration-300 ${
                      !isSignedIn
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none absolute"
                    }`}
                  >
                    <SignUpButton mode="modal">
                      <Button
                        size="lg"
                        className="rounded-xl px-5 text-base cursor-pointer"
                      >
                        <span className="text-nowrap">Get Started</span>
                      </Button>
                    </SignUpButton>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className={`h-10.5 rounded-xl px-5 cursor-pointer transition-opacity duration-300 ${
                      !isSignedIn
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none absolute"
                    }`}
                  >
                    <Link href="/demo">
                      <span className="text-nowrap">See how it works</span>
                    </Link>
                  </Button>

                  <div
                    className={`rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5 transition-opacity duration-300 ${
                      isSignedIn
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none absolute"
                    }`}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base cursor-pointer"
                    >
                      <Link href="/dashboard">
                        <span className="text-nowrap">Go to Dashboard</span>
                      </Link>
                    </Button>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className={`h-10.5 rounded-xl px-5 cursor-pointer transition-opacity duration-300 ${
                      isSignedIn
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none absolute"
                    }`}
                  >
                    <Link href="/demo">
                      <span className="text-nowrap">See how it works</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
