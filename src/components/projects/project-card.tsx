import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Corosel from "@/components/utility/corosel";
import { GithubIcon } from "@/components/icons";
import { useAnimationGate } from "@/contexts/animation-gate";

export interface ProjectCardProps {
  name: string;
  favicon: string;
  imageUrl: string[];
  description: string;
  sourceCodeHref: string;
  liveWebsiteHref?: string;
  category: string;
  technologies: string[];
}

export default function ProjectCard(props: ProjectCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { animationsReady } = useAnimationGate();

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

  // If gate not ready yet, render non-animated static markup so that whileInView fires after gate opens.
  if (!animationsReady) {
    return (
      <div className={`w-full overflow-hidden rounded-lg border border-accent/20 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 ${backgroundColor}`}>
        <Corosel images={props.imageUrl} aspectRatio={1.9} />
        <div className="p-4 text-foreground sm:p-6">
          <div className="flex items-center gap-3">
            <span className="relative h-6 w-6 text-2xl">{props.favicon}</span>
            <span className="text-lg font-semibold">{props.name}</span>
          </div>
          <div className="mt-3">
            <p className="text-sm md:text-base text-muted-foreground">
              {props.description}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-end gap-6">
            {props?.sourceCodeHref && (
              <a
                href={props.sourceCodeHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source code for ${props.name}`}
                className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                <GithubIcon className="h-5 w-5" /> Source code
              </a>
            )}
            {props.liveWebsiteHref && (
              <a
                href={props.liveWebsiteHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live website for ${props.name}`}
                className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                <FiExternalLink className="h-5 w-5" /> Live
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ease: "easeOut", duration: 0.4 }}
      className={`w-full overflow-hidden rounded-lg border border-accent/20 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 ${backgroundColor}`}
    >
      <Corosel images={props.imageUrl} aspectRatio={1.9} />
      <div className="p-4 text-foreground sm:p-6">
        <div className="flex items-center gap-3">
          <span className="relative h-6 w-6 text-2xl">{props.favicon}</span>
          <span className="text-lg font-semibold">{props.name}</span>
        </div>
        <div className="mt-3">
          <p className="text-sm md:text-base text-muted-foreground">
            {props.description}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-6">
          {props?.sourceCodeHref && (
            <a
              href={props.sourceCodeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View source code for ${props.name}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              <GithubIcon className="h-5 w-5" /> Source code
            </a>
          )}
          {props.liveWebsiteHref && (
            <a
              href={props.liveWebsiteHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View live website for ${props.name}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              <FiExternalLink className="h-5 w-5" /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
