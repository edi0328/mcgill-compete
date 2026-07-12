"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wraps the app so every animation respects the user's OS-level
 * "reduce motion" preference (transforms are disabled, fades remain).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
