import { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { useAnimationGate } from "@/contexts/animation-gate";

export interface FadeRightProps {
  children: ReactNode;
  duration: number;
  delay?: number;
  className?: string;
  whileInView?: boolean;
}

export default function FadeRight({
  children,
  duration,
  delay,
  className,
  whileInView = false,
}: FadeRightProps) {
  const prefersReducedMotion = useReducedMotion();
  const { animationsReady } = useAnimationGate();

  const animation = {
    opacity: 1,
    x: 0,
    transition: {
      duration,
      ease: "easeOut",
      delay,
    },
  } as const;

  const initial = prefersReducedMotion
    ? { opacity: 0 }
    : { x: -100, opacity: 0 };
  const animate = prefersReducedMotion ? { opacity: 1 } : animation;

  // Avoid triggering any Framer Motion lifecycle before the global gate opens.
  if (!animationsReady) {
    return (
      <div className={className} key="not-ready">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      key="ready"
      initial={initial}
      whileInView={whileInView ? animate : {}}
      animate={!whileInView ? animate : {}}
      viewport={{ once: true, amount: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
