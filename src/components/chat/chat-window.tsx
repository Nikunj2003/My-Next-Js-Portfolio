import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, X, Loader2, CheckCircle, XCircle, Navigation, Download, Palette, ExternalLink } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { classNames } from "@/utility/classNames";
import { useAutosizeTextArea } from "@/hooks/useAutoSizeTextarea";
import { ToolCall, ToolAction } from "@/types/tools";
import NavigationIndicator, { useNavigationActions } from "./navigation-indicator";
import { useConfirmationDialog } from "./confirmation-dialog";

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
}

// Tool execution result component
function ToolExecutionResult({ toolCall }: { toolCall: ToolCall }) {
  const { name, result } = toolCall;
  const isSuccess = result?.success ?? false;
  const hasActions = result?.actions && result.actions.length > 0;

  const getToolIcon = (toolName: string) => {
    if (toolName.includes('Navigate') || toolName.includes('navigate')) return Navigation;
    if (toolName.includes('Download') || toolName.includes('download')) return Download;
    if (toolName.includes('Theme') || toolName.includes('theme')) return Palette;
    if (toolName.includes('Modal') || toolName.includes('modal')) return ExternalLink;
    return Bot;
  };

  const ToolIcon = getToolIcon(name);

  return (
    <motion.div
      className={classNames(
        "rounded-lg border p-3 text-xs",
        isSuccess
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center gap-2 mb-2">
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
        <div className="flex items-center gap-1">
          <ToolIcon size={14} className={isSuccess ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"} />
          <span className={classNames(
            "font-medium",
            isSuccess ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
          )}>
            {name.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>
      </div>

      {isSuccess && result?.data !== undefined && (
        <motion.div
          className="mb-2 text-green-700 dark:text-green-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {typeof result.data === 'string' ? (
            <p>{result.data}</p>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs">
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
          transition={{ delay: 0.2 }}
        >
          <p className="font-medium">{result.error.message}</p>
          {result.error.suggestions && result.error.suggestions.length > 0 && (
            <ul className="mt-1 list-disc list-inside space-y-1">
              {result.error.suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs">{suggestion}</li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {/* Actions performed */}
      {hasActions && (
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className={classNames(
            "font-medium",
            isSuccess ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
          )}>
            Actions:
          </p>
          {result!.actions!.map((action, index) => (
            <ActionIndicator key={index} action={action} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// Action indicator component
function ActionIndicator({ action }: { action: ToolAction }) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'navigate': return Navigation;
      case 'download': return Download;
      case 'theme': return Palette;
      case 'modal': return ExternalLink;
      default: return Bot;
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
        {action.type === 'navigate' && `Navigating to ${action.target}`}
        {action.type === 'download' && `Downloading ${action.target}`}
        {action.type === 'theme' && `Switching to ${action.target} theme`}
        {action.type === 'modal' && `Opening ${action.target} modal`}
        {action.type === 'scroll' && `Scrolling to ${action.target}`}
      </span>
    </motion.div>
  );
}

// Enhanced loading indicator for tool execution
function ToolExecutionLoadingIndicator() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { icon: Bot, text: "Processing request..." },
    { icon: Loader2, text: "Executing tools..." },
    { icon: CheckCircle, text: "Generating response..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [steps.length]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <motion.div
      className="flex justify-start gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent"
        animate={{ rotate: currentStep === 1 ? 360 : 0 }}
        transition={{ duration: 2, repeat: currentStep === 1 ? Infinity : 0, ease: "linear" }}
      >
        <CurrentIcon size={16} className="text-white dark:text-black" />
      </motion.div>
      <motion.div
        className="min-w-[120px] rounded-lg bg-muted px-4 py-3"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center gap-2">
          <motion.span
            key={currentStep}
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].text}
          </motion.span>
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

        {/* Progress bar */}
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

        {/* Step indicators */}
        <div className="mt-2 flex justify-center gap-1">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={classNames(
                "h-1 w-1 rounded-full transition-colors",
                index === currentStep ? "bg-accent" : "bg-accent/30"
              )}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  // const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Navigation actions and confirmation dialog
  const {
    actions,
    addAction,
    updateActionStatus,
    removeAction
  } = useNavigationActions();
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  useAutosizeTextArea(textareaRef, inputValue, "40px");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
      setShouldAutoScroll(false);
    }
  }, [messages, shouldAutoScroll]);

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
    setInputValue("");
    setIsLoading(true);
    setShouldAutoScroll(true); // Only scroll when user sends a message

    try {
      // Enhanced API call to get tool execution results
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          conversationHistory: messages,
          currentPage: window.location.pathname.slice(1) || 'home',
          currentTheme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
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
            for (const action of toolCall.result.actions) {
              const actionId = addAction(action.type, action.target);

              // Check if this is a destructive action that needs confirmation
              const isDestructive = checkIfDestructiveAction(action);

              if (isDestructive) {
                showConfirmation({
                  title: 'Confirm Action',
                  message: `Are you sure you want to ${getActionDescription(action)}?`,
                  confirmText: 'Yes, proceed',
                  cancelText: 'Cancel',
                  variant: 'destructive',
                  onConfirm: () => executeAction(actionId, action),
                  onCancel: () => removeAction(actionId),
                });
              } else {
                executeAction(actionId, action);
              }
            }
          }
        }
      }

      // Create AI message with tool execution results
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I apologize, but I'm having trouble responding right now.",
        sender: "ai",
        timestamp: new Date(),
        toolCalls: data.toolCalls,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // After AI response, scroll last user message to top
      setTimeout(() => {
        scrollUserMessageToTop(userMessage.id);
      }, 50);
    } catch (error) {
      console.error('Chat API error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble responding right now. Please try asking your question again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for navigation actions
  const checkIfDestructiveAction = (action: ToolAction): boolean => {
    // Define which actions are considered destructive
    const destructiveActions = ['download', 'theme'];
    return destructiveActions.includes(action.type);
  };

  const getActionDescription = (action: ToolAction): string => {
    switch (action.type) {
      case 'navigate': return `navigate to ${action.target}`;
      case 'download': return `download ${action.target}`;
      case 'theme': return `switch to ${action.target} theme`;
      case 'modal': return `open ${action.target}`;
      case 'scroll': return `scroll to ${action.target}`;
      default: return 'perform this action';
    }
  };

  const executeAction = async (actionId: string, action: ToolAction) => {
    updateActionStatus(actionId, 'in-progress');

    try {
      // Simulate action execution with appropriate delays
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Execute the actual action based on type
      switch (action.type) {
        case 'navigate':
          // This would typically trigger actual navigation
          console.log(`Navigating to ${action.target}`);
          break;
        case 'download':
          // This would typically trigger actual download
          console.log(`Downloading ${action.target}`);
          break;
        case 'theme':
          // This would typically trigger theme change
          console.log(`Switching to ${action.target} theme`);
          break;
        case 'modal':
          // This would typically open a modal
          console.log(`Opening ${action.target} modal`);
          break;
        case 'scroll':
          // This would typically scroll to section
          console.log(`Scrolling to ${action.target}`);
          break;
      }

      updateActionStatus(actionId, 'completed');

      // Auto-remove completed actions after a delay
      setTimeout(() => {
        removeAction(actionId);
      }, 3000);

    } catch (error) {
      console.error('Action execution failed:', error);
      updateActionStatus(actionId, 'failed', 'Action failed to execute');

      // Auto-remove failed actions after a longer delay
      setTimeout(() => {
        removeAction(actionId);
      }, 5000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "What technologies does Nikunj use?",
    "Summarize Nikunj's experience",
    "List notable projects",
    "What are key skills?",
  ];

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    setHasInteracted(true);
    setTimeout(() => handleSendMessage(), 10);
  };

  return (
    <>
      {/* Navigation Indicator */}
      <NavigationIndicator
        actions={actions}
        onDismiss={removeAction}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog />

      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : {
              opacity: 0,
              scale: 0.8,
              y: 20,
              rotateX: -15,
            }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : {
              opacity: 1,
              scale: 1,
              y: 0,
              rotateX: 0,
            }
        }
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : {
              opacity: 0,
              scale: 0.8,
              y: 20,
              rotateX: 15,
            }
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className={classNames(
          "fixed bottom-24 right-6 z-40",
          "h-[32rem] w-80 sm:w-96",
          "rounded-lg border border-border/60 bg-background/55 backdrop-blur-xl shadow-2xl",
          "flex flex-col overflow-hidden"
        )}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between border-b border-border/60 bg-accent/10 backdrop-blur-xl p-4"
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
              Ask about Nikunj
            </motion.h3>
          </div>
          <div className="flex items-center">
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
        </motion.div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 space-y-4 overflow-y-auto p-4"
        >
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
                layout
                className={classNames(
                  "flex gap-3",
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
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.sender === "user"
                      ? "bg-accent text-white dark:text-black"
                      : "bg-muted text-muted-foreground"
                  )}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
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
                              <h1 className="text-lg font-bold mb-2 text-foreground">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-base font-semibold mb-2 text-foreground">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-semibold mb-1 text-foreground">{children}</h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0 text-inherit">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside mb-2 space-y-1 text-inherit">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside mb-2 space-y-1 text-inherit">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-inherit">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-inherit">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-inherit">{children}</em>
                            ),
                            code: ({ children, className }) => {
                              const isInline = !className;
                              if (isInline) {
                                return (
                                  <code className="bg-muted/50 px-1 py-0.5 rounded text-[11px] font-mono text-inherit">
                                    {children}
                                  </code>
                                );
                              }
                              const codeText = String(children).replace(/\n$/, '');
                              return (
                                <div className="group relative mb-2">
                                  <button
                                    onClick={() => navigator.clipboard.writeText(codeText)}
                                    className="absolute right-1 top-1 rounded px-2 py-0.5 text-[10px] font-medium bg-accent text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Copy code"
                                  >
                                    Copy
                                  </button>
                                  <code className="block bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto text-inherit whitespace-pre">{codeText}</code>
                                </div>
                              );
                            },
                            pre: ({ children }) => <>{children}</>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-accent pl-3 mb-2 text-inherit opacity-80">
                                {children}
                              </blockquote>
                            ),
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:text-accent/80 underline"
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
                        <ToolExecutionResult key={`${toolCall.id}-${index}`} toolCall={toolCall} />
                      ))}
                    </motion.div>
                  )}
                  <motion.span
                    className="mt-1 block text-xs opacity-70"
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
              <ToolExecutionLoadingIndicator />
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <motion.div
          className="border-t border-border/60 bg-background/50 backdrop-blur-xl p-4"
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
                  className="rounded-full bg-accent/10 hover:bg-accent/20 text-xs px-3 py-1 text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
          <motion.div className="flex items-end gap-3" layout>
            <motion.textarea
              ref={(el: HTMLTextAreaElement | null) => {
                // assign to both refs safely
                if (textareaRef && 'current' in textareaRef) {
                  (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
                }
                if (inputRef && 'current' in inputRef) {
                  (inputRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
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
                "flex-1 text-sm resize-none leading-relaxed",
                "rounded-lg border border-border bg-background",
                "text-foreground placeholder:text-muted-foreground",
                "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent",
                "transition-all duration-200 scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent",
                "max-h-40"
              )}
              style={{ padding: '10px 12px 11px 10px', lineHeight: '1.35' }}
              disabled={isLoading}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={classNames(
                "rounded-lg p-3 transition-colors self-center",
                "bg-accent hover:bg-accent-light disabled:bg-muted",
                "text-accent-foreground disabled:text-muted-foreground",
                "disabled:cursor-not-allowed"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                scale: { type: 'spring', stiffness: 400, damping: 25 },
              }}
              aria-label="Send message"
            >
              <Send size={16} />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

// Helper: scroll the specified user message to the top of the container
function scrollUserMessageToTop(messageId: string) {
  // Find the message element & its scroll container
  const messageEl = document.querySelector<HTMLElement>(
    `[data-message-id="${messageId}"]`
  );
  const messagesWrapper = messageEl?.closest(
    '.overflow-y-auto'
  ) as HTMLElement | null;
  if (!messageEl || !messagesWrapper) return;
  const containerRect = messagesWrapper.getBoundingClientRect();
  const elRect = messageEl.getBoundingClientRect();
  const GAP = 12; // px gap from the top
  const offset = elRect.top - containerRect.top + messagesWrapper.scrollTop - GAP;
  messagesWrapper.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
}
