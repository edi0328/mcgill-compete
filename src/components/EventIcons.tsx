import type { SVGProps } from "react";

/**
 * Custom event icons in lucide's stroke style (24×24 grid, round caps,
 * r=2.5 circle nodes like GitFork), for event families where lucide has
 * no representative glyph.
 */

/**
 * Binary tree - a root with two children, the canonical CS hierarchy mark.
 * Three nodes keep the glyph unambiguous at 16–18px; edges are trimmed to
 * the circle boundaries so strokes never overlap. The training-session icon.
 */
export function BinaryTreeIcon({
  size = 24,
  strokeWidth = 2,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* root */}
      <circle cx="12" cy="5" r="2.5" />
      {/* children */}
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      {/* edges */}
      <line x1="10.9" y1="7.2" x2="6.1" y2="16.8" />
      <line x1="13.1" y1="7.2" x2="17.9" y2="16.8" />
    </svg>
  );
}
