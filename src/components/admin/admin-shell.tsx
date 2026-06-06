"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, CalendarCheck, Inbox, UtensilsCrossed, FileText,
  Images, ExternalLink, LogOut, Menu, X, MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/conversations", label: "Conversations", icon: MessagesSquare },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/content", label: "Content / CMS", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <p className="font-display text-xl tracking-[0.18em] text-sidebar-foreground">BELLA VITA</p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Admin Dashboard</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-sidebar-border p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent">
          <ExternalLink className="h-4.5 w-4.5" /> View Website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10">
          <LogOut className="h-4.5 w-4.5" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">{SidebarContent}</div>
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-sidebar">{SidebarContent}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-5 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <span className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Live
          </span>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
