import { ReactNode, useState } from "react";

import { Montserrat } from "next/font/google";

import Navbar from "@/layout/navbar";
import Footer from "@/layout/footer";
import WelcomeScreen from "@/components/welcome-screen";
import FloatingChatButton from "@/components/chat/floating-chat-button";
import { routes } from "@/data/navigationRoutes";
import { classNames } from "@/utility/classNames";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export interface MainLayoutProps {
  children: ReactNode;
  onWelcomeFinished?: () => void;
}

export default function MainLayout(props: MainLayoutProps) {
  const [isWelcomeFinished, setIsWelcomeFinished] = useState(false);

  const handleWelcomeFinished = () => {
    setIsWelcomeFinished(true);
    props.onWelcomeFinished?.();
  };

  return (
    <>
      <WelcomeScreen onFinished={handleWelcomeFinished} />
      {/* Skip to content link for accessibility */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <div className={classNames("min-h-screen", montserrat.className)}>
        <Navbar routes={routes} />
        <main id="content">{props.children}</main>
      </div>
      <Footer />
      {isWelcomeFinished && <FloatingChatButton />}
    </>
  );
}
