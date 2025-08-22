import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  isOpen: boolean;
  isFullScreen: boolean;
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

  const toggleChat = () => {
    if (isOpen) {
      // When closing chat, reset full-screen state
      setIsOpen(false);
      setIsFullScreen(false);
    } else {
      // When opening chat, just open it
      setIsOpen(true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
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
