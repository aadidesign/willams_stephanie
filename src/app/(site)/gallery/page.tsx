import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { CtaButton } from "@/components/site/cta-button";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual feast. Explore Bella Vita's dishes, dining room, wine cellar and private events through our gallery.",
};

export default async function GalleryPage() {
  const c = await getSiteContent();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="A feast for the eyes"
        description="Step inside Bella Vita: the food, the room, the moments worth framing."
        image={c.gallery[1].src}
        crumb="Gallery"
      />

      <section className="bg-canvas py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <GalleryGrid items={c.gallery} />
        </div>
      </section>

      <section className="bg-cream py-20 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Hungry yet?</h2>
          <p className="mt-4 font-serif-lux text-lg text-ink-mute">There&apos;s no substitute for the real thing. Reserve your table today.</p>
          <div className="mt-8 flex justify-center">
            <CtaButton href="/booking" variant="solid">Reserve a Table</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
