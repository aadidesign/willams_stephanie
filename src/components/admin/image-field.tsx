"use client";

import { ImageIcon } from "lucide-react";

/**
 * Admin image control: live thumbnail preview + URL input.
 * Uses a plain <img> so admins can preview any host without Next image-domain
 * config. Swap in a file-upload to Cloudinary/S3 later without changing callers.
 */
export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-input p-3">
      <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… image URL"
          className="mt-1.5 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
