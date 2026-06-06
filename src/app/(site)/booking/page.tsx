import type { Metadata } from "next";
import { Phone, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { BookingFlow } from "@/components/booking/booking-flow";
import { OpenStatus } from "@/components/site/open-status";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Online Booking",
  description:
    "Reserve your table at Bella Vita Ristorante in seconds. Choose your date, time and party size. Instant confirmation by email.",
};

export default async function BookingPage() {
  const c = await getSiteContent();

  return (
    <>
      <PageHeader
        eyebrow="Online Booking"
        title="Reserve your table"
        description="Real-time availability · instant email confirmation · no booking fees."
        image={siteContent.gallery[9].src}
        crumb="Booking"
      />

      <section className="bg-canvas py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          {/* Trust badges */}
          <div className="mx-auto mb-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "No booking fees", s: "Free to reserve & cancel" },
              { icon: Sparkles, t: "Instant confirmation", s: "By email within minutes" },
              { icon: Clock, t: "Real-time slots", s: "Live table availability" },
            ].map((b) => (
              <div key={b.t} className="flex items-center gap-4 border border-ink/10 bg-cream px-5 py-4">
                <b.icon className="h-7 w-7 shrink-0 text-terracotta" strokeWidth={1.4} />
                <div>
                  <p className="font-display text-base text-ink">{b.t}</p>
                  <p className="font-body text-xs text-ink-mute">{b.s}</p>
                </div>
              </div>
            ))}
          </div>

          <BookingFlow />

          {/* Help footer */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 text-center sm:flex-row sm:text-left">
            <OpenStatus hours={c.hours} />
            <a href={c.contact.phoneHref} className="inline-flex items-center gap-2 font-body text-sm text-ink-mute hover:text-terracotta">
              <Phone className="h-4 w-4 text-terracotta" /> Prefer to call? {c.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
