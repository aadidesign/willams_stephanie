import Image from "next/image";
import { siteContent, type MenuItem } from "@/content/site";
import { cn } from "@/lib/utils";

const { currency } = siteContent.brand;

export function DishCard({ item, className }: { item: MenuItem; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border border-ink/8 bg-canvas transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(28,26,23,0.35)]",
        className
      )}
    >
      {item.image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
          {item.tags?.includes("Signature") && (
            <span className="absolute left-4 top-4 bg-gold px-3 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-ink">
              Signature
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-lg leading-tight text-ink">{item.name}</h3>
          <span className="font-display text-lg text-terracotta">
            {currency}
            {item.price}
          </span>
        </div>
        <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-ink-mute">
          {item.description}
        </p>
        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags
              .filter((t) => t !== "Signature")
              .map((t) => (
                <span
                  key={t}
                  className="border border-ink/15 px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.16em] text-ink-mute"
                >
                  {t}
                </span>
              ))}
          </div>
        )}
      </div>
    </article>
  );
}

/** Compact menu list row (no image), used on the full Menu page. */
export function DishRow({ item }: { item: MenuItem }) {
  return (
    <div className="group flex items-baseline gap-4 py-5">
      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <h3 className="font-display text-lg text-ink">{item.name}</h3>
          {item.tags?.includes("Signature") && (
            <span className="text-gold" title="Signature dish">✦</span>
          )}
        </div>
        <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-mute">
          {item.description}
        </p>
        {item.tags && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags
              .filter((t) => t !== "Signature")
              .map((t) => (
                <span
                  key={t}
                  className="font-body text-[9px] uppercase tracking-[0.18em] text-gold-dark"
                >
                  {t}
                </span>
              ))}
          </div>
        )}
      </div>
      <span
        className="mx-3 hidden flex-1 translate-y-[-3px] border-b border-dotted border-ink/25 sm:block"
        aria-hidden
      />
      <span className="font-display text-lg text-terracotta">
        {siteContent.brand.currency}
        {item.price}
      </span>
    </div>
  );
}
