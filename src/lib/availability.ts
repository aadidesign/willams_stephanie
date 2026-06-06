import { connectDB } from "./db";
import { Booking } from "./models";
import {
  siteContent,
  ACTIVE_BOOKING_STATUSES,
  type RestaurantTable,
} from "@/content/site";

type BookingLike = { date: string; time: string; status: string; tables?: string[] };

const demoStore = globalThis as unknown as { _demoBookings?: BookingLike[] };

export const ALL_TABLES: RestaurantTable[] = siteContent.booking.tables;

/** Active (table-occupying) bookings for a given date, from DB or demo store. */
export async function getActiveBookings(date: string): Promise<BookingLike[]> {
  const conn = await connectDB();
  if (conn) {
    return (await Booking.find({
      date,
      status: { $in: ACTIVE_BOOKING_STATUSES },
    }).lean()) as unknown as BookingLike[];
  }
  return (demoStore._demoBookings ?? []).filter(
    (b) => b.date === date && ACTIVE_BOOKING_STATUSES.includes(b.status)
  );
}

/** Set of table ids occupied at a specific time. */
export function occupiedAt(bookings: BookingLike[], time: string): Set<string> {
  const set = new Set<string>();
  for (const b of bookings) {
    if (b.time === time) (b.tables ?? []).forEach((t) => set.add(t));
  }
  return set;
}

export function freeTablesAt(bookings: BookingLike[], time: string): RestaurantTable[] {
  const occ = occupiedAt(bookings, time);
  return ALL_TABLES.filter((t) => !occ.has(t.id));
}

/** Best-fit free table for a party (smallest table that still seats everyone). */
export function pickTable(free: RestaurantTable[], partySize: number): RestaurantTable | null {
  const suitable = free
    .filter((t) => t.seats >= partySize)
    .sort((a, b) => a.seats - b.seats);
  return suitable[0] ?? null;
}
