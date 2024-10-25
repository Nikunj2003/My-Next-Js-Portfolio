import { SVGMotionProps, motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { classNames } from "@/utility/classNames";

const Path = (props: SVGMotionProps<SVGPathElement>) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    strokeLinecap="round"
    {...props}
  />
);

export interface MenuLogoProps {
  open: boolean;
  toggle: () => void;
}

export default function MenuLogo(props: MenuLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is mounted to avoid mismatches on first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define background color based on theme after the component has mounted
  const backgroundColor =
    resolvedTheme === "dark"
      ? "bg-black/10 backdrop-blur-lg" // Dark theme background with blur
      : "bg-white/10 backdrop-blur-lg"; // Light theme background with blur

  // Prevent rendering before the theme is resolved
  if (!mounted) return null;

  return (
    <button
      aria-label="open menu"
      onClick={props.toggle}
      className={classNames(
        "relative z-50 flex h-12 w-12 select-none items-center gap-1 rounded-full p-3 py-1 font-semibold shadow-md ring-1 ring-zinc-200 dark:ring-accent/50 md:hidden",
        backgroundColor // Apply dynamic background based on theme
      )}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 23 23"
        className={classNames("mt-1", "stroke-accent")}
        animate={props.open ? "open" : "close"}
        initial={props.open ? "open" : "close"} // Set initial state
      >
        <Path
          variants={{
            close: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            close: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            close: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </motion.svg>
    </button>
  );
}
