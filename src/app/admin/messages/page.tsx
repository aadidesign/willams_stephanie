"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox, Trash2, Mail, Phone, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Message = {
  _id: string; name: string; email: string; phone?: string; subject: string;
  message: string; type: string; read: boolean; createdAt: string;
};

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Message | null>(null);

  function load() {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function markRead(m: Message, read = true) {
    setMessages((ms) => ms.map((x) => (x._id === m._id ? { ...x, read } : x)));
    await fetch(`/api/messages/${m._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function remove(id: string) {
    setMessages((ms) => ms.filter((x) => x._id !== id));
    if (active?._id === id) setActive(null);
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    toast.success("Message deleted.");
  }

  const unread = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  function open(m: Message) {
    setActive(m);
    if (!m.read) markRead(m, true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-6 w-6 text-terracotta" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground">{unread} unread · enquiries, catering, banquet &amp; newsletter sign-ups.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* List */}
        <Card className="p-0 lg:col-span-2">
          <div className="max-h-[70vh] divide-y overflow-y-auto">
            {loading && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
            {!loading && messages.length === 0 && <p className="p-6 text-sm text-muted-foreground">No messages yet.</p>}
            {messages.map((m) => (
              <button
                key={m._id}
                onClick={() => open(m)}
                className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${active?._id === m._id ? "bg-muted" : ""}`}
              >
                {!m.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-terracotta" />}
                <div className={`min-w-0 flex-1 ${m.read ? "pl-5" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-sm ${m.read ? "font-medium" : "font-semibold"}`}>{m.name}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{m.subject}</p>
                  <Badge variant="outline" className="mt-1.5 text-[9px] capitalize">{m.type}</Badge>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Detail */}
        <Card className="p-6 lg:col-span-3">
          {active ? (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{active.subject}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">From <span className="font-medium text-foreground">{active.name}</span></p>
                </div>
                <button onClick={() => remove(active._id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 border-y py-3 text-sm">
                <a href={`mailto:${active.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Mail className="h-4 w-4" /> {active.email}</a>
                {active.phone && <a href={`tel:${active.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Phone className="h-4 w-4" /> {active.phone}</a>}
              </div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed">{active.message}</p>
              <div className="mt-8 flex gap-3">
                <a href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`} className="inline-flex items-center gap-2 rounded-md bg-terracotta px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-terracotta-dark">
                  <Mail className="h-4 w-4" /> Reply by Email
                </a>
                <button onClick={() => markRead(active, false)} className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide hover:bg-muted">
                  <Check className="h-4 w-4" /> Mark Unread
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
              <Inbox className="h-10 w-10 opacity-40" />
              <p className="mt-3 text-sm">Select a message to read it.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
