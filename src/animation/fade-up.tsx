import { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

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
  return (
    <motion.div
      initial={initial}
      whileInView={whileInView ? animate : {}}
      animate={!whileInView ? animate : {}}
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
