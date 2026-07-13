import { StaggerGrid, StaggerItem } from "@/components/AnimatedSection";
import { isReal } from "@/lib/placeholders";
import type { RoadmapStep } from "@/types/content";

/**
 * Numbered step list — used for getting started and both roadmaps.
 * Steps hang off a hairline rule under each number, so the list reads as
 * one connected path rather than a stack of boxes.
 */
export function RoadmapList({ steps }: { steps: RoadmapStep[] }) {
  return (
    <StaggerGrid className="max-w-2xl">
      {steps.map((step, i) => (
        <StaggerItem key={step.title}>
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <span className="pt-1 font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="mt-2 w-px flex-1 bg-line" />
              )}
            </div>
            <div className={i < steps.length - 1 ? "pb-7" : undefined}>
              <h3 className="font-semibold leading-snug tracking-tight">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-fg-muted">{step.description}</p>
              {step.link && isReal(step.link.url) && (
                <a
                  href={step.link.url}
                  className="mt-2 inline-block font-mono text-[12px] text-cf-blue hover:underline"
                >
                  [{step.link.label}]
                </a>
              )}
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
