import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "@/layout/main-layout";
import PageTransitionAnimation from "@/components/page-transition-animation";
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

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      {/* Cursor trail effect - only render on desktop for performance */}
      {typeof window !== 'undefined' && window.innerWidth >= 1024 ? (
        <CursorTrailCanvas className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
      ) : null}

      <ThemeProvider attribute="class" defaultTheme="light">
        <MainLayout>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.asPath}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen"
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
          
          {/* Page transition overlay */}
          <AnimatePresence mode="wait">
            <PageTransitionAnimation key={router.asPath} />
          </AnimatePresence>
        </MainLayout>
      </ThemeProvider>

      <Analytics />
    </>
  );
}
