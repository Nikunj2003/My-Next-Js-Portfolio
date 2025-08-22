import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Send,
  User,
  Bot,
  X,
  CheckCircle,
  XCircle,
  Navigation,
  Download,
  Palette,
  ExternalLink,
  Trash2,
  Maximize,
  Minimize,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "next-themes";
import { classNames } from "@/utility/classNames";
import { useAutosizeTextArea } from "@/hooks/useAutoSizeTextarea";
import { ToolCall, ToolAction } from "@/types/tools";
import NavigationIndicator, {
  useNavigationActions,
} from "./navigation-indicator";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  toolCalls?: ToolCall[];
  isToolExecution?: boolean;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

// Normalize incoming (possibly LLM-generated) action type variants to canonical ones
function normalizeActionType(raw: string): ToolAction["type"] {
  const lower = raw.toLowerCase();
  if (
    lower === "scrollto" ||
    lower === "scroll_to" ||
    lower === "scroll-section" ||
    lower === "scrollsection"
  )
    return "scroll";
  // Already valid types -> return as-is when matching
  switch (lower) {
    case "navigate":
    case "download":
    case "theme":
    case "modal":
    case "scroll":
      return lower as ToolAction["type"];
    default:
      // Fallback: try partial match
      if (lower.startsWith("scroll")) return "scroll";
      return "scroll"; // safe default (or could throw)
  }
}

// Tool execution result component
function ToolExecutionResult({ toolCall }: { toolCall: ToolCall }) {
  const { name, result } = toolCall;
  const isSuccess = result?.success ?? false;
  const hasActions = result?.actions && result.actions.length > 0;
  const [isExpanded, setIsExpanded] = useState(false);

  const getToolIcon = (toolName: string) => {
    if (toolName.includes("Navigate") || toolName.includes("navigate"))
      return Navigation;
    if (toolName.includes("Download") || toolName.includes("download"))
      return Download;
    if (toolName.includes("Theme") || toolName.includes("theme"))
      return Palette;
    if (toolName.includes("Modal") || toolName.includes("modal"))
      return ExternalLink;
    return Bot;
  };

  const ToolIcon = getToolIcon(name);

  // Get summary message for collapsed state
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
    } else {
      return result?.error?.message || "Execution failed";
    }
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
      {/* Collapsed Header */}
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

        {/* Summary message */}
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

        {/* Expand/Collapse indicator */}
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

      {/* Expanded Details */}
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
              {/* Success data */}
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

              {/* Error details */}
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
                          {result.error.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-xs">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </motion.div>
              )}

              {/* Actions performed */}
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

// Action indicator component
function ActionIndicator({ action }: { action: ToolAction }) {
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

export default function ChatWindow({
  isOpen,
  onClose,
  isFullScreen = false,
  onToggleFullScreen,
}: ChatWindowProps) {
  // Track first render to avoid re-playing entrance animation on each fullscreen toggle
  const firstRenderRef = useRef(true);
  useEffect(() => {
    firstRenderRef.current = false;
  }, []);
  const router = useRouter();
  // Add highlight styles to the document head if not already present
  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      !document.getElementById("chat-highlight-styles")
    ) {
      const style = document.createElement("style");
      style.id = "chat-highlight-styles";
      style.textContent = `
        .highlight-section {
          animation: highlight-pulse 2s ease-in-out;
          scroll-margin-top: 2rem;
        }
          updateActionStatus(actionId, "in-progress");
          const autoShrinkEligible = ["navigate", "scroll", "download", "modal", "theme"] as const;
          const autoShrinkTools = new Set([
            "manage_ui_state",
            "open_modal",
            "navigate_to_page",
            "navigate_to_section",
          ]);
          if (
            isFullScreen &&
            onToggleFullScreen &&
            originTool &&
            autoShrinkTools.has(originTool)
          ) {
            onToggleFullScreen();
          }
          // Auto-exit fullscreen ONLY for specific tools (not all actions)
          if (isFullScreen && onToggleFullScreen && autoShrinkEligible.includes(action.type)) {
            onToggleFullScreen();
          }
        @keyframes highlight-pulse {
          0% { 
          // Enhanced API call to get tool execution results
            background-color: rgba(59, 130, 246, 0.05);
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            background-color: transparent;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hi! I'm an AI assistant that can answer questions about Nikunj Khitha's background, skills, and experience. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // Scroll behavior control
  const pendingUserMessageIdRef = useRef<string | null>(null); // last sent user message id awaiting AI reply
  const desiredScrollBehaviorRef = useRef<"none" | "anchorUserTop">("none");
  const userInitiatedScrollRef = useRef(false); // user scrolled up (lock auto positioning)
  const wasNearBottomBeforeAIRef = useRef(false); // track state before AI message insertion
  // const lastAIMessageIdRef = useRef<string | null>(null); // removed unused ref
  const pendingScrollRef = useRef<"none" | "bottom">("none");
  // const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  // Input focus animation removed per user request
  // (keeping placeholder for potential future minimal logic)

  // Navigation actions
  const { actions, addAction, updateActionStatus, removeAction } =
    useNavigationActions();

  // Theme management
  const { setTheme, resolvedTheme } = useTheme();

  useAutosizeTextArea(textareaRef, inputValue, "40px", {
    minHeight: 40,
    maxHeight: 240,
    shrinkOnEmpty: true,
  });

  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 120; // px
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold
    );
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Set up scroll listener to detect user manual scrolling (locks auto anchor positioning)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    let lastScrollTop = container.scrollTop;
    const onScroll = () => {
      const st = container.scrollTop;
      // If user scrolls up significantly, lock
      if (st < lastScrollTop && !isNearBottom()) {
        userInitiatedScrollRef.current = true;
      } else if (isNearBottom()) {
        // Unlock when user returns near bottom
        userInitiatedScrollRef.current = false;
      }
      lastScrollTop = st;
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // Apply desired anchor scroll after AI message appended
  useEffect(() => {
    if (desiredScrollBehaviorRef.current === "anchorUserTop") {
      const container = messagesContainerRef.current;
      if (!container) return;
      // Skip if user scrolled away
      if (userInitiatedScrollRef.current) {
        desiredScrollBehaviorRef.current = "none";
        return;
      }
      const userId = pendingUserMessageIdRef.current;
      if (!userId) return;
      // Allow layout paint
      const timer = setTimeout(() => {
        const el = container.querySelector(
          `[data-message-id="${userId}"]`
        ) as HTMLElement | null;
        if (el) {
          const GAP = 16; // reduced gap per user request
          // Smooth anchor scroll
          const top = el.offsetTop - GAP;
          container.scrollTo({
            top: top < 0 ? 0 : top,
            behavior: wasNearBottomBeforeAIRef.current ? "smooth" : "auto",
          });
          // Removed blue ring highlight per user request.
        }
        desiredScrollBehaviorRef.current = "none";
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // Perform deferred scroll actions (e.g., after user sends a message) once messages render
  useEffect(() => {
    if (pendingScrollRef.current === "bottom") {
      scrollToBottom(true);
      pendingScrollRef.current = "none";
    }
  }, [messages.length]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Scroll position tracking to toggle scroll-to-bottom button
  // useEffect(() => {
  //   const el = messagesContainerRef.current;
  //   if (!el) return;
  //   const handler = () => {
  //     const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  //     setShowScrollToBottom(!nearBottom);
  //   };
  //   el.addEventListener('scroll', handler);
  //   handler();
  //   return () => el.removeEventListener('scroll', handler);
  // }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    pendingUserMessageIdRef.current = userMessage.id;
    // Defer scroll until after DOM updates to ensure accurate bottom position
    pendingScrollRef.current = "bottom";
    setInputValue("");
    // Force shrink immediately after clearing large pasted content
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    });
    setIsLoading(true);
    // Don't auto-scroll immediately, wait for AI response

    try {
      // Enhanced API call to get tool execution results
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          conversationHistory: messages,
          currentPage: window.location.pathname.slice(1) || "home",
          currentTheme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process tool calls and create navigation actions
      if (data.toolCalls && data.toolCalls.length > 0) {
        for (const toolCall of data.toolCalls) {
          if (toolCall.result?.actions) {
            // Mutate actions in-place to normalized types so UI components see canonical type
            toolCall.result.actions = toolCall.result.actions.map(
              (a: Partial<ToolAction> & { [k: string]: unknown }) => {
                const normalizedType = normalizeActionType(
                  (a as ToolAction).type || ""
                );
                return { ...a, type: normalizedType } as ToolAction;
              }
            );
            for (const action of toolCall.result.actions) {
              const actionId = addAction(action.type, action.target);
              executeAction(actionId, action as ToolAction, toolCall.name);
            }
          }
        }
      }

      // Create AI message with tool execution results
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.response ||
          "I apologize, but I'm having trouble responding right now.",
        sender: "ai",
        timestamp: new Date(),
        toolCalls: data.toolCalls,
      };

      wasNearBottomBeforeAIRef.current = isNearBottom();
      setMessages((prev) => [...prev, aiMessage]);
      // Request anchor positioning (only if user was near bottom)
      if (wasNearBottomBeforeAIRef.current) {
        desiredScrollBehaviorRef.current = "anchorUserTop";
      }
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble responding right now. Please try asking your question again.",
        sender: "ai",
        timestamp: new Date(),
      };
      wasNearBottomBeforeAIRef.current = isNearBottom();
      setMessages((prev) => [...prev, errorMessage]);
      if (wasNearBottomBeforeAIRef.current) {
        desiredScrollBehaviorRef.current = "anchorUserTop";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        content:
          "Hi! I'm an AI assistant that can answer questions about Nikunj Khitha's background, skills, and experience. What would you like to know?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    pendingUserMessageIdRef.current = null;
    desiredScrollBehaviorRef.current = "none";
    pendingScrollRef.current = "bottom";
    setHasInteracted(false); // allow quick suggestion buttons to reappear
    setInputValue("");
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "40px";
    });
  };

  const executeAction = async (
    actionId: string,
    action: ToolAction,
    originToolName?: string
  ) => {
    updateActionStatus(actionId, "in-progress");

    // Only auto-minimize when the originating tool is one of these
    const autoShrinkTools = new Set([
      "manage_ui_state",
      "open_modal",
      "navigate_to_page",
      "navigate_to_section",
    ]);
    const wasFullScreen = isFullScreen;
    if (
      wasFullScreen &&
      onToggleFullScreen &&
      originToolName &&
      autoShrinkTools.has(originToolName)
    ) {
      onToggleFullScreen();
    }

    try {
      // Simulate action execution with appropriate delays
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      // Execute the actual action based on type
      switch (action.type) {
        case "navigate":
          // Actually navigate to the target page
          if (action.target && typeof action.target === "string") {
            const targetPathRaw = action.target.startsWith("/")
              ? action.target
              : `/${action.target}`;
            // Normalize root/home aliases
            const targetPath = targetPathRaw === "/home" ? "/" : targetPathRaw;
            // Slight delay if we just auto-minimized to allow morph animation to be perceptible
            const navDelay = wasFullScreen ? 120 : 0;
            setTimeout(() => {
              router
                .push(targetPath)
                .catch((err) => console.error("Router navigation failed", err));
            }, navDelay);
            console.log(`Navigating (SPA) to ${targetPath}`);
          } else {
            console.error("Invalid navigation target:", action.target);
          }
          break;
        case "download":
          // Actually trigger the download
          if (action.target && typeof action.target === "string") {
            // Create a temporary link element and trigger download
            const link = document.createElement("a");
            link.href = action.target;
            type DownloadData = { fileName?: string } | undefined;
            const downloadMeta = action.data as DownloadData;
            link.download = downloadMeta?.fileName || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log(`Download triggered for ${action.target}`);
          } else {
            console.error("Invalid download target:", action.target);
          }
          break;
        case "theme":
          // Actually switch the theme
          if (action.target === "light" || action.target === "dark") {
            setTheme(action.target);
            console.log(`Theme switched to ${action.target}`);
          } else {
            // Toggle theme if target is not specific
            const newTheme = resolvedTheme === "dark" ? "light" : "dark";
            setTheme(newTheme);
            console.log(`Theme toggled to ${newTheme}`);
          }
          break;
        case "modal":
          // Open specific modals via global custom events
          if (typeof action.target === "string") {
            if (action.target.toLowerCase() === "contact") {
              window.dispatchEvent(new Event("open-contact-modal"));
              console.log("Dispatched open-contact-modal event");
            } else {
              console.log(`Modal target '${action.target}' not wired yet.`);
            }
          }
          break;
        case "scroll":
          // Actually scroll to the target element
          if (action.target && typeof action.target === "string") {
            let element: Element | null = null;

            // Try different selector strategies for finding the section
            const selectors = [
              `#${action.target}`, // Direct ID match
              `[data-section="${action.target}"]`, // Data attribute
              `.${action.target}-section`, // Class name with -section suffix
              `[id*="${action.target}"]`, // ID containing the target
              `[class*="${action.target}"]`, // Class containing the target
              `section[aria-label*="${action.target}"]`, // Section with aria-label
              `h2:contains("${action.target}")`, // Heading containing the text (won't work with querySelector)
            ];

            // Try each selector until we find the element
            for (const selector of selectors) {
              if (selector.includes(":contains(")) continue; // Skip pseudo-selectors
              try {
                element = document.querySelector(selector);
                if (element) break;
              } catch (e) {
                // Invalid selector, continue to next
                continue;
              }
            }

            // If still not found, try to find by text content
            if (!element) {
              const headings = Array.from(
                document.querySelectorAll("h1, h2, h3, h4, h5, h6")
              );
              for (const heading of headings) {
                if (
                  heading.textContent
                    ?.toLowerCase()
                    .includes(action.target.toLowerCase())
                ) {
                  element = heading.closest("section") || heading;
                  break;
                }
              }
            }

            if (element) {
              element.scrollIntoView({
                behavior: action.data?.smooth !== false ? "smooth" : "auto",
                block: "start",
              });
              console.log(`Scrolled to ${action.target}`);

              // Add highlight effect if requested
              if (action.data?.highlight) {
                element.classList.add("highlight-section");
                setTimeout(() => {
                  element?.classList.remove("highlight-section");
                }, 2000);
              }
            } else {
              console.warn(
                `Element not found for scroll target: ${action.target}`
              );
              // Try to scroll to a common skills section selector as fallback
              const fallbackSelectors = [
                "#skills",
                ".skills",
                '[data-section="skills"]',
              ];
              for (const fallback of fallbackSelectors) {
                const fallbackElement = document.querySelector(fallback);
                if (fallbackElement) {
                  fallbackElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  console.log(`Scrolled to fallback selector: ${fallback}`);
                  break;
                }
              }
            }
          } else {
            console.error("Invalid scroll target:", action.target);
          }
          break;
      }

      updateActionStatus(actionId, "completed");

      // Auto-remove completed actions after a delay
      setTimeout(() => {
        removeAction(actionId);
      }, 3000);
    } catch (error) {
      console.error("Action execution failed:", error);
      updateActionStatus(actionId, "failed", "Action failed to execute");

      // Auto-remove failed actions after a longer delay
      setTimeout(() => {
        removeAction(actionId);
      }, 5000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "What technologies does Nikunj use?",
    "Summarize Nikunj's experience",
    "List notable projects",
    "What are key skills?",
    "Navigate to Resume page",
    "Toggle theme",
    "Download Resume",
  ];

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    setHasInteracted(true);
    setTimeout(() => handleSendMessage(), 10);
  };

  return (
    <>
      {/* Navigation Indicator */}
      <NavigationIndicator actions={actions} onDismiss={removeAction} />

      <motion.div
        layout
        layoutId="chat-window"
        initial={
          firstRenderRef.current
            ? prefersReducedMotion
              ? { opacity: 0 }
              : isFullScreen
              ? { opacity: 0, scale: 0.95 }
              : { opacity: 0, scale: 0.8, y: 20, rotateX: -15 }
            : false
        }
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          borderRadius: prefersReducedMotion
            ? (isFullScreen ? 0 : 16)
            : isFullScreen
            ? 0
            : 16,
          boxShadow: isFullScreen
            ? "0 8px 40px -10px rgba(0,0,0,0.35)"
            : "0 8px 28px -4px rgba(0,0,0,0.30)",
          backdropFilter: isFullScreen ? "blur(28px)" : "blur(22px)",
          WebkitBackdropFilter: isFullScreen ? "blur(28px)" : "blur(22px)",
          transition: {
            borderRadius: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
          },
        }}
        exit={{
          opacity: 0,
          scale: prefersReducedMotion ? 1 : 0.9,
          y: prefersReducedMotion ? 0 : 10,
          rotateX: prefersReducedMotion ? 0 : 10,
          transition: { duration: 0.25 }
        }}
        transition={{
          layout: {
            type: "spring",
            stiffness: 260,
            damping: 34,
            mass: 0.7,
          },
          type: "spring",
          stiffness: isFullScreen ? 300 : 260,
            // slightly higher damping to remove bounce
          damping: isFullScreen ? 36 : 34,
          mass: isFullScreen ? 0.6 : 0.7,
        }}
        className={classNames(
          "fixed z-40",
          // positioning classes kept for accessibility & layout; layout animation will smooth between states
          isFullScreen
            ? "inset-0 h-screen w-screen"
            : "bottom-24 right-6 h-[32rem] w-80 sm:w-96",
          isFullScreen
            ? "bg-background/80 border-0 shadow-none"
            : "bg-background/55 border border-border/60 shadow-2xl",
          "flex flex-col overflow-hidden",
          // radius handled also via animation for smooth morph
          isFullScreen ? "rounded-none" : "rounded-lg",
          // refine backdrop blur layering
          "backdrop-saturate-150"
        )}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "width,height,transform,border-radius,box-shadow,backdrop-filter",
        }}
      >
        {/* Header */}
        <motion.div
          className={classNames(
            "relative flex items-center justify-between border-b backdrop-blur-xl",
            isFullScreen
              ? "border-border/40 bg-accent/5 p-6 md:p-8"
              : "border-border/60 bg-accent/10 p-4"
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="h-2 w-2 rounded-full bg-accent"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.h3
              className="font-semibold text-foreground"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {isFullScreen ? "AI Assistant - Ask about Nikunj" : "Ask about Nikunj"}
            </motion.h3>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleClearChat}
              className="rounded p-1 transition-colors hover:bg-muted"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Clear chat"
            >
              <Trash2 size={16} className="text-muted-foreground" />
            </motion.button>
            {onToggleFullScreen && (
              <motion.button
                onClick={onToggleFullScreen}
                className="rounded p-1 transition-colors hover:bg-muted"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isFullScreen ? "Minimize chat" : "Maximize chat"}
              >
                {isFullScreen ? (
                  <Minimize size={16} className="text-muted-foreground" />
                ) : (
                  <Maximize size={16} className="text-muted-foreground" />
                )}
              </motion.button>
            )}
            <motion.button
              onClick={onClose}
              className="rounded p-1 transition-colors hover:bg-muted"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close chat"
            >
              <X size={16} className="text-muted-foreground" />
            </motion.button>
          </div>
          {/* Gradient overlays for scroll edges */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-transparent to-background" />
        </motion.div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className={classNames(
            "relative flex-1 space-y-4 overflow-y-auto scroll-smooth",
            isFullScreen ? "p-6 md:p-8" : "p-4"
          )}
        >
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-6 bg-gradient-to-b from-background via-background/70 to-transparent" />
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                data-message-id={message.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: 20,
                        scale: 0.8,
                      }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        y: -20,
                        scale: 0.8,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index === 0 ? 0.3 : 0.1,
                }}
                className={classNames(
                  "group flex gap-3",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "ai" && (
                  <motion.div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Bot size={16} className="text-white dark:text-black" />
                  </motion.div>
                )}
                <motion.div
                  className={classNames(
                    "relative max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ring-1 ring-border/20",
                    message.sender === "user"
                      ? "bg-gradient-to-br from-accent to-accent/80 text-white dark:text-black"
                      : "bg-muted/60 text-muted-foreground backdrop-blur-sm"
                  )}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Tail decoration */}
                  <span
                    className={classNames(
                      "pointer-events-none absolute -bottom-1 h-3 w-3 rotate-45",
                      message.sender === "user"
                        ? "right-3 bg-accent/70"
                        : "left-3 bg-muted/60"
                    )}
                  />
                  <motion.div
                    className="leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {message.sender === "ai" ? (
                      <div className="chat-markdown prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Custom styling for markdown elements
                            h1: ({ children }) => (
                              <h1 className="mb-2 text-lg font-bold text-foreground">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mb-2 text-base font-semibold text-foreground">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-1 text-sm font-semibold text-foreground">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2 text-inherit last:mb-0">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-2 list-inside list-disc space-y-1 text-inherit">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-2 list-inside list-decimal space-y-1 text-inherit">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-inherit">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-inherit">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-inherit">
                                {children}
                              </em>
                            ),
                            code: ({ children, className }) => {
                              const isInline = !className;
                              if (isInline) {
                                return (
                                  <code className="rounded bg-muted/50 px-1 py-0.5 font-mono text-[11px] text-inherit">
                                    {children}
                                  </code>
                                );
                              }
                              const codeText = String(children).replace(
                                /\n$/,
                                ""
                              );
                              return (
                                <div className="group relative mb-2">
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(codeText)
                                    }
                                    className="absolute right-1 top-1 rounded bg-accent px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 dark:text-black"
                                    aria-label="Copy code"
                                  >
                                    Copy
                                  </button>
                                  <code className="block overflow-x-auto whitespace-pre rounded bg-muted/50 p-2 font-mono text-xs text-inherit">
                                    {codeText}
                                  </code>
                                </div>
                              );
                            },
                            pre: ({ children }) => <>{children}</>,
                            blockquote: ({ children }) => (
                              <blockquote className="mb-2 border-l-2 border-accent pl-3 text-inherit opacity-80">
                                {children}
                              </blockquote>
                            ),
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent underline hover:text-accent/80"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </motion.div>

                  {/* Tool Execution Results */}
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <motion.div
                      className="mt-3 space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      {message.toolCalls.map((toolCall, index) => (
                        <ToolExecutionResult
                          key={`${toolCall.id}-${index}`}
                          toolCall={toolCall}
                        />
                      ))}
                    </motion.div>
                  )}
                  <motion.span
                    className="mt-1 block text-[10px] uppercase tracking-wide opacity-60 transition-opacity group-hover:opacity-80"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 0.7, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </motion.span>
                </motion.div>
                {message.sender === "user" && (
                  <motion.div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <User size={16} className="text-white dark:text-black" />
                  </motion.div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                className="flex justify-start gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Bot size={16} className="text-white dark:text-black" />
                </motion.div>
                <motion.div
                  className="min-w-[80px] rounded-lg bg-muted px-4 py-3"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="mr-2 text-xs text-muted-foreground">
                      AI is thinking
                    </span>
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-0.5">
                    <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-accent/30">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <motion.div
          className={classNames(
            "border-t backdrop-blur-xl",
            isFullScreen
              ? "border-border/40 bg-background/30 p-6 md:p-8"
              : "border-border/60 bg-background/50 p-4"
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {/* Suggestions */}
          {messages.length === 1 && !hasInteracted && (
            <motion.div
              className="mb-3 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs text-foreground transition-colors hover:bg-accent/20"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
          <div className="flex items-end gap-3">
            <textarea
              ref={(el: HTMLTextAreaElement | null) => {
                if (textareaRef && "current" in textareaRef) {
                  (
                    textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = el;
                }
                if (inputRef && "current" in inputRef) {
                  (
                    inputRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = el;
                }
              }}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!hasInteracted) setHasInteracted(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Nikunj's experience, skills..."
              rows={1}
              className={classNames(
                "flex-1 resize-none text-sm leading-relaxed",
                "rounded-lg border border-border bg-background",
                "text-foreground placeholder:text-muted-foreground",
                "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent",
                "scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent",
                "max-h-40"
              )}
              style={{ padding: "10px 12px 11px 10px", lineHeight: "1.35" }}
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={classNames(
                "self-center rounded-lg p-3",
                "bg-accent hover:bg-accent-light disabled:bg-muted",
                "disabled:text-muted-foreground",
                "disabled:cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <Send
                size={16}
                className={classNames(
                  "text-white dark:text-black",
                  (!inputValue.trim() || isLoading) && "text-muted-foreground dark:text-muted-foreground"
                )}
              />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
