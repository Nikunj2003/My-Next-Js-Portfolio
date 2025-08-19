import SkillPill, {
  type SkillPillProps,
} from "@/components/skills/skills-pill";
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
    <section
      id="skills"
      className="overflow-hidden px-6 py-28 sm:px-14 md:px-24"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-muted/20 p-6 shadow-lg ring-1 ring-zinc-200/50 backdrop-blur-lg dark:ring-accent/20 sm:p-8 md:p-12">
          <h2 className="text-xl font-semibold text-accent sm:text-4xl">
            Skills
          </h2>
          {skills.map((section) => (
            <div key={section.sectionName} className="mt-6">
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                {section.sectionName}
              </span>
              <div className="mt-3 flex flex-wrap gap-4 text-xl text-accent-foreground">
                {section.skills.map((pill, index) => (
                  <FadeRight
                    key={`lang-${index}`}
                    duration={isMobileDebounced ? 0.2 : 0.4}
                    delay={0.06 + index * 0.08}
                    whileInView={true}
                  >
                    <SkillPill {...pill} />
                  </FadeRight>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
