import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, Wine } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { MenuBook } from "@/components/menu/menu-book";
import { CtaButton } from "@/components/site/cta-button";
import { Reveal } from "@/components/motion/reveal";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Bella Vita's seasonal menu: hand-rolled pasta, wood-fired pizza, antipasti, secondi and house-made dolci, paired with 200+ wines.",
};

export default async function MenuPage() {
  const c = await getSiteContent();

  return (
    <>
      <PageHeader
        eyebrow={c.menuIntro.eyebrow}
        title="Our Menu"
        description={c.menuIntro.description}
        image={siteContent.menu[1].items[0].image ?? c.about.image}
        crumb="Menu"
      />

      {/* Interactive menu book on a dark table-top */}
      <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
        <div className="absolute inset-0 opacity-[0.06]">
          <Image src={c.about.image} alt="" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5))]" />
        <div className="relative px-5 sm:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow text-gold-light">À la Carte</span>
            <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">Turn the pages of our kitchen</h2>
            <p className="mt-3 font-serif-lux text-lg text-cream/60">Hover a dish to see it plated. Turn the page to explore each course.</p>
          </div>
          <MenuBook categories={c.menu} />
        </div>
      </section>

      {/* Happy hour banner */}
      <section id="happy-hour" className="bg-terracotta-dark py-16 text-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-8 px-5 text-center sm:px-8 lg:flex-row lg:text-left">
          <div className="flex items-center gap-6">
            <Wine className="hidden h-14 w-14 shrink-0 text-gold-light sm:block" strokeWidth={1.2} />
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.3em] text-gold-light">{c.happyHour.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">{c.happyHour.heading}</h2>
              <p className="mt-2 max-w-xl font-serif-lux text-lg text-cream/85">{c.happyHour.description}</p>
            </div>
          </div>
          <CtaButton href="/booking" variant="gold">Reserve for Happy Hour</CtaButton>
        </div>
      </section>

      {/* Download / CTA */}
      <section className="bg-cream py-20 text-center">
        <Reveal>
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Take the menu with you</h2>
            <p className="mt-4 font-serif-lux text-lg text-ink-mute">
              Download our printable menus &amp; wine list, or reserve a table to taste it all.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/menu-kit" className="inline-flex items-center gap-2.5 border border-ink/30 px-9 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-cream">
                <Download className="h-4 w-4" /> Menu Kit
              </Link>
              <CtaButton href="/booking" variant="solid">Reserve a Table</CtaButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
