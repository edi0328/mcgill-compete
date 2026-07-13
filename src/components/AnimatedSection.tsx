"use client";

import { motion, useScroll, useTransform } from "motion/react";
import {
  Children,
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

/**
 * The site's only scroll-animation primitives. Keep animation logic here —
 * don't add per-component motion code elsewhere.
 *
 * <AnimatedSection>              — reveals a block when it scrolls into view.
 * <StaggerGrid> + <StaggerItem>  — reveal a list one item at a time.
 * <Parallax>                     — drifts children slower than the scroll.
 *
 * Server HTML ships fully visible (no-JS users, crawlers, and pre-hydration
 * paints see everything). On mount, blocks below the fold get
 * data-reveal="pending" (hidden via CSS gated on prefers-reduced-motion),
 * and one shared IntersectionObserver flips them to "in" as they approach
 * the viewport. Everything reveals from y:8px — no direction variants.
 *
 * Reveals are deliberately fast (400ms) so they never gate reading; primary
 * body text (e.g. home About paragraphs) is never wrapped in a reveal at
 * all (NN/g, July 2026 decision).
 */

const STAGGER_MS = 70;
const STAGGER_CAP_MS = 210;

let sharedObserver: IntersectionObserver | null = null;

function observe(el: HTMLElement) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
  }
  sharedObserver.observe(el);
}

/** Hide-then-reveal only when it can't strand content: JS is running,
 *  motion is allowed, and the block starts below the fold. */
function useReveal(delayMs: number) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.style.setProperty("--reveal-delay", `${delayMs}ms`);
    el.setAttribute("data-reveal", "pending");
    observe(el);
    return () => sharedObserver?.unobserve(el);
  }, [delayMs]);
  return ref;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds, kept for call-site compatibility. */
  delay?: number;
  /** Deprecated: all reveals come from below now. Accepted and ignored. */
  from?: "up" | "left" | "right" | "scale";
}) {
  const ref = useReveal(Math.round(delay * 1000));
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const StaggerDelay = createContext(0);

export function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // Index-based stagger via --reveal-delay per item, capped so long lists
  // don't waterfall.
  return (
    <div className={className}>
      {Children.map(children, (child, i) => (
        <StaggerDelay.Provider value={Math.min(i * STAGGER_MS, STAGGER_CAP_MS)}>
          {child}
        </StaggerDelay.Provider>
      ))}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** Deprecated: all reveals come from below now. Accepted and ignored. */
  from?: "up" | "left" | "right" | "scale";
}) {
  const delayMs = useContext(StaggerDelay);
  const ref = useReveal(delayMs);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Children drift vertically as the block crosses the viewport. */
export function Parallax({
  children,
  className,
  offset = 16,
}: {
  children: ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
