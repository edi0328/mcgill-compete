"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Red progress line along the bottom edge of the sticky header, filling
 * left to right - the scroll position indicator (the native scrollbar is
 * hidden, see globals.css). Rendered inside SiteHeader.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40 });
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
