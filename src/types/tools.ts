/**
 * Core tool system types for the AI Portfolio Navigator
 */

import { JSONSchema7 } from 'json-schema';

/**
 * Context information available to tools during execution
 */
export interface ToolContext {
  /** Current page the user is on */
  currentPage: string;
  /** Current theme (light/dark) */
  theme: 'light' | 'dark';
  /** User agent string */
  userAgent: string;
  /** Session identifier */
  sessionId: string;
  /** Current section within the page (if applicable) */
  currentSection?: string;
}

/**
 * Result of a tool execution
 */
export interface ToolResult {
  /** Whether the tool execution was successful */
  success: boolean;
  /** Data returned by the tool */
  data?: unknown;
  /** Error information if execution failed */
  error?: ToolError;
  /** Actions to be performed as a result of tool execution */
  actions?: ToolAction[];
  /** Metadata about the execution */
  metadata?: Record<string, unknown>;
}

/**
 * Error information for failed tool executions
 */
export interface ToolError {
  /** Error code for categorization */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Suggestions for resolving the error */
  suggestions?: string[];
  /** Fallback data if available */
  fallback?: unknown;
}

/**
 * Actions that can be performed as a result of tool execution
 */
export interface ToolAction {
  /** Type of action to perform */
  type: 'navigate' | 'modal' | 'theme' | 'download' | 'scroll';
  /** Target for the action */
  target: string;
  /** Additional data for the action */
  data?: Record<string, unknown>;
}

/**
 * Represents a call to a specific tool with arguments
 */
export interface ToolCall {
  /** Unique identifier for this tool call */
  id: string;
  /** Name of the tool to execute */
  name: string;
  /** Arguments to pass to the tool */
  arguments: Record<string, unknown>;
  /** Result of the tool execution (populated after execution) */
  result?: ToolResult;
}

/**
 * Base interface for all portfolio tools
 */
export interface PortfolioTool {
  /** Unique name identifier for the tool */
  name: string;
  /** Human-readable description of what the tool does */
  description: string;
  /** JSON Schema defining the tool's parameters */
  parameters: JSONSchema7;
  /** Execute the tool with given arguments and context */
  execute: (args: Record<string, unknown>, context: ToolContext, config?: ToolExecutionConfig) => Promise<ToolResult>;
}

/**
 * Configuration for tool execution
 */
export interface ToolExecutionConfig {
  /** Maximum execution time in milliseconds */
  timeout?: number;
  /** Whether to retry on failure */
  retry?: boolean;
  /** Number of retry attempts */
  retryAttempts?: number;
  /** Whether to validate arguments against schema */
  validateArgs?: boolean;
}

/**
 * Tool execution statistics
 */
export interface ToolExecutionStats {
  /** Tool name */
  toolName: string;
  /** Execution time in milliseconds */
  executionTime: number;
  /** Whether execution was successful */
  success: boolean;
  /** Timestamp of execution */
  timestamp: Date;
  /** Error code if failed */
  errorCode?: string;
}