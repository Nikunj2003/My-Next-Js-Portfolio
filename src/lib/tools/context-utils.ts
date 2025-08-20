/**
 * Utility functions for tool context validation and sanitization
 */

import { ToolContext } from "@/types/tools";

/**
 * Context sanitization utilities
 */
export class ContextSanitizer {
  /**
   * Sanitize page name
   */
  static sanitizePage(page: string): string {
    if (!page || typeof page !== "string") {
      return "home";
    }

    const sanitized = page.trim().toLowerCase();
    const validPages = ["home", "about", "projects", "resume", "contact"];

    return validPages.includes(sanitized) ? sanitized : "home";
  }

  /**
   * Sanitize section name
   */
  static sanitizeSection(section: string | undefined): string | undefined {
    if (!section || typeof section !== "string") {
      return undefined;
    }

    const sanitized = section.trim().toLowerCase();
    return sanitized.length > 0 ? sanitized : undefined;
  }

  /**
   * Sanitize theme
   */
  static sanitizeTheme(theme: string): "light" | "dark" {
    if (theme === "dark") {
      return "dark";
    }
    return "light"; // Default to light
  }

  /**
   * Sanitize session ID
   */
  static sanitizeSessionId(sessionId: string): string {
    if (!sessionId || typeof sessionId !== "string") {
      return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Remove any potentially harmful characters
    const sanitized = sessionId.replace(/[^a-zA-Z0-9-_]/g, "");
    return sanitized.length > 0 ? sanitized : `session-${Date.now()}`;
  }

  /**
   * Sanitize user agent
   */
  static sanitizeUserAgent(userAgent: string): string {
    if (!userAgent || typeof userAgent !== "string") {
      return "Unknown";
    }

    // Limit length and remove potentially harmful content
    const sanitized = userAgent.trim().substring(0, 500);
    return sanitized.length > 0 ? sanitized : "Unknown";
  }

  /**
   * Sanitize entire context object
   */
  static sanitizeContext(context: Partial<ToolContext>): ToolContext {
    return {
      currentPage: this.sanitizePage(context.currentPage || "home"),
      currentSection: this.sanitizeSection(context.currentSection),
      theme: this.sanitizeTheme(context.theme || "light"),
      sessionId: this.sanitizeSessionId(context.sessionId || ""),
      userAgent: this.sanitizeUserAgent(context.userAgent || "Unknown"),
    };
  }
}

/**
 * Context validation utilities
 */
export class ContextValidator {
  /**
   * Validate page name
   */
  static isValidPage(page: string): boolean {
    const validPages = ["home", "about", "projects", "resume", "contact"];
    return typeof page === "string" && validPages.includes(page.toLowerCase());
  }

  /**
   * Validate theme
   */
  static isValidTheme(theme: string): theme is "light" | "dark" {
    return theme === "light" || theme === "dark";
  }

  /**
   * Validate session ID format
   */
  static isValidSessionId(sessionId: string): boolean {
    if (!sessionId || typeof sessionId !== "string") {
      return false;
    }

    // Check for basic session ID format
    const sessionIdPattern = /^[a-zA-Z0-9-_]+$/;
    return sessionIdPattern.test(sessionId) && sessionId.length >= 10;
  }

  /**
   * Validate user agent
   */
  static isValidUserAgent(userAgent: string): boolean {
    return typeof userAgent === "string" && userAgent.trim().length > 0;
  }

  /**
   * Validate complete context
   */
  static validateContext(context: ToolContext): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validations
    if (!this.isValidPage(context.currentPage)) {
      errors.push(
        `Invalid currentPage: "${context.currentPage}". Must be one of: home, about, projects, resume, contact`
      );
    }

    if (!this.isValidTheme(context.theme)) {
      errors.push(
        `Invalid theme: "${context.theme}". Must be "light" or "dark"`
      );
    }

    if (!this.isValidSessionId(context.sessionId)) {
      errors.push(
        `Invalid sessionId: "${context.sessionId}". Must be a valid session identifier`
      );
    }

    if (!this.isValidUserAgent(context.userAgent)) {
      errors.push(
        `Invalid userAgent: "${context.userAgent}". Must be a non-empty string`
      );
    }

    // Optional field validations
    if (context.currentSection && typeof context.currentSection !== "string") {
      warnings.push(
        `currentSection should be a string if provided, got: ${typeof context.currentSection}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * Context transformation utilities
 */
export class ContextTransformer {
  /**
   * Transform URL path to page and section
   */
  static pathToPageSection(path: string): { page: string; section?: string } {
    if (!path || typeof path !== "string") {
      return { page: "home" };
    }

    // Remove leading/trailing slashes and query parameters
    const cleanPath = path
      .split("?")[0]
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

    if (!cleanPath || cleanPath === "index") {
      return { page: "home" };
    }

    const segments = cleanPath.split("/");
    const page = ContextSanitizer.sanitizePage(segments[0]);
    const section = segments[1]
      ? ContextSanitizer.sanitizeSection(segments[1])
      : undefined;

    return { page, section };
  }

  /**
   * Transform page and section to URL path
   */
  static pageSectionToPath(page: string, section?: string): string {
    const sanitizedPage = ContextSanitizer.sanitizePage(page);

    if (sanitizedPage === "home") {
      return "/";
    }

    let path = `/${sanitizedPage}`;

    if (section) {
      const sanitizedSection = ContextSanitizer.sanitizeSection(section);
      if (sanitizedSection) {
        path += `#${sanitizedSection}`;
      }
    }

    return path;
  }

  /**
   * Create context from browser environment
   */
  static fromBrowser(overrides: Partial<ToolContext> = {}): ToolContext {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const { page, section } = this.pathToPageSection(path);

    const baseContext: ToolContext = {
      currentPage: page,
      currentSection: section,
      theme: this.detectSystemTheme(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      sessionId: this.generateSessionId(),
    };

    return ContextSanitizer.sanitizeContext({ ...baseContext, ...overrides });
  }

  /**
   * Create context for server-side rendering
   */
  static forServer(
    page: string = "home",
    overrides: Partial<ToolContext> = {}
  ): ToolContext {
    const baseContext: ToolContext = {
      currentPage: page,
      theme: "light",
      userAgent: "Server",
      sessionId: `server-${Date.now()}`,
    };

    return ContextSanitizer.sanitizeContext({ ...baseContext, ...overrides });
  }

  /**
   * Detect system theme preference
   */
  private static detectSystemTheme(): "light" | "dark" {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }

  /**
   * Generate a unique session ID
   */
  private static generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `session-${timestamp}-${random}`;
  }
}

/**
 * Context comparison utilities
 */
export class ContextComparator {
  /**
   * Check if two contexts are equal
   */
  static areEqual(context1: ToolContext, context2: ToolContext): boolean {
    return (
      context1.currentPage === context2.currentPage &&
      context1.currentSection === context2.currentSection &&
      context1.theme === context2.theme &&
      context1.sessionId === context2.sessionId &&
      context1.userAgent === context2.userAgent
    );
  }

  /**
   * Get differences between two contexts
   */
  static getDifferences(
    context1: ToolContext,
    context2: ToolContext
  ): Partial<ToolContext> {
    const differences: Partial<ToolContext> = {};

    if (context1.currentPage !== context2.currentPage) {
      differences.currentPage = context2.currentPage;
    }

    if (context1.currentSection !== context2.currentSection) {
      differences.currentSection = context2.currentSection;
    }

    if (context1.theme !== context2.theme) {
      differences.theme = context2.theme;
    }

    if (context1.sessionId !== context2.sessionId) {
      differences.sessionId = context2.sessionId;
    }

    if (context1.userAgent !== context2.userAgent) {
      differences.userAgent = context2.userAgent;
    }

    return differences;
  }

  /**
   * Check if context has changed significantly (excluding session/user agent)
   */
  static hasSignificantChange(
    context1: ToolContext,
    context2: ToolContext
  ): boolean {
    return (
      context1.currentPage !== context2.currentPage ||
      context1.currentSection !== context2.currentSection ||
      context1.theme !== context2.theme
    );
  }
}
