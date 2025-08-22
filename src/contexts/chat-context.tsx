import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ChatContextType {
  isOpen: boolean;
  isFullScreen: boolean;
  isExitingFullScreen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsFullScreen: (fullScreen: boolean) => void;
  toggleChat: () => void;
  toggleFullScreen: () => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isExitingFullScreen, setIsExitingFullScreen] = useState(false);

  // Reset the exit flag after a short delay
  useEffect(() => {
    if (isExitingFullScreen) {
      const timeout = setTimeout(() => {
        setIsExitingFullScreen(false);
      }, 100); // Small delay to ensure components render without animation
      return () => clearTimeout(timeout);
    }
  }, [isExitingFullScreen]);

  const toggleChat = () => {
    if (isOpen) {
      // When closing chat, check if we're exiting full-screen
      if (isFullScreen) {
        setIsExitingFullScreen(true);
      }
      setIsOpen(false);
      setIsFullScreen(false);
    } else {
      // When opening chat, just open it
      setIsOpen(true);
    }
  };

  const closeChat = () => {
    if (isFullScreen) {
      setIsExitingFullScreen(true);
    }
    setIsOpen(false);
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      // If we're currently in full-screen, we're exiting
      setIsExitingFullScreen(true);
    }
    setIsFullScreen(!isFullScreen);
  };

  const value: ChatContextType = {
    isOpen,
    isFullScreen,
    setIsOpen,
    setIsFullScreen,
    toggleChat,
    toggleFullScreen,
    closeChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
