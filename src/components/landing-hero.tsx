import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import FadeUp from "@/animation/fade-up";

export default function LandingHero() {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let progress = 0;
  const { current: elContainer } = ref;

  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine the button text color based on the theme
  const buttonTextColor =
    mounted && resolvedTheme === "dark" ? "text-black" : "text-white";

  return (
    <motion.section
      animate={{
        transform: `translateY(${progress * 20}vh)`,
      }}
      transition={{ type: "spring", stiffness: 100 }}
      ref={ref}
      className="pointer-events-auto flex h-[calc(100vh-112px)] items-center px-6 sm:px-14 md:px-20"
    >
      <div className="-mt-[112px] w-full">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence>
            <FadeUp key="title-main" duration={0.6}>
              <h1 className="bg-accent bg-clip-text py-2 text-5xl font-bold text-transparent sm:text-6xl md:text-7xl xl:text-8xl">
                Nikunj Khitha
              </h1>
              <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 md:text-3xl">
                Software Development Engineer
              </span>
            </FadeUp>
            <FadeUp key="description" duration={0.6} delay={0.2}>
              <div className="mt-8 max-w-3xl text-base font-semibold text-zinc-900 dark:text-zinc-200 sm:text-base md:text-2xl">
                <span className="text-xl text-accent sm:text-3xl">Hi</span>,
                I&apos;m
                <span className="text-accent"> Nikunj Khitha</span>, &nbsp; I
                transform concepts into seamless user experiences through
                innovative web and AI solutions.
              </div>
            </FadeUp>
            <FadeUp key="cta-button" duration={0.6} delay={0.4}>
              <Link href="/projects">
                <button
                  className={`mt-8 rounded-full bg-accent px-6 py-3 text-lg font-semibold ${buttonTextColor} transition-all duration-300 hover:bg-accent-light hover:scale-105 active:scale-95`}
                >
                  View My Work
                </button>
              </Link>
            </FadeUp>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}