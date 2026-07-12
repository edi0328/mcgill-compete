"use client";

import dynamic from "next/dynamic";
import { Logo3D } from "@/components/Logo3D";

/**
 * Client-only three.js visuals for the home hero. WebGL can't render on the
 * server, so both load dynamically; the CSS gem (Logo3D) shows until the
 * real one is ready — and stays as the no-JS fallback.
 */

export const GemCanvas = dynamic(() => import("@/components/GemCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[270px] w-[270px] items-center justify-center sm:h-[340px] sm:w-[330px]">
      <Logo3D size={240} />
    </div>
  ),
});
