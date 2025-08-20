// Message interface for conversation history
interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export async function getAIResponse(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    // Get last 10 messages for context (excluding the current user message)
    const recentMessages = conversationHistory.slice(-10);

    // Convert timestamps to strings for JSON serialization
    const serializedHistory = recentMessages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp.toISOString(),
    }));

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: serializedHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get AI response");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("AI Response Error:", error);

    // Fallback response with some basic information
    if (
      userMessage.toLowerCase().includes("contact") ||
      userMessage.toLowerCase().includes("email")
    ) {
      return `You can reach Nikunj at:\n\n📧 **Email:** njkhitha2003@gmail.com\n💼 **LinkedIn:** https://www.linkedin.com/in/Nikunj-Khitha/\n🐙 **GitHub:** https://github.com/Nikunj2003\n🌐 **Website:** https://nikunj.tech`;
    }

    return "I apologize, but I'm having trouble connecting to the AI service right now. Please try asking your question again, or feel free to explore Nikunj's portfolio directly!";
  }
}
