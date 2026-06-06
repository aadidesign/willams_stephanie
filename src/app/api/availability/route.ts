import { NextResponse } from "next/server";
import { siteContent } from "@/content/site";
import { getActiveBookings, freeTablesAt, ALL_TABLES } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const partySize = Number(searchParams.get("partySize") || 0);
  const slots = siteContent.booking.timeSlots;

  if (!date) {
    return NextResponse.json({ ok: false, error: "date required" }, { status: 400 });
  }

  try {
    const bookings = await getActiveBookings(date);

    const result = slots.map((time) => {
      const free = freeTablesAt(bookings, time);
      const suitable = partySize > 0 ? free.filter((t) => t.seats >= partySize) : free;
      const occupiedIds = ALL_TABLES.filter((t) => !free.some((f) => f.id === t.id)).map((t) => t.id);
      return {
        time,
        available: suitable.length > 0,
        remaining: suitable.length,
        freeTables: free.map((t) => t.id),
        occupiedTables: occupiedIds,
      };
    });

    return NextResponse.json({ ok: true, date, tables: ALL_TABLES, slots: result });
  } catch (err) {
    console.error("[api/availability] error:", err);
    // Fail open so the public form still works.
    return NextResponse.json({
      ok: true,
      date,
      tables: ALL_TABLES,
      slots: slots.map((time) => ({ time, available: true, remaining: ALL_TABLES.length, freeTables: ALL_TABLES.map((t) => t.id), occupiedTables: [] })),
    });
  }
}

export const dynamic = "force-dynamic";
