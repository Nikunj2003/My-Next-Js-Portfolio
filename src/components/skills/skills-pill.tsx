import { FC, SVGProps, memo } from "react";

export type SkillPillProps = {
  name: string;
  icon: FC<SVGProps<SVGSVGElement>>;
};

function SkillPillComponent(props: SkillPillProps) {
  const { name, icon: Icon } = props;

  return (
    <div
      className={
        "flex w-max items-center gap-2 overflow-hidden rounded-lg border border-accent/20 bg-white/20 px-4 py-3 text-sm shadow-md backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20 dark:bg-black/20 sm:text-base md:px-6 md:py-3 md:text-lg"
      }
    >
      <Icon className="h-5 w-5 sm:h-8 sm:w-8" />
      <span className="font-medium">{name}</span>
    </div>
  );
}

export default memo(SkillPillComponent);
