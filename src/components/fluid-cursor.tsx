"use client";
import { useEffect } from "react";

import fluidCursor from "@/hooks/useFluidCursor";

const FluidCursor = () => {
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;
