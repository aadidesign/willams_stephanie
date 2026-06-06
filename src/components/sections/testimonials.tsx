"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { siteContent, type Testimonial } from "@/content/site";
import { SectionHeading } from "@/components/site/ornament";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export function Testimonials({ items = siteContent.testimonials }: { items?: Testimonial[] }) {
  const testimonials = items;
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="paper-texture absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Happy Customers"
          title={<>Loved by our guests</>}
          description="Don't just take our word for it. Here's what la famiglia says."
        />

        <div className="relative mt-14 min-h-[260px]">
          <Quote className="mx-auto h-12 w-12 text-gold/30" />
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-center"
            >
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="font-serif-lux text-2xl italic leading-relaxed text-ink sm:text-3xl">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8 flex flex-col items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta font-display text-lg text-cream">
                  {initials(t.name)}
                </span>
                <div>
                  <p className="font-display text-base text-ink">{t.name}</p>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-gold-dark">
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-terracotta hover:bg-terracotta hover:text-cream"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-terracotta" : "w-2 bg-ink/20"
                }`}
              />
            ))}
          </div>
          <button
            aria-label="Next testimonial"
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-terracotta hover:bg-terracotta hover:text-cream"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
