import { ReactNode } from "react";

import { Montserrat } from "next/font/google";

import Navbar from "@/layout/navbar";
import Footer from "@/layout/footer";
import WelcomeScreen from "@/components/welcome-screen";
import { routes } from "@/data/navigationRoutes";
import { classNames } from "@/utility/classNames";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout(props: MainLayoutProps) {
  return (
    <>
      <WelcomeScreen />
      <div className={classNames("min-h-screen", montserrat.className)}>
        <Navbar routes={routes} />
        <main>{props.children}</main>
      </div>
      <Footer />
    </>
  );
}
