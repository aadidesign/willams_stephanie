import Image from "next/image";
import type { Metadata } from "next";
import { Users, UtensilsCrossed, DoorOpen, Check } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading, Ornament } from "@/components/site/ornament";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaButton } from "@/components/site/cta-button";

export const metadata: Metadata = {
  title: "Banquet Facility",
  description:
    "Host weddings, galas and private celebrations in Bella Vita's elegant banquet halls, seating up to 180 across three private rooms with bespoke menus.",
};

export default async function BanquetPage() {
  const c = await getSiteContent();
  const b = c.banquet;

  return (
    <>
      <PageHeader eyebrow={b.eyebrow} title={b.heading} description={b.lead} image={b.image} crumb="Banquet" />

      {/* Intro + capacity */}
      <section className="bg-canvas py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal direction="right">
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image src={b.image} alt="Bella Vita banquet hall" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
            <div>
              <SectionHeading align="left" eyebrow="Private Events" title="An unforgettable setting" />
              <p className="mt-6 font-serif-lux text-xl leading-relaxed text-ink">{b.lead}</p>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-mute">{b.body}</p>
              <div className="mt-9 grid grid-cols-3 gap-4 border-t border-ink/10 pt-8">
                {[
                  { icon: Users, value: b.capacity.seated, label: "Seated" },
                  { icon: UtensilsCrossed, value: b.capacity.standing, label: "Standing" },
                  { icon: DoorOpen, value: b.capacity.privateRooms, label: "Private rooms" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon className="mx-auto h-6 w-6 text-gold-dark" strokeWidth={1.4} />
                    <p className="mt-3 font-display text-3xl text-terracotta">{s.value}</p>
                    <p className="mt-1 font-body text-[10px] uppercase tracking-[0.2em] text-ink-mute">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="Our Spaces" title="Three rooms, endless possibilities" />
          <Ornament className="mt-7" />
          <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
            {b.spaces.map((space) => (
              <StaggerItem key={space.name} className="group overflow-hidden border border-ink/8 bg-canvas">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={space.image} alt={space.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-[1.3s] group-hover:scale-110" />
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl text-ink">{space.name}</h3>
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.18em] text-gold-dark">{space.capacity}</p>
                  <p className="mt-4 font-body text-sm leading-relaxed text-ink-mute">{space.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Inclusions */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream sm:py-28">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow text-gold-light">Everything Included</span>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">We handle every detail</h2>
            <p className="mt-5 font-serif-lux text-xl text-cream/70">
              From the first toast to the last dance, our events team takes care of it all, so you simply enjoy the moment.
            </p>
            <div className="mt-9"><CtaButton href="/contact" variant="gold">Enquire About Your Event</CtaButton></div>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {b.inclusions.map((inc) => (
              <StaggerItem key={inc} className="flex items-center gap-3 border border-cream/12 bg-cream/[0.03] px-5 py-4">
                <Check className="h-5 w-5 shrink-0 text-gold" />
                <span className="font-body text-sm text-cream/85">{inc}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-canvas py-20 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Let&apos;s plan something beautiful</h2>
          <p className="mt-4 font-serif-lux text-lg text-ink-mute">Tell us about your celebration and our coordinator will be in touch within 24 hours.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CtaButton href="/contact" variant="solid">Request a Proposal</CtaButton>
            <CtaButton href="/gallery" variant="outline">View the Gallery</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
