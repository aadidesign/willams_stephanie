"use client";

import { useEffect, useState } from "react";
import { getOpenStatus } from "@/lib/hours";
import { siteContent, type Hour } from "@/content/site";
import { cn } from "@/lib/utils";

export function OpenStatus({ className, tone = "dark", hours = siteContent.hours }: { className?: string; tone?: "dark" | "light"; hours?: Hour[] }) {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const s = getOpenStatus(hours);
      setStatus({ open: s.open, label: s.label });
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (!status) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.18em]",
        tone === "light" ? "text-cream/80" : "text-ink-mute",
        className
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        {status.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            status.open ? "bg-green-500" : "bg-terracotta"
          )}
        />
      </span>
      {status.label}
    </span>
  );
}
