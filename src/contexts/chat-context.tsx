import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  isOpen: boolean;
  isFullScreen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsFullScreen: (fullScreen: boolean) => void;
  toggleChat: () => void;
  toggleFullScreen: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
