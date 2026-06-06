import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
  type: z.string().optional(),
});

const demoStore = globalThis as unknown as { _demoMessages?: unknown[] };
demoStore._demoMessages ??= [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
    }

    const data = {
      ...parsed.data,
      phone: parsed.data.phone || "",
      subject: parsed.data.subject || "General Enquiry",
      type: parsed.data.type || "contact",
      read: false,
    };

    const conn = await connectDB();
    if (conn) {
      const doc = await Message.create(data);
      return NextResponse.json({ ok: true, message: doc, persisted: true });
    }

    const demo = { ...data, _id: `demo_${Date.now()}`, createdAt: new Date().toISOString() };
    (demoStore._demoMessages as unknown[]).unshift(demo);
    return NextResponse.json({ ok: true, message: demo, persisted: false });
  } catch (err) {
    console.error("[api/contact] error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ ok: true, messages: demoStore._demoMessages, persisted: false });
    }
    const messages = await Message.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ ok: true, messages, persisted: true });
  } catch (err) {
    console.error("[api/contact] GET error:", err);
    return NextResponse.json({ ok: false, messages: [] }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
