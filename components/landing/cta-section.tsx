import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-5xl rounded-2xl md:rounded-3xl border px-6 py-10 md:py-20 lg:py-32">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            Ready to revolutionize your meetings?
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">
            Join thousands of teams already using MeetingBot to save time.
          </p>

          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/home">
                <span>Get Started</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
