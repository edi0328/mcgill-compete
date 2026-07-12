import { VerifyBadge } from "@/components/Badge";
import { InlineLinks } from "@/components/InlineLinks";
import type { HallOfFameEntry } from "@/types/content";

export function HallOfFameCard({ entry }: { entry: HallOfFameEntry }) {
  return (
    <article className="rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[13px] text-fg-muted">
          <span className="text-accent">{entry.year}</span> · {entry.competition}
        </p>
        <VerifyBadge verified={entry.verified} />
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight">{entry.teamName}</h3>
      <p className="mt-1 font-mono text-sm text-fg">{entry.placement}</p>

      <dl className="mt-4 space-y-1 text-sm text-fg-muted">
        <div>
          <dt className="inline font-mono text-[12px] text-fg-faint">members: </dt>
          <dd className="inline">{entry.members.join(", ")}</dd>
        </div>
        {entry.coach && (
          <div>
            <dt className="inline font-mono text-[12px] text-fg-faint">coach: </dt>
            <dd className="inline">{entry.coach}</dd>
          </div>
        )}
        {entry.qualification && (
          <div>
            <dt className="inline font-mono text-[12px] text-fg-faint">qualified via: </dt>
            <dd className="inline">{entry.qualification}</dd>
          </div>
        )}
      </dl>

      {entry.sourceLink && (
        <InlineLinks links={[{ label: "source", url: entry.sourceLink }]} className="mt-3" />
      )}
    </article>
  );
}
