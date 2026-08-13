"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gentle text-decrypt effect: each character shows a single glitch glyph for
 * a beat, then settles, sweeping left to right (~715ms total). Deterministic
 * and deliberately weak - one brief shimmer, not a glitch storm. Plays once.
 * Used in exactly two places: the home hero H1 (immediate) and the home
 * "what we do" section title (on scroll, via Section's `scramble` prop).
 * The full text renders immediately for no-JS users, screen readers, and
 * under prefers-reduced-motion; the animated string is one text node, so
 * words can never break mid-word during the effect.
 */

const GLITCH_CHARS = "<>-_/\\*+";
const CHAR_STAGGER_MS = 26.4; // when each character starts, left to right
const CHAR_GLITCH_MS = 66; // how long a character glitches before settling
const TOTAL_MS = 715;
const SWAP_MS = 66; // one glyph swap per glitch window

export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  immediate = false,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
  /** Start on mount instead of waiting for the viewport (above-the-fold). */
  immediate?: boolean;
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const run = () => {
      if (started.current) return;
      started.current = true;

      // Deterministic left-to-right sweep, capped so the whole line settles
      // within TOTAL_MS even for long text.
      const stagger = Math.min(
        CHAR_STAGGER_MS,
        (TOTAL_MS - CHAR_GLITCH_MS) / Math.max(text.length, 1),
      );
      const chars = Array.from(text);
      let t0 = 0;

      const step = (now: number) => {
        if (!t0) t0 = now;
        const t = now - t0;
        let out = "";
        let done = 0;
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          const start = i * stagger;
          if (c.trim() === "" || t >= start + CHAR_GLITCH_MS) {
            done++;
            out += c;
          } else if (t >= start) {
            const swap = Math.floor((t - start) / SWAP_MS);
            out += GLITCH_CHARS[(i * 5 + swap * 3) % GLITCH_CHARS.length];
          } else {
            out += " ";
          }
        }
        setDisplay(out);
        if (done < chars.length) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    if (immediate) {
      run();
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, immediate]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
