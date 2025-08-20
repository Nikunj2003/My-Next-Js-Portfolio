/**
 * Unit tests for contextual tool suggestions system
 */

import { ContextualToolSuggestions } from "../contextual-tool-suggestions";
import { PortfolioTool, ToolContext } from "@/types/tools";

// Mock tools for testing
const mockTools: PortfolioTool[] = [
  {
    name: "NavigateToPage",
    description: "Navigate to a specific page",
    parameters: {},
    execute: async () => ({ success: true }),
  },
  {
    name: "GetProjects",
    description: "Get project information",
    parameters: {},
    execute: async () => ({ success: true }),
  },
  {
    name: "GetExperience",
    description: "Get experience information",
    parameters: {},
    execute: async () => ({ success: true }),
  },
  {
    name: "GetSkills",
    description: "Get skills information",
    parameters: {},
    execute: async () => ({ success: true }),
  },
  {
    name: "OpenModal",
    description: "Open a modal dialog",
    parameters: {},
    execute: async () => ({ success: true }),
  },
  {
    name: "ToggleTheme",
    description: "Toggle between light and dark theme",
    parameters: {},
    execute: async () => ({ success: true }),
  },
  {
    name: "TriggerDownload",
    description: "Trigger file download",
    parameters: {},
    execute: async () => ({ success: true }),
  },
];

describe("ContextualToolSuggestions", () => {
  let suggestions: ContextualToolSuggestions;
  let mockContext: ToolContext;

  beforeEach(() => {
    suggestions = new ContextualToolSuggestions();
    suggestions.registerTools(mockTools);

    mockContext = {
      currentPage: "home",
      theme: "light",
      userAgent: "test-agent",
      sessionId: "test-session",
    };
  });

  describe("tool registration", () => {
    it("should register a single tool", () => {
      const newSuggestions = new ContextualToolSuggestions();
      newSuggestions.registerTool(mockTools[0]);

      const result = newSuggestions.getSuggestions(mockContext);
      expect(result.some((s) => s.tool.name === "NavigateToPage")).toBe(true);
    });

    it("should register multiple tools", () => {
      const newSuggestions = new ContextualToolSuggestions();
      newSuggestions.registerTools(mockTools);

      const result = newSuggestions.getSuggestions(mockContext);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getSuggestions", () => {
    it("should return suggestions for home page", () => {
      const result = suggestions.getSuggestions(mockContext);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.tool.name === "NavigateToPage")).toBe(true);
      expect(result.some((s) => s.tool.name === "GetProjects")).toBe(true);
      expect(result.some((s) => s.tool.name === "GetSkills")).toBe(true);
    });

    it("should return different suggestions for about page", () => {
      const aboutContext = { ...mockContext, currentPage: "about" };
      const result = suggestions.getSuggestions(aboutContext);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.tool.name === "GetExperience")).toBe(true);
      expect(result.some((s) => s.tool.name === "GetSkills")).toBe(true);
    });

    it("should return different suggestions for projects page", () => {
      const projectsContext = { ...mockContext, currentPage: "projects" };
      const result = suggestions.getSuggestions(projectsContext);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.tool.name === "GetProjects")).toBe(true);
      expect(result.some((s) => s.tool.name === "OpenModal")).toBe(true);
    });

    it("should return different suggestions for resume page", () => {
      const resumeContext = { ...mockContext, currentPage: "resume" };
      const result = suggestions.getSuggestions(resumeContext);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.tool.name === "TriggerDownload")).toBe(true);
      expect(result.some((s) => s.tool.name === "GetExperience")).toBe(true);
    });

    it("should return different suggestions for contact page", () => {
      const contactContext = { ...mockContext, currentPage: "contact" };
      const result = suggestions.getSuggestions(contactContext);

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.tool.name === "OpenModal")).toBe(true);
    });

    it("should include intent-based suggestions when message provided", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "show me your projects"
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.tool.name === "GetProjects")).toBe(true);
      expect(result.some((s) => s.reason.includes("intent"))).toBe(true);
    });

    it("should boost relevance for section-specific tools", () => {
      const contextWithSection = {
        ...mockContext,
        currentPage: "about",
        currentSection: "experience",
      };
      const result = suggestions.getSuggestions(contextWithSection);

      const experienceSuggestion = result.find(
        (s) => s.tool.name === "GetExperience"
      );
      expect(experienceSuggestion).toBeDefined();
      expect(experienceSuggestion!.reason).toContain("experience section");
    });

    it("should limit suggestions to 10 items", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "tell me everything about projects experience skills"
      );

      expect(result.length).toBeLessThanOrEqual(10);
    });

    it("should sort suggestions by relevance", () => {
      const result = suggestions.getSuggestions(mockContext);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].relevance).toBeLessThanOrEqual(
          result[i - 1].relevance
        );
      }
    });

    it("should include theme toggle suggestion", () => {
      const result = suggestions.getSuggestions(mockContext);

      expect(result.some((s) => s.tool.name === "ToggleTheme")).toBe(true);
    });
  });

  describe("filterToolsByContext", () => {
    it("should filter tools for home page", () => {
      const result = suggestions.filterToolsByContext({ page: "home" });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((t) => t.name === "NavigateToPage")).toBe(true);
      expect(result.some((t) => t.name === "GetProjects")).toBe(true);
    });

    it("should filter tools for about page", () => {
      const result = suggestions.filterToolsByContext({ page: "about" });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((t) => t.name === "GetExperience")).toBe(true);
      expect(result.some((t) => t.name === "GetSkills")).toBe(true);
    });

    it("should further filter by intent", () => {
      const result = suggestions.filterToolsByContext({
        page: "home",
        intent: "projects",
      });

      expect(result.some((t) => t.name === "GetProjects")).toBe(true);
      expect(result.some((t) => t.name === "NavigateToPage")).toBe(true);
    });

    it("should return all tools for unmapped page", () => {
      const result = suggestions.filterToolsByContext({ page: "unknown" });

      expect(result.length).toBe(mockTools.length);
    });

    it("should handle empty intent gracefully", () => {
      const result = suggestions.filterToolsByContext({
        page: "home",
        intent: "unknown-intent",
      });

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getContextualHelp", () => {
    it("should return help for home page", () => {
      const result = suggestions.getContextualHelp(mockContext);

      expect(result.pageDescription).toContain("homepage");
      expect(result.availableActions.length).toBeGreaterThan(0);
      expect(result.suggestedQuestions.length).toBeGreaterThan(0);
      expect(result.navigationSuggestions.length).toBeGreaterThan(0);
    });

    it("should return help for about page", () => {
      const aboutContext = { ...mockContext, currentPage: "about" };
      const result = suggestions.getContextualHelp(aboutContext);

      expect(result.pageDescription).toContain("background");
      expect(result.availableActions).toContain("View detailed experience");
      expect(
        result.suggestedQuestions.some((q) => q.includes("experience"))
      ).toBe(true);
    });

    it("should return help for projects page", () => {
      const projectsContext = { ...mockContext, currentPage: "projects" };
      const result = suggestions.getContextualHelp(projectsContext);

      expect(result.pageDescription).toContain("portfolio");
      expect(result.availableActions).toContain(
        "Filter projects by technology"
      );
      expect(
        result.suggestedQuestions.some((q) => q.includes("projects"))
      ).toBe(true);
    });

    it("should return help for resume page", () => {
      const resumeContext = { ...mockContext, currentPage: "resume" };
      const result = suggestions.getContextualHelp(resumeContext);

      expect(result.pageDescription).toContain("resume");
      expect(result.availableActions).toContain("Download PDF resume");
      expect(
        result.suggestedQuestions.some((q) => q.includes("download"))
      ).toBe(true);
    });

    it("should return help for contact page", () => {
      const contactContext = { ...mockContext, currentPage: "contact" };
      const result = suggestions.getContextualHelp(contactContext);

      expect(result.pageDescription).toContain("Contact");
      expect(result.availableActions).toContain("Send a message");
      expect(result.suggestedQuestions.some((q) => q.includes("contact"))).toBe(
        true
      );
    });

    it("should fallback to home help for unknown page", () => {
      const unknownContext = { ...mockContext, currentPage: "unknown" };
      const result = suggestions.getContextualHelp(unknownContext);

      expect(result.pageDescription).toContain("homepage");
    });
  });

  describe("getSmartRecommendations", () => {
    it("should recommend complementary tools based on usage", () => {
      const recentUsage = ["GetProjects", "GetProjects"];
      const result = suggestions.getSmartRecommendations(
        mockContext,
        recentUsage
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.tool.name === "GetSkills")).toBe(true);
      expect(result.some((s) => s.reason.includes("Complements"))).toBe(true);
    });

    it("should suggest workflow next steps", () => {
      const recentUsage = ["GetProjects"];
      const result = suggestions.getSmartRecommendations(
        mockContext,
        recentUsage
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((s) => s.reason.includes("workflow"))).toBe(true);
    });

    it("should limit recommendations to 5 items", () => {
      const recentUsage = ["GetProjects", "GetExperience", "GetSkills"];
      const result = suggestions.getSmartRecommendations(
        mockContext,
        recentUsage
      );

      expect(result.length).toBeLessThanOrEqual(5);
    });

    it("should handle empty usage history", () => {
      const result = suggestions.getSmartRecommendations(mockContext, []);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should increase relevance for frequently used tools", () => {
      const recentUsage = ["GetProjects", "GetProjects", "GetProjects"];
      const result = suggestions.getSmartRecommendations(
        mockContext,
        recentUsage
      );

      const complementaryTool = result.find((s) =>
        s.reason.includes("GetProjects")
      );
      if (complementaryTool) {
        expect(complementaryTool.relevance).toBeGreaterThan(0.4);
      }
    });
  });

  describe("intent detection", () => {
    it("should detect navigation intent", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "go to projects page"
      );

      expect(result.some((s) => s.context?.includes("intent:navigation"))).toBe(
        true
      );
      expect(result.some((s) => s.tool.name === "NavigateToPage")).toBe(true);
    });

    it("should detect information intent", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "tell me about your experience"
      );

      expect(
        result.some((s) => s.context?.includes("intent:information"))
      ).toBe(true);
      expect(result.some((s) => s.tool.name === "GetExperience")).toBe(true);
    });

    it("should detect download intent", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "download your resume"
      );

      expect(result.some((s) => s.context?.includes("intent:download"))).toBe(
        true
      );
      expect(result.some((s) => s.tool.name === "TriggerDownload")).toBe(true);
    });

    it("should detect theme intent", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "switch to dark mode"
      );

      expect(result.some((s) => s.context?.includes("intent:theme"))).toBe(
        true
      );
      expect(result.some((s) => s.tool.name === "ToggleTheme")).toBe(true);
    });

    it("should detect contact intent", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "how can I contact you"
      );

      expect(result.some((s) => s.context?.includes("intent:contact"))).toBe(
        true
      );
      expect(result.some((s) => s.tool.name === "OpenModal")).toBe(true);
    });

    it("should handle multiple intents in one message", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "show me projects and download resume"
      );

      expect(result.some((s) => s.tool.name === "GetProjects")).toBe(true);
      expect(result.some((s) => s.tool.name === "TriggerDownload")).toBe(true);
    });
  });

  describe("priority assignment", () => {
    it("should assign high priority to primary page tools", () => {
      const result = suggestions.getSuggestions(mockContext);

      const primaryTool = result.find((s) => s.tool.name === "NavigateToPage");
      expect(primaryTool?.priority).toBe("high");
    });

    it("should assign medium priority to secondary tools", () => {
      const result = suggestions.getSuggestions(mockContext);

      const secondaryTool = result.find((s) => s.tool.name === "OpenModal");
      expect(secondaryTool?.priority).toBe("medium");
    });

    it("should assign low priority to tertiary tools", () => {
      const result = suggestions.getSuggestions(mockContext);

      const tertiaryTool = result.find(
        (s) => s.tool.name === "TriggerDownload"
      );
      expect(tertiaryTool?.priority).toBe("low");
    });

    it("should assign priority based on intent confidence", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "definitely download the resume now"
      );

      const downloadTool = result.find(
        (s) => s.tool.name === "TriggerDownload"
      );
      expect(downloadTool?.priority).toBe("high");
    });
  });

  describe("deduplication", () => {
    it("should remove duplicate tool suggestions", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "projects and portfolio work"
      );

      const toolNames = result.map((s) => s.tool.name);
      const uniqueToolNames = Array.from(new Set(toolNames));

      expect(toolNames.length).toBe(uniqueToolNames.length);
    });

    it("should keep highest relevance when deduplicating", () => {
      const result = suggestions.getSuggestions(
        mockContext,
        "show me all your projects"
      );

      const projectTool = result.find((s) => s.tool.name === "GetProjects");
      expect(projectTool).toBeDefined();

      // Should have high relevance from both page and intent matching
      expect(projectTool!.relevance).toBeGreaterThan(0.5);
    });
  });
});
