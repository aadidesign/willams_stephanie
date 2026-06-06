"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { siteContent, ACTIVE_BOOKING_STATUSES } from "@/content/site";
import { formatTime } from "@/lib/hours";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
const { tables, timeSlots } = siteContent.booking;

export function FloorView({ bookings }: { bookings: any[] }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // occupancy[time][tableId] = booking
  const { occupancy, dayBookings } = useMemo(() => {
    const day = bookings.filter(
      (b) => b.date === date && ACTIVE_BOOKING_STATUSES.includes(b.status)
    );
    const occ: Record<string, Record<string, any>> = {};
    for (const b of day) {
      for (const t of b.tables ?? []) {
        occ[b.time] = occ[b.time] || {};
        occ[b.time][t] = b;
      }
    }
    return { occupancy: occ, dayBookings: day };
  }, [bookings, date]);

  const totalSeatsBooked = dayBookings.reduce((s, b) => s + (b.partySize || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground">Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 w-44" />
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">{dayBookings.length} bookings</span>
          <span className="text-muted-foreground">{totalSeatsBooked} covers</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-terracotta" /> Booked</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm border border-input bg-background" /> Free</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-muted/70 p-2 text-left font-medium">Time</th>
              {tables.map((t) => (
                <th key={t.id} className="border-l p-2 text-center font-medium">
                  <div>{t.id}</div>
                  <div className="text-[10px] font-normal text-muted-foreground">{t.seats}p</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className="border-t">
                <td className="sticky left-0 z-10 whitespace-nowrap bg-background p-2 font-medium">{formatTime(time)}</td>
                {tables.map((t) => {
                  const b = occupancy[time]?.[t.id];
                  return (
                    <td key={t.id} className="border-l p-1">
                      <div
                        title={b ? `${b.name} · party ${b.partySize} · ${b.status}` : `${t.id} free`}
                        className={cn(
                          "flex h-8 items-center justify-center rounded-sm text-[10px]",
                          b ? "bg-terracotta font-medium text-cream" : "bg-background"
                        )}
                      >
                        {b ? b.name.split(" ")[0].slice(0, 6) : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Hover a cell for guest details. Phone &amp; walk-in bookings you add appear here instantly, blocking that table for the chosen time so the website can&apos;t double-book it.</p>
    </div>
  );
}
