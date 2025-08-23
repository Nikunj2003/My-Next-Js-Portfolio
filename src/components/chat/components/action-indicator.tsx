import { motion } from "framer-motion";
import { Navigation, Download, Palette, ExternalLink, Bot } from "lucide-react";
import { ToolAction } from "@/types/tools";

export function ActionIndicator({ action }: { action: ToolAction }) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case "navigate":
        return Navigation;
      case "download":
        return Download;
      case "theme":
        return Palette;
      case "modal":
        return ExternalLink;
      case "scroll":
        return Navigation;
      default:
        return Bot;
    }
  };
  const ActionIcon = getActionIcon(action.type);
  return (
    <motion.div
      className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <ActionIcon size={12} />
      <span>
        {action.type === "navigate" && `Navigating to ${action.target}`}
        {action.type === "download" && `Downloading ${action.target}`}
        {action.type === "theme" && `Switching to ${action.target} theme`}
        {action.type === "modal" && `Opening ${action.target} modal`}
        {action.type === "scroll" && `Scrolling to ${action.target}`}
      </span>
    </motion.div>
  );
}
