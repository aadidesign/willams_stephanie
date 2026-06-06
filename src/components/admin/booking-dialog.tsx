"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { siteContent, BOOKING_STATUSES } from "@/content/site";
import { formatTime } from "@/lib/hours";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const { tables, timeSlots, partySizes, occasions } = siteContent.booking;

type BookingShape = {
  _id?: string;
  name: string; email: string; phone: string;
  date: string; time: string; partySize: number;
  occasion: string; notes?: string; tables?: string[];
  status: string; source?: string;
};

const empty = (): BookingShape => ({
  name: "", email: "", phone: "", date: new Date().toISOString().slice(0, 10),
  time: "19:00", partySize: 2, occasion: occasions[0], notes: "", tables: [],
  status: "booked", source: "phone",
});

export function BookingDialog({
  open, onOpenChange, booking, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking?: BookingShape | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<BookingShape>(empty());
  const [occupied, setOccupied] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(booking?._id);

  useEffect(() => {
    if (open) setForm(booking ? { ...empty(), ...booking, tables: booking.tables ?? [] } : empty());
  }, [open, booking]);

  // Fetch occupancy for the chosen date so we can grey-out taken tables.
  const loadOccupancy = useCallback(async (date: string, time: string) => {
    if (!date || !time) return;
    try {
      const r = await fetch(`/api/availability?date=${date}`);
      const d = await r.json();
      const slot = d.slots?.find((s: any) => s.time === time);
      setOccupied(slot?.occupiedTables ?? []);
    } catch {
      setOccupied([]);
    }
  }, []);

  useEffect(() => {
    if (open) loadOccupancy(form.date, form.time);
  }, [open, form.date, form.time, loadOccupancy]);

  const own = booking?.tables ?? [];
  function tableState(id: string): "free" | "taken" | "selected" {
    if (form.tables?.includes(id)) return "selected";
    if (occupied.includes(id) && !own.includes(id)) return "taken";
    return "free";
  }
  function toggleTable(id: string) {
    if (tableState(id) === "taken") return;
    setForm((f) => {
      const set = new Set(f.tables ?? []);
      if (set.has(id)) set.delete(id); else set.add(id);
      return { ...f, tables: [...set] };
    });
  }

  async function save() {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, email: form.email || "walkin@bellavita.local" };
      const res = isEdit
        ? await fetch(`/api/bookings/${booking!._id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
          })
        : await fetch(`/api/bookings`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
          });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error);
      toast.success(isEdit ? "Booking updated." : "Booking added.");
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || "Could not save booking.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "h-9";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Booking" : "New Booking (phone / walk-in)"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 text-xs">Guest name *</Label>
              <Input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Phone *</Label>
              <Input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 text-xs">Email</Label>
            <Input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="optional for walk-ins" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="mb-1.5 text-xs">Date</Label>
              <Input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Time</Label>
              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                {timeSlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
              </select>
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Party</Label>
              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={form.partySize} onChange={(e) => setForm({ ...form, partySize: Number(e.target.value) })}>
                {partySizes.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 text-xs">Occasion</Label>
              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                {occasions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Status</Label>
              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm capitalize" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Table assignment */}
          <div>
            <Label className="mb-2 text-xs">Assign table(s) — {form.tables?.length || 0} selected</Label>
            <div className="flex flex-wrap gap-1.5">
              {tables.map((t) => {
                const st = tableState(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTable(t.id)}
                    disabled={st === "taken"}
                    title={`${t.area} · seats ${t.seats}${st === "taken" ? " · taken" : ""}`}
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                      st === "selected" && "border-terracotta bg-terracotta text-cream",
                      st === "free" && "border-input hover:border-terracotta",
                      st === "taken" && "cursor-not-allowed border-input bg-muted text-muted-foreground/40 line-through"
                    )}
                  >
                    {t.id}<span className="ml-1 opacity-60">{t.seats}p</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">Grey = already taken at this date &amp; time. Leave empty to auto-assign a best-fit table.</p>
          </div>

          <div>
            <Label className="mb-1.5 text-xs">Notes</Label>
            <Input className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Allergies, seating preference…" />
          </div>
        </div>

        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-terracotta px-5 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} {isEdit ? "Save changes" : "Add booking"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
