import type { Hour } from "@/content/site";

const DAY_ORDER = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

/** Format "HH:mm" (24h) into a friendly "h:mm AM/PM". */
export function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return m === "00" ? `${h} ${ampm}` : `${h}:${m} ${ampm}`;
}

/** Determine whether the venue is currently open, given the hours table. */
export function getOpenStatus(hours: Hour[], now: Date = new Date()) {
  const todayName = DAY_ORDER[now.getDay()];
  const today = hours.find((h) => h.day === todayName);
  if (!today || today.closed) return { open: false, today, label: "Closed today" };

  const [oH, oM] = today.open.split(":").map(Number);
  const [cH, cM] = today.close.split(":").map(Number);
  const mins = now.getHours() * 60 + now.getMinutes();
  const openMins = oH * 60 + oM;
  const closeMins = cH * 60 + cM;

  const open = mins >= openMins && mins < closeMins;
  return {
    open,
    today,
    label: open
      ? `Open now · until ${formatTime(today.close)}`
      : mins < openMins
        ? `Opens at ${formatTime(today.open)}`
        : "Closed now",
  };
}
