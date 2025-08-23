import { ToolAction } from "@/types/tools";

export function normalizeActionType(raw: string): ToolAction["type"] {
  const lower = raw.toLowerCase();
  if (
    /(^scrollto$)|(^scroll_to$)|(^scroll-section$)|(^scrollsection$)/.test(
      lower
    )
  )
    return "scroll";
  switch (lower) {
    case "navigate":
    case "download":
    case "theme":
    case "modal":
    case "scroll":
      return lower as ToolAction["type"];
    default:
      if (lower.startsWith("scroll")) return "scroll";
      return "scroll"; // fallback
  }
}
