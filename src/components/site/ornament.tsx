import { cn } from "@/lib/utils";

/** Decorative Italian-style divider: a fork/leaf flourish between rules. */
export function Ornament({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "cream" | "ink";
}) {
  const color =
    tone === "gold"
      ? "text-gold"
      : tone === "cream"
        ? "text-cream/70"
        : "text-ink/40";
  return (
    <div className={cn("flex items-center justify-center gap-4", color, className)}>
      <span className="h-px w-12 bg-current opacity-50 sm:w-20" />
      <svg
        className="h-5 w-5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2c-1.5 3-1.5 6 0 9 1.5-3 1.5-6 0-9Z" />
        <path d="M12 11v11" />
        <path d="M7 5c-1 2.5-.5 5 1.5 6.5M17 5c1 2.5.5 5-1.5 6.5" />
      </svg>
      <span className="h-px w-12 bg-current opacity-50 sm:w-20" />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", align === "left" && "eyebrow--left")}>
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display mt-5 text-3xl leading-[1.12] sm:text-4xl md:text-5xl",
          tone === "light" ? "text-cream" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "font-serif-lux mx-auto mt-5 text-lg leading-relaxed sm:text-xl",
            align === "left" && "mx-0",
            tone === "light" ? "text-cream/75" : "text-ink-mute"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
