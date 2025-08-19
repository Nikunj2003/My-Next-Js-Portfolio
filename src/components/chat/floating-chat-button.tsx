import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { classNames } from "@/utility/classNames";
import ChatWindow from "./chat-window";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Variants for smoother morph-style transition between icons
  const iconVariants = {
    enter: { rotate: -90, opacity: 0, scale: 0.4 },
    center: { rotate: 0, opacity: 1, scale: 1 },
    exit: { rotate: 90, opacity: 0, scale: 0.4 },
  } as const;

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className={classNames(
          "fixed bottom-6 right-6 z-40",
          "h-14 w-14 rounded-full",
          "bg-accent hover:bg-accent-light active:bg-accent-dark",
          "text-white dark:text-black",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300 ease-in-out",
          "flex items-center justify-center",
          "border-2 border-accent-dark dark:border-accent-light",
          "group"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5,
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <motion.div
          className="relative"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={isOpen ? "close" : "chat"}
              variants={iconVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 340, damping: 24 }}
              className="flex items-center justify-center"
            >
              {isOpen ? (
                <X size={24} />
              ) : (
                <motion.span whileHover={{ y: -2 }}>
                  <MessageCircle size={24} />
                </motion.span>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Notification dot with animation */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-destructive"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              <motion.div
                className="h-full w-full rounded-full bg-destructive"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
