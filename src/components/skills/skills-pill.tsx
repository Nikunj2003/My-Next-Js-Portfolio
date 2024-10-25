import { FC, SVGProps, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type SkillPillProps = {
  name: string;
  icon: FC<SVGProps<SVGSVGElement>>;
};

export default function SkillPill(props: SkillPillProps) {
  const { name, icon: Icon } = props;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is mounted to avoid mismatches on first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define background color based on theme (dark/light) after the component has mounted
  const backgroundColor =
    resolvedTheme === "dark"
      ? "bg-black/10 backdrop-blur-lg" // Dark theme background with blur
      : "bg-white/10 backdrop-blur-lg"; // Light theme background with blur

  // Prevent rendering before the theme is resolved (avoiding mismatched colors during SSR or initial page load)
  if (!mounted) return null;

  return (
    <div
      className={`flex w-max items-center gap-2 overflow-hidden rounded-lg border border-accent/20 px-4 py-3 text-sm shadow-sm sm:text-base md:px-6 md:py-3 md:text-lg ${backgroundColor}`}
    >
      <Icon className="h-5 w-5 sm:h-8 sm:w-8" />
      <span className="font-medium">{name}</span>
    </div>
  );
}
