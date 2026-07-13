"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * The club gem in real 3D: hexagonal prism with pyramid caps, flat-shaded
 * McGill red, "CP" wrapped around the side faces. Auto-spins slowly; drag to
 * throw it. Loaded client-side only (see HeroVisuals.tsx); fades in on its
 * first WebGL frame so nothing else ever paints in its place. Rendering
 * pauses while offscreen or when the tab is hidden.
 * Decorative — hidden from screen readers.
 */

const RED = "#e51c31";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Red side texture with "CP" once per face (6 faces wrap u = 0..1). */
function makeSideTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1536; // 256 px per face
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = RED;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const sans = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-space-grotesk")
    .trim();
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 150px ${sans || "sans-serif"}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.translate(128 + i * 256, 138);
    ctx.transform(1, 0, -0.22, 1, 0, 0); // italic slant, like the flat logo
    ctx.fillText("CP", 0, 0);
    ctx.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Gem() {
  // Opt out of the React Compiler: the drag/spin refs and canvas texture are
  // imperative three.js patterns its memo analysis can't reason about.
  "use no memo";
  const group = useRef<THREE.Group>(null);
  const reduced = useMemo(prefersReducedMotion, []);
  const spin = useRef(reduced ? 0 : 0.0016);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastScrollY = useRef<number | null>(null);

  const sideTexture = useMemo(() => makeSideTexture(), []);
  const baseSpin = spin.current;

  useFrame(() => {
    if (!group.current) return;

    // scroll turns the gem — user-driven, so allowed even under reduced motion
    const scrollY = window.scrollY;
    if (lastScrollY.current === null) lastScrollY.current = scrollY;
    const scrollDelta = scrollY - lastScrollY.current;
    lastScrollY.current = scrollY;
    group.current.rotation.y += scrollDelta * 0.006;

    if (!dragging.current) {
      group.current.rotation.y += spin.current;
      // ease any thrown momentum back to the idle speed
      spin.current += (baseSpin - spin.current) * 0.02;
    }
  });

  return (
    <group
      ref={group}
      rotation={[0.16, 0, 0]}
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        (e.target as Element).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current || !group.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        group.current.rotation.y += dx * 0.012;
        spin.current = dx * 0.012;
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      {/* prism body — material slots: [side, top cap, bottom cap] */}
      <mesh>
        <cylinderGeometry args={[1, 1, 1.15, 6, 1]} />
        <meshLambertMaterial attach="material-0" map={sideTexture} flatShading />
        <meshLambertMaterial attach="material-1" color={RED} flatShading />
        <meshLambertMaterial attach="material-2" color={RED} flatShading />
      </mesh>
      {/* pyramid caps */}
      <mesh position={[0, 0.875, 0]}>
        <coneGeometry args={[1, 0.6, 6]} />
        <meshLambertMaterial color={RED} flatShading />
      </mesh>
      <mesh position={[0, -0.875, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1, 0.6, 6]} />
        <meshLambertMaterial color={RED} flatShading />
      </mesh>
    </group>
  );
}

export default function GemCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [ready, setReady] = useState(false);

  // Stop the render loop while the gem is offscreen or the tab is hidden.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    let visible = true;
    let onscreen = true;
    const update = () => setFrameloop(visible && onscreen ? "always" : "never");
    const observer = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    const onVisibility = () => {
      visible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      // pan-y: vertical swipes keep scrolling the page; horizontal drags
      // reach the pointer handlers so touch users can spin the gem too.
      className={`h-[270px] w-[270px] cursor-grab touch-pan-y transition-opacity duration-200 ease-out active:cursor-grabbing sm:h-[340px] sm:w-[330px] ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={frameloop}
        camera={{ position: [0, 0.35, 3.9], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 5, 6]} intensity={1.5} />
        <directionalLight position={[-5, -2, 3]} intensity={0.4} />
        <Gem />
      </Canvas>
    </div>
  );
}
