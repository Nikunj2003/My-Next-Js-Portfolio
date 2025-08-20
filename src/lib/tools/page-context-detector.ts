/**
 * Page context detection system for AI Portfolio Navigator
 * Implements intelligent page and section detection from various sources
 */

import { ToolContext } from "@/types/tools";
import {
  ContextSanitizer,
  ContextValidator,
  ContextTransformer,
} from "./context-utils";

/**
 * Page context detection result
 */
export interface PageContextDetection {
  /** Detected page */
  page: string;
  /** Detected section (if any) */
  section?: string;
  /** Confidence level (0-1) */
  confidence: number;
  /** Source of detection */
  source: "url" | "referrer" | "chat" | "navigation" | "default";
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Context tracking entry
 */
export interface ContextTrackingEntry {
  /** Timestamp of the context */
  timestamp: Date;
  /** Context at this point */
  context: ToolContext;
  /** Source of the context change */
  source: string;
  /** Previous context (if available) */
  previousContext?: ToolContext;
}

/**
 * Page context detector class
 */
export class PageContextDetector {
  private contextHistory: ContextTrackingEntry[] = [];
  private maxHistorySize = 50;

  /**
   * Detect page context from URL path
   */
  detectFromUrl(url: string): PageContextDetection {
    try {
      // Check if URL is obviously invalid
      if (!url || typeof url !== "string" || url.trim() === "") {
        throw new Error("Empty or invalid URL");
      }

      const urlObj = new URL(url, "https://example.com");

      // Check if this was actually a valid URL or just got parsed with base
      if (url.startsWith("http") || url.startsWith("/")) {
        const { page, section } = ContextTransformer.pathToPageSection(
          urlObj.pathname
        );

        // Extract section from hash if not in path
        let detectedSection = section;
        if (!detectedSection && urlObj.hash) {
          detectedSection = urlObj.hash.replace("#", "");
        }

        return {
          page,
          section: detectedSection,
          confidence: 0.95,
          source: "url",
          metadata: {
            originalUrl: url,
            pathname: urlObj.pathname,
            hash: urlObj.hash,
            search: urlObj.search,
          },
        };
      } else {
        throw new Error("Invalid URL format");
      }
    } catch (error) {
      return {
        page: "home",
        confidence: 0.1,
        source: "default",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * Detect page context from chat message content
   */
  detectFromChatMessage(message: string): PageContextDetection {
    const lowerMessage = message.toLowerCase();

    // Page detection patterns
    const pagePatterns = {
      home: [
        /\b(home|main|landing|index)\b/,
        /\b(welcome|intro|start)\b/,
        /\b(overview|summary)\b/,
      ],
      about: [
        /\b(about|bio|background|experience)\b/,
        /\b(career|work|job|employment)\b/,
        /\b(education|qualification|degree)\b/,
        /\b(personal|profile|resume)\b/,
      ],
      projects: [
        /\b(project|portfolio|work|build)\b/,
        /\b(code|development|app|website)\b/,
        /\b(github|repository|demo)\b/,
        /\b(showcase|gallery)\b/,
      ],
      resume: [
        /\b(resume|cv|curriculum)\b/,
        /\b(download|pdf|document)\b/,
        /\b(qualification|certification)\b/,
      ],
      contact: [
        /\b(contact|email|message|reach)\b/,
        /\b(connect|communication|touch)\b/,
        /\b(linkedin|social|network)\b/,
      ],
    };

    // Section detection patterns
    const sectionPatterns = {
      skills: /\b(skill|technology|tech|programming|language)\b/,
      experience: /\b(experience|work|job|career|employment)\b/,
      education: /\b(education|degree|university|college|school)\b/,
      achievements: /\b(achievement|award|recognition|accomplishment)\b/,
      projects: /\b(project|portfolio|work|build|development)\b/,
    };

    let bestMatch: PageContextDetection = {
      page: "home",
      confidence: 0.1,
      source: "chat",
    };

    // Check page patterns
    for (const [page, patterns] of Object.entries(pagePatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(lowerMessage)) {
          const confidence = this.calculateChatConfidence(
            lowerMessage,
            pattern
          );
          if (confidence > bestMatch.confidence) {
            bestMatch = {
              page,
              confidence,
              source: "chat",
              metadata: {
                matchedPattern: pattern.source,
                originalMessage: message,
              },
            };
          }
        }
      }
    }

    // Check section patterns regardless of page match confidence
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(lowerMessage)) {
        bestMatch.section = section;
        bestMatch.confidence = Math.min(bestMatch.confidence + 0.1, 1.0);
        break;
      }
    }

    return bestMatch;
  }

  /**
   * Detect page context from navigation history
   */
  detectFromNavigation(navigationHistory: string[]): PageContextDetection {
    if (navigationHistory.length === 0) {
      return {
        page: "home",
        confidence: 0.1,
        source: "default",
      };
    }

    const lastNavigation = navigationHistory[navigationHistory.length - 1];
    const detection = this.detectFromUrl(lastNavigation);

    return {
      ...detection,
      source: "navigation",
      confidence: Math.min(detection.confidence + 0.05, 1.0),
      metadata: {
        ...detection.metadata,
        navigationHistory: navigationHistory.slice(-3), // Last 3 entries
      },
    };
  }

  /**
   * Detect page context from referrer
   */
  detectFromReferrer(referrer: string): PageContextDetection {
    if (!referrer) {
      return {
        page: "home",
        confidence: 0.1,
        source: "default",
      };
    }

    const detection = this.detectFromUrl(referrer);
    return {
      ...detection,
      source: "referrer",
      confidence: Math.max(detection.confidence - 0.1, 0.1),
      metadata: {
        ...detection.metadata,
        referrer,
      },
    };
  }

  /**
   * Combine multiple detection sources for best result
   */
  detectFromMultipleSources(sources: {
    url?: string;
    chatMessage?: string;
    navigationHistory?: string[];
    referrer?: string;
  }): PageContextDetection {
    const detections: PageContextDetection[] = [];

    if (sources.url) {
      detections.push(this.detectFromUrl(sources.url));
    }

    if (sources.chatMessage) {
      detections.push(this.detectFromChatMessage(sources.chatMessage));
    }

    if (sources.navigationHistory) {
      detections.push(this.detectFromNavigation(sources.navigationHistory));
    }

    if (sources.referrer) {
      detections.push(this.detectFromReferrer(sources.referrer));
    }

    if (detections.length === 0) {
      return {
        page: "home",
        confidence: 0.1,
        source: "default",
      };
    }

    // Find the detection with highest confidence
    const bestDetection = detections.reduce((best, current) =>
      current.confidence > best.confidence ? current : best
    );

    // Combine metadata from all sources
    const combinedMetadata = detections.reduce(
      (acc, detection) => ({
        ...acc,
        ...detection.metadata,
      }),
      {}
    );

    return {
      ...bestDetection,
      confidence: Math.min(
        bestDetection.confidence + (detections.length - 1) * 0.05,
        1.0
      ),
      metadata: {
        ...combinedMetadata,
        sourcesUsed: detections.map((d) => d.source),
        totalSources: detections.length,
      },
    };
  }

  /**
   * Track context changes over time
   */
  trackContext(context: ToolContext, source: string): void {
    const previousContext =
      this.contextHistory.length > 0
        ? this.contextHistory[this.contextHistory.length - 1].context
        : undefined;

    const entry: ContextTrackingEntry = {
      timestamp: new Date(),
      context: { ...context },
      source,
      previousContext,
    };

    this.contextHistory.push(entry);

    // Maintain history size limit
    if (this.contextHistory.length > this.maxHistorySize) {
      this.contextHistory = this.contextHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get context history
   */
  getContextHistory(limit?: number): ContextTrackingEntry[] {
    const history = [...this.contextHistory];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Get current context from history
   */
  getCurrentContext(): ToolContext | null {
    if (this.contextHistory.length === 0) {
      return null;
    }
    return this.contextHistory[this.contextHistory.length - 1].context;
  }

  /**
   * Get context changes between two time points
   */
  getContextChanges(since: Date): ContextTrackingEntry[] {
    return this.contextHistory.filter((entry) => entry.timestamp >= since);
  }

  /**
   * Validate detected context
   */
  validateDetectedContext(detection: PageContextDetection): {
    valid: boolean;
    sanitized: PageContextDetection;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate page
    if (!ContextValidator.isValidPage(detection.page)) {
      errors.push(`Invalid page: ${detection.page}`);
    }

    // Validate section if present
    if (detection.section && typeof detection.section !== "string") {
      errors.push(`Invalid section type: ${typeof detection.section}`);
    }

    // Validate confidence
    if (detection.confidence < 0 || detection.confidence > 1) {
      errors.push(`Invalid confidence: ${detection.confidence}`);
    }

    // Sanitize the detection
    const sanitized: PageContextDetection = {
      page: ContextSanitizer.sanitizePage(detection.page),
      section: ContextSanitizer.sanitizeSection(detection.section),
      confidence: Math.max(0, Math.min(1, detection.confidence)),
      source: detection.source,
      metadata: detection.metadata,
    };

    return {
      valid: errors.length === 0,
      sanitized,
      errors,
    };
  }

  /**
   * Clear context history
   */
  clearHistory(): void {
    this.contextHistory = [];
  }

  /**
   * Calculate confidence for chat-based detection
   */
  private calculateChatConfidence(message: string, pattern: RegExp): number {
    const matches = message.match(pattern);
    if (!matches) return 0;

    let confidence = 0.3; // Base confidence for any match

    // Increase confidence based on match characteristics
    if (matches[0].length > 3) confidence += 0.1; // Longer matches are more confident
    if (matches.index === 0) confidence += 0.1; // Matches at start are more confident

    // Check for multiple matches
    const globalPattern = new RegExp(pattern.source, "gi");
    const allMatches = message.match(globalPattern);
    if (allMatches && allMatches.length > 1) {
      confidence += Math.min(allMatches.length * 0.05, 0.2);
    }

    // Check message length (shorter messages with matches are more confident)
    if (message.length < 50) confidence += 0.1;

    return Math.min(confidence, 0.9); // Cap at 0.9 for chat-based detection
  }
}

/**
 * Context tracking utilities
 */
export class ContextTracker {
  private static instance: PageContextDetector | null = null;

  /**
   * Get singleton instance
   */
  static getInstance(): PageContextDetector {
    if (!this.instance) {
      this.instance = new PageContextDetector();
    }
    return this.instance;
  }

  /**
   * Reset singleton instance
   */
  static resetInstance(): void {
    this.instance = null;
  }

  /**
   * Quick context detection from current environment
   */
  static detectCurrentContext(
    overrides: Partial<ToolContext> = {}
  ): ToolContext {
    const detector = this.getInstance();

    // Try to detect from browser environment
    if (typeof window !== "undefined") {
      const detection = detector.detectFromMultipleSources({
        url: window.location.href,
        referrer: document.referrer,
      });

      const context: ToolContext = {
        currentPage: detection.page,
        currentSection: detection.section,
        theme: ContextTransformer["detectSystemTheme"](),
        userAgent: navigator.userAgent,
        sessionId: ContextTransformer["generateSessionId"](),
        ...overrides,
      };

      detector.trackContext(context, "browser-detection");
      return context;
    }

    // Fallback for server-side
    const context = ContextTransformer.forServer("home", overrides);
    detector.trackContext(context, "server-fallback");
    return context;
  }
}
