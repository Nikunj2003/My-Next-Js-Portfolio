"use client";
import { useEffect, useState } from "react";

import fluidCursor from "@/hooks/useFluidCursor";

const FluidCursor = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Only render on desktop with pointer devices (not touch-only)
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    const isDesktop = window.innerWidth >= 1024;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setShouldRender(hasPointer && isDesktop && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    fluidCursor();
    // Note: fluidCursor doesn't provide a cleanup mechanism
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;
