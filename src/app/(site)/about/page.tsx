import Image from "next/image";
import type { Metadata } from "next";
import { Wheat, Leaf, Wine, Heart } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading, Ornament } from "@/components/site/ornament";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaButton } from "@/components/site/cta-button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Three generations of authentic Italian cooking. Discover the story of Bella Vita Ristorante, serving locally crafted food & wine since 1978.",
};

const ICONS = { wheat: Wheat, leaf: Leaf, wine: Wine, heart: Heart };

export default async function AboutPage() {
  const c = await getSiteContent();

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="A family table since 1978"
        description="Three generations. One kitchen. A love letter to Italy, written daily."
        image={c.about.image}
        crumb="About Us"
      />

      {/* Story */}
      <section className="bg-canvas py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="right">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={c.about.imageSecondary} alt="The Bella Vita kitchen" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading align="left" eyebrow={c.about.eyebrow} title={c.about.heading} />
            <p className="font-serif-lux mt-6 text-xl leading-relaxed text-ink">{c.about.lead}</p>
            {c.about.body.map((p, i) => (
              <p key={i} className="mt-4 font-body text-[15px] leading-relaxed text-ink-mute">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-ink/8 bg-ink py-16 text-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4">
          {c.about.stats.map((s) => (
            <Reveal key={s.label} className="text-center">
              <p className="font-display text-5xl gold-gradient-text sm:text-6xl">{s.value}</p>
              <p className="mt-3 font-body text-xs uppercase tracking-[0.22em] text-cream/60">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy / values */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="Our Philosophy" title="What we believe in" description="The principles that have guided every plate we've served for nearly half a century." />
          <Ornament className="mt-7" />
          <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map((v) => {
              const Icon = ICONS[v.icon as keyof typeof ICONS] ?? Heart;
              return (
                <StaggerItem key={v.title} className="text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-terracotta">
                    <Icon className="h-7 w-7" strokeWidth={1.4} />
                  </span>
                  <h3 className="mt-6 font-display text-xl text-ink">{v.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink-mute">{v.description}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Chef quote */}
      <section className="relative overflow-hidden bg-ink py-28 text-center text-cream">
        <div className="absolute inset-0 opacity-15">
          <Image src={c.about.image} alt="" fill className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal>
            <Wine className="mx-auto h-10 w-10 text-gold/50" strokeWidth={1.2} />
            <blockquote className="mt-8 font-serif-lux text-3xl italic leading-relaxed sm:text-4xl">
              “{c.about.chef.quote}”
            </blockquote>
            <p className="mt-8 font-display text-lg tracking-wide text-gold-light">{c.about.chef.name}</p>
            <p className="mt-1 font-body text-xs uppercase tracking-[0.24em] text-cream/55">{c.about.chef.title}</p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-canvas py-20 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Come taste the tradition</h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CtaButton href="/booking" variant="solid">Reserve a Table</CtaButton>
            <CtaButton href="/menu" variant="outline">Explore the Menu</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
