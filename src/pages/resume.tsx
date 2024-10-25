import { siteMetadata } from "@/data/siteMetaData.mjs";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Resume() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 845);
    };

    handleResize(); // Initial check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Ensures the theme is mounted before rendering
    setMounted(true);
  }, []);

  // Avoid rendering before theme is fully resolved to prevent flicker
  if (!mounted) return null;

  return (
    <>
      <NextSeo
        title="Resume of Nikunj Khitha - FullStack & AI Developer"
        description="Download the resume of Nikunj Khitha, a seasoned FullStack Developer with expertise in MERN Stack, DevOps, AI, Mobile and Web App development."
        canonical={`${siteMetadata.siteUrl}/resume`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/resume`,
          title: "Nikunj Khitha's Resume - FullStack & AI Developer",
          description:
            "Explore the professional resume of Nikunj Khitha, a MERN and FullStack Developer with a diverse skill set in web development.",
          images: [
            {
              url: `${siteMetadata.siteUrl}${siteMetadata.twitterImage}`,
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
              "Resume, Portfolio, AI Developer, DevOps, FullStack Developer, Web Development, JavaScript, HTML, CSS",
          },
        ]}
      />

      <section className="mx-auto mb-14 mt-6 w-full gap-20 px-6 sm:mt-12 sm:px-14 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div
            className={`rmb mb-6 flex justify-center transition-transform duration-700 ${
              isVisible ? "translate-y-0" : "translate-y-10 opacity-0"
            }`}
          >
            <a
              href="/Resume.pdf"
              download
              className={`relative mx-3 my-3 font-semibold transition-transform duration-100 hover:scale-110 ${
                resolvedTheme === "dark" ? "text-black" : "text-white"
              } rounded-full bg-[#56A5A9] px-6 py-4 sm:px-5 sm:py-3`} // Adjust text color based on theme
              style={{
                fontSize: "1.10rem",
                transition: "background-color 0.3s ease",
                marginBottom: "2.1rem",
              }} // Increased font size
            >
              Download Resume
            </a>
          </div>

          <div className="rmt mt-8 flex justify-center">
            <div
              className={`rmt flex items-center justify-center rounded-lg p-4 backdrop-blur-lg transition-opacity duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maxWidth: "900px",
                width: "95%",
                minHeight: "600px",
                paddingTop: "3rem",
                paddingBottom: "3rem",
                backgroundColor:
                  resolvedTheme === "dark"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.2)",
                border: `1px solid ${
                  resolvedTheme === "dark" ? "#1A5458" : "#D6E8E9"
                }`,
                boxShadow:
                  resolvedTheme === "dark"
                    ? "none"
                    : "0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)",
                transform:
                  resolvedTheme === "dark" ? "none" : "translateY(-2px)", // Slight translateY for 3D effect
                display: !isMobile ? "flex" : "none", // Hide on mobile
              }}
            >
              <img
                src="/resume.png"
                alt="Nikunj Khitha Resume"
                className={`transition-transform duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{
                  maxWidth: "90%",
                  height: "auto",
                }}
              />
            </div>

            {isMobile && (
              <img
                src="/resume.png"
                alt="Nikunj Khitha Resume"
                className={`transition-transform duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{
                  maxWidth: "90%",
                  height: "auto",
                  boxShadow:
                    resolvedTheme === "light"
                      ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                      : "none", // Add shadow only in light mode for mobile
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
