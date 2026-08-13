import { LevelTag } from "@/components/Badge";
import { InlineLinks } from "@/components/InlineLinks";
import { isReal } from "@/lib/placeholders";
import type { PastMaterial } from "@/types/content";

/**
 * One archived session as a timetable row: mono semester/week slot on the
 * left, topic + level, then material links (or a coming-soon note). Rows are
 * separated by hairline rules from the parent (`divide-y`) - no cards.
 */
export function MaterialRow({ material }: { material: PastMaterial }) {
  const links = [
    material.slides && { label: "slides", url: material.slides },
    material.problems && { label: "problems", url: material.problems },
    material.solutions && { label: "solutions", url: material.solutions },
    material.recording && { label: "recording", url: material.recording },
  ].filter(Boolean) as { label: string; url: string }[];
  const hasRealLinks = links.some((link) => isReal(link.url));

  return (
    <div className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[11ch_1fr]">
      <div className="font-mono leading-relaxed">
        <span className="block text-[12px] font-semibold text-fg">
          {material.semester.toLowerCase()}
        </span>
        <span className="block text-[12px] text-fg-faint">
          {material.week.toLowerCase()}
        </span>
      </div>
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-semibold tracking-tight">{material.topic}</span>
          <LevelTag level={material.level} />
        </div>
        {hasRealLinks ? (
          <InlineLinks links={links} />
        ) : (
          <span className="font-mono text-[12px] text-fg-faint">
            materials coming soon
          </span>
        )}
      </div>
    </div>
  );
}
