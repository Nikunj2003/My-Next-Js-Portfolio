import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { classNames } from "@/utility/classNames";
import ChatWindow from "./chat-window";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <ChatWindow 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      )}

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={classNames(
          "fixed bottom-6 right-6 z-40",
          "h-14 w-14 rounded-full",
          "bg-accent hover:bg-accent-light active:bg-accent-dark",
          "text-background dark:text-foreground",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300 ease-in-out",
          "hover:scale-110 active:scale-95",
          "flex items-center justify-center",
          "border-2 border-accent-dark dark:border-accent-light",
          "group"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative">
          {isOpen ? (
            <X 
              size={24} 
              className="transition-transform duration-200 group-hover:rotate-90" 
            />
          ) : (
            <MessageCircle 
              size={24} 
              className="transition-transform duration-200 group-hover:bounce" 
            />
          )}
        </div>
        
        {/* Notification dot (optional - can be used for unread messages) */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse" />
        )}
      </button>
    </>
  );
}
