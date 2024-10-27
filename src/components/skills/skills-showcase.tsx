import { AnimatePresence } from "framer-motion";
import SkillPill, { type SkillPillProps } from "@/components/skills/skills-pill";
import FadeRight from "@/animation/fade-right";
import { useScreenBreakpoint } from "@/hooks/useScreenBreakpoint";
import { useDebounceValue } from "@/hooks/useDebounceValue";

export interface SkillsShowcaseProps {
  skills: {
    sectionName: string;
    skills: SkillPillProps[];
  }[];
}

export default function SkillsShowcase({ skills }: SkillsShowcaseProps) {
  const isMobile = useScreenBreakpoint(640);
  const isMobileDebounced = useDebounceValue(isMobile, 300); // Adjust debounce time

  return (
    <section className="overflow-hidden px-6 py-32 sm:px-14 md:px-20">
      <div className="relative mx-auto max-w-7xl">
        <h2 className="text-xl font-semibold text-accent sm:text-4xl">Skills</h2>
        {skills.map((section) => (
          <div key={section.sectionName} className="mt-4">
            <span className="text-xs font-semibold text-foreground sm:text-sm">
              {section.sectionName}
            </span>
            <div className="mt-2 flex flex-wrap gap-4 text-xl text-accent-foreground">
              {section.skills.map((pill, index) => (
                <AnimatePresence key={`pill-${index}`}>
                  <FadeRight
                    key={`lang-${index}`}
                    duration={isMobileDebounced ? 0.2 : 0.4} // Reduce duration for smoother mobile
                    delay={0.1 + index * 0.1}
                    whileInView={!isMobileDebounced} // Triggers on scroll for non-mobile
                  >
                    <SkillPill {...pill} />
                  </FadeRight>
                </AnimatePresence>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
