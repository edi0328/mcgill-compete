import { StaggerGrid, StaggerItem } from "@/components/AnimatedSection";
import { VerifyBadge } from "@/components/Badge";
import type { TimelineItem } from "@/types/content";

/** Vertical milestone timeline for the Hall of Fame page. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <StaggerGrid className="max-w-2xl border-l border-line pl-6">
      {items.map((item, i) => (
        <StaggerItem key={`${item.year}-${i}`} className="relative pb-8 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-paper"
          />
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-accent">{item.year}</span>
            <VerifyBadge verified={item.verified} />
          </div>
          <p className="mt-2 text-sm text-fg-muted">{item.text}</p>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
