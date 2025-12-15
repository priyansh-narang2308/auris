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
      viewBox="0 0 82 18"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground h-5 w-auto", className)}
    >
      <path
        d="M3 0H4.8V18H3V0ZM13.2 0H15V18H13.2V0ZM18 3.2V4.8H0V3.2H18ZM0 15.2V13.6H18V15.2H0Z"
        fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
      />

      <text
        x="24"
        y="14"
        fill="currentColor"
        fontSize="16.5"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="500"
        letterSpacing="-0.02em"
      >
        auris
      </text>

      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="18"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A5A3FF" />
          <stop offset="1" stopColor="#2EC4B6" />
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
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5", className)}
    >
      <path
        d="M3 0H4.8V18H3V0ZM13.2 0H15V18H13.2V0ZM18 3.2V4.8H0V3.2H18ZM0 15.2V13.6H18V15.2H0Z"
        fill={uniColor ? "currentColor" : "url(#logo-gradient)"}
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="18"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A5A3FF" />
          <stop offset="1" stopColor="#2EC4B6" />
        </linearGradient>
      </defs>
    </svg>
  );
};


export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 71 25"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-7 w-7 text-foreground", className)}
    >
      <path
        d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
    </svg>
  );
};

