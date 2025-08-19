import { siteMetadata } from "@/data/siteMetaData.mjs";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ResumeDisplay from "@/components/resume-display";
import SectionDivider from "@/components/section-divider";

export default function Resume() {
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <NextSeo
        title="Resume of Nikunj Khitha - Software Development Engineer"
        description="Download the resume of Nikunj Khitha, an AI Specialist and FullStack Developer with expertise in MERN Stack, Flutter, DevOps, Azure AI, Microservices, Cloud, and Web App development."
        canonical={`${siteMetadata.siteUrl}/resume`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/resume`,
          title: "Nikunj Khitha's Resume - FullStack & AI Developer",
          description:
            "Explore the professional resume of Nikunj Khitha, an AI Specialist and Full-Stack Developer with expertise in building intelligent web and mobile applications, cloud-based solutions, and AI-powered microservices.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
              alt: "Nikunj Khitha - Resume Image",
            },
          ],
          siteName: siteMetadata.siteName,
          type: "website",
        }}
        twitter={{ cardType: "summary_large_image" }}
        additionalMetaTags={[
          {
            property: "keywords",
            content:
              "Resume, Portfolio, Projects, MERN stack Developer, FullStack Developer, Web Development, AI Developer, DevOps, Cloud, Flutter Developer, Mobile App Developer, Typescript, JavaScript, HTML, CSS, Web Applications, Responsive Design",
          },
        ]}
      />
      <section className="mx-auto mb-14 mt-6 w-full gap-20 px-4 sm:mt-12 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div
            className={`rmb mb-6 flex flex-col items-center justify-center gap-3 transition-transform duration-700 ${
              isVisible ? "translate-y-0" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3">
              <a
                href={`/Nikunj_Resume.pdf`}
                download
                aria-label="Download Nikunj Khitha's Resume"
                className={`relative mx-3 my-3 font-semibold transition-transform duration-100 hover:scale-105 ${
                  resolvedTheme === "dark" ? "text-black" : "text-white"
                } rounded-full bg-[#56A5A9] px-5 py-3 sm:px-6 sm:py-3`}
                style={{ fontSize: "1.05rem" }}
              >
                Download Resume
              </a>
              <a
                href={`/Nikunj_Resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume in new tab"
                className="rounded-full border-2 border-accent bg-accent/10 px-5 py-3 text-sm font-semibold text-accent backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-white sm:px-6 sm:text-base"
              >
                Open in new tab
              </a>
            </div>
          </div>
          <div className="rmt mt-6 sm:mt-8">
            <ResumeDisplay />
          </div>

          <SectionDivider />
        </div>
      </section>
      <style jsx>{`
        a {
          text-decoration: none;
        }
        .block {
          display: block; /* Ensure the link covers the entire image area */
        }
      `}</style>
    </>
  );
}
