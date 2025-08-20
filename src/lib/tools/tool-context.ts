/**
 * Tool execution context management
 */

import { ToolContext } from '@/types/tools';

/**
 * Tool context manager for tracking and managing execution state
 */
export class ToolContextManager {
  private context: ToolContext;
  private listeners: Array<(context: ToolContext) => void> = [];

  constructor(initialContext: Partial<ToolContext> = {}) {
    this.context = this.createDefaultContext(initialContext);
  }

  /**
   * Get current context
   */
  getContext(): ToolContext {
    return { ...this.context };
  }

  /**
   * Update context with new values
   */
  updateContext(updates: Partial<ToolContext>): void {
    const previousContext = { ...this.context };
    this.context = { ...this.context, ...updates };
    
    // Validate updated context
    const validation = this.validateContext(this.context);
    if (!validation.valid) {
      // Revert to previous context if validation fails
      this.context = previousContext;
      throw new Error(`Context update failed: ${validation.message}`);
    }

    // Notify listeners of context change
    this.notifyListeners();
  }

  /**
   * Update current page
   */
  setCurrentPage(page: string, section?: string): void {
    this.updateContext({ 
      currentPage: page,
      currentSection: section 
    });
  }

  /**
   * Update theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.updateContext({ theme });
  }

  /**
   * Update session ID
   */
  setSessionId(sessionId: string): void {
    this.updateContext({ sessionId });
  }

  /**
   * Update user agent
   */
  setUserAgent(userAgent: string): void {
    this.updateContext({ userAgent });
  }

  /**
   * Subscribe to context changes
   */
  subscribe(listener: (context: ToolContext) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Clear all listeners
   */
  clearListeners(): void {
    this.listeners = [];
  }

  /**
   * Reset context to defaults
   */
  reset(newContext?: Partial<ToolContext>): void {
    this.context = this.createDefaultContext(newContext);
    this.notifyListeners();
  }

  /**
   * Create a child context with overrides
   */
  createChildContext(overrides: Partial<ToolContext>): ToolContext {
    return { ...this.context, ...overrides };
  }

  /**
   * Validate context data
   */
  private validateContext(context: ToolContext): { valid: boolean; message?: string } {
    if (!context.currentPage || typeof context.currentPage !== 'string') {
      return {
        valid: false,
        message: 'currentPage is required and must be a string'
      };
    }

    if (!context.theme || !['light', 'dark'].includes(context.theme)) {
      return {
        valid: false,
        message: 'theme must be either "light" or "dark"'
      };
    }

    if (!context.sessionId || typeof context.sessionId !== 'string') {
      return {
        valid: false,
        message: 'sessionId is required and must be a string'
      };
    }

    if (!context.userAgent || typeof context.userAgent !== 'string') {
      return {
        valid: false,
        message: 'userAgent is required and must be a string'
      };
    }

    if (context.currentSection && typeof context.currentSection !== 'string') {
      return {
        valid: false,
        message: 'currentSection must be a string if provided'
      };
    }

    return { valid: true };
  }

  /**
   * Create default context
   */
  private createDefaultContext(overrides: Partial<ToolContext> = {}): ToolContext {
    return {
      currentPage: 'home',
      theme: 'light',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      sessionId: this.generateSessionId(),
      currentSection: undefined,
      ...overrides
    };
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Notify all listeners of context changes
   */
  private notifyListeners(): void {
    const currentContext = this.getContext();
    this.listeners.forEach(listener => {
      try {
        listener(currentContext);
      } catch (error) {
        console.error('Error in context listener:', error);
      }
    });
  }
}

/**
 * Context validation utilities
 */
export class ToolContextValidator {
  /**
   * Validate a complete context object
   */
  static validate(context: ToolContext): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!context.currentPage || typeof context.currentPage !== 'string') {
      errors.push('currentPage is required and must be a string');
    }

    if (!context.theme || !['light', 'dark'].includes(context.theme)) {
      errors.push('theme must be either "light" or "dark"');
    }

    if (!context.sessionId || typeof context.sessionId !== 'string') {
      errors.push('sessionId is required and must be a string');
    }

    if (!context.userAgent || typeof context.userAgent !== 'string') {
      errors.push('userAgent is required and must be a string');
    }

    if (context.currentSection && typeof context.currentSection !== 'string') {
      errors.push('currentSection must be a string if provided');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize context data
   */
  static sanitize(context: Partial<ToolContext>): Partial<ToolContext> {
    const sanitized: Partial<ToolContext> = {};

    if (context.currentPage && typeof context.currentPage === 'string') {
      sanitized.currentPage = context.currentPage.trim().toLowerCase();
    }

    if (context.theme && ['light', 'dark'].includes(context.theme)) {
      sanitized.theme = context.theme;
    }

    if (context.sessionId && typeof context.sessionId === 'string') {
      sanitized.sessionId = context.sessionId.trim();
    }

    if (context.userAgent && typeof context.userAgent === 'string') {
      sanitized.userAgent = context.userAgent.trim();
    }

    if (context.currentSection && typeof context.currentSection === 'string') {
      sanitized.currentSection = context.currentSection.trim();
    }

    return sanitized;
  }

  /**
   * Check if a page name is valid
   */
  static isValidPage(page: string): boolean {
    const validPages = ['home', 'about', 'projects', 'resume', 'contact'];
    return validPages.includes(page.toLowerCase());
  }

  /**
   * Check if a theme is valid
   */
  static isValidTheme(theme: string): theme is 'light' | 'dark' {
    return theme === 'light' || theme === 'dark';
  }
}

/**
 * Context utilities for common operations
 */
export class ToolContextUtils {
  /**
   * Extract page information from URL or path
   */
  static extractPageFromPath(path: string): { page: string; section?: string } {
    const cleanPath = path.replace(/^\/+|\/+$/g, '').toLowerCase();
    
    if (!cleanPath || cleanPath === 'index') {
      return { page: 'home' };
    }

    const parts = cleanPath.split('/');
    const page = parts[0];
    const section = parts[1];

    return {
      page: ToolContextValidator.isValidPage(page) ? page : 'home',
      section: section || undefined
    };
  }

  /**
   * Detect theme from system preferences
   */
  static detectSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  /**
   * Generate context from browser environment
   */
  static createBrowserContext(overrides: Partial<ToolContext> = {}): ToolContext {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const { page, section } = this.extractPageFromPath(path);
    
    return {
      currentPage: page,
      currentSection: section,
      theme: this.detectSystemTheme(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...overrides
    };
  }

  /**
   * Create context for server-side rendering
   */
  static createServerContext(
    page: string = 'home',
    overrides: Partial<ToolContext> = {}
  ): ToolContext {
    return {
      currentPage: page,
      theme: 'light',
      userAgent: 'Server',
      sessionId: `server-session-${Date.now()}`,
      ...overrides
    };
  }
}