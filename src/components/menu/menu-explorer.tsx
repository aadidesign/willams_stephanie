"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MenuCategory } from "@/content/site";
import { DishCard, DishRow } from "./dish-card";
import { cn } from "@/lib/utils";

export function MenuExplorer({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <div>
      {/* Category tabs */}
      <div className="sticky top-[68px] z-30 -mx-5 mb-12 bg-canvas/90 px-5 py-4 backdrop-blur-md sm:top-[76px]">
        <div className="scrollbar-none mx-auto flex max-w-[1400px] items-center justify-start gap-2 overflow-x-auto sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={cn(
                "shrink-0 whitespace-nowrap px-5 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300",
                active === cat.id
                  ? "bg-terracotta text-cream"
                  : "text-ink-mute hover:text-terracotta"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[1400px]"
        >
          <div className="mb-10 text-center">
            <p className="font-body text-[11px] uppercase tracking-[0.3em] text-gold-dark">{current.italian}</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{current.name}</h2>
            <p className="mx-auto mt-3 max-w-xl font-serif-lux text-lg text-ink-mute">{current.description}</p>
          </div>

          {/* Featured cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {current.items.filter((i) => i.featured).map((item) => (
              <DishCard key={item.name} item={item} />
            ))}
          </div>

          {/* Remaining as rows */}
          {current.items.some((i) => !i.featured) && (
            <div className="mx-auto mt-12 max-w-3xl divide-y divide-ink/10 border-t border-ink/10">
              {current.items.filter((i) => !i.featured).map((item) => (
                <DishRow key={item.name} item={item} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
