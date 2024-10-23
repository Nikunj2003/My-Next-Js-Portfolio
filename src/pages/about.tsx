import { NextSeo } from "next-seo";

import AboutHero from "@/components/about-hero";
import ExperienceShowcaseList from "@/components/experience/experience-showcase-list";
import { EXPERIENCE } from "@/data/experience";
import { siteMetadata } from "@/data/siteMetaData.mjs";

export default function About() {
  return (
    <>
      <NextSeo
        title="About Nikunj Khitha | MERN and FullStack Developer"
        description="Learn more about Nikunj Khitha, a dedicated MERN and FullStack Developer with 2 years of experience. Discover the journey, skills, and passion that drive me to create innovative and user-friendly web solutions."
        canonical={`${siteMetadata.siteUrl}/about`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/about`,
          title: "Learn About Nikunj Khitha - MERN and FullStack Developer",
          description:
            "Dive into the story of Nikunj Khitha, a MERN and FullStack Developer. Uncover the experiences, skills, and passion that fuel a commitment to delivering exceptional web solutions.",
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
              "About Me, FullStack Developer, MERN Developer, Web Developer, JavaScript, HTML, CSS, Professional Journey, Skills, Passion for Web Development",
          },
        ]}
      />
      <AboutHero />
      <ExperienceShowcaseList title="Experience" details={EXPERIENCE} />
    </>
  );
}
