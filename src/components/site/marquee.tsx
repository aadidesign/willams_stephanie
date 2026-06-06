export function Marquee({ text }: { text: string }) {
  const items = text.split("·").map((s) => s.trim());
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-terracotta py-3.5">
      <div className="flex">
        <div className="animate-marquee flex shrink-0 items-center gap-6 whitespace-nowrap pr-6">
          {Array.from({ length: 3 }).map((_, r) => (
            <span key={r} className="flex items-center gap-6">
              {items.map((t, i) => (
                <span key={`${r}-${i}`} className="flex items-center gap-6">
                  <span className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-cream/90">
                    {t}
                  </span>
                  <span className="text-gold-light">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
