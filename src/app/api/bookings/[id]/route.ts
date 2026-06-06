import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models";

async function isAdmin() {
  const c = await cookies();
  return c.get("bv_admin")?.value === "1";
}

const demoStore = globalThis as unknown as { _demoBookings?: Array<Record<string, unknown>> };

const EDITABLE = ["status", "tables", "date", "time", "partySize", "occasion", "notes", "name", "phone", "email"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  // Only allow whitelisted fields.
  const update: Record<string, unknown> = {};
  for (const k of EDITABLE) if (k in body) update[k] = body[k];

  const conn = await connectDB();
  if (conn) {
    const doc = await Booking.findByIdAndUpdate(id, update, { new: true }).lean();
    return NextResponse.json({ ok: true, booking: doc });
  }
  const list = demoStore._demoBookings ?? [];
  const b = list.find((x) => x._id === id);
  if (b) Object.assign(b, update);
  return NextResponse.json({ ok: true, booking: b });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;

  const conn = await connectDB();
  if (conn) {
    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  }
  if (demoStore._demoBookings) {
    demoStore._demoBookings = demoStore._demoBookings.filter((x) => x._id !== id);
  }
  return NextResponse.json({ ok: true });
}

export const dynamic = "force-dynamic";
