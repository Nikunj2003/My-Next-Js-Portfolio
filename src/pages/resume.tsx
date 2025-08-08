import { siteMetadata } from "@/data/siteMetaData.mjs";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ResumeDisplay from "@/components/resume-display";

export default function Resume() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 845);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const backgroundColor =
    mounted && resolvedTheme === "dark"
      ? "bg-black/20 backdrop-blur-lg"
      : "bg-white/20 backdrop-blur-lg";

  if (!mounted) return null;

  return (
    <>
      <NextSeo
        title="Resume of Nikunj Khitha - FullStack & AI Developer"
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
      <section className="mx-auto mb-14 mt-6 w-full gap-20 px-6 sm:mt-12 sm:px-14 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div
            className={`rmb mb-6 flex justify-center transition-transform duration-700 ${isVisible ? "translate-y-0" : "translate-y-10 opacity-0"}`}
          >
            <a
              href={`/Nikunj_Resume.pdf`}
              download
              aria-label="Download Nikunj Khitha's Resume"
              className={`relative mx-3 my-3 font-semibold transition-transform duration-100 hover:scale-110 ${
                resolvedTheme === "dark" ? "text-black" : "text-white"
              } rounded-full bg-[#56A5A9] px-6 py-4 sm:px-5 sm:py-3`}
              style={{ fontSize: "1.10rem", marginBottom: "2.1rem" }}
            >
              Download Resume
            </a>
          </div>
          <div className="rmt mt-8">
            <ResumeDisplay />
          </div>
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
