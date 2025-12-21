import { Logo } from "@/components/logo";
import Link from "next/link";
import { PrivacyPolicyDialog, TermsDialog } from "./legal-dialogs";

const links = [
  { title: "Features", href: "#" },
  { title: "Solution", href: "#" },
  { title: "Pricing", href: "#" },
];
export default function Footer() {
  return (
    <footer className="py-16 md:py-24 border-t border-slate-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center">
          <Link href="/" aria-label="go home" className="block size-fit">
            <Logo />
          </Link>

          <nav className="my-8 ml-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="h-px w-full bg-slate-200 dark:bg-zinc-800 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 order-2 md:order-1">
            <SocialLink href="#" label="X (Twitter)">
              <path
                fill="currentColor"
                d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
              />
            </SocialLink>

            <SocialLink href="#" label="LinkedIn">
              <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
              />
            </SocialLink>

            <SocialLink
              href="https://github.com/priyansh-narang2308/auris"
              label="GitHub"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.63-.33 2.47-.33c.84 0 1.68.11 2.47.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </SocialLink>

            <SocialLink href="#" label="Instagram">
              <path
                fill="currentColor"
                d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
              />
            </SocialLink>
          </div>

          <p className="text-muted-foreground text-sm order-3 md:order-2">
            © {new Date().getFullYear()} auris, All rights reserved
          </p>
          <div className="flex gap-6 order-1 md:order-3">
            <PrivacyPolicyDialog
              trigger={
                <button className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </button>
              }
            />

            <TermsDialog
              trigger={
                <button className="text-sm cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </button>
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </Link>
  );
}
