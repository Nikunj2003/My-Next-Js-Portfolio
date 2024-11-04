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
        title="Nikunj Khitha - FullStack & AI Developer"
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
      </Head>
      <LandingHero />
      <SkillsShowcase skills={SKILLS_DATA} />
      <ProjectShowcase projects={PROJECT_SHOWCASE} />
    </>
  );
}
