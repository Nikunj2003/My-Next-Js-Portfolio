import { NextSeo } from "next-seo";

import ProjectCard from "@/components/projects/project-card";
import { PROJECTS_CARD } from "@/data/projects";
import SectionDivider from "@/components/section-divider";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export default function Projects() {
  return (
    <>
      <NextSeo
        title="Projects by Nikunj Khitha - FullStack & AI Developer"
        description="Explore a diverse collection of projects by Nikunj Khitha, an AI Specialist and Full Stack Developer. Discover innovative AI-driven solutions, responsive web applications, and seamless user interfaces showcasing skills in MERN Stack, DevOps, Azure AI, microservices, and Flutter mobile app development."
        canonical={`${siteMetadata.siteUrl}/projects`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/projects`,
          title: "Explore Nikunj Khitha's Projects - FullStack & AI Developer",
          description:
            "Showcasing an array of projects crafted by Nikunj Khitha, highlighting expertise in AI, web development, and mobile app development. Experience innovation through the MERN Stack, DevOps practices, Azure AI solutions, and cloud technologies that enhance digital experiences.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
              alt: "Nikunj Khitha - Project Showcase",
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
              "Projects, Portfolio, AI Specialist, FullStack Developer, MERN Stack, Web Development, Mobile App Development, DevOps, Azure AI, Cloud Solutions, Flutter, JavaScript, TypeScript, HTML, CSS, Responsive Design",
          },
        ]}
      />
      <section className="mx-auto mb-40 mt-6 w-full gap-20 px-6 sm:mt-12 sm:px-14 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-border bg-muted/20 p-6 backdrop-blur-lg shadow-lg ring-1 ring-zinc-200/50 dark:ring-accent/20 sm:p-8 md:p-12">
            <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:mb-8 sm:flex-row">
              <h1 className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                Projects
              </h1>
              <span className="text-sm text-muted-foreground">Curated work showcasing engineering, AI, and product craft</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 sm:mt-6 sm:grid-cols-2 lg:grid-cols-2">
              {PROJECTS_CARD.map((card, index) => (
                <ProjectCard key={index} {...card} />
              ))}
            </div>
          </div>

          <SectionDivider />

          <div className="mx-auto mt-16 max-w-5xl text-center text-foreground md:mt-28">
            <p className="mt-10 text-base md:text-xl">
              Visit my GitHub to see some of the latest projects{" "}
              <a
                href={`${siteMetadata.github}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent underline underline-offset-2 hover:text-accent/70"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
