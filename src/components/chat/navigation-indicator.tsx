import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation,
  Download,
  Palette,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { classNames } from "@/utility/classNames";

export interface NavigationAction {
  id: string;
  type: "navigate" | "download" | "theme" | "modal" | "scroll";
  target: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  message?: string;
  timestamp: Date;
}

interface NavigationIndicatorProps {
  actions: NavigationAction[];
  onDismiss?: (actionId: string) => void;
}

export default function NavigationIndicator({
  actions,
  onDismiss,
}: NavigationIndicatorProps) {
  const activeActions = actions.filter(
    (action) => action.status === "pending" || action.status === "in-progress"
  );

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
        return Navigation;
    }
  };

  const getActionMessage = (action: NavigationAction) => {
    if (action.message) return action.message;

    switch (action.type) {
      case "navigate":
        return action.status === "in-progress"
          ? `Navigating to ${action.target}...`
          : `Navigate to ${action.target}`;
      case "download":
        return action.status === "in-progress"
          ? `Downloading ${action.target}...`
          : `Download ${action.target}`;
      case "theme":
        return action.status === "in-progress"
          ? `Switching to ${action.target} theme...`
          : `Switch to ${action.target} theme`;
      case "modal":
        return action.status === "in-progress"
          ? `Opening ${action.target}...`
          : `Open ${action.target}`;
      case "scroll":
        return action.status === "in-progress"
          ? `Scrolling to ${action.target}...`
          : `Scroll to ${action.target}`;
      default:
        return "Processing action...";
    }
  };

  const getStatusColor = (status: NavigationAction["status"]) => {
    switch (status) {
      case "pending":
  return "text-amber-600 dark:text-amber-400";
      case "in-progress":
  return "text-accent";
      case "completed":
  return "text-emerald-500 dark:text-emerald-400";
      case "failed":
  return "text-rose-500 dark:text-rose-400";
      default:
  return "text-foreground/70";
    }
  };

  const getStatusIcon = (status: NavigationAction["status"]) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "failed":
        return AlertCircle;
      default:
        return null;
    }
  };

  if (activeActions.length === 0) return null;

  return (
    <motion.div
      className="fixed right-4 top-4 z-50 space-y-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <AnimatePresence mode="popLayout">
        {activeActions.map((action) => {
          const ActionIcon = getActionIcon(action.type);
          const StatusIcon = getStatusIcon(action.status);
          const wrapperGradient = (() => {
            switch (action.status) {
              case "in-progress":
                return "from-accent/30 via-accent/10 to-background/60 border-accent/40";
              case "completed":
                return "from-emerald-500/30 via-emerald-500/10 to-background/60 border-emerald-500/40";
              case "failed":
                return "from-rose-500/30 via-rose-500/10 to-background/60 border-rose-500/40";
              case "pending":
              default:
                return "from-amber-500/25 via-amber-500/10 to-background/60 border-amber-500/40";
            }
          })();

          return (
            <motion.div
              key={action.id}
              className={classNames(
                "group relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 shadow-lg backdrop-blur-xl",
                "min-w-[280px] max-w-[400px]",
                "bg-gradient-to-br",
                wrapperGradient,
                "transition-colors duration-300"
              )}
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              layout
            >
              {/* Action Icon */}
              <motion.div
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-inset",
                  action.status === "in-progress"
                    ? "bg-accent/20 text-accent ring-accent/40"
                    : action.status === "completed"
                    ? "bg-emerald-500/15 text-emerald-500 ring-emerald-500/40"
                    : action.status === "failed"
                    ? "bg-rose-500/15 text-rose-500 ring-rose-500/40"
                    : "bg-amber-500/15 text-amber-500 ring-amber-500/40"
                )}
                animate={action.status === "in-progress" ? { rotate: 360 } : {}}
                transition={
                  action.status === "in-progress"
                    ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }
                    : {}
                }
              >
                <ActionIcon size={16} className="drop-shadow" />
              </motion.div>

              {/* Action Details */}
              <div className="min-w-0 flex-1">
                <motion.p
                  className={classNames(
                    "truncate text-sm font-medium",
                    getStatusColor(action.status)
                  )}
                  layout
                >
                  {getActionMessage(action)}
                </motion.p>

                {/* Progress Bar for In-Progress Actions */}
                {action.status === "in-progress" && (
                  <motion.div
                    className={classNames(
                      "mt-2 h-1 overflow-hidden rounded-full",
                      action.status === "in-progress" &&
                        "bg-accent/20 dark:bg-accent/30"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Status Icon */}
              {StatusIcon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <StatusIcon
                    size={16}
                    className={classNames(
                      "drop-shadow",
                      action.status === "completed"
                        ? "text-emerald-500"
                        : action.status === "failed"
                        ? "text-rose-500"
                        : getStatusColor(action.status)
                    )}
                  />
                </motion.div>
              )}

              {/* Dismiss Button */}
              {onDismiss && action.status !== "in-progress" && (
                <motion.button
                  onClick={() => onDismiss(action.id)}
                  className="ml-2 rounded p-1 text-muted-foreground/70 hover:bg-foreground/10 hover:text-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Dismiss notification"
                >
                  ×
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

// Hook for managing navigation actions
export function useNavigationActions() {
  const [actions, setActions] = React.useState<NavigationAction[]>([]);

  const addAction = React.useCallback(
    (type: NavigationAction["type"], target: string, message?: string) => {
      const action: NavigationAction = {
        id: `${type}-${target}-${Date.now()}`,
        type,
        target,
        status: "pending",
        message,
        timestamp: new Date(),
      };

      setActions((prev) => [...prev, action]);
      return action.id;
    },
    []
  );

  const updateActionStatus = React.useCallback(
    (
      actionId: string,
      status: NavigationAction["status"],
      message?: string
    ) => {
      setActions((prev) =>
        prev.map((action) =>
          action.id === actionId
            ? { ...action, status, message: message || action.message }
            : action
        )
      );
    },
    []
  );

  const removeAction = React.useCallback((actionId: string) => {
    setActions((prev) => prev.filter((action) => action.id !== actionId));
  }, []);

  const clearCompletedActions = React.useCallback(() => {
    setActions((prev) =>
      prev.filter(
        (action) =>
          action.status === "pending" || action.status === "in-progress"
      )
    );
  }, []);

  return {
    actions,
    addAction,
    updateActionStatus,
    removeAction,
    clearCompletedActions,
  };
}
