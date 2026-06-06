"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, ChevronLeft, ShieldCheck, X } from "lucide-react";
import { siteContent } from "@/content/site";
import { formatTime } from "@/lib/hours";
import { sendOwnerEmail } from "@/lib/emailjs";
import { cn } from "@/lib/utils";

const { booking, contact } = siteContent;

type Slot = { time: string; available: boolean; remaining: number };
export type BookingResult = {
  ref: string; table?: string; date: string; time: string; partySize: number; name: string;
};

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ChatBooking({
  onDone, onCancel,
}: {
  onDone: (r: BookingResult) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(0);
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState(toISO(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [occasion, setOccasion] = useState(booking.occasions[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step !== 1) return;
    setLoadingSlots(true);
    setTime("");
    fetch(`/api/availability?date=${date}&partySize=${partySize}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [step, date, partySize]);

  function validEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function validPhone(p: string) { return p.replace(/\D/g, "").length >= 7; }

  async function submit() {
    setError("");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!validPhone(form.phone)) return setError("Please enter a valid phone number.");
    if (!validEmail(form.email)) return setError("Please enter a valid email address.");
    setSubmitting(true);
    try {
      const payload = { ...form, date, time, partySize, occasion, source: "ai-chat" };
      const res = await fetch("/api/bookings", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setError(data.error || "Could not complete booking. Please call us."); setSubmitting(false); return; }
      void sendOwnerEmail("booking", {
        ...payload,
        date_pretty: new Date(date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
        time_pretty: formatTime(time),
      });
      onDone({
        ref: String(data.booking?._id ?? "BV").slice(-6).toUpperCase(),
        table: data.booking?.tables?.[0],
        date, time, partySize, name: form.name,
      });
    } catch {
      setError("Network error. Please try again or call us.");
      setSubmitting(false);
    }
  }

  const field = "w-full rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none";

  return (
    <div className="rounded-2xl border border-ink/10 bg-canvas p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display text-sm text-ink">
          <ShieldCheck className="h-4 w-4 text-terracotta" /> Secure reservation
        </div>
        <button onClick={onCancel} aria-label="Cancel" className="text-ink/40 hover:text-ink"><X className="h-4 w-4" /></button>
      </div>

      {/* progress dots */}
      <div className="mb-4 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-terracotta" : "bg-ink/10")} />
        ))}
      </div>

      {/* STEP 0: party + date */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-mute">Guests</p>
            <div className="grid grid-cols-5 gap-1.5">
              {booking.partySizes.map((n) => (
                <button key={n} onClick={() => setPartySize(n)}
                  className={cn("rounded-lg py-2 text-sm font-medium transition-colors", partySize === n ? "bg-terracotta text-cream" : "border border-ink/15 text-ink hover:border-terracotta")}>
                  {n}{n === 10 ? "+" : ""}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-mute">Date</p>
            <input type="date" min={toISO(new Date())} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
          </div>
          <button onClick={() => setStep(1)} className="w-full rounded-lg bg-terracotta py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark">
            See available times
          </button>
        </div>
      )}

      {/* STEP 1: time */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Available times · party of {partySize}</p>
          {loadingSlots ? (
            <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-terracotta" /></div>
          ) : slots.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink-mute">No live availability found. Please call {contact.phone}.</p>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {slots.map((s) => (
                <button key={s.time} disabled={!s.available} onClick={() => { setTime(s.time); setStep(2); }}
                  className={cn("rounded-lg py-2 text-xs font-medium transition-colors",
                    !s.available ? "cursor-not-allowed border border-ink/10 text-ink/25 line-through"
                      : "border border-ink/15 text-ink hover:border-terracotta hover:bg-terracotta hover:text-cream")}>
                  {formatTime(s.time)}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setStep(0)} className="flex items-center gap-1 text-xs text-ink-mute hover:text-ink"><ChevronLeft className="h-3.5 w-3.5" /> Back</button>
        </div>
      )}

      {/* STEP 2: details */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Your details</p>
          <input placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
          <input placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
          <input placeholder="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={field}>
            {booking.occasions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <input placeholder="Special requests (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={field} />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-2 text-xs text-ink-mute hover:bg-ink/5"><ChevronLeft className="h-3.5 w-3.5" /> Back</button>
            <button onClick={() => setStep(3)} className="flex-1 rounded-lg bg-terracotta py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark">Review</button>
          </div>
        </div>
      )}

      {/* STEP 3: confirm */}
      {step === 3 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Confirm your reservation</p>
          <div className="space-y-1.5 rounded-lg bg-cream p-3 text-sm">
            {[
              ["Guest", form.name],
              ["Party", `${partySize} · ${occasion}`],
              ["Date", new Date(date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })],
              ["Time", formatTime(time)],
              ["Phone", form.phone],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-ink-mute">{k}</span><span className="font-medium text-ink">{v}</span></div>
            ))}
          </div>
          <p className="rounded-lg bg-gold/10 px-3 py-2 text-[11px] text-ink-mute">
            Your table is held as <b>pending</b>. Our team will call {form.phone || "you"} to confirm. No payment is taken here.
          </p>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} disabled={submitting} className="flex items-center gap-1 rounded-lg border border-ink/15 px-3 py-2 text-xs text-ink-mute hover:bg-ink/5"><ChevronLeft className="h-3.5 w-3.5" /> Edit</button>
            <button onClick={submit} disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-terracotta py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Confirm reservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
