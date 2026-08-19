import {
  AnimatedSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/AnimatedSection";
import { fallEvents } from "@/content/fallEvents";

/** The Fall 2026 event list + Qualifier footnote, shared by home and sponsorship. */
export function FallEventsList() {
  return (
    <>
      <StaggerGrid className="divide-y divide-line border-y border-line">
        {fallEvents.map((e) => (
          <StaggerItem key={e.title}>
            <div className="py-6 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-x-4">
              <p className="font-mono text-[12px] text-fg-muted">{e.date}</p>
              <div className="mt-2 sm:mt-0">
                <h3 className="text-base font-semibold tracking-tight">
                  {e.title}
                </h3>
                <p className="mt-1 max-w-[65ch] text-base leading-relaxed text-fg-muted">
                  {e.text}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
      <AnimatedSection>
        <p className="mt-4 font-mono text-[12px] text-fg-faint">
          * ICPC sets the exact Qualifier date. We will pass it on to sponsors
          as soon as it is announced.
        </p>
      </AnimatedSection>
    </>
  );
}
