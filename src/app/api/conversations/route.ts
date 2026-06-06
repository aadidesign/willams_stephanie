import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ChatLog } from "@/lib/models";

const logSchema = z.object({
  sessionId: z.string().min(6).max(80),
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const demo = globalThis as unknown as { _demoChatLogs?: Array<Record<string, unknown>> };
demo._demoChatLogs ??= [];

async function isAdmin() {
  const c = await cookies();
  return c.get("bv_admin")?.value === "1";
}

// Append a single message to the transcript (called by the chat widget).
export async function POST(req: Request) {
  try {
    const parsed = logSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

    const entry = { ...parsed.data, createdAt: new Date().toISOString() };
    const conn = await connectDB();
    if (conn) {
      await ChatLog.create(parsed.data);
      return NextResponse.json({ ok: true, persisted: true });
    }
    demo._demoChatLogs!.push(entry);
    return NextResponse.json({ ok: true, persisted: false });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Admin: fetch transcripts grouped by session.
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const conn = await connectDB();
    const rows = conn
      ? ((await ChatLog.find().sort({ createdAt: 1 }).limit(2000).lean()) as unknown as Array<Record<string, unknown>>)
      : demo._demoChatLogs!;

    const map = new Map<string, { sessionId: string; messages: Array<Record<string, unknown>>; updatedAt: string }>();
    for (const r of rows) {
      const sid = String(r.sessionId);
      if (!map.has(sid)) map.set(sid, { sessionId: sid, messages: [], updatedAt: String(r.createdAt) });
      const g = map.get(sid)!;
      g.messages.push(r);
      g.updatedAt = String(r.createdAt);
    }
    const sessions = [...map.values()].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    return NextResponse.json({ ok: true, sessions });
  } catch {
    return NextResponse.json({ ok: false, sessions: [] }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
