import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function PageTransitionAnimation() {
  const prefersReducedMotion = useReducedMotion();

  // Match media query for mobile detection (less resize churn than full resize listener)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639.9px)");
    const apply = () => setIsMobile(mq.matches);
    apply(); // initial
    const handler = () => apply();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Detect low resource devices (very rough heuristic) to lighten effect even on desktop.
  const [isLowPerf, setIsLowPerf] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const cores = (navigator as any).hardwareConcurrency || 8;
      // Treat <=4 cores as potentially low-perf (mobile / older device)
      if (cores <= 4) setIsLowPerf(true);
    }
  }, []);

  // Use lightweight mode for mobile and low-perf devices
  const useLightMode = isMobile || isLowPerf;

  // IMPORTANT: All hooks must be called before any early returns (Rules of Hooks)
  const circleCount = 3;
  const circles = useMemo(
    () => Array.from({ length: circleCount }),
    [circleCount]
  );

  // If user prefers reduced motion, don't render heavy transition.
  if (prefersReducedMotion) return null;

  // MOBILE: Simple, fast fade transition (no clipPath, no blur)
  if (useLightMode) {
    return (
      <motion.div
        className="fixed inset-0 z-[60] flex h-screen w-screen items-center justify-center bg-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        {/* Simple centered icon - no blur, no rotation */}
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-background/30 bg-background/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Sparkles className="h-8 w-8 text-background" />
        </motion.div>
      </motion.div>
    );
  }

  // DESKTOP: Full animated transition with circles
  return (
    <>
      {/* Full screen overlay - covers entire viewport */}
      <motion.div
        className="fixed inset-0 z-[60] flex h-screen w-screen items-center justify-center bg-gradient-to-br from-accent via-accent-light to-accent-dark"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(100% at 50% 50%)" }}
        exit={{ clipPath: "circle(0% at 50% 50%)" }}
        transition={{
          duration: 0.6,
          ease: [0.76, 0, 0.24, 1],
          clipPath: { duration: 0.8 },
        }}
      >
        {/* Central star logo */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
            type: "spring",
            stiffness: 120,
            damping: 12,
          }}
        >
          <motion.div
            className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-background/30 bg-background/10 backdrop-blur-xl will-change-transform"
            style={{ transformOrigin: "50% 50%" }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-12 w-12 text-background drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Radiating circles */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {circles.map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-background/30 will-change-transform"
              style={{
                width: `${120 + i * 60}px`,
                height: `${120 + i * 60}px`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.28, 0.1, 0.28],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Secondary overlay for smoother transition */}
      <motion.div
        className="fixed inset-0 z-[55] h-screen w-screen bg-gradient-to-tl from-accent/80 via-accent-dark/60 to-accent/40 backdrop-blur-sm"
        initial={{ clipPath: "circle(0% at 30% 70%)" }}
        animate={{ clipPath: "circle(120% at 30% 70%)" }}
        exit={{ clipPath: "circle(0% at 30% 70%)" }}
        transition={{
          delay: 0.05,
          duration: 0.7,
          ease: [0.76, 0, 0.24, 1],
        }}
      />

      {/* Tertiary overlay for depth */}
      <motion.div
        className="fixed inset-0 z-[50] h-screen w-screen bg-gradient-to-tr from-accent/40 via-background/20 to-accent-light/30"
        initial={{ clipPath: "circle(0% at 70% 30%)" }}
        animate={{ clipPath: "circle(130% at 70% 30%)" }}
        exit={{ clipPath: "circle(0% at 70% 30%)" }}
        transition={{
          delay: 0.1,
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </>
  );
}
