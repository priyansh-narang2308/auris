import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface VercelCardProps extends Omit<HTMLMotionProps<"div">, "whileHover" | "transition"> {
  showIcons?: boolean;
  iconClassName?: string;
  animateOnHover?: boolean;
  glowEffect?: boolean;
  bordered?: boolean;
}

function VercelCard({
  children,
  className,
  showIcons = true,
  iconClassName,
  animateOnHover = false,
  glowEffect = false,
  bordered = true,
  ...props
}: VercelCardProps) {
  return (
    <motion.div
      className={cn(
        "group/card relative flex flex-col items-center justify-center w-full h-full min-h-50",
        bordered && "border border-black/20 dark:border-white/20 rounded-xl",
        className
      )}
      whileHover={animateOnHover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {showIcons && (
        <>
          <Icon className={cn("absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white z-20", iconClassName)} />
          <Icon className={cn("absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white z-20", iconClassName)} />
          <Icon className={cn("absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white z-20", iconClassName)} />
          <Icon className={cn("absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white z-20", iconClassName)} />
        </>
      )}

      {glowEffect && (
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
           <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover/card:opacity-100 blur-2xl transition-opacity duration-500" />
        </div>
      )}

      <div className="relative z-10 h-full w-full p-6 flex flex-col items-center justify-center">
        {children as React.ReactNode}
      </div>
    </motion.div>
  );
}

function Icon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
}

export { VercelCard };