import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ComponentProps, type ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost" | "gold";
type Tone = "dark" | "light";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 disabled:pointer-events-none";

export function CtaButton({
  children,
  href,
  variant = "solid",
  tone = "dark",
  className,
  ...props
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  tone?: Tone;
  className?: string;
} & ComponentProps<"button">) {
  const styles: Record<Variant, string> = {
    solid:
      "bg-terracotta text-cream px-9 py-4 hover:bg-terracotta-dark shadow-[0_10px_30px_-12px_rgba(156,59,34,0.7)] hover:shadow-[0_16px_40px_-12px_rgba(156,59,34,0.85)] hover:-translate-y-0.5",
    gold:
      "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-ink px-9 py-4 hover:brightness-105 shadow-[0_10px_30px_-12px_rgba(201,162,75,0.7)] hover:-translate-y-0.5",
    outline:
      tone === "light"
        ? "border border-cream/60 text-cream px-9 py-4 hover:bg-cream hover:text-ink"
        : "border border-ink/30 text-ink px-9 py-4 hover:bg-ink hover:text-cream",
    ghost:
      tone === "light"
        ? "text-cream px-2 py-1 hover:text-gold-light"
        : "text-ink px-2 py-1 hover:text-terracotta",
  };

  const content = (
    <>
      <span>{children}</span>
      <svg
        className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(base, styles[variant], className)}>
        {content}
      </Link>
    );
  }
  return (
    <button className={cn(base, styles[variant], className)} {...props}>
      {content}
    </button>
  );
}
