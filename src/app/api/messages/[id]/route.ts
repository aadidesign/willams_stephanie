import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { Message } from "@/lib/models";

async function isAdmin() {
  const c = await cookies();
  return c.get("bv_admin")?.value === "1";
}

const demoStore = globalThis as unknown as { _demoMessages?: Array<Record<string, unknown>> };

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const { read } = await req.json();

  const conn = await connectDB();
  if (conn) {
    const doc = await Message.findByIdAndUpdate(id, { read }, { new: true }).lean();
    return NextResponse.json({ ok: true, message: doc });
  }
  const m = (demoStore._demoMessages ?? []).find((x) => x._id === id);
  if (m) m.read = read;
  return NextResponse.json({ ok: true, message: m });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;

  const conn = await connectDB();
  if (conn) {
    await Message.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  }
  if (demoStore._demoMessages) {
    demoStore._demoMessages = demoStore._demoMessages.filter((x) => x._id !== id);
  }
  return NextResponse.json({ ok: true });
}

export const dynamic = "force-dynamic";
