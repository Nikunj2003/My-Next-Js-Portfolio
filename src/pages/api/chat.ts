import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { AI_MODEL, SYSTEM_PROMPT, SUGGESTION_SYSTEM_PROMPT } from "@/config/ai";
import { rateLimiterApi, getUserId } from "@/utility/rate-limiter";
import { toolRegistry, initializeAllTools } from "@/lib/tools";
import { contextAwareToolRegistry } from "@/lib/tools/context-aware-tool-registry";
import { ToolContext, ToolCall, ToolResult } from "@/types/tools";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
  currentPage?: string;
  currentTheme?: "light" | "dark";
  userAgent?: string;
}

interface ChatResponse {
  response: string;
  actions?: unknown[];
  toolCalls?: ToolCall[];
  suggestions?: string[];
}

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

// Rate limiter: max 40 requests per minute per user (IP+UA or fallback cookie)
const chatRateLimiter = rateLimiterApi({
  interval: 60_000, // 1 minute window
  uniqueTokenPerInterval: 1000, // capacity of distinct users per minute
  getUserId,
});

// Initialize tools on module load
let toolsInitialized = false;

async function ensureToolsInitialized(): Promise<void> {
  if (!toolsInitialized) {
    try {
      await initializeAllTools();
      toolsInitialized = true;
      console.log("Tools initialized successfully");
    } catch (error) {
      console.error("Failed to initialize tools:", error);
      throw new Error("Tool initialization failed");
    }
  }
}

/**
 * Execute tool calls from OpenAI function calling
 */
async function executeToolCalls(
  toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
  context: ToolContext
): Promise<{ results: ToolResult[]; toolCallResults: ToolCall[] }> {
  const results: ToolResult[] = [];
  const toolCallResults: ToolCall[] = [];

  for (const toolCall of toolCalls) {
    try {
      // Handle both function and custom tool call types
      const functionCall = "function" in toolCall ? toolCall.function : null;

      if (!functionCall) {
        throw new Error("Invalid tool call format");
      }

      console.log(
        `Executing tool: ${functionCall.name}`,
        functionCall.arguments
      );

      const args = JSON.parse(functionCall.arguments);
      const result = await contextAwareToolRegistry.executeTool(
        functionCall.name,
        args,
        context
      );

      results.push(result);

      const toolCallResult: ToolCall = {
        id: toolCall.id,
        name: functionCall.name,
        arguments: args,
        result,
      };

      toolCallResults.push(toolCallResult);

      console.log(
        `Tool ${functionCall.name} executed:`,
        result.success ? "SUCCESS" : "FAILED"
      );
    } catch (error) {
      const functionCall = "function" in toolCall ? toolCall.function : null;
      const toolName = functionCall?.name || "unknown";

      console.error(`Error executing tool ${toolName}:`, error);

      const errorResult: ToolResult = {
        success: false,
        error: {
          code: "TOOL_EXECUTION_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Unknown tool execution error",
          suggestions: ["Check tool arguments and try again"],
        },
      };

      results.push(errorResult);

      const toolCallResult: ToolCall = {
        id: toolCall.id,
        name: toolName,
        arguments: {},
        result: errorResult,
      };

      toolCallResults.push(toolCallResult);
    }
  }

  return { results, toolCallResults };
}

/**
 * Format tool results for LLM consumption
 */
function formatToolResultsForLLM(toolCalls: ToolCall[]): string {
  if (toolCalls.length === 0) return "";

  const formattedResults = toolCalls
    .map((call) => {
      const { name, result } = call;

      if (result && result.success) {
        return `Tool "${name}" executed successfully. Result: ${JSON.stringify(
          result.data,
          null,
          2
        )}`;
      } else {
        return `Tool "${name}" failed. Error: ${
          result?.error?.message || "Unknown error"
        }`;
      }
    })
    .join("\n\n");

  return `\n\nTool Execution Results:\n${formattedResults}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Enforce 40 requests per minute
    try {
      await chatRateLimiter.check(res, req, 40);
    } catch {
      return res.status(429).json({
        error: "Too many requests. Please wait a minute before trying again.",
      });
    }

    // Ensure tools are initialized
    await ensureToolsInitialized();

    const {
      message,
      conversationHistory = [],
      currentPage = "home",
      currentTheme = "light",
      userAgent,
    }: ChatRequest = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.LLM_API_KEY) {
      throw new Error("LLM API key not configured");
    }

    // Create tool context with enhanced detection
    let toolContext: ToolContext = {
      currentPage,
      theme: currentTheme,
      userAgent: userAgent || req.headers["user-agent"] || "unknown",
      sessionId: `session-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
    };

    // Enhance context with page detection from message
    try {
      const detectedContext = contextAwareToolRegistry.detectPageContext({
        chatMessage: message,
        url: req.headers.referer,
      });

      // Use detected page if it has higher confidence than provided page
      if (
        detectedContext.currentPage !== "home" ||
        !currentPage ||
        currentPage === "home"
      ) {
        toolContext = {
          ...toolContext,
          currentPage: detectedContext.currentPage,
          currentSection: detectedContext.currentSection,
        };
      }
    } catch (error) {
      console.warn("Context detection failed, using provided context:", error);
    }

    const recentMessages = conversationHistory.slice(-10);

    // Format conversation history for OpenAI API
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add conversation history
    recentMessages.forEach((msg: Message) => {
      if (msg.sender === "user") {
        messages.push({ role: "user", content: msg.content });
      } else if (msg.sender === "ai") {
        messages.push({ role: "assistant", content: msg.content });
      }
    });

    messages.push({ role: "user", content: message });

    // Get contextual function definitions for OpenAI
    const functionDefinitions =
      contextAwareToolRegistry.getContextualFunctionDefinitions(toolContext);

    console.log(
      `Making OpenAI request with ${functionDefinitions.length} available tools`
    );

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      tools: functionDefinitions.map((func) => ({
        type: "function" as const,
        function: {
          name: func.name,
          description: func.description,
          parameters: func.parameters as Record<string, unknown>,
        },
      })),
      tool_choice: "auto",
      top_p: 0.7,
      temperature: 0.8,
    });

    const choice = response.choices[0];
    if (!choice) {
      throw new Error("No response from OpenAI");
    }

    let aiResponse = choice.message?.content || "";
    let toolCallResults: ToolCall[] = [];
    // capture original user message for suggestion generation later
    const originalUserMessage = message;

    // Handle tool calls if present
    if (choice.message?.tool_calls && choice.message.tool_calls.length > 0) {
      console.log(`Processing ${choice.message.tool_calls.length} tool calls`);

      const { toolCallResults: tcResults } = await executeToolCalls(
        choice.message.tool_calls,
        toolContext
      );

      toolCallResults = tcResults;

      // Add tool results to conversation for follow-up response
      const toolResultsMessage = formatToolResultsForLLM(toolCallResults);

      if (toolResultsMessage) {
        // Make a follow-up call to get a natural response incorporating tool results
        const followUpMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
          [
            ...messages,
            {
              role: "assistant",
              content: aiResponse || "I'll help you with that.",
              tool_calls: choice.message.tool_calls,
            },
            ...choice.message.tool_calls.map((toolCall, index) => ({
              role: "tool" as const,
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolCallResults[index]?.result || {}),
            })),
          ];

        const followUpResponse = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: followUpMessages,
          top_p: 0.7,
          temperature: 0.8,
        });

        aiResponse =
          followUpResponse.choices[0]?.message?.content || aiResponse;
      }
    }

    if (!aiResponse) {
      aiResponse =
        "I apologize, but I'm having trouble responding right now. Please try asking your question again.";
    }
    // AI-driven follow-up suggestions: separate model call requesting ONLY a JSON array of questions
    const generateAISuggestions = async (): Promise<string[]> => {
      try {
        const suggestionPromptSystem = SUGGESTION_SYSTEM_PROMPT;

        const priorUserTexts = conversationHistory
          .filter((m) => m.sender === "user")
          .map((m) => m.content.toLowerCase());

        // --- Topic Categorization Helpers (lightweight, heuristic) ---
        const categoryKeywords: Record<string, RegExp> = {
          experience: /(experience|role|intern|work|company|job|position|impact|responsibilit)/i,
            skills: /(skill|stack|technology|tech|framework|language|tool)/i,
          projects: /(project|build|develop|app|application|platform|system|tool)/i,
          achievements: /(achieve|award|won|improv|result|reduced|increase|coverage|accuracy|milestone)/i,
          contact: /(contact|reach|email|linkedin|connect|collaborate|hire)/i,
          career_goals: /(goal|future|plan|aspiration|next|aim)/i,
        };

        const detectCategoriesFromConversation = (): Set<string> => {
          const s = new Set<string>();
          const corpus = [...recentMessages.map((m) => m.content), message].join("\n");
          for (const [cat, rx] of Object.entries(categoryKeywords)) {
            if (rx.test(corpus)) s.add(cat);
          }
          return s;
        };

        const usedCategories = Array.from(detectCategoriesFromConversation());
        const desiredCategories = Object.keys(categoryKeywords).filter(
          (c) => !usedCategories.includes(c)
        );

        const suggestionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
          [
            { role: "system", content: suggestionPromptSystem },
            // Provide compressed conversation context for relevance
            {
              role: "user",
              content: `Conversation so far (truncated to recent):\n${recentMessages
                .map(
                  (m) => `${m.sender === "user" ? "User" : "AI"}: ${m.content}`
                )
                .join("\n")}`,
            },
            { role: "assistant", content: aiResponse.slice(0, 4000) },
            {
              role: "user",
              content: `Generate ONLY a JSON array of 3-6 diverse follow-up questions now. Ensure topical diversity. Recently covered categories (avoid over-repeating): ${usedCategories.join(",") || "none"}. Prefer including some of: ${desiredCategories.join(",") || "(reuse any with new angle)"}. Remember: no more than 2 in the same category.`,
            },
          ];

        const suggestionResp = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: suggestionMessages,
          temperature: 0.7,
          top_p: 0.9,
        });

        let raw = suggestionResp.choices[0]?.message?.content?.trim() || "[]";
        // Strip markdown fences if any
        raw = raw
          .replace(/^```(?:json)?/i, "")
          .replace(/```$/i, "")
          .trim();
        let parsed: unknown = [];
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          // Attempt to extract JSON array substring
          const match = raw.match(/\[[\s\S]*\]/);
          if (match) {
            try {
              parsed = JSON.parse(match[0]);
            } catch {
              parsed = [];
            }
          }
        }
        if (!Array.isArray(parsed)) return [];
        const cleaned = (parsed as unknown[])
          .filter((v) => typeof v === "string")
          .map((s) => (s as string).trim())
          .filter((s) => s.length > 0 && s.length <= 120)
          .filter((s) => !priorUserTexts.includes(s.toLowerCase()))
          .filter(
            (s, i, arr) =>
              arr.findIndex((t) => t.toLowerCase() === s.toLowerCase()) === i
          )
          .slice(0, 6);
        // Post-process for category diversity
        const categorize = (q: string): string => {
          for (const [cat, rx] of Object.entries(categoryKeywords)) {
            if (rx.test(q)) return cat;
          }
          return "other";
        };

        const maxPerCategory = 1; // strict: only one per category to enforce breadth
        const catCount: Record<string, number> = {};
        const diversified: string[] = [];
        for (const q of cleaned) {
          const cat = categorize(q);
          catCount[cat] = catCount[cat] || 0;
          if (catCount[cat] < maxPerCategory) {
            diversified.push(q);
            catCount[cat]++;
          }
          if (diversified.length >= 6) break;
        }

        // Fallback library for missing categories
        const fallbackByCategory: Record<string, string[]> = {
          experience: ["What recent impact has Nikunj made in his current role?"],
          skills: ["Which technical skills does Nikunj use most day to day?"],
          projects: ["Which project best showcases Nikunj's problem-solving?"],
          achievements: ["Can you highlight one of Nikunj's standout achievements?"],
          contact: ["What's the best way to connect with Nikunj for collaboration?"],
          career_goals: ["What future goals is Nikunj focusing on next?"],
        };

        if (diversified.length < 3) {
          // Add fallbacks from unused categories
            for (const cat of Object.keys(fallbackByCategory)) {
            if (diversified.length >= 6) break;
            if (!diversified.some((q) => categorize(q) === cat)) {
              const fb = fallbackByCategory[cat][0];
              if (fb) diversified.push(fb);
            }
          }
        }

        return diversified.slice(0, 6);
      } catch (e) {
        console.warn("Suggestion generation failed:", e);
        return [];
      }
    };

    const followUpSuggestions = await generateAISuggestions();

    const chatResponse: ChatResponse = {
      response: aiResponse,
      toolCalls: toolCallResults.length > 0 ? toolCallResults : undefined,
      suggestions: followUpSuggestions.length ? followUpSuggestions : undefined,
    };

    console.log(
      `Chat response generated with ${toolCallResults.length} tool calls`
    );

    return res.status(200).json(chatResponse);
  } catch (error: unknown) {
    console.error("AI Response Error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      status: (error as { status?: unknown })?.status,
      type: (error as { type?: unknown })?.type,
      code: (error as { code?: unknown })?.code,
    });

    // Check if this is a tool initialization error
    if (
      error instanceof Error &&
      error.message?.includes("Tool initialization failed")
    ) {
      return res.status(500).json({
        error: "Tool system is currently unavailable. Please try again later.",
        response:
          "I apologize, but my enhanced features are temporarily unavailable. I can still provide basic information about Nikunj Khitha. What would you like to know?",
      });
    }

    // Provide intelligent fallback responses based on keywords
    const message = req.body.message?.toLowerCase() || "";

    if (message.includes("contact") || message.includes("email")) {
      return res.status(200).json({
        response: `# Contact Nikunj Khitha\n\nYou can connect with Nikunj through various channels:\n\n## 📧 **Email**\n[njkhitha2003@gmail.com](mailto:njkhitha2003@gmail.com)\n\n## 💼 **LinkedIn**\n[Connect on LinkedIn](https://www.linkedin.com/in/Nikunj-Khitha/)\n\n## 🐙 **GitHub**\n[View Projects on GitHub](https://github.com/Nikunj2003)\n\n## 🌐 **Portfolio Website**\n[nikunj.tech](https://nikunj.tech)\n\n---\n\n> **Currently:** Automation Intern at Armorcode Inc.\n> \n> **Interests:** AI development, full-stack engineering, and creating innovative solutions\n> \n> Feel free to reach out for collaborations, job opportunities, or tech discussions!`,
      });
    }

    if (
      message.includes("experience") ||
      message.includes("work") ||
      message.includes("job")
    ) {
      return res.status(200).json({
        response: `# Nikunj's Professional Experience\n\nNikunj has diverse experience across multiple companies:\n\n## 🔧 **Current: Automation Intern at Armorcode Inc.**\n*Jan 2025 - Aug 2025*\n\n- Building next-gen testing frameworks with \`Spring Boot\`, \`Playwright\` & \`TestNG\`\n- **Won internal AI challenge** by automating documentation for 250+ tools\n- Reduced documentation update time from **72 hours to 45 minutes**\n- Implemented AI auto-heal feature reducing test flakiness by **99%**\n\n## 💻 **SDE Intern at Xansr Software**\n*June 2024 - Jan 2025*\n\n- Developed microservices with \`Node.js\` & \`FastAPI\` achieving **100% test coverage**\n- Built **"Fantasy GPT"** chatbot with 98% accuracy using \`RAG\` & \`LangGraph\`\n- Created **"AIKO"** media assistant for personalized sports highlights\n- Improved API performance by **40%** and reduced deployment time by **42%**\n\n> Would you like to know more about any specific role or project?`,
      });
    }

    if (
      message.includes("skill") ||
      message.includes("technology") ||
      message.includes("tech")
    ) {
      return res.status(200).json({
        response: `# Nikunj's Technical Skills\n\nNikunj has expertise across multiple technology stacks:\n\n## 🌐 **Full Stack Development**\n- \`React\`, \`Next.js\`, \`Node.js\`, \`Express\`\n- \`FastAPI\`, \`Spring Boot\`, \`Flutter\`\n- \`TailwindCSS\`, \`MongoDB\`, \`MySQL\`, \`Firebase\`\n\n## 🤖 **AI/ML Specialization**\n- \`OpenAI\`, \`Azure AI\`, \`LangChain\`\n- \`RAG\`, \`LangGraph\`, \`Prompt Engineering\`\n- \`LLaMA AI\`, \`Vercel AI SDK\`\n\n## 🚀 **DevOps & Cloud**\n- \`Docker\`, \`Kubernetes\`, \`CI/CD\`\n- \`GitHub Actions\`, \`Jenkins\`\n- \`AWS\`, \`Microsoft Azure\`\n\n## 💻 **Programming Languages**\n- \`JavaScript\`, \`TypeScript\`, \`Java\`\n- \`Python\`, \`PHP\`, \`Dart\`\n\n> What specific technology would you like to know more about?`,
      });
    }

    if (message.includes("project") || message.includes("portfolio")) {
      return res.status(200).json({
        response: `# Nikunj's Key Projects\n\nNikunj has worked on diverse projects spanning multiple domains:\n\n## 🌍 **EarthLink**\n*Enterprise Platform*\n- American Internet service provider platform\n- **Tech Stack:** \`React\`, \`Next.js\`, \`GraphQL\`, \`Microservices\`\n- **Features:** Styled Components, SCSS integration\n\n## 🛒 **Rapid Store**\n*E-commerce Platform*\n- Electronics and gadgets marketplace\n- **Tech Stack:** \`React\`, \`Razorpay\`, \`Context API\`\n- **Features:** Payment integration, Authentication\n\n## 🤖 **Fantasy GPT**\n*AI/ML Project*\n- Sports chatbot for fantasy enthusiasts\n- **Accuracy:** 98% using \`RAG\` & \`LangGraph\`\n- **Tech Stack:** \`Node.js\`, \`AI/ML\`\n\n## 📺 **AIKO**\n*AI Media Assistant*\n- Personalized sports highlights generator\n- **Features:** Real-time commentary, Media processing\n\n## 🎨 **Rapid UI**\n*Open Source*\n- CSS library with pre-defined components\n- **Tech Stack:** \`CSS\`, \`JavaScript\`, Design System\n\n> Which project interests you most? I can share more details!`,
      });
    }

    return res.status(200).json({
      response: `# Welcome! I'm here to help you learn about Nikunj Khitha\n\n## What would you like to know?\n\n### 🔹 **Professional Experience**\n- Current role at Armorcode Inc.\n- Previous internships and achievements\n- Career progression and impact\n\n### 🔹 **Technical Skills**\n- Programming languages and frameworks\n- AI/ML expertise and tools\n- DevOps and cloud technologies\n\n### 🔹 **AI/ML Projects**\n- Fantasy GPT chatbot (98% accuracy)\n- AIKO media assistant\n- Automation and testing innovations\n\n### 🔹 **Portfolio Projects**\n- Enterprise web applications\n- E-commerce platforms\n- Open source contributions\n\n### 🔹 **Contact Information**\n- How to reach Nikunj for opportunities\n- Professional social links\n\n> Just ask me anything about Nikunj's background, and I'll provide detailed information!`,
    });
  }
}
