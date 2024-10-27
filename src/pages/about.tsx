import { NextSeo } from "next-seo";

import AboutHero from "@/components/about-hero";
import ExperienceShowcaseList from "@/components/experience/experience-showcase-list";
import { EXPERIENCE } from "@/data/experience";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export default function About() {
  return (
    <>
      <NextSeo
        title="About Nikunj Khitha - FullStack & AI Developer"
        description="Discover the journey and skills of Nikunj Khitha, a passionate AI Specialist and Full Stack Developer. Explore my commitment to creating innovative web and mobile solutions, leveraging the MERN Stack, DevOps, and Azure AI expertise."
        canonical={`${siteMetadata.siteUrl}/about`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/about`,
          title: "Learn About Nikunj Khitha - FullStack & AI Developer",
          description:
            "Dive into the story of Nikunj Khitha, an AI Specialist and Full Stack Developer. Uncover my experiences and skills in delivering exceptional web solutions through DevOps, Azure AI, microservices, and mobile development.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.twitterImage}`,
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
              "About Me, FullStack Developer, Portfolio, MERN Stack, AI Developer, Web Development, DevOps, Flutter Developer, Mobile App Development, Typescript, JavaScript, HTML, CSS, Responsive Design",
          },
        ]}
      />
      <AboutHero />
      <ExperienceShowcaseList title="Experience" details={EXPERIENCE} />
    </>
  );
}
