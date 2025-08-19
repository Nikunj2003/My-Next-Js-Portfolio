type DividerSize = "sm" | "md" | "lg";

export default function SectionDivider({
  size = "lg",
}: {
  size?: DividerSize;
}) {
  const spacing = size === "sm" ? "my-10" : size === "md" ? "my-14" : "my-16";
  return (
    <div
      className={`mx-auto ${spacing} h-px w-11/12 max-w-7xl bg-gradient-to-r from-transparent via-accent/30 to-transparent`}
    />
  );
}
