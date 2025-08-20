/**
 * Unit tests for page context detection system
 */

import {
  PageContextDetector,
  ContextTracker,
  PageContextDetection,
} from "../page-context-detector";
import { ToolContext } from "@/types/tools";

describe("PageContextDetector", () => {
  let detector: PageContextDetector;

  beforeEach(() => {
    detector = new PageContextDetector();
  });

  describe("detectFromUrl", () => {
    it("should detect home page from root URL", () => {
      const result = detector.detectFromUrl("https://example.com/");

      expect(result.page).toBe("home");
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.source).toBe("url");
    });

    it("should detect about page from URL", () => {
      const result = detector.detectFromUrl("https://example.com/about");

      expect(result.page).toBe("about");
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.source).toBe("url");
    });

    it("should detect projects page with section from URL", () => {
      const result = detector.detectFromUrl(
        "https://example.com/projects/web-apps"
      );

      expect(result.page).toBe("projects");
      expect(result.section).toBe("web-apps");
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.source).toBe("url");
    });

    it("should detect section from hash fragment", () => {
      const result = detector.detectFromUrl(
        "https://example.com/about#experience"
      );

      expect(result.page).toBe("about");
      expect(result.section).toBe("experience");
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.source).toBe("url");
    });

    it("should handle invalid URLs gracefully", () => {
      const result = detector.detectFromUrl("invalid-url");

      expect(result.page).toBe("home");
      expect(result.confidence).toBeLessThan(0.2);
      expect(result.source).toBe("default");
      expect(result.metadata?.error).toBeDefined();
    });

    it("should sanitize invalid page names", () => {
      const result = detector.detectFromUrl("https://example.com/invalid-page");

      expect(result.page).toBe("home");
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.source).toBe("url");
    });
  });

  describe("detectFromChatMessage", () => {
    it("should detect about page from experience-related message", () => {
      const result = detector.detectFromChatMessage(
        "Tell me about your work experience"
      );

      expect(result.page).toBe("about");
      expect(result.section).toBe("experience");
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.source).toBe("chat");
    });

    it("should detect projects page from project-related message", () => {
      const result = detector.detectFromChatMessage(
        "Show me your projects and portfolio"
      );

      expect(result.page).toBe("projects");
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.source).toBe("chat");
    });

    it("should detect contact page from contact-related message", () => {
      const result = detector.detectFromChatMessage(
        "How can I contact you or send an email?"
      );

      expect(result.page).toBe("contact");
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.source).toBe("chat");
    });

    it("should detect resume page from resume-related message", () => {
      const result = detector.detectFromChatMessage(
        "Can I download your resume PDF?"
      );

      expect(result.page).toBe("resume");
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.source).toBe("chat");
    });

    it("should detect skills section from skills-related message", () => {
      const result = detector.detectFromChatMessage(
        "What programming languages and technologies do you know?"
      );

      expect(result.section).toBe("skills");
      expect(result.confidence).toBeGreaterThan(0.1);
      expect(result.source).toBe("chat");
    });

    it("should handle generic messages with low confidence", () => {
      const result = detector.detectFromChatMessage("Hello there");

      expect(result.page).toBe("home");
      expect(result.confidence).toBeLessThan(0.3);
      expect(result.source).toBe("chat");
    });

    it("should increase confidence for multiple matches", () => {
      const result1 = detector.detectFromChatMessage("projects");
      const result2 = detector.detectFromChatMessage(
        "projects and portfolio work"
      );

      expect(result2.confidence).toBeGreaterThan(result1.confidence);
    });

    it("should increase confidence for shorter messages with matches", () => {
      const result1 = detector.detectFromChatMessage(
        "Tell me about your work experience and career background in detail"
      );
      const result2 = detector.detectFromChatMessage("work experience");

      expect(result2.confidence).toBeGreaterThan(result1.confidence);
    });
  });

  describe("detectFromNavigation", () => {
    it("should detect from navigation history", () => {
      const history = ["/home", "/about", "/projects"];
      const result = detector.detectFromNavigation(history);

      expect(result.page).toBe("projects");
      expect(result.source).toBe("navigation");
      expect(result.metadata?.navigationHistory).toEqual([
        "/home",
        "/about",
        "/projects",
      ]);
    });

    it("should handle empty navigation history", () => {
      const result = detector.detectFromNavigation([]);

      expect(result.page).toBe("home");
      expect(result.confidence).toBeLessThan(0.2);
      expect(result.source).toBe("default");
    });

    it("should limit navigation history in metadata", () => {
      const longHistory = ["/1", "/2", "/3", "/4", "/5", "/projects"];
      const result = detector.detectFromNavigation(longHistory);

      expect(result.metadata?.navigationHistory).toHaveLength(3);
      expect(result.metadata?.navigationHistory).toEqual([
        "/4",
        "/5",
        "/projects",
      ]);
    });
  });

  describe("detectFromReferrer", () => {
    it("should detect from referrer URL", () => {
      const result = detector.detectFromReferrer("https://example.com/about");

      expect(result.page).toBe("about");
      expect(result.source).toBe("referrer");
      expect(result.metadata?.referrer).toBe("https://example.com/about");
    });

    it("should handle empty referrer", () => {
      const result = detector.detectFromReferrer("");

      expect(result.page).toBe("home");
      expect(result.confidence).toBeLessThan(0.2);
      expect(result.source).toBe("default");
    });

    it("should have lower confidence than direct URL detection", () => {
      const urlResult = detector.detectFromUrl("https://example.com/about");
      const referrerResult = detector.detectFromReferrer(
        "https://example.com/about"
      );

      expect(referrerResult.confidence).toBeLessThan(urlResult.confidence);
    });
  });

  describe("detectFromMultipleSources", () => {
    it("should combine multiple sources and pick best result", () => {
      const result = detector.detectFromMultipleSources({
        url: "https://example.com/projects",
        chatMessage: "show me your work",
        navigationHistory: ["/home", "/about"],
        referrer: "https://google.com",
      });

      // The result should be from the highest confidence source
      expect(["projects", "about"]).toContain(result.page);
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.metadata?.sourcesUsed).toHaveLength(4);
      expect(result.metadata?.totalSources).toBe(4);
    });

    it("should handle no sources provided", () => {
      const result = detector.detectFromMultipleSources({});

      expect(result.page).toBe("home");
      expect(result.confidence).toBeLessThan(0.2);
      expect(result.source).toBe("default");
    });

    it("should increase confidence with multiple sources", () => {
      const singleResult = detector.detectFromMultipleSources({
        chatMessage: "projects",
      });

      const multiResult = detector.detectFromMultipleSources({
        chatMessage: "projects",
        navigationHistory: ["/projects"],
      });

      expect(multiResult.confidence).toBeGreaterThan(singleResult.confidence);
    });
  });

  describe("context tracking", () => {
    it("should track context changes", () => {
      const context: ToolContext = {
        currentPage: "about",
        theme: "dark",
        userAgent: "test",
        sessionId: "test-session",
      };

      detector.trackContext(context, "test");

      const history = detector.getContextHistory();
      expect(history).toHaveLength(1);
      expect(history[0].context).toEqual(context);
      expect(history[0].source).toBe("test");
    });

    it("should maintain history size limit", () => {
      // Add more than max history size
      for (let i = 0; i < 60; i++) {
        const context: ToolContext = {
          currentPage: "home",
          theme: "light",
          userAgent: "test",
          sessionId: `session-${i}`,
        };
        detector.trackContext(context, `test-${i}`);
      }

      const history = detector.getContextHistory();
      expect(history.length).toBeLessThanOrEqual(50);
    });

    it("should get current context from history", () => {
      const context: ToolContext = {
        currentPage: "projects",
        theme: "light",
        userAgent: "test",
        sessionId: "current-session",
      };

      detector.trackContext(context, "test");

      const current = detector.getCurrentContext();
      expect(current).toEqual(context);
    });

    it("should return null for empty history", () => {
      const current = detector.getCurrentContext();
      expect(current).toBeNull();
    });

    it("should get context changes since date", async () => {
      const baseTime = new Date();

      // Add some contexts
      detector.trackContext(
        {
          currentPage: "home",
          theme: "light",
          userAgent: "test",
          sessionId: "session-1",
        },
        "test-1"
      );

      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
      const midTime = new Date();
      await new Promise((resolve) => setTimeout(resolve, 10));

      detector.trackContext(
        {
          currentPage: "about",
          theme: "light",
          userAgent: "test",
          sessionId: "session-2",
        },
        "test-2"
      );

      const changes = detector.getContextChanges(midTime);
      expect(changes).toHaveLength(1);
      expect(changes[0].context.currentPage).toBe("about");
    });

    it("should clear history", () => {
      detector.trackContext(
        {
          currentPage: "home",
          theme: "light",
          userAgent: "test",
          sessionId: "session",
        },
        "test"
      );

      expect(detector.getContextHistory()).toHaveLength(1);

      detector.clearHistory();
      expect(detector.getContextHistory()).toHaveLength(0);
    });
  });

  describe("validateDetectedContext", () => {
    it("should validate valid context", () => {
      const detection: PageContextDetection = {
        page: "about",
        section: "experience",
        confidence: 0.8,
        source: "url",
      };

      const result = detector.validateDetectedContext(detection);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitized.page).toBe("about");
      expect(result.sanitized.section).toBe("experience");
    });

    it("should sanitize invalid page", () => {
      const detection: PageContextDetection = {
        page: "invalid-page",
        confidence: 0.8,
        source: "url",
      };

      const result = detector.validateDetectedContext(detection);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Invalid page: invalid-page");
      expect(result.sanitized.page).toBe("home");
    });

    it("should sanitize invalid confidence", () => {
      const detection: PageContextDetection = {
        page: "about",
        confidence: 1.5,
        source: "url",
      };

      const result = detector.validateDetectedContext(detection);

      expect(result.sanitized.confidence).toBe(1.0);
    });

    it("should handle negative confidence", () => {
      const detection: PageContextDetection = {
        page: "about",
        confidence: -0.5,
        source: "url",
      };

      const result = detector.validateDetectedContext(detection);

      expect(result.sanitized.confidence).toBe(0);
    });
  });
});

describe("ContextTracker", () => {
  beforeEach(() => {
    ContextTracker.resetInstance();
  });

  it("should provide singleton instance", () => {
    const instance1 = ContextTracker.getInstance();
    const instance2 = ContextTracker.getInstance();

    expect(instance1).toBe(instance2);
  });

  it("should reset singleton instance", () => {
    const instance1 = ContextTracker.getInstance();
    ContextTracker.resetInstance();
    const instance2 = ContextTracker.getInstance();

    expect(instance1).not.toBe(instance2);
  });

  describe("detectCurrentContext", () => {
    it("should detect context with overrides", () => {
      const context = ContextTracker.detectCurrentContext({
        currentPage: "projects",
        theme: "dark",
      });

      expect(context.currentPage).toBe("projects");
      expect(context.theme).toBe("dark");
      expect(context.sessionId).toBeDefined();
      expect(context.userAgent).toBeDefined();
    });

    it("should track detected context", () => {
      const detector = ContextTracker.getInstance();

      ContextTracker.detectCurrentContext();

      const history = detector.getContextHistory();
      expect(history.length).toBeGreaterThan(0);
    });
  });
});
