"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      toast.success("Welcome back!");
      router.push(params.get("from") || "/admin");
      router.refresh();
    } catch {
      toast.error("Incorrect password. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="font-display text-3xl tracking-[0.18em] text-cream">BELLA VITA</span>
          <p className="mt-2 font-body text-[10px] uppercase tracking-[0.4em] text-gold-light">Admin Dashboard</p>
        </div>
        <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-cream/10 bg-cream/[0.03] p-8 backdrop-blur">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta text-cream">
            <Lock className="h-5 w-5" />
          </div>
          <label className="mb-2 block text-center font-body text-xs uppercase tracking-[0.2em] text-cream/60">
            Enter password
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-cream/20 bg-transparent py-3 text-center font-body text-cream placeholder:text-cream/30 focus:border-gold focus:outline-none"
            placeholder="••••••••"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 bg-terracotta py-3.5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <p className="mt-5 text-center font-body text-xs text-cream/40">
            Demo password: <span className="text-gold-light">bellavita</span>
          </p>
        </form>
      </div>
    </div>
  );
}
