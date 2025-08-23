import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Navigation,
  Download,
  Palette,
  ExternalLink,
  Bot,
} from "lucide-react";
import { ToolCall } from "@/types/tools";
import { classNames } from "@/utility/classNames";
import { ActionIndicator } from "./action-indicator";

export function ToolExecutionResult({ toolCall }: { toolCall: ToolCall }) {
  const { name, result } = toolCall;
  const isSuccess = result?.success ?? false;
  const hasActions = result?.actions && result.actions.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  const getToolIcon = (toolName: string) => {
    if (toolName.toLowerCase().includes("navigate")) return Navigation;
    if (toolName.toLowerCase().includes("download")) return Download;
    if (toolName.toLowerCase().includes("theme")) return Palette;
    if (toolName.toLowerCase().includes("modal")) return ExternalLink;
    return Bot;
  };

  const ToolIcon = getToolIcon(name);

  const getSummaryMessage = () => {
    if (isSuccess) {
      if (hasActions && result?.actions) {
        const action = result.actions[0];
        switch (action.type) {
          case "navigate":
            return `Navigated to ${action.target}`;
          case "download":
            return `Downloaded ${action.target}`;
          case "theme":
            return `Switched to ${action.target} theme`;
          case "modal":
            return `Opened ${action.target}`;
          case "scroll":
            return `Scrolled to ${action.target}`;
          default:
            return "Action completed successfully";
        }
      }
      return "Executed successfully";
    }
    return result?.error?.message || "Execution failed";
  };

  return (
    <motion.div
      className={classNames(
        "cursor-pointer rounded-lg border text-xs transition-all duration-200",
        isSuccess
          ? "border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800 dark:bg-green-950/30 dark:hover:bg-green-950/50"
          : "border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:hover:bg-red-950/50"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-2 p-3">
        <motion.div
          className={classNames(
            "flex h-5 w-5 items-center justify-center rounded-full",
            isSuccess ? "bg-green-500" : "bg-red-500"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
        >
          {isSuccess ? (
            <CheckCircle size={12} className="text-white" />
          ) : (
            <XCircle size={12} className="text-white" />
          )}
        </motion.div>

        <div className="flex flex-1 items-center gap-1">
          <ToolIcon
            size={14}
            className={
              isSuccess
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }
          />
          <span
            className={classNames(
              "font-medium",
              isSuccess
                ? "text-green-800 dark:text-green-200"
                : "text-red-800 dark:text-red-200"
            )}
          >
            {name.replace(/([A-Z])/g, " $1").trim()}
          </span>
        </div>

        <span
          className={classNames(
            "ml-2 flex-1 truncate text-right text-xs",
            isSuccess
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {getSummaryMessage()}
        </span>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={classNames(
            "ml-2",
            isSuccess
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-current/20 border-t"
          >
            <div className="p-3 pt-2">
              {isSuccess && result?.data !== undefined && (
                <motion.div
                  className="mb-2 text-green-700 dark:text-green-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="mb-1 font-medium">Result:</p>
                  {typeof result.data === "string" ? (
                    <p className="text-xs">{result.data}</p>
                  ) : (
                    <pre className="whitespace-pre-wrap rounded bg-green-100 p-2 font-mono text-xs dark:bg-green-900/30">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </motion.div>
              )}

              {!isSuccess && result?.error && (
                <motion.div
                  className="mb-2 text-red-700 dark:text-red-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="mb-1 font-medium">Error Details:</p>
                  <p className="mb-2 text-xs">{result.error.message}</p>
                  {result.error.suggestions &&
                    result.error.suggestions.length > 0 && (
                      <div>
                        <p className="mb-1 font-medium">Suggestions:</p>
                        <ul className="list-inside list-disc space-y-1">
                          {result.error.suggestions.map((s, i) => (
                            <li key={i} className="text-xs">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </motion.div>
              )}

              {hasActions && (
                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p
                    className={classNames(
                      "font-medium",
                      isSuccess
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    )}
                  >
                    Actions Performed:
                  </p>
                  {result!.actions!.map((action, index) => (
                    <ActionIndicator key={index} action={action} />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
