import type { EventLevel, EventType } from "@/types/content";

/** Levels use Codeforces rating colors - gray/green/blue/red. */
const levelTextColor: Record<EventLevel, string> = {
  "Open to all": "text-cf-gray",
  Beginner: "text-cf-green",
  Intermediate: "text-cf-blue",
  Advanced: "text-cf-red",
};

/** Level as bare Codeforces-colored mono text - used in timetable rows. */
export function LevelTag({ level }: { level: EventLevel }) {
  return (
    <span className={`font-mono text-[11px] ${levelTextColor[level]}`}>
      {level.toLowerCase()}
    </span>
  );
}

export function TypeBadge({ type }: { type: EventType | string }) {
  return (
    <span className="inline-block rounded border border-line bg-paper-deep px-2 py-1 font-mono text-[11px] text-fg-muted">
      {type.toLowerCase()}
    </span>
  );
}

/** Shown on Hall of Fame entries that still need a source. */
export function VerifyBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-block rounded border border-ac/40 px-2 py-1 font-mono text-[11px] text-ac">
        verified
      </span>
    );
  }
  return (
    <span className="inline-block rounded border border-accent/40 px-2 py-1 font-mono text-[11px] text-accent-soft">
      TODO: verify
    </span>
  );
}
