import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import FadeUp from "@/animation/fade-up";
import FadeRight from "@/animation/fade-right";
import heroProfileImg from "@/public/images/heroProfile.png";

export default function AboutHero() {
  return (
    <div className="mx-auto mt-0 max-w-7xl px-6 py-20 sm:px-14 md:mt-20 md:px-20 lg:mt-0">
      <div className="rounded-2xl border border-border bg-muted/20 p-6 backdrop-blur-lg shadow-lg ring-1 ring-zinc-200/50 dark:ring-accent/20 sm:p-8 md:p-12">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
          <div className="w-full sm:w-1/2 md:w-2/3 lg:inline-block lg:h-full lg:w-1/2">
            <AnimatePresence>
              <FadeUp key="hero-image" duration={0.6}>
                <Image
                  src={heroProfileImg}
                  width={100}
                  height={100}
                  className="h-auto w-full px-0 xl:px-16"
                  alt="hero image"
                  unoptimized
                />
              </FadeUp>
            </AnimatePresence>
          </div>
          <div className="sm:1/2 mt-10 w-full lg:w-1/2">
            <AnimatePresence>
              <FadeUp key="title-greeting" duration={0.6}>
                <h1 className="text-5xl font-bold text-accent sm:text-6xl md:text-5xl lg:text-4xl xl:text-6xl">
                  Hi, I&apos;m Nikunj Khitha
                </h1>
              </FadeUp>
              <FadeUp key="description-1" duration={0.6} delay={0.2}>
                <p className="mt-8 text-base font-medium text-zinc-900 dark:text-zinc-300 sm:text-lg md:text-lg">
                  I turn visions into reality with code. Whether developing a web application, mobile app using Flutter, or an AI-driven solution, I apply my expertise in Full Stack development, Azure AI, and user-centered design to ensure excellence in every project.
                </p>
              </FadeUp>
              <FadeUp key="description-2" duration={0.6} delay={0.4}>
                <p className="mt-8 text-base font-medium text-zinc-900 dark:text-zinc-300 sm:text-lg md:text-lg">
                  Explore my latest projects showcasing my expertise in Next.js, Node.js, JavaScript, TypeScript, AI solutions, cloud development, and web and mobile development using Flutter.
                </p>
              </FadeUp>
              <FadeRight
                key="hero-location"
                duration={0.6}
                delay={0.8}
                className="mr-0 mt-8 flex items-center justify-center gap-4 lg:mr-8 lg:justify-end"
              >
                <div className="relative flex w-12 gap-4 overflow-hidden rounded-md">
                  <Image
                    className="-z-10 h-full w-full bg-cover bg-no-repeat"
                    alt="Indian flag"
                    src="https://flagcdn.com/in.svg"
                    width={15}
                    height={15}
                  />
                </div>
                <span className="text-lg font-medium text-foreground">India</span>
              </FadeRight>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}