import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { classNames } from "@/utility/classNames";
import { getAIResponse } from "@/utility/ai-chat-responses";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm an AI assistant that can answer questions about Nikunj Khitha's background, skills, and experience. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setShouldAutoScroll(true); // Only scroll when user sends a message

    try {
      const aiResponse = await getAIResponse(inputValue.trim());
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try asking your question again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { 
        opacity: 0, 
        scale: 0.8, 
        y: 20,
        rotateX: -15
      }}
      animate={prefersReducedMotion ? { opacity: 1 } : { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotateX: 0
      }}
      exit={prefersReducedMotion ? { opacity: 0 } : { 
        opacity: 0, 
        scale: 0.8, 
        y: 20,
        rotateX: 15
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
      className={classNames(
        "fixed bottom-24 right-6 z-50",
        "w-80 sm:w-96 h-[32rem]",
        "bg-background border border-border rounded-lg shadow-2xl",
        "flex flex-col overflow-hidden"
      )}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-border bg-accent/5"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
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
            className="p-1 rounded hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close chat"
          >
            <X size={16} className="text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={prefersReducedMotion ? { opacity: 0 } : {
                opacity: 0,
                y: 20,
                scale: 0.8
              }}
              animate={prefersReducedMotion ? { opacity: 1 } : {
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={prefersReducedMotion ? { opacity: 0 } : {
                opacity: 0,
                y: -20,
                scale: 0.8
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index === 0 ? 0.3 : 0.1
              }}
              layout
              className={classNames(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "ai" && (
                <motion.div 
                  className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: 0.2
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
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                )}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.p 
                  className="whitespace-pre-wrap leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {message.content}
                </motion.p>
                <motion.span 
                  className="text-xs opacity-70 mt-1 block"
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
                  className="flex-shrink-0 h-8 w-8 rounded-full bg-foreground flex items-center justify-center"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: 0.2
                  }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <User size={16} className="text-background" />
                </motion.div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              className="flex gap-3 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div 
                className="flex-shrink-0 h-8 w-8 rounded-full bg-accent flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Bot size={16} className="text-white dark:text-black" />
              </motion.div>
              <motion.div 
                className="bg-muted rounded-lg px-4 py-3 min-w-[80px]"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-2">AI is thinking</span>
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div 
                        key={i}
                        className="w-1.5 h-1.5 bg-accent rounded-full"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex gap-0.5">
                  <div className="h-0.5 bg-accent/30 rounded-full flex-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent rounded-full"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
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
        className="p-4 border-t border-border bg-background"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <motion.div 
          className="flex gap-2"
          layout
        >
          <motion.input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Nikunj's experience, skills, or projects..."
            className={classNames(
              "flex-1 px-3 py-2 text-sm",
              "bg-background border border-border rounded-lg",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
              "transition-all duration-200"
            )}
            disabled={isLoading}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={classNames(
              "p-2 rounded-lg transition-colors",
              "bg-accent hover:bg-accent-light disabled:bg-muted",
              "text-accent-foreground disabled:text-muted-foreground",
              "disabled:cursor-not-allowed"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotate: isLoading ? 360 : 0
            }}
            transition={{
              rotate: {
                duration: 1,
                repeat: isLoading ? Infinity : 0,
                ease: "linear"
              },
              scale: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
            aria-label="Send message"
          >
            <Send size={16} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
