"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { siteContent, type SiteContent } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({
  hero = siteContent.hero,
  brand = siteContent.brand,
}: {
  hero?: SiteContent["hero"];
  brand?: SiteContent["brand"];
}) {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-ink">
      {/* Background video with image poster fallback (Ken Burns) */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.poster}
        >
          <source src={hero.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/45 to-ink/85" />
        {/* center scrim keeps the headline readable over any footage */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_center,rgba(28,26,23,0.55),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-cream">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="font-body text-[10px] uppercase tracking-[0.42em] text-gold-light sm:text-xs"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="mt-6 font-display text-[18vw] leading-[0.82] tracking-[0.04em] text-shadow-hero sm:text-[14vw] md:text-[150px]">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            >
              {hero.titleTop}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="gold-gradient-text block italic font-serif-lux"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
            >
              {hero.titleBottom}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: EASE }}
          className="mx-auto mt-7 max-w-xl font-serif-lux text-lg leading-relaxed text-cream/85 sm:text-xl"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={hero.primaryCta.href}
            className="group inline-flex w-full items-center justify-center gap-2.5 bg-terracotta px-10 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition-all duration-500 hover:bg-terracotta-dark hover:-translate-y-0.5 sm:w-auto"
          >
            {hero.primaryCta.label}
            <svg className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="inline-flex w-full items-center justify-center gap-2.5 border border-cream/50 px-10 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition-all duration-500 hover:bg-cream hover:text-ink sm:w-auto"
          >
            {hero.secondaryCta.label}
          </Link>
        </motion.div>
      </div>

      {/* Corner info */}
      <div className="absolute bottom-8 left-8 hidden font-body text-[10px] uppercase tracking-[0.25em] text-cream/55 md:block">
        Locally crafted
        <br />
        food &amp; wine · {brand.established}
      </div>

      {/* Rotating badge */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:block">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="animate-spin-slow absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            <defs>
              <path id="heroBadgePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text fill="rgba(247,242,233,0.85)" fontSize="8.5" fontFamily="var(--font-inter)" letterSpacing="2.4">
              <textPath href="#heroBadgePath">
                • {hero.badge.toUpperCase()} •
              </textPath>
            </text>
          </svg>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.2H22l-6 4.4 2.3 7.2L12 16.8 5.7 20.8 8 13.6 2 9.2h7.6z" /></svg>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-cream/40 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-cream/70"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
