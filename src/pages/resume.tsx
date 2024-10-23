import { siteMetadata } from "@/data/siteMetaData.mjs";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Resume() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 845);
    };

    handleResize(); // Initial check on mount
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const backgroundColor = resolvedTheme === "dark" 
    ? 'rgba(0, 0, 0, 0.2)' 
    : 'rgba(255, 255, 255, 0.2)';

  const buttonTextColor = resolvedTheme === "dark" ? 'text-black' : 'text-white';

  return (
    <>
      <NextSeo
        title="Resume of Nikunj Khitha - FullStack & AI Developer"
        description="Download the resume of Nikunj Khitha, a seasoned FullStack Developer with expertise in MERN Stack, DevOps, AI, Mobile and Web App development."
        canonical={`${siteMetadata.siteUrl}/resume`}
        openGraph={{
          url: `${siteMetadata.siteUrl}/resume`,
          title: "Nikunj Khitha's Resume - FullStack & AI Developer",
          description: "Explore the professional resume of Nikunj Khitha, a MERN and FullStack Developer with a diverse skill set in web development.",
          images: [{
            url: `${siteMetadata.siteUrl}${siteMetadata.twitterImage}`,
            alt: "Nikunj Khitha - Resume Image",
          }],
          siteName: siteMetadata.siteName,
          type: "website",
        }}
        twitter={{ cardType: "summary_large_image" }}
        additionalMetaTags={[{
          property: "keywords",
          content: "Resume, Portfolio, AI Developer, DevOps, FullStack Developer, Web Development, JavaScript, HTML, CSS",
        }]}
      />

      <section className="mx-auto mt-6 w-full gap-20 px-6 mb-14 sm:mt-12 sm:px-14 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className={`rmb flex justify-center mb-6 transition-transform duration-700 ${isVisible ? 'translate-y-0' : 'translate-y-10 opacity-0'}`}>
            <a
              href="/Resume.pdf"
              download
              className={`mx-3 my-3 transition-transform duration-100 hover:scale-110 relative font-semibold ${buttonTextColor} bg-[#56A5A9] rounded-full px-4 py-3 sm:px-3 sm:py-2`}
              style={{ transition: 'background-color 0.3s ease' }}
            >
              Download Resume
            </a>
          </div>

          <div className="mt-8 flex justify-center rmt">
            <div
              className={`rmt bg-white bg-opacity-30 backdrop-blur-lg p-4 rounded-lg transition-opacity duration-700 flex justify-center items-center ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maxWidth: '900px',
                width: '95%',
                minHeight: '600px',
                backgroundColor,
                display: !isMobile ? 'flex' : 'none', // Hide on mobile
              }}
            >
              <img
                src="/resume.png"
                alt="Nikunj Khitha Resume"
                className={`border-2 border-gray-300 transition-transform duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{
                  maxWidth: '90%',
                  height: 'auto',
                }}
              />
            </div>

            {isMobile && (
              <img
                src="/resume.png"
                alt="Nikunj Khitha Resume"
                className={`border-2 border-gray-300 transition-transform duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{
                  maxWidth: '90%',
                  height: 'auto',
                }}
              />
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 845px) {
          section {
            margin-top: 0;
            margin-bottom: 0;
            padding-top: 20px;
            padding-right: 20px;
            padding-left: 20px;
            padding-bottom: 0px;
          }
          .rmt {
            margin-top: 2.5rem;
            min-height: 300px;
          }
          .rmb {
            margin-bottom: 0;
          }
        }
      `}</style>
    </>
  );
}
