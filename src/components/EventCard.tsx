import type { ComponentType } from "react";
import { Laptop, MessagesSquare, Trophy, Users } from "lucide-react";
import { LevelTag } from "@/components/Badge";
import { BinaryTreeIcon } from "@/components/EventIcons";
import { InlineLinks } from "@/components/InlineLinks";
import { eventDateParts } from "@/lib/events";
import { isReal } from "@/lib/placeholders";
import type { ClubEvent, EventLinks, EventType } from "@/types/content";

const linkLabels: Record<keyof EventLinks, string> = {
  slides: "slides",
  problems: "problems",
  editorial: "editorial",
  contest: "contest",
  rsvp: "rsvp",
  discord: "announcement",
};

type EventIcon = ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

/** One glyph per event family, inline next to the title - no tile, no box. */
const typeIcons: Record<EventType, EventIcon> = {
  "Beginner training": BinaryTreeIcon,
  "Advanced training": BinaryTreeIcon,
  "ICPC team practice": BinaryTreeIcon,
  "Practice contest": Laptop,
  "Club contest": Laptop,
  "External contest": Laptop,
  "ICPC qualifier": Trophy,
  "Contest review": MessagesSquare,
  "Social / kickoff": Users,
  "Mock interviews": MessagesSquare,
};

/**
 * The left timetable slot: two stacked mono lines. Confirmed dates render
 * "thu apr 2" over "18:00–19:30"; unconfirmed ones render the `timing`
 * string split at "·" ("sept" over "date tba") - TBA is data, not apology.
 */
function whenLines(event: ClubEvent): [string, string?] {
  if (event.date) {
    const d = eventDateParts(event.date);
    const line1 = `${d.weekday} ${d.monthYear.split(" ")[0]} ${d.day}`.toLowerCase();
    const line2 =
      event.startTime && event.endTime
        ? `${event.startTime}–${event.endTime}`
        : undefined;
    return [line1, line2];
  }
  const [first, ...rest] = (event.timing ?? "date tba").split("·");
  return [first.trim(), rest.join("·").trim() || undefined];
}

/**
 * One timetable row: mono when-column on the left, then title (with an
 * inline type glyph and a bare level tag), description, and links.
 * Rows are separated by hairline rules from the parent (`divide-y`) -
 * no cards, no borders of its own.
 *
 * `compact` is the home-page teaser layer: date, icon, title, and the
 * one-line description only. The full layout (level, room/host, links) is
 * kept for a future schedule/archive page.
 */
export function EventCard({
  event,
  compact = false,
}: {
  event: ClubEvent;
  compact?: boolean;
}) {
  const links = (Object.entries(event.links ?? {}) as [keyof EventLinks, string][]).map(
    ([key, url]) => ({ label: linkLabels[key], url }),
  );
  const Icon = typeIcons[event.type];
  const [when1, when2] = whenLines(event);
  const place = [
    isReal(event.location) ? event.location : undefined,
    isReal(event.host) ? `hosted by ${event.host}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="grid gap-x-6 gap-y-2 py-6 sm:grid-cols-[11ch_1fr]">
      <div className="font-mono leading-relaxed">
        <span className="block text-[12px] font-semibold text-fg">{when1}</span>
        {when2 && (
          <span className="block text-[12px] text-fg-faint">
            {when2}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Icon size={18} strokeWidth={1.75} className="shrink-0 text-fg-muted" />
          <h3 className="text-base font-semibold tracking-tight">
            {event.title}
          </h3>
          {!compact && <LevelTag level={event.level} />}
        </div>
        <p className="mt-1 pl-7 text-base leading-relaxed text-fg-muted">
          {event.description}
        </p>
        {!compact && place && (
          <p className="mt-2 pl-7 font-mono text-[12px] text-fg-faint">{place}</p>
        )}
        {!compact && links.length > 0 && (
          <InlineLinks links={links} className="mt-2 pl-7" />
        )}
      </div>
    </article>
  );
}
