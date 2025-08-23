import { ToolCall } from "@/types/tools";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  toolCalls?: ToolCall[];
  isToolExecution?: boolean;
  suggestions?: string[];
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}
