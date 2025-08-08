import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import FadeUp from "@/animation/fade-up";
import FadeRight from "@/animation/fade-right";
import heroProfileImg from "@/public/images/heroProfile.png";

export default function AboutHero() {
  return (
    <div className="mx-auto mt-0 max-w-7xl px-6 py-20 sm:px-14 md:mt-20 md:px-20 lg:mt-0">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 p-6 backdrop-blur-lg shadow-lg ring-1 ring-zinc-200/50 dark:ring-accent/20 sm:p-8 md:p-12">
        {/* Background accents */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-accent/15 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
          <div className="w-full sm:w-1/2 md:w-2/3 lg:inline-block lg:h-full lg:w-1/2">
            <AnimatePresence>
              <FadeUp key="hero-image" duration={0.6} whileInView>
                <Image
                  src={heroProfileImg}
                  width={800}
                  height={800}
                  className="h-auto w-full px-0 xl:px-16 rounded-xl border border-accent/10"
                  alt="Portrait of Nikunj Khitha"
                  priority={false}
                />
              </FadeUp>
            </AnimatePresence>
          </div>
          <div className="sm:1/2 mt-10 w-full lg:w-1/2">
            <AnimatePresence>
              <FadeUp key="title-greeting" duration={0.6}>
                <h1 className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-5xl lg:text-4xl xl:text-6xl">
                  Hi, I&apos;m Nikunj Khitha
                </h1>
              </FadeUp>
              <FadeUp key="description-1" duration={0.6} delay={0.2}>
                <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-zinc-900 dark:text-zinc-300 sm:text-lg">
                  I&apos;m a software engineer passionate about building intelligent, end-to-end solutions at the intersection of AI and automation. My experience ranges from developing enterprise-grade testing frameworks with Spring Boot to engineering sophisticated AI agents using AWS Bedrock, Azure AI, and Crew AI.
                </p>
              </FadeUp>
              <FadeUp key="description-2" duration={0.6} delay={0.35}>
                <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-relaxed text-zinc-900 dark:text-zinc-300 sm:text-lg">
                  Explore my portfolio to see how I apply my expertise. From creating AI-powered chatbots with Node.js and FastAPI to implementing robust CI/CD pipelines and developing resilient mobile apps with Flutter, I am dedicated to delivering high-impact, production-ready code.
                </p>
              </FadeUp>

              {/* Highlights row */}
              <FadeUp key="highlights" duration={0.6} delay={0.5}>
                <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: "AI & Automation" },
                    { label: "Full Stack Engineering" },
                    { label: "DevOps & Cloud" },
                  ].map((h) => (
                    <div
                      key={h.label}
                      className="rounded-lg border border-accent/20 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent backdrop-blur-sm"
                    >
                      {h.label}
                    </div>
                  ))}
                </div>
              </FadeUp>

              {/* CTAs */}
              <FadeUp key="about-ctas" duration={0.6} delay={0.65}>
                <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-start">
                  <a
                    href="/projects"
                    className="rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-accent-light active:scale-95 sm:text-base"
                  >
                    View Projects
                  </a>
                  <a
                    href="mailto:njkhitha2003@gmail.com"
                    className="rounded-full border-2 border-accent bg-accent/10 px-6 py-3 text-center text-sm font-semibold text-accent backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:bg-accent hover:text-white active:scale-95 sm:text-base"
                  >
                    Contact Me
                  </a>
                </div>
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
                    width={20}
                    height={14}
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