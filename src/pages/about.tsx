import Head from "next/head";
import { NextSeo } from "next-seo";

import AboutHero from "@/components/about-hero";
import ExperienceShowcaseList from "@/components/experience/experience-showcase-list";
import SectionDivider from "@/components/section-divider";
import { EXPERIENCE } from "@/data/experience";
import { siteMetadata } from "@/data/siteMetaData.mjs";
import {
  getAboutBreadcrumbSchema,
  getAboutProfilePageSchema,
  getPersonSchema,
  toJsonLd,
} from "@/lib/seo/schema";

export default function About() {
  return (
    <>
      <NextSeo
        title="About Nikunj Khitha - Software Development Engineer"
        description="Discover the journey and skills of Nikunj Khitha, a passionate AI Specialist and Full Stack Developer. Explore my commitment to creating innovative web and mobile solutions, leveraging the MERN Stack, DevOps, and Azure AI expertise."
        canonical={`${siteMetadata.siteUrl}/about`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/about`,
          title: "Learn About Nikunj Khitha - Software Development Engineer",
          description:
            "Dive into the story of Nikunj Khitha, an AI Specialist and Full Stack Developer. Uncover my experiences and skills in delivering exceptional web solutions through DevOps, Azure AI, microservices, and mobile development.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
              alt: "Nikunj Khitha - Professional Developer Portfolio",
            },
          ],
          siteName: siteMetadata.siteName,
          type: "profile",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd(getAboutProfilePageSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd(getPersonSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd(getAboutBreadcrumbSchema()),
          }}
        />
      </Head>

      <AboutHero />
      <SectionDivider />
      <ExperienceShowcaseList title="Experience" details={EXPERIENCE} />
    </>
  );
}
