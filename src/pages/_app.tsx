import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import MainLayout from "@/layout/main-layout";
import "@/styles/globals.css";
import dynamic from "next/dynamic";
const CursorTrailCanvas = dynamic(() => import("@/components/cursor-trail-canvas"), { ssr: false });

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
          <Component key={router.asPath} {...pageProps} />
        </MainLayout>
      </ThemeProvider>

      <Analytics />
    </>
  );
}
