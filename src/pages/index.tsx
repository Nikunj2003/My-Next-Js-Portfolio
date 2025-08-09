import Head from "next/head";
import { NextSeo } from "next-seo";

import LandingHero from "@/components/landing-hero";
import SkillsShowcase from "@/components/skills/skills-showcase";
import ProjectShowcase from "@/components/projects/project-showcase";
import { PROJECT_SHOWCASE } from "@/data/projects";
import { SKILLS_DATA } from "@/data/skills";
import { siteMetadata } from "@/data/siteMetaData.mjs";
import FadeUp from "@/animation/fade-up";
import { AnimatePresence } from "framer-motion";
import SectionDivider from "@/components/section-divider";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Nikunj Khitha - Software Development Engineer"
        description="Explore the portfolio of Nikunj Khitha, an innovative AI Specialist and Full Stack Developer. Discover projects showcasing expertise in Next.js, MERN Stack, Flutter, DevOps, Azure AI, and microservices, all designed to enhance user experiences on web and mobile applications."
        canonical={siteMetadata.siteUrl}
        openGraph={{
          url: siteMetadata.siteUrl,
          title: "Nikunj Khitha - Portfolio of a FullStack & AI Developer",
          description:
            "Delve into the world of web development with Nikunj Khitha. Explore a portfolio featuring advanced projects that highlight skills in Next.js, MERN Stack, Flutter, DevOps, Azure AI, and microservices, reflecting a dedication to creating impactful web and mobile applications.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
              alt: "Nikunj Khitha - Professional Developer Portfolio",
            },
          ],
          siteName: siteMetadata.siteName,
          type: "website",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            property: "keywords",
            content:
              "Nikunj Khitha, FullStack Developer, AI Specialist, Portfolio, Projects, MERN Stack, Next.js, Flutter Developer, DevOps, Azure AI, Microservices, Web Development, Responsive Design, JavaScript, TypeScript, HTML, CSS",
          },
        ]}
      />
      <Head>
        {siteMetadata.googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={siteMetadata.googleSiteVerification}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteMetadata.siteName,
              url: siteMetadata.siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteMetadata.siteUrl}/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteMetadata.author,
              url: siteMetadata.siteUrl,
              sameAs: [siteMetadata.github, siteMetadata.linkedin],
              jobTitle: siteMetadata.description,
              image: `${siteMetadata.siteUrl}${siteMetadata.image}`,
              email: siteMetadata.email,
            }),
          }}
        />
      </Head>
      
      {/* Enhanced Hero Section */}
      <LandingHero />

      <SectionDivider />
      
      {/* About Summary Section */}
      <AnimatePresence>
        <FadeUp key="about-title" duration={0.6} whileInView={true}>
      <section className="px-6 py-16 sm:px-14 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-border bg-muted/20 p-6 backdrop-blur-lg shadow-lg ring-1 ring-zinc-200/50 dark:ring-accent/20 sm:p-8 md:p-12">

                <h2 className="text-3xl font-bold text-accent sm:text-4xl md:text-5xl">
                  About Me
                </h2>
                <p className="mt-6 text-lg font-medium leading-relaxed text-zinc-900 dark:text-zinc-300 sm:text-xl">
                  I&apos;m a passionate software engineer who specializes in building intelligent, 
                  end-to-end solutions at the intersection of{" "}
                  <span className="text-accent font-semibold">AI and automation</span>. 
                  With expertise spanning from enterprise-grade testing frameworks with Spring Boot 
                  to sophisticated AI agents using AWS Bedrock, Azure AI, and Crew AI.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-accent/10 p-4 backdrop-blur-sm">
                    <h3 className="font-semibold text-accent">Full Stack Development</h3>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      MERN Stack, Next.js, Flutter, and modern web technologies
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-4 backdrop-blur-sm">
                    <h3 className="font-semibold text-accent">AI & Machine Learning</h3>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      Azure AI, OpenAI, LangChain, and intelligent automation
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                    <h3 className="font-semibold text-accent">DevOps & Cloud</h3>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      CI/CD pipelines, Docker, Kubernetes, and Azure services
                    </p>
                  </div>
                </div>
          </div>
        </div>
      </section>
        </FadeUp>
    </AnimatePresence>

     <SectionDivider />

      {/* Skills Section with Enhanced Styling */}
      <SkillsShowcase skills={SKILLS_DATA} />

      <SectionDivider />
      
      {/* Featured Projects Section */}
      <ProjectShowcase projects={PROJECT_SHOWCASE} />

      <SectionDivider />
      
      {/* Call to Action Section */}
    <AnimatePresence>
      <FadeUp key="cta-title" duration={0.6} whileInView={true}>
      <section className="px-6 py-16 sm:px-14 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-border bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 p-6 backdrop-blur-lg shadow-lg ring-1 ring-accent/20 sm:p-8 md:p-12 mb-16 sm:mb-20">

                <h2 className="text-center text-3xl font-bold text-accent sm:text-4xl md:text-5xl">
                  Let&apos;s Build Something Amazing
                </h2>
                <p className="mt-6 text-center text-lg font-medium text-zinc-900 dark:text-zinc-300 sm:text-xl">
                  Ready to transform your ideas into reality? Let&apos;s collaborate on your next project.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <a
                    href="/projects"
                    className="rounded-full bg-accent px-8 py-3 text-center text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-light hover:scale-105 active:scale-95"
                  >
                    View My Work
                  </a>
                  <a
                    href="/about"
                    className="rounded-full border-2 border-accent px-8 py-3 text-center text-lg font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:scale-105 active:scale-95"
                  >
                    Learn More About Me
                  </a>
                </div>
          </div>
        </div>
      </section>
      </FadeUp>
    </AnimatePresence>
    </>
  );
}
