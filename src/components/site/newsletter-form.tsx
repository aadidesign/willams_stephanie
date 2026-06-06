"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email,
          message: "Newsletter sign-up from website footer.",
          type: "newsletter",
          subject: "Newsletter Subscription",
        }),
      });
      setDone(true);
      toast.success("Welcome to la famiglia! Check your inbox soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-5 flex items-center gap-2 border-b border-gold/40 pb-3 font-body text-sm text-gold-light">
        <Check className="h-4 w-4" /> You&apos;re on the list. Grazie!
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex items-center gap-2 border-b border-cream/25 pb-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="w-full bg-transparent py-1.5 font-body text-sm text-cream placeholder:text-cream/30 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        aria-label="Subscribe"
        className="text-gold transition-transform duration-300 hover:translate-x-1 disabled:opacity-50"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </form>
  );
}
