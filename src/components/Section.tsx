import type { ReactNode } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ScrambleText } from "@/components/ScrambleText";

/**
 * Standard page section: heading + content, revealed on scroll.
 *
 * `tone="surface"` puts the section on a full-width raised band — alternate
 * it with default sections so long pages read as chapters, not one scroll.
 * Avoid two surface sections back-to-back (their borders double up).
 * `flush` tightens the vertical padding for short CTA-style sections.
 * `scramble` plays the ScrambleText decrypt on the title when it scrolls
 * into view — used on exactly one section (home "what we do") so the effect
 * stays a moment, not a pattern.
 */
export function Section({
  title,
  children,
  intro,
  tone = "default",
  flush = false,
  scramble = false,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  tone?: "default" | "surface";
  flush?: boolean;
  scramble?: boolean;
}) {
  const headingClass = "font-display text-2xl tracking-tight sm:text-3xl";
  const inner = (
    <section
      className={`mx-auto max-w-5xl px-4 sm:px-6 ${
        flush ? "py-10 sm:py-12" : "py-14 sm:py-16"
      }`}
    >
      <AnimatedSection>
        {scramble ? (
          <ScrambleText as="h2" text={title} className={headingClass} />
        ) : (
          <h2 className={headingClass}>{title}</h2>
        )}
        {intro && <p className="mt-3 max-w-2xl text-[15px] text-fg-muted">{intro}</p>}
      </AnimatedSection>
      <div className="mt-8">{children}</div>
    </section>
  );
  if (tone === "surface") {
    return <div className="border-y border-line bg-surface">{inner}</div>;
  }
  return inner;
}
