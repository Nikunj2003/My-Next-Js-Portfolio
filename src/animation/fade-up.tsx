import { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { useAnimationGate } from "@/contexts/animation-gate";

export interface FadeUpProps {
  children: ReactNode;
  duration: number;
  delay?: number;
  whileInView?: boolean;
}

export default function FadeUp({
  children,
  duration,
  delay,
  whileInView = false,
}: FadeUpProps) {
  const prefersReducedMotion = useReducedMotion();
  const { animationsReady } = useAnimationGate();
  const animation = {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: "easeOut",
      delay,
    },
  } as const;

  const initial = prefersReducedMotion ? { opacity: 0 } : { y: 80, opacity: 0 };
  const animate = prefersReducedMotion ? { opacity: 1 } : animation;

  // Avoid triggering any Framer Motion lifecycle before the global gate opens.
  if (!animationsReady) {
    return <div key="not-ready">{children}</div>;
  }

  return (
    <motion.div
      key="ready"
      initial={initial}
      whileInView={whileInView ? animate : {}}
      animate={!whileInView ? animate : {}}
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
