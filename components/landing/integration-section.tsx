import { Gemini } from "@/components/logos";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/logo";
import Image from "next/image";

export default function IntegrationsSection() {
  return (
    <section>
      <div className=" dark:bg-background py-18 md:py-12 ">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative mx-auto flex max-w-sm items-center justify-between">
            <div className="space-y-6">
              <IntegrationCard position="left-top">
                <Image src={"/asana.png"} alt="asana" width={16} height={16} />
              </IntegrationCard>
              <IntegrationCard>
                <Image src={"/jira.png"} alt="jira" width={16} height={16} />
              </IntegrationCard>
              <IntegrationCard position="left-bottom">
                <Gemini />
              </IntegrationCard>
            </div>
            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-2xl border p-1">
                <IntegrationCard
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/25 shadow-xl dark:border-white/25 dark:shadow-white/10"
                  isCenter={true}
                >
                  <LogoIcon />
                </IntegrationCard>
              </div>
            </div>
            <div
              role="presentation"
              className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] opacity-50 [--dots-color:black] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:[--dots-color:white]"
            ></div>

            <div className="space-y-6">
              <IntegrationCard position="right-top">
                <Image src={"/slack.png"} alt="slack" width={16} height={16} />
              </IntegrationCard>
              <IntegrationCard position="right-middle">
                <Image
                  src={"/gcal.png"}
                  alt="calendar"
                  width={16}
                  height={16}
                />
              </IntegrationCard>
              <IntegrationCard position="right-bottom">
                <Image
                  src={"/trello.png"}
                  alt="trello"
                  width={64}
                  height={64}
                />
              </IntegrationCard>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Integrate with your favorite tools
            </h2>
            <p className="text-muted-foreground">
              Connect seamlessly with popular platforms and services to enhance
              your workflow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  position,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  position?:
    | "left-top"
    | "left-middle"
    | "left-bottom"
    | "right-top"
    | "right-middle"
    | "right-bottom";
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-background relative flex size-12 rounded-xl border dark:bg-transparent",
        "transition-all duration-300 ease-out cursor-pointer ",
        "hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl ",
        isCenter && "hover:scale-110 hover:shadow-lg",
        className
      )}
    >
      <div
        className={cn(
          "relative z-20 m-auto size-fit *:size-6 transition-transform duration-300",
          isCenter && "*:size-8"
        )}
      >
        {children}
      </div>

      {position && !isCenter && (
        <div
          className={cn(
            "bg-linear-to-r to-muted-foreground/25 absolute z-10 h-px transition-opacity duration-300",
            "group-hover:opacity-70",
            position === "left-top" &&
              "left-full top-1/2 w-32.5 origin-left rotate-25",
            position === "left-middle" && "left-full top-1/2 w-30 origin-left",
            position === "left-bottom" &&
              "left-full top-1/2 w-32.5 origin-left rotate-[-25deg]",
            position === "right-top" &&
              "bg-linear-to-l right-full top-1/2 w-32.5 origin-right rotate-[-25deg]",
            position === "right-middle" &&
              "bg-linear-to-l right-full top-1/2 w-32.5 origin-right",
            position === "right-bottom" &&
              "bg-linear-to-l right-full top-1/2 w-32.5 origin-right rotate-25"
          )}
        />
      )}
    </div>
  );
};
