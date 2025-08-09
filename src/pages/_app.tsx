import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "@/layout/main-layout";
import PageTransitionAnimation from "@/components/page-transition-animation";
import { AnimationGateProvider, useAnimationGate } from "@/contexts/animation-gate";
import "@/styles/globals.css";
import dynamic from "next/dynamic";

const CursorTrailCanvas = dynamic(() => import("@/components/cursor-trail-canvas"), { ssr: false });

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.76, 0, 0.24, 1],
  duration: 0.6
};

export default function App(props: AppProps) {
  return (
    <AnimationGateProvider>
      <AppContent {...props} />
    </AnimationGateProvider>
  );
}

function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setAnimationsReady, animationsReady } = useAnimationGate();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsTransitioning(true);
      setAnimationsReady(false); // gate animations during route transition
    };

    const handleRouteChangeComplete = () => {
      // Add a small delay to ensure the transition completes
      setTimeout(() => {
        setIsTransitioning(false);
        setAnimationsReady(true); // reopen animations after overlay exits
      }, 800); // Matches the faster transition duration
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      {/* Cursor trail effect - only render on desktop for performance */}
      {typeof window !== 'undefined' && window.innerWidth >= 1024 ? (
        <CursorTrailCanvas className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
      ) : null}

      <ThemeProvider attribute="class" defaultTheme="light">
        <MainLayout onWelcomeFinished={() => setAnimationsReady(true)}>
          <AnimatePresence mode="wait" initial={false} onExitComplete={() => setAnimationsReady(true)}>
            <motion.div
              key={router.asPath}
              initial="initial"
              animate={animationsReady ? "in" : "initial"}
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen"
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>

          {/* Page transition overlay - only show when transitioning */}
          <AnimatePresence>
            {isTransitioning && <PageTransitionAnimation />}
          </AnimatePresence>
        </MainLayout>
      </ThemeProvider>

      <Analytics />
    </>
  );
}
