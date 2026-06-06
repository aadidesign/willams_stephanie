import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models";
import { getActiveBookings, freeTablesAt, pickTable } from "@/lib/availability";

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string(),
  partySize: z.number().int().min(1).max(50),
  occasion: z.string().optional(),
  notes: z.string().optional(),
  tables: z.array(z.string()).optional(),
  status: z.enum(["pending", "confirmed", "booked", "seated", "cancelled"]).optional(),
  source: z.string().optional(),
});

const demoStore = globalThis as unknown as { _demoBookings?: unknown[]; _bookingRL?: Map<string, number[]> };
demoStore._demoBookings ??= [];
demoStore._bookingRL ??= new Map();

async function isAdmin() {
  const c = await cookies();
  return c.get("bv_admin")?.value === "1";
}

/** Simple in-memory IP rate limiter to prevent reservation spam/abuse. */
function rateLimited(req: Request, max = 6, windowMs = 10 * 60 * 1000): boolean {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const map = demoStore._bookingRL!;
  const hits = (map.get(ip) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  map.set(ip, hits);
  return hits.length > max;
}

export async function POST(req: Request) {
  try {
    const admin = await isAdmin();

    // Anti-abuse: rate-limit public (non-admin) reservation attempts per IP.
    if (!admin && rateLimited(req)) {
      return NextResponse.json(
        { ok: false, error: "Too many booking attempts. Please try again shortly or call us." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = bookingSchema.safeParse({ ...body, partySize: Number(body.partySize) });
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid booking details", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { date, time, partySize } = parsed.data;

    // Resolve table assignment.
    let tables = parsed.data.tables ?? [];
    if (tables.length === 0) {
      // Auto-assign a best-fit free table.
      const active = await getActiveBookings(date);
      const free = freeTablesAt(active, time);
      const table = pickTable(free, partySize);
      if (!table) {
        // No suitable free table — public users get a clear message.
        if (!admin) {
          return NextResponse.json(
            { ok: false, error: "Sorry, that time is fully booked. Please choose another slot." },
            { status: 409 }
          );
        }
      } else {
        tables = [table.id];
      }
    }

    const data = {
      ...parsed.data,
      occasion: parsed.data.occasion || "Casual Dining",
      notes: parsed.data.notes || "",
      tables,
      status: parsed.data.status || (admin ? "booked" : "pending"),
      source: parsed.data.source || (admin ? "phone" : "website"),
    };

    const conn = await connectDB();
    if (conn) {
      const doc = await Booking.create(data);
      return NextResponse.json({ ok: true, booking: doc, persisted: true });
    }

    const demo = { ...data, _id: `demo_${Date.now()}`, createdAt: new Date().toISOString() };
    (demoStore._demoBookings as unknown[]).unshift(demo);
    return NextResponse.json({ ok: true, booking: demo, persisted: false });
  } catch (err) {
    console.error("[api/bookings] POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ ok: true, bookings: demoStore._demoBookings, persisted: false });
    }
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({ ok: true, bookings, persisted: true });
  } catch (err) {
    console.error("[api/bookings] GET error:", err);
    return NextResponse.json({ ok: false, error: "Server error", bookings: [] }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
