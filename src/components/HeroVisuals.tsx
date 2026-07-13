"use client";

import dynamic from "next/dynamic";
import { Logo3D } from "@/components/Logo3D";

/**
 * Client-only three.js visuals for the home hero. WebGL can't render on the
 * server, so the canvas loads dynamically. While the chunk loads, the box
 * stays empty at its final size — showing the CSS gem first read as a
 * "wrong version" flashing before the real one. <noscript> keeps the CSS
 * gem for no-JS users and crawlers, where the canvas never arrives.
 */

const Canvas3D = dynamic(() => import("@/components/GemCanvas"), {
  ssr: false,
  loading: () => null,
});

export function GemCanvas() {
  return (
    <div className="h-[270px] w-[270px] sm:h-[340px] sm:w-[330px]">
      <Canvas3D />
      <noscript>
        <div className="flex h-full w-full items-center justify-center">
          <Logo3D size={240} />
        </div>
      </noscript>
    </div>
  );
}
