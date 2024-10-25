import { NextSeo } from "next-seo";

import ProjectCard from "@/components/projects/project-card";
import { PROJECTS_CARD } from "@/data/projects";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export default function Projects() {
  return (
    <>
      <NextSeo
        title="Projects by Nikunj Khitha - FullStack & A.I. Developer"
        description="Explore a collection of projects by Nikunj Khitha, an AI Specialist and Full Stack Developer with expertise in crafting intelligent and responsive web applications. From AI-driven solutions to seamless user interfaces, delve into the depth and diversity of my work, showcasing skills in MERN Stack, DevOps, Azure AI, microservices, and mobile app development using Flutter."
        canonical={`${siteMetadata.siteUrl}/projects`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/projects`,
          title:
            "Discover Projects by Nikunj Khitha - FullStack & A.I. Developer",
          description:
            "Showcasing projects crafted by Nikunj Khitha, an AI Specialist and Full Stack Developer. Experience the synergy of innovation and expertise in web and mobile app development, AI, MERN Stack, DevOps, and cloud solutions, highlighting a commitment to creating cutting-edge applications and intelligent digital experiences.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.twitterImage}`,
              alt: "Nikunj Khitha - Portfolio Image",
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
              "Projects, Portfolio, MERN stack Developer, FullStack Developer, Web Development, AI Developer, DevOps, Cloud, Flutter Developer, Mobile App Developer, Typescript, JavaScript, HTML, CSS, Web Applications, Responsive Design",
          },
        ]}
      />
      <section className="mx-auto mb-40 mt-6 w-full gap-20 px-6 sm:mt-12 sm:px-14 md:px-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold text-foreground md:text-4xl">
            Projects
          </h1>
          <div className="my-2">
            <span className="text-sm text-muted-foreground">
              Here are some of the projects I&apos;d worked on
            </span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2">
            {PROJECTS_CARD.map((card, index) => (
              <ProjectCard key={index} {...card} />
            ))}
          </div>
          <div className="mx-auto mt-16 max-w-5xl text-center text-foreground md:mt-28">
            <p className="mt-10 text-base md:text-xl">
              Visit my github to see some of the latest projects{" "}
              <a
                href={`${siteMetadata.github}?tab=repositories`}
                target="_blank"
                className="font-semibold text-accent underline underline-offset-2 hover:text-accent/70"
              >
                Github
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
