import type { CSSProperties } from "react";

/**
 * CSS-only 3D club mark matching the hexagonal CP logo: a hexagonal prism
 * with pyramid caps on top and bottom, red facets, white italic "CP" on the
 * side faces. Spins slowly around its vertical axis; pauses under
 * prefers-reduced-motion (see .gem-spin in globals.css). Decorative only.
 */

// Per-facet reds - static shades that read as lighting as the gem turns.
const SIDE_REDS = ["#f4404f", "#e51c31", "#c11226", "#970d1d", "#c11226", "#e51c31"];
const TOP_REDS = ["#ff5a66", "#f23a49", "#d31f31", "#b31424", "#d31f31", "#f23a49"];
const BOTTOM_REDS = ["#c9182a", "#ab1122", "#8c0c1a", "#700915", "#8c0c1a", "#ab1122"];

export function Logo3D({ size = 150 }: { size?: number }) {
  const s = size / 2; // hexagon side length (= circumradius)
  const a = (s * Math.sqrt(3)) / 2; // apothem: distance from axis to each face
  const h = s * 1.15; // prism height
  const ph = s * 0.6; // pyramid cap height
  const l = Math.sqrt(ph * ph + a * a); // cap face slant height
  const beta = (Math.atan(a / ph) * 180) / Math.PI; // cap face tilt

  const face = (i: number): CSSProperties => ({
    position: "absolute",
    left: s / 2,
    width: s,
    backfaceVisibility: "hidden",
    transform: `rotateY(${i * 60}deg) translateZ(${a}px)`,
  });

  return (
    <div aria-hidden="true" style={{ perspective: size * 5 }}>
      <div style={{ transform: "rotateX(-16deg)", transformStyle: "preserve-3d" }}>
        <div className="gem-spin relative" style={{ width: s * 2, height: h + 2 * ph }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              {/* prism side */}
              <div
                style={{
                  ...face(i),
                  top: ph,
                  height: h,
                  background: `linear-gradient(180deg, ${SIDE_REDS[i]}, ${BOTTOM_REDS[i]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="font-sans font-semibold italic text-white"
                  style={{ fontSize: s * 0.5, textShadow: "0 2px 6px rgba(0,0,0,0.25)" }}
                >
                  CP
                </span>
              </div>
              {/* top pyramid facet */}
              <div
                style={{
                  ...face(i),
                  top: ph - l,
                  height: l,
                  transformOrigin: "50% 100%",
                  transform: `rotateY(${i * 60}deg) translateZ(${a}px) rotateX(${beta}deg)`,
                  clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                  background: TOP_REDS[i],
                }}
              />
              {/* bottom pyramid facet */}
              <div
                style={{
                  ...face(i),
                  top: ph + h,
                  height: l,
                  transformOrigin: "50% 0%",
                  transform: `rotateY(${i * 60}deg) translateZ(${a}px) rotateX(${-beta}deg)`,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: BOTTOM_REDS[i],
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
