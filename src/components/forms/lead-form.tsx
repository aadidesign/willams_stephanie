"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendOwnerEmail } from "@/lib/emailjs";

type Props = {
  type?: string;
  subjectOptions?: string[];
  defaultSubject?: string;
  showSubject?: boolean;
  messageLabel?: string;
  submitLabel?: string;
  compact?: boolean;
};

export function LeadForm({
  type = "contact",
  subjectOptions,
  defaultSubject = "General Enquiry",
  showSubject = true,
  messageLabel = "Your Message",
  submitLabel = "Send Message",
  compact = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      subject: String(fd.get("subject") || defaultSubject),
      message: String(fd.get("message") || ""),
      type,
    };
    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      // Fire client-side EmailJS notification to the owner (best-effort).
      void sendOwnerEmail("contact", payload);
      setDone(true);
      toast.success("Thank you! We'll be in touch very soon.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Something went wrong. Please call us or try again.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full border-b border-ink/20 bg-transparent py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none transition-colors";

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-gold/40 bg-gold/5 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-cream">
          <Send className="h-6 w-6" />
        </div>
        <h3 className="mt-5 font-display text-2xl text-ink">Message sent!</h3>
        <p className="mt-2 font-body text-sm text-ink-mute">Grazie mille. Our team will reply within 24 hours.</p>
        <button onClick={() => setDone(false)} className="mt-6 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className={compact ? "space-y-6" : "grid gap-6 sm:grid-cols-2"}>
        <div>
          <label className="mb-1 block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">Full Name *</label>
          <input name="name" required placeholder="Mario Rossi" className={field} />
        </div>
        <div>
          <label className="mb-1 block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">Email *</label>
          <input name="email" type="email" required placeholder="you@email.com" className={field} />
        </div>
      </div>
      <div className={compact ? "space-y-6" : "grid gap-6 sm:grid-cols-2"}>
        <div>
          <label className="mb-1 block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">Phone</label>
          <input name="phone" placeholder="+1 (000) 000-0000" className={field} />
        </div>
        {showSubject && (
          <div>
            <label className="mb-1 block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">Subject</label>
            {subjectOptions ? (
              <select name="subject" defaultValue={defaultSubject} className={field}>
                {subjectOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input name="subject" defaultValue={defaultSubject} className={field} />
            )}
          </div>
        )}
      </div>
      <div>
        <label className="mb-1 block font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-mute">{messageLabel} *</label>
        <textarea name="message" required rows={5} placeholder="Tell us how we can help…" className={`${field} resize-none`} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="group inline-flex items-center justify-center gap-2.5 bg-terracotta px-10 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition-all duration-500 hover:bg-terracotta-dark disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
