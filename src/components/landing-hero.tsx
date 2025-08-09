import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

import FadeUp from "@/animation/fade-up";

export default function LandingHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the button text color based on the theme
  const buttonTextColor =
    mounted && resolvedTheme === "dark" ? "text-black" : "text-white";

  return (
    <section
      ref={ref}
      className="pointer-events-auto relative flex min-h-[calc(100vh-80px)] items-center sm:-mt-8 md:-mt-14 px-6 sm:px-14 md:px-20"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-56 w-56 rounded-full bg-accent/20 blur-3xl sm:h-72 sm:w-72"></div>
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96"></div>
      </div>

      <div className="w-full sm:pt-0">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence>
            <FadeUp key="title-main" duration={0.6} whileInView={true}>
              <div className="relative">
                <h1 className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text py-2 pb-4 text-4xl font-bold text-transparent sm:pb-6 sm:text-6xl md:text-7xl xl:text-8xl">
                  Nikunj Khitha
                </h1>
                {/* Animated underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-1 rounded-full bg-gradient-to-r from-accent to-accent-light"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-accent/10 px-3 py-1.5 text-base font-semibold text-accent backdrop-blur-sm sm:px-4 sm:py-2 sm:text-lg md:text-xl">
                  Software Development Engineer
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1.5 text-base font-semibold text-accent backdrop-blur-sm sm:px-4 sm:py-2 sm:text-lg md:text-xl">
                  Gen AI Specialist
                </span>
              </div>
            </FadeUp>

            <FadeUp key="description" duration={0.6} delay={0.2} whileInView={true}>
              <div className="mt-6 max-w-4xl sm:mt-8">
                <p className="text-lg font-medium leading-relaxed text-zinc-900 dark:text-zinc-200 sm:text-2xl md:text-3xl">
                  <span className="text-xl text-accent sm:text-4xl">Hi</span>, I&apos;m
                  <span className="font-semibold text-accent"> Nikunj Khitha</span>.
                </p>
                <p className="mt-3 text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 sm:mt-4 sm:text-xl md:text-2xl">
                  I transform innovative concepts into seamless user experiences through
                  <span className="font-semibold text-accent"> cutting-edge web</span> and
                  <span className="font-semibold text-accent"> AI solutions</span>.
                </p>
              </div>
            </FadeUp>

            <FadeUp key="stats" duration={0.6} delay={0.4} whileInView={true}>
              <div className="mt-8 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-accent/20 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-accent">1+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Years Experience</div>
                </div>
                <div className="rounded-lg border border-accent/20 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-accent">20+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Projects Built</div>
                </div>
                <div className="col-span-2 rounded-lg border border-accent/20 bg-white/10 p-4 backdrop-blur-sm sm:col-span-1">
                  <div className="text-2xl font-bold text-accent">10+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Technologies</div>
                </div>
              </div>
            </FadeUp>

            <FadeUp key="cta-buttons" duration={0.6} delay={0.6}>
              <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row">
                <Link
                  href="/projects"
                  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-accent px-7 py-3 text-base font-semibold ${buttonTextColor} transition-all duration-300 hover:scale-105 hover:bg-accent-light active:scale-95 sm:px-8 sm:py-4 sm:text-lg`}
                >
                  <span className="relative z-10">View My Work</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border-2 border-accent bg-accent/10 px-7 py-3 text-base font-semibold text-accent backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-white active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
                >
                  Learn More
                </Link>
              </div>
            </FadeUp>

              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 transform sm:bottom-8 sm:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="hidden flex-col items-center gap-2 sm:flex">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Scroll to explore</span>
                  <div className="h-6 w-4 rounded-full border-2 border-accent/50">
                    <motion.div
                      className="mx-auto mt-1 h-2 w-1 rounded-full bg-accent"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
