/**
 * Context-aware tool registry that integrates contextual suggestions
 * with the existing tool execution system
 */

import { ToolRegistry } from "./tool-registry";
import {
  ContextualToolSuggestions,
  ToolSuggestion,
  ContextualHelp,
} from "./contextual-tool-suggestions";
import { PageContextDetector, ContextTracker } from "./page-context-detector";
import {
  PortfolioTool,
  ToolContext,
  ToolResult,
  ToolCall,
} from "@/types/tools";

/**
 * Enhanced tool registry with contextual awareness
 */
export class ContextAwareToolRegistry extends ToolRegistry {
  private contextualSuggestions: ContextualToolSuggestions;
  private contextDetector: PageContextDetector;
  private recentToolUsage: string[] = [];
  private maxUsageHistory = 20;

  constructor() {
    super();
    this.contextualSuggestions = new ContextualToolSuggestions();
    this.contextDetector = ContextTracker.getInstance();
  }

  /**
   * Register a tool and add it to contextual suggestions
   */
  register(tool: PortfolioTool): void {
    super.register(tool);
    this.contextualSuggestions.registerTool(tool);
  }

  /**
   * Get contextual tool suggestions based on current context
   */
  getContextualSuggestions(
    context: ToolContext,
    userMessage?: string
  ): ToolSuggestion[] {
    // Track the current context
    this.contextDetector.trackContext(context, "suggestion-request");

    return this.contextualSuggestions.getSuggestions(context, userMessage);
  }

  /**
   * Get smart recommendations based on usage patterns
   */
  getSmartRecommendations(
    context: ToolContext,
    userMessage?: string
  ): ToolSuggestion[] {
    return this.contextualSuggestions.getSmartRecommendations(
      context,
      this.recentToolUsage,
      userMessage
    );
  }

  /**
   * Get contextual help for current page
   */
  getContextualHelp(context: ToolContext): ContextualHelp {
    return this.contextualSuggestions.getContextualHelp(context);
  }

  /**
   * Filter tools by context criteria
   */
  getRelevantTools(context: ToolContext, intent?: string): PortfolioTool[] {
    return this.contextualSuggestions.filterToolsByContext({
      page: context.currentPage,
      section: context.currentSection,
      intent,
      theme: context.theme,
    });
  }

  /**
   * Execute tool with context awareness and usage tracking
   */
  async executeTool(
    toolName: string,
    args: Record<string, unknown>,
    context: ToolContext,
    config?: any
  ): Promise<ToolResult> {
    // Track context before execution
    this.contextDetector.trackContext(context, `tool-execution:${toolName}`);

    // Execute the tool using parent method
    const result = await super.executeTool(toolName, args, context, config);

    // Track tool usage for smart recommendations
    this.trackToolUsage(toolName);

    // Update context if tool execution resulted in navigation or state changes
    if (result.success && result.actions) {
      const updatedContext = this.updateContextFromActions(
        context,
        result.actions
      );
      if (updatedContext) {
        this.contextDetector.trackContext(
          updatedContext,
          `tool-result:${toolName}`
        );
      }
    }

    return result;
  }

  /**
   * Get enhanced function definitions with contextual information
   */
  getContextualFunctionDefinitions(context: ToolContext): Array<{
    name: string;
    description: string;
    parameters: any;
    relevance?: number;
    context?: string;
  }> {
    const baseFunctions = this.getFunctionDefinitions();
    const suggestions = this.getContextualSuggestions(context);

    // Enhance function definitions with contextual relevance
    return baseFunctions
      .map((func) => {
        const suggestion = suggestions.find((s) => s.tool.name === func.name);

        return {
          ...func,
          relevance: suggestion?.relevance,
          context: suggestion?.context,
        };
      })
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
  }

  /**
   * Detect page context from various sources
   */
  detectPageContext(sources: {
    url?: string;
    chatMessage?: string;
    navigationHistory?: string[];
    referrer?: string;
  }): ToolContext {
    const detection = this.contextDetector.detectFromMultipleSources(sources);

    const context: ToolContext = {
      currentPage: detection.page,
      currentSection: detection.section,
      theme: "light", // Default, should be overridden by caller
      userAgent: "unknown", // Default, should be overridden by caller
      sessionId: `session-${Date.now()}`,
    };

    this.contextDetector.trackContext(context, "context-detection");
    return context;
  }

  /**
   * Get context history for analysis
   */
  getContextHistory(limit?: number): Array<{
    timestamp: Date;
    context: ToolContext;
    source: string;
  }> {
    return this.contextDetector.getContextHistory(limit);
  }

  /**
   * Get usage analytics for tools
   */
  getUsageAnalytics(): {
    recentUsage: string[];
    usagePatterns: Record<string, number>;
    contextHistory: Array<{
      timestamp: Date;
      context: ToolContext;
      source: string;
    }>;
    suggestions: ToolSuggestion[];
  } {
    const currentContext = this.contextDetector.getCurrentContext();
    const usagePatterns = this.recentToolUsage.reduce((acc, tool) => {
      acc[tool] = (acc[tool] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      recentUsage: [...this.recentToolUsage],
      usagePatterns,
      contextHistory: this.getContextHistory(10),
      suggestions: currentContext
        ? this.getContextualSuggestions(currentContext)
        : [],
    };
  }

  /**
   * Clear all registered tools
   */
  clearAllTools(): void {
    super.clearAllTools();
    this.contextualSuggestions = new ContextualToolSuggestions();
    this.resetContextualData();
  }

  /**
   * Reset contextual data
   */
  resetContextualData(): void {
    this.recentToolUsage = [];
    this.contextDetector.clearHistory();
  }

  /**
   * Get tools recommended for specific workflow
   */
  getWorkflowTools(
    workflow:
      | "project-exploration"
      | "background-research"
      | "contact-flow"
      | "resume-flow"
  ): PortfolioTool[] {
    const workflowMappings = {
      "project-exploration": ["GetProjects", "NavigateToPage", "OpenModal"],
      "background-research": ["GetExperience", "GetSkills", "TriggerDownload"],
      "contact-flow": ["NavigateToPage", "OpenModal", "GetExperience"],
      "resume-flow": ["TriggerDownload", "GetExperience", "GetSkills"],
    };

    const toolNames = workflowMappings[workflow] || [];
    return toolNames
      .map((name) => this.get(name))
      .filter(Boolean) as PortfolioTool[];
  }

  /**
   * Track tool usage for smart recommendations
   */
  private trackToolUsage(toolName: string): void {
    this.recentToolUsage.push(toolName);

    // Maintain usage history size
    if (this.recentToolUsage.length > this.maxUsageHistory) {
      this.recentToolUsage.shift();
    }
  }

  /**
   * Update context based on tool execution results
   */
  private updateContextFromActions(
    currentContext: ToolContext,
    actions: any[]
  ): ToolContext | null {
    let updatedContext: ToolContext | null = null;

    for (const action of actions) {
      if (action.type === "navigate" && action.target) {
        updatedContext = {
          ...currentContext,
          currentPage: action.target,
          currentSection: action.data?.section,
        };
      } else if (action.type === "theme" && action.target) {
        updatedContext = {
          ...currentContext,
          theme: action.target as "light" | "dark",
        };
      }
    }

    return updatedContext;
  }
}

/**
 * Enhanced global tool registry with contextual awareness
 */
export const contextAwareToolRegistry = new ContextAwareToolRegistry();
