import Head from "next/head";

import { NextSeo } from "next-seo";

import LandingHero from "@/components/landing-hero";
import SkillsShowcase from "@/components/skills/skills-showcase";
import ProjectShowcase from "@/components/projects/project-showcase";
import { PROJECT_SHOWCASE } from "@/data/projects";
import { SKILLS_DATA } from "@/data/skills";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Nikunj Khitha - FullStack/A.I. Developer"
        description="Explore the professional portfolio of Nikunj Khitha, an AI Specialist and Full Stack Developer. Discover innovative projects showcasing expertise in Next Js, MERN Stack, Flutter, DevOps, Azure AI, microservices, and a passion for crafting seamless user experiences across web and mobile applications."
        canonical={siteMetadata.siteUrl}
        openGraph={{
          url: siteMetadata.siteUrl,
          title: "Nikunj Khitha - FullStack/A.I. Developer Portfolio",
          description:
            "Dive into the world of web development with Nikunj Khitha. Discover a skilled AI Specialist and Full Stack Developer, showcasing cutting-edge projects that highlight expertise in Next Js, MERN Stack, Flutter, DevOps, Azure AI, microservices, and a commitment to crafting web and mobile applications.",
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
              "Projects, Portfolio, MERN stack Developer, FullStack Developer, Web Development, AI Developer, Open AI, LLaMa AI, Azure, DevOps, Cloud, Flutter Developer, Mobile App Developer, Typescript, JavaScript, HTML, CSS, Web Applications, Responsive Design",
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
      </Head>
      <LandingHero />
      <SkillsShowcase skills={SKILLS_DATA} />
      <ProjectShowcase projects={PROJECT_SHOWCASE} />
    </>
  );
}
