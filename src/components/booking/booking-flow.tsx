"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users, CalendarDays, Clock, Check, Loader2, ChevronRight, ChevronLeft,
  PartyPopper, CalendarPlus, Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { siteContent } from "@/content/site";
import { formatTime } from "@/lib/hours";
import { sendOwnerEmail } from "@/lib/emailjs";
import { cn } from "@/lib/utils";

const { booking, brand, contact } = siteContent;

type Slot = { time: string; available: boolean; remaining: number };

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const STEPS = ["Party", "Date & Time", "Your Details", "Confirmed"];

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [partySize, setPartySize] = useState(2);
  const [occasion, setOccasion] = useState(booking.occasions[0]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [time, setTime] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ ref: string; table?: string } | null>(null);

  const largeParty = partySize >= booking.largePartyThreshold;

  // Fetch table-aware availability when a date or party size changes.
  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setTime("");
    fetch(`/api/availability?date=${toISODate(date)}&partySize=${partySize}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots(booking.timeSlots.map((t) => ({ time: t, available: true, remaining: 30 }))))
      .finally(() => setLoadingSlots(false));
  }, [date, partySize]);

  const canNext =
    (step === 0 && partySize > 0) ||
    (step === 1 && date && time) ||
    step === 2;

  async function submit() {
    if (!date || !time) return;
    if (!form.name || !form.email.includes("@") || !form.phone) {
      toast.error("Please complete your name, email and phone.");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      date: toISODate(date),
      time,
      partySize,
      occasion,
    };
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "We couldn't complete your booking. Please call us.");
        return;
      }
      void sendOwnerEmail("booking", {
        ...payload,
        date_pretty: date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
        time_pretty: formatTime(time),
      });
      setConfirmation({
        ref: String(data.booking?._id ?? "BV").slice(-6).toUpperCase(),
        table: data.booking?.tables?.[0],
      });
      setStep(3);
    } catch {
      toast.error("We couldn't complete your booking. Please call us.");
    } finally {
      setSubmitting(false);
    }
  }

  // Calendar links for confirmation (3rd-party integration).
  const calLinks = (() => {
    if (!date || !time) return { google: "#", ics: "#" };
    const [h, m] = time.split(":").map(Number);
    const start = new Date(date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const title = encodeURIComponent(`Table for ${partySize} at ${brand.name}`);
    const details = encodeURIComponent(`${occasion} · ${brand.fullName}. Ref to follow by email.`);
    const loc = encodeURIComponent(contact.addressLine);
    const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${loc}`;
    const ics = `data:text/calendar;charset=utf8,${encodeURIComponent(
      `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nSUMMARY:Table for ${partySize} at ${brand.name}\nLOCATION:${contact.addressLine}\nEND:VEVENT\nEND:VCALENDAR`
    )}`;
    return { google, ics };
  })();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-12 flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border font-body text-xs font-semibold transition-colors duration-300",
                  i < step
                    ? "border-terracotta bg-terracotta text-cream"
                    : i === step
                      ? "border-terracotta text-terracotta"
                      : "border-ink/20 text-ink/30"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("hidden font-body text-[10px] uppercase tracking-[0.15em] sm:block", i <= step ? "text-ink" : "text-ink/30")}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={cn("h-px w-6 sm:w-12", i < step ? "bg-terracotta" : "bg-ink/15")} />}
          </div>
        ))}
      </div>

      <div className="border border-ink/10 bg-cream p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: Party + occasion */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
              <h3 className="flex items-center gap-3 font-display text-2xl text-ink"><Users className="h-6 w-6 text-terracotta" /> How many guests?</h3>
              <div className="mt-7 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {booking.partySizes.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPartySize(n)}
                    className={cn(
                      "aspect-square font-display text-xl transition-all duration-300",
                      partySize === n ? "bg-terracotta text-cream" : "border border-ink/15 text-ink hover:border-terracotta"
                    )}
                  >
                    {n}{n === 10 ? "+" : ""}
                  </button>
                ))}
              </div>
              <h3 className="mt-10 flex items-center gap-3 font-display text-2xl text-ink"><PartyPopper className="h-6 w-6 text-terracotta" /> Occasion</h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {booking.occasions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={cn(
                      "px-4 py-2.5 font-body text-xs uppercase tracking-[0.12em] transition-all duration-300",
                      occasion === o ? "bg-ink text-cream" : "border border-ink/15 text-ink-mute hover:border-ink"
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {largeParty && (
                <p className="mt-6 border-l-2 border-gold bg-gold/10 px-4 py-3 font-body text-sm text-ink-mute">
                  Parties of {booking.largePartyThreshold}+ may be better suited to our{" "}
                  <a href="/banquet" className="font-semibold text-terracotta underline">banquet facility</a>, we&apos;ll confirm availability by phone.
                </p>
              )}
            </motion.div>
          )}

          {/* STEP 2: Date + time */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }} className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-3 font-display text-2xl text-ink"><CalendarDays className="h-6 w-6 text-terracotta" /> Pick a date</h3>
                <div className="mt-5 flex justify-center rounded-md border border-ink/10 bg-canvas p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={{ before: new Date() }}
                    className="bg-transparent"
                  />
                </div>
              </div>
              <div>
                <h3 className="flex items-center gap-3 font-display text-2xl text-ink"><Clock className="h-6 w-6 text-terracotta" /> Choose a time</h3>
                {!date ? (
                  <p className="mt-5 font-body text-sm text-ink-mute">Select a date to see available times.</p>
                ) : loadingSlots ? (
                  <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-terracotta" /></div>
                ) : (
                  <div className="mt-5 grid grid-cols-3 gap-2.5">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setTime(s.time)}
                        className={cn(
                          "py-3 font-body text-sm transition-all duration-300",
                          !s.available
                            ? "cursor-not-allowed border border-ink/10 text-ink/25 line-through"
                            : time === s.time
                              ? "bg-terracotta text-cream"
                              : "border border-ink/15 text-ink hover:border-terracotta"
                        )}
                      >
                        {formatTime(s.time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
              <h3 className="font-display text-2xl text-ink">Almost there, your details</h3>
              <div className="mt-4 flex flex-wrap gap-2 font-body text-xs uppercase tracking-[0.14em] text-ink-mute">
                <span className="bg-ink/5 px-3 py-1.5">{partySize} guests</span>
                <span className="bg-ink/5 px-3 py-1.5">{date?.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                <span className="bg-ink/5 px-3 py-1.5">{formatTime(time)}</span>
                <span className="bg-ink/5 px-3 py-1.5">{occasion}</span>
              </div>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {([["name", "Full Name *", "Mario Rossi"], ["email", "Email *", "you@email.com"], ["phone", "Phone *", "+1 (000) 000-0000"]] as const).map(([key, label, ph]) => (
                  <div key={key} className={key === "phone" ? "sm:col-span-2" : ""}>
                    <label className="mb-1 block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">{label}</label>
                    <input
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={ph}
                      className="w-full border-b border-ink/20 bg-transparent py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="mb-1 block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">Special Requests</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    placeholder="Allergies, high chair, window table…"
                    className="w-full resize-none border-b border-ink/20 bg-transparent py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 3 && confirmation && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-cream">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="mt-6 font-display text-3xl text-ink">Reservation requested!</h3>
              <p className="mt-3 font-body text-sm text-ink-mute">
                Confirmation <span className="font-semibold text-terracotta">#{confirmation.ref}</span>. We&apos;ve emailed you the details and our team will confirm shortly.
              </p>
              <div className="mx-auto mt-7 max-w-sm divide-y divide-ink/10 border border-ink/10 bg-canvas text-left">
                {[
                  ["Guest", form.name],
                  ["Party", `${partySize} guests · ${occasion}`],
                  ["Date", date?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })],
                  ["Time", formatTime(time)],
                  ...(confirmation.table ? [["Table", confirmation.table] as [string, string]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between px-5 py-3 font-body text-sm">
                    <span className="text-ink-mute">{k}</span>
                    <span className="text-ink">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={calLinks.google} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-terracotta px-6 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-cream hover:bg-terracotta-dark">
                  <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
                </a>
                <a href={calLinks.ics} download="bella-vita-reservation.ics" className="inline-flex items-center gap-2 border border-ink/25 px-6 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-cream">
                  Download .ics
                </a>
              </div>
              <a href={contact.phoneHref} className="mt-6 inline-flex items-center gap-2 font-body text-sm text-ink-mute hover:text-terracotta">
                <Phone className="h-4 w-4" /> Need to change something? Call {contact.phone}
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav buttons */}
        {step < 3 && (
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute transition-colors hover:text-ink disabled:opacity-0"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 bg-terracotta px-8 py-3.5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-all hover:bg-terracotta-dark disabled:opacity-40"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-terracotta px-8 py-3.5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-all hover:bg-terracotta-dark disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {submitting ? "Booking…" : "Confirm Reservation"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
