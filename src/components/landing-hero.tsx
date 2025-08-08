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
    <section
      ref={ref}
      className="pointer-events-auto relative flex h-[calc(100vh-112px)] items-center overflow-hidden px-6 sm:px-14 md:px-20"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
      </div>
      
      <div className="-mt-[112px] w-full">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence>
            <FadeUp key="title-main" duration={0.6} whileInView={true}>
              <div className="relative">
                <h1 className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text py-2 pb-6 text-5xl font-bold text-transparent sm:text-6xl md:text-7xl xl:text-8xl">
                  Nikunj Khitha
                </h1>
                {/* Animated underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-1 bg-gradient-to-r from-accent to-accent-light rounded-full"
                />
              </div>
              <div className="mt-4 pt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-accent/10 px-4 py-2 text-lg font-semibold text-accent backdrop-blur-sm md:text-xl">
                  Software Development Engineer
                </span>
                <span className="rounded-full bg-accent/10 px-4 py-2 text-lg font-semibold text-accent backdrop-blur-sm md:text-xl">
                 Gen AI Specialist
                </span>
              </div>
            </FadeUp>
            
            <FadeUp key="description" duration={0.6} delay={0.2} whileInView={true}>
              <div className="mt-8 max-w-4xl">
                <p className="text-xl font-medium leading-relaxed text-zinc-900 dark:text-zinc-200 sm:text-2xl md:text-3xl">
                  <span className="text-2xl text-accent sm:text-4xl">Hi</span>,
                  I&apos;m
                  <span className="text-accent font-semibold"> Nikunj Khitha</span>. 
                </p>
                <p className="mt-4 text-lg font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-xl md:text-2xl">
                  I transform innovative concepts into seamless user experiences through 
                  <span className="text-accent font-semibold"> cutting-edge web</span> and 
                  <span className="text-accent font-semibold"> AI solutions</span>.
                </p>
              </div>
            </FadeUp>
            
            <FadeUp key="stats" duration={0.6} delay={0.4} whileInView={true}>
              <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg sm:grid-cols-3">
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm border border-accent/20">
                  <div className="text-2xl font-bold text-accent">5+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Years Experience</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm border border-accent/20">
                  <div className="text-2xl font-bold text-accent">20+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Projects Built</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm border border-accent/20 col-span-2 sm:col-span-1">
                  <div className="text-2xl font-bold text-accent">10+</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Technologies</div>
                </div>
              </div>
            </FadeUp>
            
            <FadeUp key="cta-buttons" duration={0.6} delay={0.6} whileInView={true}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/projects">
                  <button
                    className={`group relative overflow-hidden rounded-full bg-accent px-8 py-4 text-lg font-semibold ${buttonTextColor} transition-all duration-300 hover:bg-accent-light hover:scale-105 active:scale-95`}
                  >
                    <span className="relative z-10">View My Work</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                </Link>
                
                <Link href="/about">
                  <button className="rounded-full border-2 border-accent bg-accent/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:scale-105 active:scale-95">
                    Learn More
                  </button>
                </Link>
              </div>
            </FadeUp>
            
            <FadeUp key="scroll-indicator" duration={0.6} delay={0.8}>
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Scroll to explore</span>
                  <div className="h-6 w-4 rounded-full border-2 border-accent/50">
                    <motion.div 
                      className="mt-1 mx-auto h-2 w-1 rounded-full bg-accent"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
