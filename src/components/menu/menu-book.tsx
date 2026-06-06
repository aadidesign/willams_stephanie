"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/content/site";
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const cur = siteContent.brand.currency;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const pageVariants = {
  enter: (d: number) => ({ rotateY: d > 0 ? 105 : -15, opacity: 0 }),
  center: { rotateY: 0, opacity: 1 },
  exit: (d: number) => ({ rotateY: d > 0 ? -15 : 105, opacity: 0 }),
};

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
};

function heroImage(cat: MenuCategory): string {
  return (cat.items.find((i) => i.featured)?.image || cat.items.find((i) => i.image)?.image) ?? "";
}

export function MenuBook({ categories }: { categories: MenuCategory[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [hovered, setHovered] = useState<MenuItem | null>(null);

  const cat = categories[index];
  const activeImage = hovered?.image || heroImage(cat);
  const activeName = hovered?.name || cat.name;

  function go(next: number) {
    setHovered(null);
    setDir(next);
    setIndex((i) => (i + next + categories.length) % categories.length);
  }
  function jump(i: number) {
    if (i === index) return;
    setHovered(null);
    setDir(i > index ? 1 : -1);
    setIndex(i);
  }

  return (
    <div>
      {/* Chapter tabs */}
      <div className="scrollbar-none mb-12 flex items-center justify-start gap-1 overflow-x-auto sm:justify-center">
        {categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => jump(i)}
            className={cn(
              "group flex shrink-0 flex-col items-center px-4 py-2 transition-colors duration-300 sm:px-6",
              i === index ? "text-gold-light" : "text-cream/45 hover:text-cream/80"
            )}
          >
            <span className="font-body text-[9px] tracking-[0.25em]">{ROMAN[i]}</span>
            <span className="mt-1 whitespace-nowrap font-display text-sm tracking-wide">{c.name}</span>
            <span className={cn("mt-1.5 h-px bg-gold transition-all duration-500", i === index ? "w-full" : "w-0 group-hover:w-1/2")} />
          </button>
        ))}
      </div>

      {/* ===== Desktop: real two-page book ===== */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-5xl [perspective:2800px]">
          <div className="relative">
            {/* soft shadow cast on the table */}
            <div className="absolute inset-x-10 -bottom-7 h-12 rounded-[50%] bg-black/55 blur-2xl" />

            {/* page-stack thickness on the outer edges */}
            <div className="book-edge absolute inset-y-5 -left-2.5 z-0 w-3 rounded-l-sm shadow-[inset_3px_0_6px_rgba(0,0,0,0.35)]" />
            <div className="book-edge absolute inset-y-5 -right-2.5 z-0 w-3 rounded-r-sm shadow-[inset_-3px_0_6px_rgba(0,0,0,0.35)]" />

            {/* leather cover */}
            <div className="book-leather relative rounded-[7px] p-3 shadow-[0_45px_100px_-35px_rgba(0,0,0,0.85)]">
              {/* gold foil inner frame */}
              <div className="pointer-events-none absolute inset-[10px] z-30 rounded-[3px] border border-gold/25" />

              <div className="relative grid grid-cols-2 overflow-hidden rounded-[3px]">
                {/* binding spine */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-14 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.05)_30%,rgba(0,0,0,0.32)_50%,rgba(0,0,0,0.05)_70%,transparent)]" />
                <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-px -translate-x-1/2 bg-black/30" />

                {/* LEFT PAGE — image */}
                <div className="relative aspect-[3/4] bg-ink shadow-[inset_-22px_0_36px_-22px_rgba(0,0,0,0.7)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="absolute inset-0"
                    >
                      {activeImage && <Image src={activeImage} alt={activeName} fill sizes="40vw" className="object-cover" />}
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeName}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-gold-light">
                          {hovered ? "Now showing" : cat.italian}
                        </p>
                        <p className="mt-2 font-display text-3xl text-cream">{activeName}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* RIGHT PAGE — list, with 3D page-turn */}
                <div className="page-paper relative aspect-[3/4] overflow-hidden shadow-[inset_22px_0_36px_-22px_rgba(0,0,0,0.45)]">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={cat.id}
                      custom={dir}
                      variants={pageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.75, ease: EASE }}
                      style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
                      className="flex h-full flex-col px-10 py-9"
                    >
                      <div className="text-center">
                        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-gold-dark">{cat.italian}</p>
                        <h3 className="mt-2 font-display text-3xl text-ink">{cat.name}</h3>
                        <p className="mx-auto mt-2 max-w-xs font-serif-lux text-sm italic text-ink-mute">{cat.description}</p>
                      </div>
                      <div className="mt-7 flex-1 space-y-1 overflow-y-auto pr-1">
                        {cat.items.map((item) => (
                          <BookDish key={item.name} item={item} onHover={() => setHovered(item)} onLeave={() => setHovered(null)} active={hovered?.name === item.name} />
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 font-body text-[10px] uppercase tracking-[0.2em] text-ink-mute">
                        <span>Bella Vita · Est. 1978</span>
                        <span>{ROMAN[index]} / {categories.length}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* turning-page shadow sweep */}
                  <motion.div
                    key={`sweep-${cat.id}`}
                    initial={{ opacity: 0.55, x: "-100%" }}
                    animate={{ opacity: 0, x: "100%" }}
                    transition={{ duration: 0.75, ease: EASE }}
                    className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-black/20 via-transparent to-transparent"
                  />

                  {/* page-curl corner */}
                  <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-12 w-12 bg-[linear-gradient(135deg,transparent_50%,rgba(0,0,0,0.10)_50%,rgba(0,0,0,0.04)_62%,transparent_62%)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Book navigation */}
          <div className="mt-10 flex items-center justify-center gap-8">
            <BookArrow dir="prev" onClick={() => go(-1)} />
            <span className="font-body text-xs uppercase tracking-[0.25em] text-cream/50">Turn the page</span>
            <BookArrow dir="next" onClick={() => go(1)} />
          </div>
        </div>
      </div>

      {/* ===== Mobile: book-style card ===== */}
      <div className="lg:hidden">
        {/* leather cover */}
        <div className="book-leather rounded-lg p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={cat.id}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE }}
              className="overflow-hidden rounded-[3px]"
            >
              <div className="relative h-60">
                {activeImage && <Image src={activeImage} alt={activeName} fill sizes="100vw" className="object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-ink/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-gold-light">{cat.italian}</p>
                  <p className="mt-1 font-display text-3xl text-cream">{cat.name}</p>
                </div>
              </div>
              <div className="page-paper px-6 py-7">
                {cat.items.map((item) => (
                  <BookDish key={item.name} item={item} mobile />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <BookArrow dir="prev" onClick={() => go(-1)} />
          <span className="font-body text-xs uppercase tracking-[0.2em] text-cream/50">{ROMAN[index]} / {categories.length}</span>
          <BookArrow dir="next" onClick={() => go(1)} />
        </div>
      </div>
    </div>
  );
}

function BookDish({
  item, onHover, onLeave, active, mobile,
}: {
  item: MenuItem;
  onHover?: () => void;
  onLeave?: () => void;
  active?: boolean;
  mobile?: boolean;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "group cursor-default rounded-sm px-3 py-2.5 transition-colors duration-300",
        active && "bg-gold/10",
        mobile && "border-b border-ink/8 last:border-0"
      )}
    >
      <div className="flex items-baseline gap-3">
        <h4 className="flex items-center gap-1.5 font-display text-[17px] leading-tight text-ink">
          {item.name}
          {item.tags?.includes("Signature") && <span className="text-gold" title="Signature">✦</span>}
        </h4>
        <span className="mx-1 hidden flex-1 translate-y-[-3px] border-b border-dotted border-ink/25 sm:block" aria-hidden />
        <span className="font-display text-[17px] text-terracotta">{cur}{item.price}</span>
      </div>
      <p className="mt-1 font-body text-[13px] leading-relaxed text-ink-mute">{item.description}</p>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-2">
          {item.tags.filter((t) => t !== "Signature").map((t) => (
            <span key={t} className="font-body text-[9px] uppercase tracking-[0.16em] text-gold-dark">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function BookArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous category" : "Next category"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/25 text-cream/80 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
