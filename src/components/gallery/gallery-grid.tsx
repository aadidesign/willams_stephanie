"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { src: string; alt: string; category: string };

export function GalleryGrid({ items }: { items: Item[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  const close = useCallback(() => setLightbox(null), []);
  const move = useCallback(
    (dir: number) =>
      setLightbox((i) => (i === null ? i : (i + dir + filtered.length) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, move]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-5 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300",
              filter === cat ? "bg-terracotta text-cream" : "text-ink-mute hover:text-terracotta"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-ish grid */}
      <motion.div layout className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4">
        <AnimatePresence>
          {filtered.map((item, idx) => (
            <motion.button
              key={item.src}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightbox(idx)}
              className="group relative block w-full overflow-hidden break-inside-avoid"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={idx % 3 === 0 ? 800 : 600}
                className="w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-cream">{item.category}</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-cream/70 hover:text-cream">
              <X className="h-8 w-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Previous" className="absolute left-4 text-cream/70 hover:text-cream sm:left-8">
              <ChevronLeft className="h-10 w-10" />
            </button>
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                width={1280}
                height={960}
                className="mx-auto max-h-[85vh] w-auto object-contain"
              />
              <p className="mt-4 text-center font-body text-sm text-cream/70">{filtered[lightbox].alt}</p>
            </motion.div>
            <button onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Next" className="absolute right-4 text-cream/70 hover:text-cream sm:right-8">
              <ChevronRight className="h-10 w-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
