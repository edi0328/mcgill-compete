import type { SVGProps } from "react";

/**
 * Custom event icons in lucide's stroke style (24×24 grid, round caps),
 * for event families where lucide has no representative glyph.
 */

/**
 * Bipartite graph — K(2,2): two nodes per side, all four edges, so the mark
 * reads as two rails with a clean X crossing even at 16–18px. The
 * training-session icon: a nod to flow algorithms and matchings.
 */
export function BipartiteIcon({
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
      {/* left column */}
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      {/* right column */}
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      {/* rails */}
      <line x1="7.5" y1="6" x2="16.5" y2="6" />
      <line x1="7.5" y1="18" x2="16.5" y2="18" />
      {/* crossing */}
      <line x1="7" y1="7.7" x2="17" y2="16.3" />
      <line x1="7" y1="16.3" x2="17" y2="7.7" />
    </svg>
  );
}
