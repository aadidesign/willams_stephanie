import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/site/social-icons";
import { getSiteContent } from "@/lib/content";
import { formatTime } from "@/lib/hours";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/ornament";
import { Reveal } from "@/components/motion/reveal";
import { OpenStatus } from "@/components/site/open-status";
import { LeadForm } from "@/components/forms/lead-form";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CtaButton } from "@/components/site/cta-button";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact & Visiting Hours",
  description:
    "Find Bella Vita Ristorante: address, phone, email, visiting hours and directions. Get in touch or reserve your table today.",
};

export default async function ContactPage() {
  const c = await getSiteContent();

  const infoCards = [
    { icon: Phone, label: "Call Us", value: c.contact.phone, href: c.contact.phoneHref, sub: "Reservations & enquiries" },
    { icon: Mail, label: "Email Us", value: c.contact.email, href: `mailto:${c.contact.email}`, sub: "We reply within 24 hours" },
    { icon: MapPin, label: "Visit Us", value: c.contact.addressLine, href: c.contact.mapLink, sub: "Valet parking available" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact & Visiting Hours"
        description="We'd love to welcome you. Reach out, drop by, or reserve your table."
        image={siteContent.gallery[1].src}
        crumb="Contact"
      />

      {/* Info cards */}
      <section className="bg-canvas py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-6 px-5 sm:px-8 md:grid-cols-3">
          {infoCards.map((card) => (
            <Reveal key={card.label}>
              <a
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex h-full flex-col items-start border border-ink/10 bg-cream p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(28,26,23,0.35)]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10 text-terracotta transition-colors duration-500 group-hover:bg-terracotta group-hover:text-cream">
                  <card.icon className="h-6 w-6" />
                </span>
                <p className="mt-6 font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-dark">{card.label}</p>
                <p className="mt-2 font-display text-lg leading-snug text-ink">{card.value}</p>
                <p className="mt-2 font-body text-sm text-ink-mute">{card.sub}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + hours */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading align="left" eyebrow="Send a Message" title="How can we help?" />
            <p className="mt-4 font-body text-sm text-ink-mute">
              Questions about the menu, a private event, catering or a reservation? Send us a note.
            </p>
            <div className="mt-9">
              <LeadForm
                subjectOptions={["General Enquiry", "Reservation", "Private Event / Banquet", "Catering Quote", "Feedback"]}
                defaultSubject="General Enquiry"
              />
            </div>
          </div>

          <div>
            <SectionHeading align="left" eyebrow="Visiting Hours" title="When we're open" />
            <div className="mt-6"><OpenStatus hours={c.hours} /></div>
            <div className="mt-6 divide-y divide-ink/10 border border-ink/10 bg-canvas">
              {c.hours.map((h) => (
                <div key={h.day} className="flex items-center justify-between px-6 py-4">
                  <span className="flex items-center gap-3 font-display text-lg text-ink">
                    <Clock className="h-4 w-4 text-gold-dark" /> {h.day}
                  </span>
                  <span className="font-body text-sm text-ink-mute">
                    {h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-body text-sm text-ink-mute">{c.hoursNote}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaButton href="/booking" variant="solid">Reserve a Table</CtaButton>
              <div className="flex gap-3">
                {[
                  { href: c.contact.social.instagram, Icon: InstagramIcon },
                  { href: c.contact.social.facebook, Icon: FacebookIcon },
                ].map(({ href, Icon }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center border border-ink/20 text-ink-mute transition-colors hover:border-terracotta hover:bg-terracotta hover:text-cream">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-canvas">
        <div className="relative h-[420px] w-full overflow-hidden">
          <iframe
            title="Bella Vita location map"
            src={c.contact.mapEmbed}
            className="h-full w-full grayscale-[0.3]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-12">
            <FaqAccordion items={c.faq} />
          </div>
        </div>
      </section>
    </>
  );
}
