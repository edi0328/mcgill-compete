import type { ReactNode } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";

/**
 * Standard page section: mono "01 // label" kicker + heading + content,
 * revealed on scroll.
 *
 * `tone="surface"` puts the section on a full-width raised band — alternate
 * it with default sections so long pages read as chapters, not one scroll.
 * Avoid two surface sections back-to-back (their borders double up).
 * `flush` tightens the vertical padding for short CTA-style sections.
 */
export function Section({
  number,
  label,
  title,
  children,
  intro,
  tone = "default",
  flush = false,
}: {
  number: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
  tone?: "default" | "surface";
  flush?: boolean;
}) {
  const inner = (
    <section
      className={`mx-auto max-w-5xl px-4 sm:px-6 ${
        flush ? "py-10 sm:py-12" : "py-14 sm:py-16"
      }`}
    >
      <AnimatedSection>
        <p className="kicker">
          <span className="text-accent">{number}</span>{` // ${label}`}
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
          {title}
        </h2>
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
