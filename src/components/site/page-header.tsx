import Image from "next/image";
import Link from "next/link";
import { Ornament } from "./ornament";

export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  crumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  crumb?: string;
}) {
  return (
    <section className="relative flex h-[58vh] min-h-[420px] w-full items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image src={image} alt="" fill priority className="object-cover animation-pan" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/80" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 text-center text-cream">
        {eyebrow && <span className="eyebrow text-gold-light">{eyebrow}</span>}
        <h1 className="mt-5 font-display text-4xl leading-tight text-shadow-hero sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <Ornament tone="gold" className="mt-6 opacity-90" />
        {description && (
          <p className="mx-auto mt-6 max-w-xl font-serif-lux text-lg leading-relaxed text-cream/80 sm:text-xl">
            {description}
          </p>
        )}
        <nav className="mt-7 font-body text-[11px] uppercase tracking-[0.2em] text-cream/55">
          <Link href="/" className="hover:text-gold-light">Home</Link>
          <span className="mx-2 text-gold">/</span>
          <span className="text-cream/80">{crumb ?? title}</span>
        </nav>
      </div>
    </section>
  );
}
