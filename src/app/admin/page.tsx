"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck, Clock, Users, Inbox, TrendingUp, ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/hours";

type Booking = { _id: string; name: string; date: string; time: string; partySize: number; occasion: string; status: string; createdAt: string };
type Message = { _id: string; name: string; subject: string; type: string; read: boolean; createdAt: string };

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  seated: "bg-blue-100 text-blue-700 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminOverview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/contact").then((r) => r.json()),
    ])
      .then(([b, m]) => {
        setBookings(b.bookings || []);
        setMessages(m.messages || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const todayCovers = bookings
      .filter((b) => b.date === today && b.status !== "cancelled")
      .reduce((s, b) => s + b.partySize, 0);
    const unread = messages.filter((m) => !m.read).length;
    return { total: bookings.length, pending, todayCovers, unread };
  }, [bookings, messages, today]);

  // Last 7 days booking counts
  const chart = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        count: bookings.filter((b) => (b.createdAt || "").slice(0, 10) === key).length,
      });
    }
    const max = Math.max(1, ...days.map((d) => d.count));
    return { days, max };
  }, [bookings]);

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: CalendarCheck, accent: "text-terracotta" },
    { label: "Pending Review", value: stats.pending, icon: Clock, accent: "text-amber-600" },
    { label: "Covers Today", value: stats.todayCovers, icon: Users, accent: "text-green-600" },
    { label: "Unread Messages", value: stats.unread, icon: Inbox, accent: "text-blue-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buongiorno, Willams 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening at Bella Vita today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.accent}`} />
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums">{loading ? "·" : s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Chart */}
        <Card className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Bookings this week</h2>
              <p className="text-sm text-muted-foreground">New reservations over the last 7 days</p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-8 flex h-48 items-end justify-between gap-3">
            {chart.days.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-terracotta to-terracotta-light transition-all duration-700"
                    style={{ height: `${(d.count / chart.max) * 100}%`, minHeight: d.count ? 6 : 2 }}
                    title={`${d.count} bookings`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent messages */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Messages</h2>
            <Link href="/admin/messages" className="text-sm text-terracotta hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!loading && messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
            {messages.slice(0, 5).map((m) => (
              <div key={m._id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.subject}</p>
                </div>
                {!m.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent Bookings</h2>
          <Link href="/admin/bookings" className="flex items-center gap-1 text-sm text-terracotta hover:underline">
            Manage all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Guest</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Time</th>
                <th className="pb-3 pr-4 font-medium">Party</th>
                <th className="pb-3 pr-4 font-medium">Occasion</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!loading && bookings.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No bookings yet. They&apos;ll appear here in real time.</td></tr>
              )}
              {bookings.slice(0, 6).map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{b.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{new Date(b.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatTime(b.time)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{b.partySize}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{b.occasion}</td>
                  <td className="py-3">
                    <Badge variant="outline" className={STATUS_COLORS[b.status] || ""}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
