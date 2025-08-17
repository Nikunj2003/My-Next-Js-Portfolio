"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { classNames } from "@/utility/classNames";
import { aiService } from "@/utility/ai-service";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm Nikunj's AI assistant. I can help you learn about his experience, skills, projects, and navigate around this portfolio. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiService.generateResponse(inputValue);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again later.",
        isUser: false,
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
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 h-96 bg-background border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-accent text-accent-foreground p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-sm">Nikunj's AI Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-accent-dark p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={classNames(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={classNames(
                    "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                    message.isUser
                      ? "bg-accent text-accent-foreground ml-auto"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Nikunj's experience..."
                className="flex-1 px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={toggleChat}
        className={classNames(
          "fixed bottom-4 right-4 z-50 w-14 h-14 bg-accent hover:bg-accent-dark text-accent-foreground rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group",
          isOpen ? "rotate-45" : "hover:scale-110"
        )}
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-300" />
        ) : (
          <MessageCircle size={24} className="transition-transform duration-300 group-hover:scale-110" />
        )}
      </button>
    </>
  );
}

// AI response generation function
async function generateAIResponse(userInput: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const lowerInput = userInput.toLowerCase();
  
  // Basic keyword matching for demo purposes
  if (lowerInput.includes("experience") || lowerInput.includes("work") || lowerInput.includes("job")) {
    return "Nikunj has extensive experience as a Software Development Engineer. He's worked at Central Electricity Authority (Government of India) improving renewable energy dashboards, at Xansr Software developing AI solutions like Fantasy GPT and AIKO, and currently at Armorcode building automation solutions. He's skilled in full-stack development, AI/ML, and DevOps practices.";
  }
  
  if (lowerInput.includes("skills") || lowerInput.includes("technologies") || lowerInput.includes("tech")) {
    return "Nikunj is proficient in a wide range of technologies including React, Next.js, Node.js, Python, Java, Spring Boot, FastAPI, Azure, Docker, Kubernetes, and AI/ML technologies like OpenAI, LangChain, and Azure AI. He's also experienced in DevOps practices, CI/CD pipelines, and cloud platforms.";
  }
  
  if (lowerInput.includes("projects") || lowerInput.includes("portfolio") || lowerInput.includes("built")) {
    return "Nikunj has built several impressive projects including EarthLink (enterprise solution), Rapid Store (e-commerce platform), Rapid Fire (social media app), Rapid UI (CSS library), and Rapid TV (video platform). He's also written technical blogs about JavaScript, React hooks, and developer productivity tools.";
  }
  
  if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("reach")) {
    return "You can contact Nikunj at njkhitha2003@gmail.com or connect with him on LinkedIn. You can also use the contact form on this website to send him a message directly!";
  }
  
  if (lowerInput.includes("education") || lowerInput.includes("university") || lowerInput.includes("degree")) {
    return "Based on his experience and projects, Nikunj has strong educational background in computer science and software engineering. His internships and work show progression from foundational programming to advanced AI/ML and cloud technologies.";
  }
  
  if (lowerInput.includes("ai") || lowerInput.includes("artificial intelligence") || lowerInput.includes("machine learning")) {
    return "Nikunj has significant experience in AI/ML. He built Fantasy GPT (a sports chatbot with 98% accuracy using RAG and LangGraph), AIKO (media assistant for sports highlights), and various automation solutions using AI. He's skilled in OpenAI, Azure AI, LangChain, and prompt engineering.";
  }
  
  if (lowerInput.includes("resume") || lowerInput.includes("cv") || lowerInput.includes("download")) {
    return "You can view and download Nikunj's resume from the Resume section of this website. It contains detailed information about his experience, skills, projects, and achievements. There's a download button available on the resume page!";
  }
  
  if (lowerInput.includes("navigation") || lowerInput.includes("navigate") || lowerInput.includes("sections")) {
    return "This portfolio has several sections: Home (landing page), About (personal info and skills), Projects (showcase of work), and Resume (downloadable CV). You can navigate using the menu at the top or click on the respective sections from the home page.";
  }
  
  if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
    return "Hello! Great to meet you! I'm here to help you learn about Nikunj Khitha's background, skills, and projects. Feel free to ask me anything about his experience, technical skills, projects, or how to navigate this portfolio website.";
  }
  
  // Default response
  return "That's an interesting question! I can help you with information about Nikunj's experience, skills, projects, education, or how to navigate this portfolio. I can also help you contact him. What specific aspect would you like to know more about?";
}
