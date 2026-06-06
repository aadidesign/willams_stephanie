import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteContent } from "@/content/site";
import { formatTime } from "@/lib/hours";
import { Ornament } from "./ornament";
import { NewsletterForm } from "./newsletter-form";
import { InstagramIcon, FacebookIcon } from "./social-icons";
import type { SiteContent } from "@/content/site";

export function Footer({
  brand = siteContent.brand,
  contact = siteContent.contact,
  hours = siteContent.hours,
  nav = siteContent.nav,
}: {
  brand?: SiteContent["brand"];
  contact?: SiteContent["contact"];
  hours?: SiteContent["hours"];
  nav?: SiteContent["nav"];
}) {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream/80">
      {/* Marquee strip */}
      <div className="border-y border-cream/10 py-5">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pr-8">
            {Array.from({ length: 2 }).map((_, r) => (
              <span key={r} className="flex items-center gap-8">
                {[
                  "Fresh Pasta Daily",
                  "Wood-Fired Pizza",
                  "200+ Wine Labels",
                  "Private Banquets",
                  "Off-Site Catering",
                  "Since 1978",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-8">
                    <span className="font-display text-xl tracking-[0.15em] text-cream/40">
                      {t}
                    </span>
                    <span className="text-gold">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <span className="font-display text-3xl tracking-[0.18em] text-cream">
              {brand.name.toUpperCase()}
            </span>
            <p className="mt-2 font-body text-[10px] uppercase tracking-[0.4em] text-gold-light">
              Ristorante · Est. {brand.established}
            </p>
            <p className="font-serif-lux mt-6 max-w-sm text-lg leading-relaxed text-cream/60">
              {brand.motto}. A family table in the heart of the city, serving
              honest Italian food &amp; wine since {brand.established}.
            </p>
            <div className="mt-7 flex gap-3">
              {[
                { href: contact.social.instagram, Icon: InstagramIcon, label: "Instagram" },
                { href: contact.social.facebook, Icon: FacebookIcon, label: "Facebook" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-cream/20 text-cream/70 transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="font-body text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Explore
            </h4>
            <ul className="mt-6 space-y-3 font-body text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-cream/60 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours + contact */}
          <div className="lg:col-span-3">
            <h4 className="font-body text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Hours &amp; Contact
            </h4>
            <ul className="mt-6 space-y-1.5 font-body text-sm text-cream/60">
              {hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between gap-4">
                  <span>{h.day.slice(0, 3)}</span>
                  <span className="text-cream/45">
                    {h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3 font-body text-sm">
              <a href={contact.phoneHref} className="flex items-center gap-3 text-cream/60 hover:text-cream">
                <Phone className="h-4 w-4 text-gold" /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-cream/60 hover:text-cream">
                <Mail className="h-4 w-4 text-gold" /> {contact.email}
              </a>
              <p className="flex items-start gap-3 text-cream/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {contact.addressLine}
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-body text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              La Famiglia
            </h4>
            <p className="mt-6 font-body text-sm leading-relaxed text-cream/60">
              Join our table for seasonal menus, wine dinners &amp; private
              event invitations.
            </p>
            <NewsletterForm />
            <Link
              href="/booking"
              className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light hover:text-gold"
            >
              <Clock className="h-4 w-4" /> Book a table
            </Link>
          </div>
        </div>

        <Ornament tone="cream" className="mt-16 opacity-50" />

        <div className="mt-8 flex justify-center text-center font-body text-[11px] uppercase tracking-[0.18em] text-cream/40">
          <p>© {new Date().getFullYear()} {brand.fullName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
