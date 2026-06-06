import type { Metadata } from "next";
import { FileText, Download } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/ornament";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { LeadForm } from "@/components/forms/lead-form";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Menu Kit",
  description:
    "Download Bella Vita's printable menus, wine list, banquet & events kit and catering brochure, or request them by email.",
};

export default async function MenuKitPage() {
  const c = await getSiteContent();
  const kit = c.menuKit;

  return (
    <>
      <PageHeader
        eyebrow={kit.eyebrow}
        title={kit.heading}
        description={kit.description}
        image={siteContent.gallery[5].src}
        crumb="Menu Kit"
      />

      {/* Downloads + request form */}
      <section className="bg-canvas py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading align="left" eyebrow="Downloads" title="Grab the kit" />
            <Stagger className="mt-10 space-y-4">
              {kit.downloads.map((d) => (
                <StaggerItem key={d.name}>
                  <a
                    href={d.file}
                    className="group flex items-center gap-5 border border-ink/10 bg-cream p-5 transition-all duration-300 hover:border-terracotta hover:shadow-[0_20px_40px_-28px_rgba(28,26,23,0.4)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-terracotta/10 text-terracotta">
                      <FileText className="h-6 w-6" />
                    </span>
                    <div className="flex-1">
                      <p className="font-display text-lg text-ink">{d.name}</p>
                      <p className="font-body text-xs uppercase tracking-[0.16em] text-ink-mute">{d.format} · {d.size}</p>
                    </div>
                    <Download className="h-5 w-5 text-ink-mute transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-terracotta" />
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="border border-ink/10 bg-cream p-8 sm:p-10">
            <SectionHeading align="left" eyebrow="Request by Email" title="Prefer it in your inbox?" />
            <p className="mt-4 font-body text-sm text-ink-mute">
              Tell us what you need: menus, the banquet kit or a catering brochure, and we&apos;ll send it right over.
            </p>
            <div className="mt-8">
              <LeadForm
                type="menu-kit"
                defaultSubject="Menu Kit Request"
                subjectOptions={["À la Carte Menu", "Wine List", "Banquet & Events Kit", "Catering Brochure"]}
                messageLabel="What would you like?"
                submitLabel="Send Me the Kit"
                compact
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
