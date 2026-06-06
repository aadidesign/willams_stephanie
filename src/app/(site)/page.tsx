import Image from "next/image";
import Link from "next/link";
import { Wheat, Leaf, Wine, Heart, Phone, UtensilsCrossed, PartyPopper, ChefHat } from "lucide-react";
import { siteContent } from "@/content/site";
import { getSiteContent } from "@/lib/content";
import { formatTime } from "@/lib/hours";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/site/marquee";
import { Testimonials } from "@/components/sections/testimonials";
import { OpenStatus } from "@/components/site/open-status";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading, Ornament } from "@/components/site/ornament";
import { CtaButton } from "@/components/site/cta-button";
import { DishCard } from "@/components/menu/dish-card";

const ICONS = { wheat: Wheat, leaf: Leaf, wine: Wine, heart: Heart };

export default async function HomePage() {
  const c = await getSiteContent();
  const featured = c.menu.flatMap((cat) => cat.items).filter((i) => i.featured).slice(0, 6);

  return (
    <>
      <Hero hero={c.hero} brand={c.brand} />
      <Marquee text={c.announcement} />

      {/* ───────────────── About / Since 1978 ───────────────── */}
      <section className="relative overflow-hidden bg-canvas py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="right">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={c.about.image} alt="Bella Vita dining experience" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-4 hidden aspect-square w-44 overflow-hidden border-8 border-canvas sm:block lg:-right-10 lg:w-56">
                <Image src={c.about.imageSecondary} alt="Freshly prepared Italian dish" fill sizes="220px" className="object-cover" />
              </div>
              <div className="absolute -left-4 top-8 flex h-28 w-28 flex-col items-center justify-center bg-terracotta text-center text-cream lg:-left-8 lg:h-32 lg:w-32">
                <span className="font-display text-3xl lg:text-4xl">{new Date().getFullYear() - c.brand.established}</span>
                <span className="font-body text-[9px] uppercase tracking-[0.2em]">Years of<br />tradition</span>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading align="left" eyebrow={c.about.eyebrow} title={c.about.heading} />
            <p className="font-serif-lux mt-6 text-xl leading-relaxed text-ink">{c.about.lead}</p>
            {c.about.body.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-mute">{p}</p>
              </Reveal>
            ))}
            <div className="mt-8 flex items-center gap-6 border-t border-ink/10 pt-7">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                <ChefHat className="h-6 w-6" />
              </span>
              <div>
                <p className="font-serif-lux text-lg italic text-ink">“{c.about.chef.quote}”</p>
                <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-gold-dark">
                  {c.about.chef.name} · {c.about.chef.title}
                </p>
              </div>
            </div>
            <div className="mt-9">
              <CtaButton href="/about" variant="outline">More About Us</CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Values strip ───────────────── */}
      <section className="border-y border-ink/8 bg-cream py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <Stagger className="grid gap-px overflow-hidden border border-ink/8 bg-ink/8 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map((v) => {
              const Icon = ICONS[v.icon as keyof typeof ICONS] ?? Heart;
              return (
                <StaggerItem key={v.title} className="group bg-cream p-8 transition-colors duration-500 hover:bg-canvas">
                  <Icon className="h-8 w-8 text-terracotta transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.4} />
                  <h3 className="mt-5 font-display text-xl text-ink">{v.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink-mute">{v.description}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ───────────────── Hours band ───────────────── */}
      <section className="relative overflow-hidden bg-ink py-24 text-cream sm:py-28">
        <div className="absolute inset-0 opacity-[0.07]">
          <Image src={siteContent.happyHour.image} alt="" fill className="object-cover" />
        </div>
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow text-gold-light">Visiting Hours</span>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">When to find us</h2>
            <p className="mt-5 max-w-md font-serif-lux text-xl text-cream/70">{c.hoursNote}</p>
            <div className="mt-7"><OpenStatus tone="light" hours={c.hours} /></div>
            <div className="mt-9 flex flex-wrap gap-4">
              <CtaButton href="/booking">Reserve a Table</CtaButton>
              <a href={c.contact.phoneHref} className="inline-flex items-center gap-3 font-body text-sm text-cream/80 hover:text-gold-light">
                <Phone className="h-4 w-4 text-gold" /> {c.contact.phone}
              </a>
            </div>
          </Reveal>
          <Reveal direction="left">
            <div className="divide-y divide-cream/10 border border-cream/15 bg-cream/[0.03] backdrop-blur-sm">
              {c.hours.map((h) => (
                <div key={h.day} className="flex items-center justify-between px-6 py-4">
                  <span className="font-display text-lg tracking-wide">{h.day}</span>
                  <span className="font-body text-sm text-cream/65">
                    {h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── Signature dishes ───────────────── */}
      <section className="bg-canvas py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow={c.menuIntro.eyebrow} title={c.menuIntro.heading} description={c.menuIntro.description} />
          <Ornament className="mt-7" />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <StaggerItem key={item.name} className="h-full">
                <DishCard item={item} />
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-12 text-center">
            <CtaButton href="/menu" variant="solid">Discover the Entire Menu</CtaButton>
          </div>
        </div>
      </section>

      {/* ───────────────── Happy hour ───────────────── */}
      <section id="happy-hour" className="relative overflow-hidden bg-terracotta-dark py-20 text-cream sm:py-24">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image src={c.happyHour.image} alt="Happy hour wine and plates" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal direction="left">
            <span className="eyebrow text-gold-light">{c.happyHour.eyebrow}</span>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">{c.happyHour.heading}</h2>
            <p className="mt-5 font-serif-lux text-xl leading-relaxed text-cream/85">{c.happyHour.description}</p>
            <div className="mt-8">
              <CtaButton href="/menu" variant="gold">See the Offer</CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── Banquet + Catering teasers ───────────────── */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="Beyond the Table" title="Host your next celebration with us" description="Private banquets and off-site catering, crafted with the same hand-made devotion." />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {[
              { ...c.banquet, href: "/banquet", icon: PartyPopper, cta: "Explore Banquets", img: c.banquet.image, title: "Banquet Facility", blurb: c.banquet.lead },
              { ...c.catering, href: "/catering", icon: UtensilsCrossed, cta: "Explore Catering", img: c.catering.image, title: "Catering", blurb: c.catering.lead },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title}>
                  <Link href={card.href} className="group relative block aspect-[16/12] overflow-hidden">
                    <Image src={card.img} alt={card.title} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-cream sm:p-10">
                      <Icon className="h-9 w-9 text-gold-light" strokeWidth={1.3} />
                      <h3 className="mt-4 font-display text-3xl">{card.title}</h3>
                      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-cream/80 line-clamp-3">{card.blurb}</p>
                      <span className="mt-5 inline-flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">
                        {card.cta}
                        <svg className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── Gallery teaser ───────────────── */}
      <section className="bg-canvas py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <SectionHeading eyebrow="Gallery" title="A feast for the eyes" />
          <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6" amount={0.05}>
            {c.gallery.slice(0, 6).map((g, i) => (
              <StaggerItem key={i} className={i === 0 || i === 3 ? "col-span-2 row-span-2" : ""}>
                <div className={`group relative overflow-hidden ${i === 0 || i === 3 ? "aspect-square" : "aspect-square"}`}>
                  <Image src={g.src} alt={g.alt} fill sizes="(max-width:768px) 50vw, 16vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-12 text-center">
            <CtaButton href="/gallery" variant="outline">View Full Gallery</CtaButton>
          </div>
        </div>
      </section>

      <Testimonials items={c.testimonials} />

      {/* ───────────────── Reservation CTA ───────────────── */}
      <section className="relative overflow-hidden bg-ink py-28 text-center text-cream sm:py-36">
        <div className="absolute inset-0 opacity-20">
          <Image src={c.about.image} alt="" fill className="object-cover animation-pan" />
        </div>
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto max-w-3xl px-5">
          <Reveal>
            <span className="eyebrow text-gold-light">Reservations</span>
            <h2 className="mt-6 font-display text-4xl leading-tight sm:text-6xl">
              Your table at <span className="gold-gradient-text italic font-serif-lux">Bella Vita</span> awaits
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-serif-lux text-xl text-cream/75">
              Book online in seconds, or call us directly. We can&apos;t wait to welcome you.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <CtaButton href="/booking" variant="solid">Book a Table</CtaButton>
              <a href={c.contact.phoneHref} className="inline-flex items-center gap-3 border border-cream/40 px-9 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition-colors hover:bg-cream hover:text-ink">
                <Phone className="h-4 w-4" /> {c.contact.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
