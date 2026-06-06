"use client";

import { useEffect, useState } from "react";
import { MessagesSquare, Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Session = { sessionId: string; messages: any[]; updatedAt: string };

export default function ConversationsAdmin() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((d) => { setSessions(d.sessions || []); setActive((d.sessions || [])[0] || null); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessagesSquare className="h-6 w-6 text-terracotta" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
          <p className="text-sm text-muted-foreground">Every guest chat with Bella is recorded here for review and quality.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Session list */}
        <Card className="p-0 lg:col-span-2">
          <div className="max-h-[72vh] divide-y overflow-y-auto">
            {loading && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
            {!loading && sessions.length === 0 && <p className="p-6 text-sm text-muted-foreground">No conversations yet.</p>}
            {sessions.map((s) => {
              const last = s.messages[s.messages.length - 1];
              const firstUser = s.messages.find((m) => m.role === "user");
              return (
                <button
                  key={s.sessionId}
                  onClick={() => setActive(s)}
                  className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${active?.sessionId === s.sessionId ? "bg-muted" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{firstUser?.content?.slice(0, 40) || "New visitor"}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{new Date(s.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{last?.content?.slice(0, 55)}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">{s.messages.length} messages</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Transcript */}
        <Card className="p-6 lg:col-span-3">
          {active ? (
            <div className="max-h-[72vh] space-y-4 overflow-y-auto">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Session {active.sessionId.slice(0, 8)} · {new Date(active.updatedAt).toLocaleString()}</p>
              {active.messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-terracotta text-cream" : "bg-foreground text-background"}`}>
                    {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </span>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-terracotta/10 text-foreground" : "bg-muted text-foreground"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-muted-foreground">Select a conversation.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
