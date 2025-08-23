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

  // Pause ongoing infinite animations when tab not visible to save battery / CPU.
  const [isPageVisible, setIsPageVisible] = useState(true);
  useEffect(() => {
    const onVisibility = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // If user prefers reduced motion, don't render heavy transition.
  if (prefersReducedMotion) return null;

  // Tunable parameters (kept very close to original for desktop; trimmed for mobile)
  const circleCount = isMobile || isLowPerf ? 2 : 3;
  const particleCount = isLowPerf && !isMobile ? 8 : isMobile ? 6 : 12;
  const particleRadius = isMobile ? 90 : isLowPerf ? 130 : 150;
  const particleDelayStep = isMobile ? 0.12 : 0.1;
  const animationsEnabled = isPageVisible; // reduced separately by prefersReducedMotion already

  // Precompute particle positions (memo to avoid recalculation per frame re-render)
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = i * (360 / particleCount) * (Math.PI / 180);
      const x = Math.round(Math.cos(angle) * particleRadius * 100) / 100;
      const y = Math.round(Math.sin(angle) * particleRadius * 100) / 100;
      return { i, x, y };
    });
  }, [particleCount, particleRadius]);

  const circles = useMemo(
    () => Array.from({ length: circleCount }),
    [circleCount]
  );

  return (
    <>
      {/* Full screen overlay - covers entire viewport */}
      <motion.div
        className="fixed inset-0 z-[60] flex h-screen w-screen items-center justify-center bg-gradient-to-br from-accent via-accent-light to-accent-dark"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(100% at 50% 50%)" }}
        exit={{ clipPath: "circle(0% at 50% 50%)" }}
        transition={{
          // Slightly slower on desktop for a smoother reveal; a hair faster on mobile
          duration: isMobile ? 0.5 : 0.6,
          ease: [0.76, 0, 0.24, 1],
          clipPath: { duration: isMobile ? 0.65 : 0.8 },
        }}
      >
        {/* Central star logo (dot background removed) */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            delay: 0.1,
            duration: isMobile ? 0.45 : 0.5,
            ease: [0.76, 0, 0.24, 1],
            type: "spring",
            stiffness: isMobile ? 140 : 120,
            damping: isMobile ? 14 : 12,
          }}
        >
          <motion.div
            className={`flex items-center justify-center rounded-full border-2 border-background/30 bg-background/10 backdrop-blur-xl will-change-transform ${
              isMobile ? "h-20 w-20" : "h-28 w-28"
            }`}
            style={{ transformOrigin: "50% 50%" }}
            animate={animationsEnabled ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={
              animationsEnabled
                ? { duration: 12, repeat: Infinity, ease: "linear" }
                : undefined
            }
          >
            <Sparkles
              className={`${
                isMobile ? "h-10 w-10" : "h-12 w-12"
              } text-background drop-shadow-lg`}
            />
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
                width: `${(isMobile ? 100 : 120) + i * (isMobile ? 50 : 60)}px`,
                height: `${
                  (isMobile ? 100 : 120) + i * (isMobile ? 50 : 60)
                }px`,
              }}
              animate={{
                scale: animationsEnabled
                  ? isMobile
                    ? [1, 1.22, 1]
                    : [1, 1.3, 1]
                  : 1,
                opacity: animationsEnabled ? [0.28, 0.1, 0.28] : 0.22,
              }}
              transition={{
                duration: (isMobile ? 2.2 : 2) + i * 0.5,
                repeat: animationsEnabled ? Infinity : 0,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Floating particles removed per request */}
      </motion.div>

      {/* Secondary overlay for smoother transition */}
      <motion.div
        className="fixed inset-0 z-[55] h-screen w-screen bg-gradient-to-tl from-accent/80 via-accent-dark/60 to-accent/40 backdrop-blur-sm"
        initial={{ clipPath: "circle(0% at 30% 70%)" }}
        animate={{ clipPath: "circle(120% at 30% 70%)" }}
        exit={{ clipPath: "circle(0% at 30% 70%)" }}
        transition={{
          delay: 0.05,
          duration: isMobile ? 0.6 : 0.7,
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
          // Slightly reduced duration on mobile keeps perceived speed consistent
          duration: isMobile ? 0.65 : 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </>
  );
}
