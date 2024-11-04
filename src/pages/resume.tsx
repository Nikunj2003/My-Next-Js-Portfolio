import { siteMetadata } from "@/data/siteMetaData.mjs";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from 'next/image';

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
              href="/Resume.pdf"
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

          <div className="rmt mt-8 flex justify-center">
            <div
              className={`rmt flex items-center justify-center rounded-lg p-4 backdrop-blur-lg transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
              style={{
                maxWidth: "900px",
                width: "95%",
                minHeight: "600px",
                padding: "3rem",
                backgroundColor: resolvedTheme === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)",
                border: `1px solid ${resolvedTheme === "dark" ? "#1A5458" : "#D6E8E9"}`,
                boxShadow: resolvedTheme === "dark" ? "none" : "0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)",
                transform: resolvedTheme === "dark" ? "none" : "translateY(-2px)",
                display: !isMobile ? "flex" : "none",
              }}
            >
              <Image
                src="/resume.png"
                alt="Nikunj Khitha Resume"
                layout="responsive"
                width={900}
                height={600}
                className={`transition-transform duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              />
            </div>

            {isMobile && (
              <Image
                src="/resume.png"
                alt="Nikunj Khitha Resume"
                layout="responsive"
                width={900}
                height={600}
                className={`transition-transform duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{
                  boxShadow: resolvedTheme === "light" ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
                }}
              />
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        a {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
