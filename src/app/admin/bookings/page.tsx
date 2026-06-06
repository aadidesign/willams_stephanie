"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Phone, Mail, CalendarCheck, Plus, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatTime } from "@/lib/hours";
import { BookingDialog } from "@/components/admin/booking-dialog";
import { FloorView } from "@/components/admin/floor-view";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Booking = {
  _id: string; name: string; email: string; phone: string; date: string;
  time: string; partySize: number; occasion: string; notes?: string;
  tables?: string[]; status: string; source?: string; createdAt: string;
};

const STATUSES = ["pending", "confirmed", "booked", "seated", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  booked: "bg-terracotta/15 text-terracotta border-terracotta/30",
  seated: "bg-blue-100 text-blue-700 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);

  function load() {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function setStatus(id: string, status: string) {
    setBookings((bs) => bs.map((b) => (b._id === id ? { ...b, status } : b)));
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (res.ok) toast.success(`Marked ${status}.`); else toast.error("Could not update.");
  }

  async function remove(id: string) {
    setBookings((bs) => bs.filter((b) => b._id !== id));
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    toast.success("Booking removed.");
  }

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = filter === "all" || b.status === filter;
      const matchQ = !q || `${b.name} ${b.email} ${b.phone} ${(b.tables || []).join(" ")}`.toLowerCase().includes(q.toLowerCase());
      return matchStatus && matchQ;
    });
  }, [bookings, filter, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: bookings.length };
    STATUSES.forEach((s) => (c[s] = bookings.filter((b) => b.status === s).length));
    return c;
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CalendarCheck className="h-6 w-6 text-terracotta" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
            <p className="text-sm text-muted-foreground">Manage reservations, add phone &amp; walk-in bookings, assign tables.</p>
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setDialogOpen(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-terracotta px-4 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark"
        >
          <Plus className="h-4 w-4" /> New Booking
        </button>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Reservations</TabsTrigger>
          <TabsTrigger value="floor">Floor &amp; Availability</TabsTrigger>
        </TabsList>

        {/* ---------- Reservations list ---------- */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {["all", ...STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                    filter === s ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {s} ({counts[s] ?? 0})
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guest or table…" className="pl-9" />
            </div>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Guest</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                    <th className="px-4 py-3 font-medium">Party</th>
                    <th className="px-4 py-3 font-medium">Table</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">Loading…</td></tr>}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No bookings found.</td></tr>
                  )}
                  {filtered.map((b) => (
                    <tr key={b._id} className="border-t align-top hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <p className="font-medium">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.occasion}{b.source && b.source !== "website" ? ` · ${b.source}` : ""}</p>
                        {b.notes && <p className="mt-1 max-w-[200px] text-xs italic text-muted-foreground">“{b.notes}”</p>}
                      </td>
                      <td className="px-4 py-4">
                        <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><Phone className="h-3 w-3" /> {b.phone}</a>
                        <a href={`mailto:${b.email}`} className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><Mail className="h-3 w-3" /> {b.email}</a>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{new Date(b.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(b.time)}</p>
                      </td>
                      <td className="px-4 py-4 tabular-nums">{b.partySize}</td>
                      <td className="px-4 py-4">
                        {b.tables && b.tables.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {b.tables.map((t) => (
                              <span key={t} className="rounded bg-terracotta/10 px-1.5 py-0.5 text-xs font-medium text-terracotta">{t}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={b.status}
                          onChange={(e) => setStatus(b._id, e.target.value)}
                          className={`rounded-md border px-2.5 py-1 text-xs font-medium capitalize outline-none ${STATUS_COLORS[b.status]}`}
                        >
                          {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => { setEditing(b); setDialogOpen(true); }} className="text-muted-foreground hover:text-foreground" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => remove(b._id)} className="text-muted-foreground hover:text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ---------- Floor view ---------- */}
        <TabsContent value="floor">
          <Card className="p-6">
            <FloorView bookings={bookings} />
          </Card>
        </TabsContent>
      </Tabs>

      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        booking={editing}
        onSaved={load}
      />
    </div>
  );
}
