import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { FC, SVGProps, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Corosel from "@/components/utility/corosel";
import { GithubIcon } from "@/components/icons";

export interface ProjectCardProps {
  name: string;
  favicon: string;
  imageUrl: string[];
  description: string;
  sourceCodeHref: string;
  liveWebsiteHref?: string;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is mounted to avoid mismatches on first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define background color based on theme (dark/light) after the component has mounted
  const backgroundColor =
    resolvedTheme === "dark"
      ? "bg-black/20 backdrop-blur-lg" // Dark theme background with blur
      : "bg-white/20 backdrop-blur-lg"; // Light theme background with blur

  // Prevent rendering before the theme is resolved (avoiding mismatched colors during SSR or initial page load)
  if (!mounted) return null;

  return (
    <motion.div
      initial={{ y: 80 }}
      whileInView={{ y: 0 }}
      transition={{
        type: "spring",
        duration: 0.4,
      }}
      className={`w-full overflow-hidden rounded-lg border border-accent/20 shadow-md transition-shadow duration-150 hover:shadow-md hover:shadow-accent/20 ${backgroundColor}`}
    >
      <Corosel images={props.imageUrl} aspectRatio={2.1} />
      <div className="p-3 text-foreground sm:p-4">
        <div className="flex items-center gap-3">
          <span className="relative h-5 w-5">
            {props.favicon}
          </span>
          <span className="text-sm font-semibold">{props.name}</span>
        </div>
        <div className="mt-3">
          <p className="text-xs md:text-sm">{props.description}</p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-6">
          {props?.sourceCodeHref && (
            <a
              href={props.sourceCodeHref}
              target="_blank"
              className="flex items-center gap-1 text-xs underline md:text-sm"
            >
              <GithubIcon className="h-5 w-5" /> Source code
            </a>
          )}
          {props.liveWebsiteHref && (
            <a
              href={props.liveWebsiteHref}
              target="_blank"
              className="flex items-center gap-1 text-xs underline md:text-sm"
            >
              <FiExternalLink className="h-5 w-5" /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
