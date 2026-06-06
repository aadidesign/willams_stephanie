import Image from "next/image";
import type { Metadata } from "next";
import { Check, Star } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading, Ornament } from "@/components/site/ornament";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaButton } from "@/components/site/cta-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Off-site Italian catering for weddings, corporate events and private dining, hand-made by Bella Vita's chefs, delivered to your venue.",
};

export default async function CateringPage() {
  const c = await getSiteContent();
  const cat = c.catering;

  return (
    <>
      <PageHeader eyebrow={cat.eyebrow} title={cat.heading} description={cat.lead} image={cat.image} crumb="Catering" />

      {/* Services */}
      <section className="bg-canvas py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="What We Cater" title="From boardroom to ballroom" description="Whatever the occasion, we bring the trattoria to you." />
          <Ornament className="mt-7" />
          <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
            {cat.services.map((s) => (
              <StaggerItem key={s.title} className="group overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={s.image} alt={s.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-[1.3s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <h3 className="absolute bottom-5 left-6 font-display text-2xl text-cream">{s.title}</h3>
                </div>
                <p className="mt-5 font-body text-sm leading-relaxed text-ink-mute">{s.description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="Catering Packages" title="Transparent, per-guest pricing" description="Every package is fully customizable. Prices are a starting point, tell us your vision for an exact quote." />
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {cat.packages.map((p) => (
              <Reveal key={p.name}>
                <div className={cn(
                  "relative flex h-full flex-col border p-8",
                  p.highlighted ? "border-gold bg-ink text-cream shadow-2xl lg:-mt-4 lg:mb-4" : "border-ink/10 bg-canvas"
                )}>
                  {p.highlighted && (
                    <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 bg-gold px-4 py-1.5 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-ink">
                      <Star className="h-3 w-3 fill-ink" /> Most Popular
                    </span>
                  )}
                  <h3 className={cn("font-display text-2xl", p.highlighted ? "text-cream" : "text-ink")}>{p.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={cn("font-display text-5xl", p.highlighted ? "gold-gradient-text" : "text-terracotta")}>
                      {c.brand.currency}{p.price}
                    </span>
                    <span className={cn("font-body text-sm", p.highlighted ? "text-cream/60" : "text-ink-mute")}>{p.unit}</span>
                  </div>
                  <ul className="mt-7 flex-1 space-y-3.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.highlighted ? "text-gold" : "text-terracotta")} />
                        <span className={cn("font-body text-sm", p.highlighted ? "text-cream/85" : "text-ink-mute")}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <CtaButton href="/contact" variant={p.highlighted ? "gold" : "outline"} className="w-full">Request Quote</CtaButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading tone="light" eyebrow="How It Works" title="Four simple steps to a flawless event" />
          <Stagger className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {cat.process.map((step, i) => (
              <StaggerItem key={step.step} className="relative">
                <span className="font-display text-6xl text-cream/10">{step.step}</span>
                <h3 className="mt-3 font-display text-2xl text-gold-light">{step.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-cream/65">{step.description}</p>
                {i < cat.process.length - 1 && (
                  <span className="absolute right-0 top-8 hidden h-px w-1/2 bg-cream/15 lg:block" />
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-canvas py-20 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Let&apos;s cater your next event</h2>
          <p className="mt-4 font-serif-lux text-lg text-ink-mute">Send us the details and we&apos;ll craft a bespoke menu &amp; quote, no obligation.</p>
          <div className="mt-8 flex justify-center">
            <CtaButton href="/contact" variant="solid">Request a Catering Quote</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
