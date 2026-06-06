"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteContent, type SiteContent } from "@/content/site";

export function Navbar({
  nav = siteContent.nav,
  brand = siteContent.brand,
  contact = siteContent.contact,
}: {
  nav?: SiteContent["nav"];
  brand?: SiteContent["brand"];
  contact?: SiteContent["contact"];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "bg-canvas/95 py-3 shadow-[0_1px_0_rgba(28,26,23,0.08)] backdrop-blur-md"
            : "bg-gradient-to-b from-black/40 to-transparent py-5"
        )}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-8">
          {/* Left nav (desktop) */}
          <div className="hidden flex-1 items-center gap-7 lg:flex">
            {nav.slice(0, 4).map((item) => (
              <NavLink key={item.href} item={item} solid={solid} active={pathname === item.href} />
            ))}
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col items-center leading-none lg:flex-1 lg:items-center"
          >
            <span
              className={cn(
                "font-display text-2xl tracking-[0.18em] transition-colors duration-500 sm:text-[27px]",
                solid ? "text-ink" : "text-cream text-shadow-hero"
              )}
            >
              {brand.name.toUpperCase()}
            </span>
            <span
              className={cn(
                "mt-1 font-body text-[8px] uppercase tracking-[0.4em] transition-colors duration-500",
                solid ? "text-gold-dark" : "text-gold-light"
              )}
            >
              Ristorante · Est. {brand.established}
            </span>
          </Link>

          {/* Right nav (desktop) */}
          <div className="hidden flex-1 items-center justify-end gap-7 lg:flex">
            {nav.slice(4).map((item) => (
              <NavLink key={item.href} item={item} solid={solid} active={pathname === item.href} />
            ))}
            <Link
              href="/booking"
              className="ml-1 inline-flex items-center gap-2 bg-terracotta px-6 py-3 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-cream transition-all duration-500 hover:bg-terracotta-dark hover:-translate-y-0.5"
            >
              Reserve
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={cn(
              "lg:hidden transition-colors",
              solid ? "text-ink" : "text-cream"
            )}
          >
            <Menu className="h-7 w-7" />
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-cream lg:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-xl tracking-[0.18em]">
                {brand.name.toUpperCase()}
              </span>
              <button aria-label="Close menu" onClick={() => setOpen(false)}>
                <X className="h-7 w-7" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-6">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "font-display text-2xl tracking-wide transition-colors",
                      pathname === item.href ? "text-gold-light" : "text-cream hover:text-gold-light"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="space-y-4 px-8 pb-12 text-center">
              <Link
                href="/booking"
                className="block bg-terracotta py-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-cream"
              >
                Reserve a Table
              </Link>
              <a
                href={contact.phoneHref}
                className="flex items-center justify-center gap-2 font-body text-sm text-cream/70"
              >
                <Phone className="h-4 w-4" /> {contact.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  item,
  solid,
  active,
}: {
  item: { label: string; href: string };
  solid: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "link-underline whitespace-nowrap font-body text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
        solid
          ? active
            ? "text-terracotta"
            : "text-ink/80 hover:text-terracotta"
          : active
            ? "text-gold-light"
            : "text-cream/90 hover:text-cream"
      )}
    >
      {item.label}
    </Link>
  );
}
