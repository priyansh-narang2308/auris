import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 132 28"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-auto text-foreground", className)}
    >
      <path
        d="
          M12 14
          C12 4, 28 4, 28 14
          C28 24, 44 24, 44 14
          C44 4, 60 4, 60 14
        "
        fill="none"
        stroke={uniColor ? "currentColor" : "url(#auris-gradient)"}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x="76"
        y="20"
        fontSize="20"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        letterSpacing="-0.025em"
        fill="currentColor"
      >
        auris
      </text>

      <defs>
        <linearGradient
          id="auris-gradient"
          x1="0"
          y1="0"
          x2="60"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7F1D1D" />
          <stop offset="0.5" stopColor="#EA580C" />
          <stop offset="1" stopColor="#FACC15" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoIcon = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 60 28"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
    >
      <path
        d="
          M4 14
          C4 4, 20 4, 20 14
          C20 24, 36 24, 36 14
          C36 4, 52 4, 52 14
        "
        fill="none"
        stroke={uniColor ? "currentColor" : "url(#auris-gradient)"}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <defs>
        <linearGradient
          id="auris-gradient"
          x1="0"
          y1="0"
          x2="60"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7F1D1D" />
          <stop offset="0.5" stopColor="#EA580C" />
          <stop offset="1" stopColor="#FACC15" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 160 34"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-10 text-foreground", className)}
    >
      <path
        d="
          M6 17
          C18 2, 42 2, 54 17
          C66 32, 90 32, 102 17
          C114 2, 138 2, 150 17
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
};
