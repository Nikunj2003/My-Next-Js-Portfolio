/**
 * Contextual tool suggestions system for AI Portfolio Navigator
 * Provides intelligent tool recommendations based on current page and user context
 */

import { ToolContext, PortfolioTool } from "@/types/tools";

/**
 * Tool suggestion with relevance scoring
 */
export interface ToolSuggestion {
  /** The suggested tool */
  tool: PortfolioTool;
  /** Relevance score (0-1) */
  relevance: number;
  /** Reason for suggestion */
  reason: string;
  /** Context that triggered this suggestion */
  context: string;
  /** Priority level */
  priority: "high" | "medium" | "low";
}

/**
 * Contextual help information
 */
export interface ContextualHelp {
  /** Current page description */
  pageDescription: string;
  /** Available actions on this page */
  availableActions: string[];
  /** Suggested questions users can ask */
  suggestedQuestions: string[];
  /** Navigation suggestions */
  navigationSuggestions: string[];
}

/**
 * Tool filtering criteria
 */
export interface ToolFilterCriteria {
  /** Current page */
  page: string;
  /** Current section */
  section?: string;
  /** User intent (derived from message) */
  intent?: string;
  /** Theme preference */
  theme?: "light" | "dark";
  /** Device type */
  deviceType?: "mobile" | "desktop";
}

/**
 * Contextual tool suggestions engine
 */
export class ContextualToolSuggestions {
  private toolRegistry: Map<string, PortfolioTool> = new Map();

  // Page-specific tool mappings
  private pageToolMappings = {
    home: {
      primary: ["NavigateToPage", "GetProjects", "GetSkills"],
      secondary: ["OpenModal", "ToggleTheme"],
      tertiary: ["TriggerDownload"],
    },
    about: {
      primary: ["GetExperience", "GetSkills", "NavigateToPage"],
      secondary: ["GetProjects", "OpenModal"],
      tertiary: ["ToggleTheme", "TriggerDownload"],
    },
    projects: {
      primary: ["GetProjects", "NavigateToPage", "OpenModal"],
      secondary: ["GetSkills", "GetExperience"],
      tertiary: ["ToggleTheme", "TriggerDownload"],
    },
    resume: {
      primary: ["TriggerDownload", "GetExperience", "GetSkills"],
      secondary: ["NavigateToPage", "OpenModal"],
      tertiary: ["GetProjects", "ToggleTheme"],
    },
    contact: {
      primary: ["OpenModal", "NavigateToPage"],
      secondary: ["GetExperience", "GetProjects"],
      tertiary: ["GetSkills", "ToggleTheme", "TriggerDownload"],
    },
  };

  // Intent-based tool mappings
  private intentToolMappings = {
    navigation: ["NavigateToPage", "OpenModal"],
    information: ["GetProjects", "GetExperience", "GetSkills"],
    action: ["TriggerDownload", "ToggleTheme", "OpenModal"],
    contact: ["OpenModal", "NavigateToPage"],
    download: ["TriggerDownload"],
    theme: ["ToggleTheme"],
    projects: ["GetProjects", "NavigateToPage"],
    experience: ["GetExperience", "NavigateToPage"],
    skills: ["GetSkills", "GetExperience"],
  };

  /**
   * Register tools for suggestions
   */
  registerTool(tool: PortfolioTool): void {
    this.toolRegistry.set(tool.name, tool);
  }

  /**
   * Register multiple tools
   */
  registerTools(tools: PortfolioTool[]): void {
    tools.forEach((tool) => this.registerTool(tool));
  }

  /**
   * Get contextual tool suggestions based on current context
   */
  getSuggestions(context: ToolContext, userMessage?: string): ToolSuggestion[] {
    const suggestions: ToolSuggestion[] = [];
    const page = context.currentPage.toLowerCase();
    const section = context.currentSection?.toLowerCase();

    // Get page-based suggestions
    const pageSuggestions = this.getPageBasedSuggestions(page, section);
    suggestions.push(...pageSuggestions);

    // Get intent-based suggestions if user message is provided
    if (userMessage) {
      const intentSuggestions = this.getIntentBasedSuggestions(
        userMessage,
        context
      );
      suggestions.push(...intentSuggestions);
    }

    // Get theme-based suggestions
    const themeSuggestions = this.getThemeBasedSuggestions(context);
    suggestions.push(...themeSuggestions);

    // Remove duplicates and sort by relevance
    const uniqueSuggestions = this.deduplicateAndSort(suggestions);

    // Limit to top 10 suggestions
    return uniqueSuggestions.slice(0, 10);
  }

  /**
   * Filter available tools based on context
   */
  filterToolsByContext(criteria: ToolFilterCriteria): PortfolioTool[] {
    const availableTools = Array.from(this.toolRegistry.values());
    const page = criteria.page.toLowerCase();

    // Get relevant tools for the page
    const pageMapping =
      this.pageToolMappings[page as keyof typeof this.pageToolMappings];
    if (!pageMapping) {
      return availableTools; // Return all tools if page not mapped
    }

    const relevantToolNames = [
      ...pageMapping.primary,
      ...pageMapping.secondary,
      ...pageMapping.tertiary,
    ];

    // Filter tools based on relevance
    const filteredTools = availableTools.filter((tool) =>
      relevantToolNames.includes(tool.name)
    );

    // If we have intent, further filter by intent
    if (criteria.intent && criteria.intent !== "unknown-intent") {
      const intentTools =
        this.intentToolMappings[
          criteria.intent as keyof typeof this.intentToolMappings
        ] || [];
      if (intentTools.length > 0) {
        return filteredTools.filter((tool) => intentTools.includes(tool.name));
      }
    }

    return filteredTools;
  }

  /**
   * Get contextual help for current page
   */
  getContextualHelp(context: ToolContext): ContextualHelp {
    const page = context.currentPage.toLowerCase();
    const section = context.currentSection?.toLowerCase();

    const helpData = this.getPageHelpData(page, section);

    return {
      pageDescription: helpData.description,
      availableActions: helpData.actions,
      suggestedQuestions: helpData.questions,
      navigationSuggestions: helpData.navigation,
    };
  }

  /**
   * Get smart tool recommendations based on user behavior patterns
   */
  getSmartRecommendations(
    context: ToolContext,
    recentToolUsage: string[],
    userMessage?: string
  ): ToolSuggestion[] {
    const suggestions: ToolSuggestion[] = [];

    // Analyze recent tool usage patterns
    const usagePatterns = this.analyzeUsagePatterns(recentToolUsage);

    // Get complementary tools based on recent usage
    const complementaryTools = this.getComplementaryTools(
      usagePatterns,
      context
    );
    suggestions.push(...complementaryTools);

    // Get workflow-based suggestions
    const workflowSuggestions = this.getWorkflowSuggestions(
      context,
      recentToolUsage
    );
    suggestions.push(...workflowSuggestions);

    return this.deduplicateAndSort(suggestions).slice(0, 5);
  }

  /**
   * Get page-based tool suggestions
   */
  private getPageBasedSuggestions(
    page: string,
    section?: string
  ): ToolSuggestion[] {
    const suggestions: ToolSuggestion[] = [];
    const pageMapping =
      this.pageToolMappings[page as keyof typeof this.pageToolMappings];

    if (!pageMapping) {
      return suggestions;
    }

    // Primary tools (high priority)
    pageMapping.primary.forEach((toolName) => {
      const tool = this.toolRegistry.get(toolName);
      if (tool) {
        suggestions.push({
          tool,
          relevance: 0.9,
          reason: `Highly relevant for ${page} page`,
          context: `page:${page}`,
          priority: "high",
        });
      }
    });

    // Secondary tools (medium priority)
    pageMapping.secondary.forEach((toolName) => {
      const tool = this.toolRegistry.get(toolName);
      if (tool) {
        suggestions.push({
          tool,
          relevance: 0.6,
          reason: `Useful for ${page} page`,
          context: `page:${page}`,
          priority: "medium",
        });
      }
    });

    // Tertiary tools (low priority)
    pageMapping.tertiary.forEach((toolName) => {
      const tool = this.toolRegistry.get(toolName);
      if (tool) {
        suggestions.push({
          tool,
          relevance: 0.3,
          reason: `Available on ${page} page`,
          context: `page:${page}`,
          priority: "low",
        });
      }
    });

    // Section-specific boosts
    if (section) {
      suggestions.forEach((suggestion) => {
        if (this.isToolRelevantForSection(suggestion.tool.name, section)) {
          suggestion.relevance = Math.min(suggestion.relevance + 0.2, 1.0);
          suggestion.reason += ` (especially for ${section} section)`;
        }
      });
    }

    return suggestions;
  }

  /**
   * Get intent-based tool suggestions from user message
   */
  private getIntentBasedSuggestions(
    message: string,
    context: ToolContext
  ): ToolSuggestion[] {
    const suggestions: ToolSuggestion[] = [];
    const lowerMessage = message.toLowerCase();

    // Detect intents from message
    const detectedIntents = this.detectIntents(lowerMessage);

    detectedIntents.forEach(({ intent, confidence }) => {
      const intentTools =
        this.intentToolMappings[
          intent as keyof typeof this.intentToolMappings
        ] || [];

      intentTools.forEach((toolName) => {
        const tool = this.toolRegistry.get(toolName);
        if (tool) {
          suggestions.push({
            tool,
            relevance: confidence,
            reason: `Matches intent: ${intent}`,
            context: `intent:${intent}`,
            priority:
              confidence > 0.6 ? "high" : confidence > 0.3 ? "medium" : "low",
          });
        }
      });
    });

    return suggestions;
  }

  /**
   * Get theme-based suggestions
   */
  private getThemeBasedSuggestions(context: ToolContext): ToolSuggestion[] {
    const suggestions: ToolSuggestion[] = [];

    // Always suggest theme toggle as a low-priority option
    const themeToggleTool = this.toolRegistry.get("ToggleTheme");
    if (themeToggleTool) {
      suggestions.push({
        tool: themeToggleTool,
        relevance: 0.2,
        reason: `Switch to ${
          context.theme === "light" ? "dark" : "light"
        } theme`,
        context: `theme:${context.theme}`,
        priority: "low",
      });
    }

    return suggestions;
  }

  /**
   * Detect user intents from message
   */
  private detectIntents(
    message: string
  ): Array<{ intent: string; confidence: number }> {
    const intents: Array<{ intent: string; confidence: number }> = [];

    const intentPatterns = {
      navigation: [
        /\b(go to|navigate|visit|show|take me)\b/,
        /\b(page|section|area)\b/,
      ],
      information: [
        /\b(tell me|show me|what|how|describe)\b/,
        /\b(about|info|information|details)\b/,
      ],
      action: [
        /\b(download|open|close|toggle|switch)\b/,
        /\b(do|perform|execute|run)\b/,
      ],
      contact: [
        /\b(contact|email|message|reach|connect)\b/,
        /\b(touch|communication|can)\b/,
      ],
      download: [/\b(download|get|save|pdf)\b/, /\b(resume|cv|document)\b/],
      theme: [/\b(theme|dark|light|mode)\b/, /\b(switch|toggle|change)\b/],
      projects: [
        /\b(project|portfolio|work|build)\b/,
        /\b(code|development|app)\b/,
      ],
      experience: [
        /\b(experience|work|job|career)\b/,
        /\b(background|history)\b/,
      ],
      skills: [
        /\b(skill|technology|tech|programming)\b/,
        /\b(language|framework|tool)\b/,
      ],
    };

    Object.entries(intentPatterns).forEach(([intent, patterns]) => {
      let confidence = 0;
      let matches = 0;

      patterns.forEach((pattern) => {
        if (pattern.test(message)) {
          matches++;
          confidence += 0.3;
        }
      });

      if (matches > 0) {
        // Boost confidence for multiple matches
        confidence = Math.min(confidence + (matches - 1) * 0.1, 1.0);
        intents.push({ intent, confidence });
      }
    });

    return intents.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Check if tool is relevant for specific section
   */
  private isToolRelevantForSection(toolName: string, section: string): boolean {
    const sectionRelevance = {
      experience: ["GetExperience", "NavigateToPage"],
      skills: ["GetSkills", "GetExperience"],
      projects: ["GetProjects", "NavigateToPage"],
      education: ["GetExperience", "NavigateToPage"],
      contact: ["OpenModal", "NavigateToPage"],
    };

    const relevantTools =
      sectionRelevance[section as keyof typeof sectionRelevance] || [];
    return relevantTools.includes(toolName);
  }

  /**
   * Get page-specific help data
   */
  private getPageHelpData(
    page: string,
    section?: string
  ): {
    description: string;
    actions: string[];
    questions: string[];
    navigation: string[];
  } {
    const helpData = {
      home: {
        description:
          "Welcome to Nikunj's portfolio homepage. Get an overview of skills, experience, and featured projects.",
        actions: [
          "Navigate to different sections",
          "View featured projects",
          "Check skills overview",
          "Switch theme",
          "Open contact form",
        ],
        questions: [
          "What are your main skills?",
          "Show me your recent projects",
          "Tell me about your experience",
          "How can I contact you?",
          "Can I download your resume?",
        ],
        navigation: [
          "Go to About page for detailed background",
          "Visit Projects page for portfolio",
          "Check Resume page for downloadable CV",
          "Open Contact form to get in touch",
        ],
      },
      about: {
        description:
          "Learn about Nikunj's professional background, experience, and skills in detail.",
        actions: [
          "View detailed experience",
          "Explore skills by category",
          "Navigate to specific sections",
          "Download resume",
          "Contact for opportunities",
        ],
        questions: [
          "What's your work experience?",
          "What technologies do you work with?",
          "Tell me about your education",
          "What are your achievements?",
          "Show me your career progression",
        ],
        navigation: [
          "View Projects to see work samples",
          "Download Resume for detailed CV",
          "Open Contact form for inquiries",
          "Return to Home for overview",
        ],
      },
      projects: {
        description:
          "Explore Nikunj's portfolio of projects across different technologies and domains.",
        actions: [
          "Filter projects by technology",
          "View project details",
          "Open project demos",
          "Navigate to source code",
          "Contact about projects",
        ],
        questions: [
          "Show me React projects",
          "What AI projects have you built?",
          "Tell me about your web applications",
          "Which project are you most proud of?",
          "Can I see the source code?",
        ],
        navigation: [
          "Go to About for technical background",
          "Check Resume for project summaries",
          "Open Contact to discuss projects",
          "Return to Home for overview",
        ],
      },
      resume: {
        description:
          "View and download Nikunj's professional resume with detailed qualifications and experience.",
        actions: [
          "Download PDF resume",
          "View online version",
          "Navigate to detailed sections",
          "Contact for opportunities",
          "Switch viewing theme",
        ],
        questions: [
          "Can I download your resume?",
          "What's your latest experience?",
          "Tell me about your qualifications",
          "What's your contact information?",
          "Are you available for work?",
        ],
        navigation: [
          "Visit About for detailed background",
          "Check Projects for work samples",
          "Open Contact form for opportunities",
          "Return to Home for overview",
        ],
      },
      contact: {
        description:
          "Contact Nikunj for opportunities, collaborations, or inquiries.",
        actions: [
          "Send a message",
          "View contact information",
          "Connect on social platforms",
          "Schedule a call",
          "Download resume",
        ],
        questions: [
          "How can I contact you?",
          "What's your email address?",
          "Are you available for work?",
          "Can we schedule a call?",
          "How do I connect on LinkedIn?",
        ],
        navigation: [
          "View About for background",
          "Check Projects for work samples",
          "Download Resume for qualifications",
          "Return to Home for overview",
        ],
      },
    };

    return helpData[page as keyof typeof helpData] || helpData.home;
  }

  /**
   * Analyze usage patterns from recent tool usage
   */
  private analyzeUsagePatterns(recentUsage: string[]): Map<string, number> {
    const patterns = new Map<string, number>();

    recentUsage.forEach((toolName) => {
      patterns.set(toolName, (patterns.get(toolName) || 0) + 1);
    });

    return patterns;
  }

  /**
   * Get complementary tools based on usage patterns
   */
  private getComplementaryTools(
    usagePatterns: Map<string, number>,
    context: ToolContext
  ): ToolSuggestion[] {
    const suggestions: ToolSuggestion[] = [];

    // Define tool relationships
    const complementaryRelations = {
      GetProjects: ["GetSkills", "NavigateToPage", "OpenModal"],
      GetExperience: ["GetSkills", "GetProjects", "TriggerDownload"],
      GetSkills: ["GetExperience", "GetProjects", "NavigateToPage"],
      NavigateToPage: ["GetProjects", "GetExperience", "OpenModal"],
      OpenModal: ["NavigateToPage", "GetProjects", "GetExperience"],
      ToggleTheme: ["NavigateToPage", "GetProjects"],
      TriggerDownload: ["GetExperience", "OpenModal", "NavigateToPage"],
    };

    usagePatterns.forEach((count, toolName) => {
      const complementary =
        complementaryRelations[
          toolName as keyof typeof complementaryRelations
        ] || [];

      complementary.forEach((compToolName) => {
        const tool = this.toolRegistry.get(compToolName);
        if (tool && !usagePatterns.has(compToolName)) {
          suggestions.push({
            tool,
            relevance: Math.min(0.4 + count * 0.1, 0.8),
            reason: `Complements recently used ${toolName}`,
            context: `usage-pattern:${toolName}`,
            priority: "medium",
          });
        }
      });
    });

    return suggestions;
  }

  /**
   * Get workflow-based suggestions
   */
  private getWorkflowSuggestions(
    context: ToolContext,
    recentUsage: string[]
  ): ToolSuggestion[] {
    const suggestions: ToolSuggestion[] = [];

    // Define common workflows
    const workflows = {
      "project-exploration": ["GetProjects", "NavigateToPage", "OpenModal"],
      "background-research": ["GetExperience", "GetSkills", "TriggerDownload"],
      "contact-flow": ["NavigateToPage", "OpenModal", "GetExperience"],
      "resume-flow": ["TriggerDownload", "GetExperience", "GetSkills"],
    };

    // Check if user is following a workflow
    Object.entries(workflows).forEach(([workflowName, steps]) => {
      const matchingSteps = steps.filter((step) => recentUsage.includes(step));

      if (matchingSteps.length > 0) {
        const nextSteps = steps.filter((step) => !recentUsage.includes(step));

        nextSteps.forEach((stepName) => {
          const tool = this.toolRegistry.get(stepName);
          if (tool) {
            suggestions.push({
              tool,
              relevance: 0.6 + matchingSteps.length * 0.1,
              reason: `Next step in ${workflowName} workflow`,
              context: `workflow:${workflowName}`,
              priority: "medium",
            });
          }
        });
      }
    });

    return suggestions;
  }

  /**
   * Remove duplicate suggestions and sort by relevance
   */
  private deduplicateAndSort(suggestions: ToolSuggestion[]): ToolSuggestion[] {
    const uniqueMap = new Map<string, ToolSuggestion>();

    suggestions.forEach((suggestion) => {
      const existing = uniqueMap.get(suggestion.tool.name);
      if (!existing || suggestion.relevance > existing.relevance) {
        uniqueMap.set(suggestion.tool.name, suggestion);
      }
    });

    return Array.from(uniqueMap.values()).sort(
      (a, b) => b.relevance - a.relevance
    );
  }
}
