import { events } from "@/content/events";
import type { ClubEvent } from "@/types/content";

/** Parse "YYYY-MM-DD" as a local date (avoids UTC off-by-one). */
function toLocalDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function upcomingEvents(limit?: number): ClubEvent[] {
  const today = startOfToday();
  // Undated ("coming soon") events keep their content-file order and lead
  // the list; confirmed dates follow, soonest first.
  const undated = events.filter((e) => !e.date);
  const dated = events
    .filter((e): e is ClubEvent & { date: string } => !!e.date)
    .filter((e) => toLocalDate(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = [...undated, ...dated];
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function pastEvents(): ClubEvent[] {
  const today = startOfToday();
  return events
    .filter((e): e is ClubEvent & { date: string } => !!e.date)
    .filter((e) => toLocalDate(e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function eventDateParts(isoDate: string): {
  weekday: string;
  day: string;
  monthYear: string;
} {
  const d = toLocalDate(isoDate);
  return {
    weekday: d.toLocaleDateString("en-CA", { weekday: "short" }),
    day: String(d.getDate()),
    monthYear: d.toLocaleDateString("en-CA", { month: "short", year: "numeric" }),
  };
}

export function formatEventDate(isoDate: string): string {
  return toLocalDate(isoDate).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
