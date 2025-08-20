/**
 * Tool execution middleware for validation, rate limiting, and security
 */

import {
  ToolContext,
  ToolResult,
  ToolExecutionConfig,
  PortfolioTool,
} from "@/types/tools";
import { JSONSchema7 } from "json-schema";
import Ajv from "ajv";

// Rate limiting storage (in-memory for now, could be Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting configuration
 */
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (context: ToolContext) => string;
}

/**
 * Security validation configuration
 */
interface SecurityConfig {
  allowedOrigins?: string[];
  maxArgumentSize?: number;
  blockedPatterns?: RegExp[];
  requireAuth?: boolean;
}

/**
 * Tool execution middleware configuration
 */
export interface ToolExecutionMiddlewareConfig {
  rateLimit?: RateLimitConfig;
  security?: SecurityConfig;
  validation?: {
    strictMode?: boolean;
    allowAdditionalProperties?: boolean;
  };
  logging?: {
    enabled?: boolean;
    logLevel?: "debug" | "info" | "warn" | "error";
    logSuccessfulExecutions?: boolean;
    logFailedExecutions?: boolean;
  };
}

/**
 * Default middleware configuration
 */
const DEFAULT_CONFIG: ToolExecutionMiddlewareConfig = {
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    keyGenerator: (context) => `${context.sessionId}-${context.userAgent}`,
  },
  security: {
    maxArgumentSize: 10000, // 10KB
    blockedPatterns: [
      /script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /onload/i,
      /onerror/i,
    ],
    requireAuth: false,
  },
  validation: {
    strictMode: true,
    allowAdditionalProperties: false,
  },
  logging: {
    enabled: true,
    logLevel: "info",
    logSuccessfulExecutions: true,
    logFailedExecutions: true,
  },
};

/**
 * Tool execution middleware class
 */
export class ToolExecutionMiddleware {
  private config: ToolExecutionMiddlewareConfig;
  private ajv: Ajv;

  constructor(config: Partial<ToolExecutionMiddlewareConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ajv = new Ajv({
      strict: this.config.validation?.strictMode ?? true,
    });
  }

  /**
   * Execute tool with middleware checks
   */
  async executeWithMiddleware(
    tool: PortfolioTool,
    args: Record<string, unknown>,
    context: ToolContext,
    config?: ToolExecutionConfig
  ): Promise<ToolResult> {
    const startTime = Date.now();

    try {
      // 1. Rate limiting check
      const rateLimitResult = await this.checkRateLimit(context);
      if (!rateLimitResult.allowed) {
        return this.createErrorResult(
          "RATE_LIMIT_EXCEEDED",
          rateLimitResult.message || "Rate limit exceeded"
        );
      }

      // 2. Security validation
      const securityResult = await this.validateSecurity(args, context);
      if (!securityResult.valid) {
        return this.createErrorResult(
          "SECURITY_VIOLATION",
          securityResult.message || "Security violation"
        );
      }

      // 3. Argument validation
      const validationResult = await this.validateArguments(tool, args);
      if (!validationResult.valid) {
        return this.createErrorResult(
          "INVALID_ARGUMENTS",
          validationResult.message || "Invalid arguments",
          validationResult.suggestions
        );
      }

      // 4. Execute the tool
      this.log("info", `Executing tool: ${tool.name}`, {
        args,
        context: this.sanitizeContext(context),
      });

      const result = await tool.execute(args, context);

      // 5. Post-execution processing
      const processedResult = await this.processResult(result, tool.name);

      const executionTime = Date.now() - startTime;

      if (
        processedResult.success &&
        this.config.logging?.logSuccessfulExecutions
      ) {
        this.log("info", `Tool ${tool.name} executed successfully`, {
          executionTime,
          resultSize: JSON.stringify(processedResult.data).length,
        });
      }

      return processedResult;
    } catch (error) {
      const executionTime = Date.now() - startTime;

      if (this.config.logging?.logFailedExecutions) {
        this.log("error", `Tool ${tool.name} execution failed`, {
          error: error instanceof Error ? error.message : "Unknown error",
          executionTime,
        });
      }

      return this.createErrorResult(
        "EXECUTION_ERROR",
        error instanceof Error ? error.message : "Unknown execution error"
      );
    }
  }

  /**
   * Check rate limiting
   */
  private async checkRateLimit(
    context: ToolContext
  ): Promise<{ allowed: boolean; message?: string }> {
    if (!this.config.rateLimit) {
      return { allowed: true };
    }

    const key =
      this.config.rateLimit.keyGenerator?.(context) || context.sessionId;
    const now = Date.now();
    const windowMs = this.config.rateLimit.windowMs;
    const maxRequests = this.config.rateLimit.maxRequests;

    const current = rateLimitStore.get(key);

    if (!current || now > current.resetTime) {
      // Reset or initialize
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true };
    }

    if (current.count >= maxRequests) {
      const resetIn = Math.ceil((current.resetTime - now) / 1000);
      return {
        allowed: false,
        message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
      };
    }

    // Increment count
    current.count++;
    rateLimitStore.set(key, current);

    return { allowed: true };
  }

  /**
   * Validate security constraints
   */
  private async validateSecurity(
    args: Record<string, unknown>,
    _context: ToolContext
  ): Promise<{ valid: boolean; message?: string }> {
    if (!this.config.security) {
      return { valid: true };
    }

    // Check argument size
    const argsSize = JSON.stringify(args).length;
    if (
      this.config.security.maxArgumentSize &&
      argsSize > this.config.security.maxArgumentSize
    ) {
      return {
        valid: false,
        message: `Arguments too large: ${argsSize} bytes (max: ${this.config.security.maxArgumentSize})`,
      };
    }

    // Check for blocked patterns
    const argsString = JSON.stringify(args).toLowerCase();
    if (this.config.security.blockedPatterns) {
      for (const pattern of this.config.security.blockedPatterns) {
        if (pattern.test(argsString)) {
          return {
            valid: false,
            message: "Arguments contain potentially unsafe content",
          };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Validate tool arguments against schema
   */
  private async validateArguments(
    tool: PortfolioTool,
    args: Record<string, unknown>
  ): Promise<{ valid: boolean; message?: string; suggestions?: string[] }> {
    try {
      const validate = this.ajv.compile(tool.parameters);
      const valid = validate(args);

      if (!valid) {
        const errors = validate.errors || [];
        const errorMessages = errors.map(
          (err) => `${err.instancePath || "root"}: ${err.message}`
        );

        const suggestions = this.generateValidationSuggestions(
          tool.parameters,
          errors
        );

        return {
          valid: false,
          message: `Validation failed: ${errorMessages.join(", ")}`,
          suggestions,
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        message: `Schema validation error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Process and format tool result
   */
  private async processResult(
    result: ToolResult,
    toolName: string
  ): Promise<ToolResult> {
    // Sanitize result data to prevent XSS
    if (result.success && result.data) {
      result.data = this.sanitizeData(result.data);
    }

    // Add metadata
    if (result.success) {
      result.metadata = {
        ...result.metadata,
        executedAt: new Date().toISOString(),
        toolName,
        processedBy: "ToolExecutionMiddleware",
      };
    }

    return result;
  }

  /**
   * Generate validation suggestions based on schema and errors
   */
  private generateValidationSuggestions(
    schema: JSONSchema7,
    errors: unknown[]
  ): string[] {
    const suggestions: string[] = [];

    for (const error of errors) {
      const err = error as {
        keyword?: string;
        params?: {
          missingProperty?: string;
          type?: string;
          allowedValues?: string[];
          limit?: number;
        };
        data?: unknown;
        instancePath?: string;
      };

      switch (err.keyword) {
        case "required":
          suggestions.push(
            `Missing required property: ${err.params?.missingProperty}`
          );
          break;
        case "type":
          suggestions.push(
            `Expected ${err.params?.type} but got ${typeof err.data}`
          );
          break;
        case "enum":
          suggestions.push(
            `Value must be one of: ${err.params?.allowedValues?.join(", ")}`
          );
          break;
        case "minLength":
          suggestions.push(
            `Value must be at least ${err.params?.limit} characters long`
          );
          break;
        case "maxLength":
          suggestions.push(
            `Value must be no more than ${err.params?.limit} characters long`
          );
          break;
        default:
          suggestions.push(
            `Check the value format for ${err.instancePath || "the parameter"}`
          );
      }
    }

    return suggestions;
  }

  /**
   * Sanitize data to prevent XSS and other security issues
   */
  private sanitizeData(data: unknown): unknown {
    if (typeof data === "string") {
      return data
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .replace(/alert\([^)]*\)/gi, "");
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    if (data && typeof data === "object") {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Sanitize context for logging
   */
  private sanitizeContext(context: ToolContext): Partial<ToolContext> {
    return {
      currentPage: context.currentPage,
      theme: context.theme,
      sessionId: context.sessionId.substring(0, 8) + "...", // Truncate for privacy
    };
  }

  /**
   * Create standardized error result
   */
  private createErrorResult(
    code: string,
    message: string,
    suggestions?: string[]
  ): ToolResult {
    return {
      success: false,
      error: {
        code,
        message,
        suggestions: suggestions || ["Please check your input and try again"],
      },
    };
  }

  /**
   * Logging utility
   */
  private log(level: string, message: string, data?: unknown): void {
    if (!this.config.logging?.enabled) return;

    const logLevel = this.config.logging.logLevel || "info";
    const levels = ["debug", "info", "warn", "error"];

    if (levels.indexOf(level) >= levels.indexOf(logLevel)) {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        component: "ToolExecutionMiddleware",
        ...(data && typeof data === "object" ? data : { data }),
      };

      console.log(JSON.stringify(logEntry));
    }
  }

  /**
   * Get middleware statistics
   */
  getStats(): {
    rateLimitEntries: number;
    config: ToolExecutionMiddlewareConfig;
  } {
    return {
      rateLimitEntries: rateLimitStore.size,
      config: this.config,
    };
  }

  /**
   * Clear rate limit cache
   */
  clearRateLimitCache(): void {
    rateLimitStore.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ToolExecutionMiddlewareConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Global middleware instance
 */
export const toolExecutionMiddleware = new ToolExecutionMiddleware();
