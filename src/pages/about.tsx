import { NextSeo } from "next-seo";

import AboutHero from "@/components/about-hero";
import ExperienceShowcaseList from "@/components/experience/experience-showcase-list";
import { EXPERIENCE } from "@/data/experience";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export default function About() {
  return (
    <>
      <NextSeo
        title="About Nikunj Khitha | FullStack/A.I. Developer"
        description="Learn more about Nikunj Khitha, a dedicated AI Specialist and Full Stack Developer. Discover the journey, skills, and passion that drive me to create innovative and user-friendly web and mobile solutions, leveraging expertise in MERN Stack, DevOps, Azure AI, microservices, and Flutter to deliver exceptional digital experiences."
        canonical={`${siteMetadata.siteUrl}/about`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/about`,
          title: "Learn About Nikunj Khitha - MERN and FullStack Developer",
          description:
            "Dive into the story of Nikunj Khitha, an AI Specialist and Full Stack Developer proficient in MERN Stack. Uncover the experiences, skills, and passion that fuel my commitment to delivering exceptional web solutions, utilizing expertise in DevOps, Azure AI, microservices, and mobile development to create innovative and user-friendly applications.",
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
              "About Me, FullStack Developer, Projects, Portfolio, MERN stack Developer, FullStack Developer, Web Development, AI Developer, DevOps, Cloud, Flutter Developer, Mobile App Developer, Typescript, JavaScript, HTML, CSS, Web Applications, Responsive Design",
          },
        ]}
      />
      <AboutHero />
      <ExperienceShowcaseList title="Experience" details={EXPERIENCE} />
    </>
  );
}
