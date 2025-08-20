/**
 * Tool registry for managing and executing portfolio tools
 */

import { PortfolioTool, ToolCall, ToolContext, ToolResult, ToolExecutionConfig } from '@/types/tools';
import { JSONSchema7 } from 'json-schema';
import { toolExecutionMiddleware } from './tool-execution-middleware';

/**
 * Registry for managing all available portfolio tools
 */
export class ToolRegistry {
  private tools: Map<string, PortfolioTool> = new Map();
  private executionHistory: ToolCall[] = [];

  /**
   * Register a new tool in the registry
   */
  register(tool: PortfolioTool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool with name "${tool.name}" is already registered`);
    }

    // Validate tool structure
    this.validateTool(tool);
    
    this.tools.set(tool.name, tool);
  }

  /**
   * Unregister a tool from the registry
   */
  unregister(toolName: string): boolean {
    return this.tools.delete(toolName);
  }

  /**
   * Get a specific tool by name
   */
  get(name: string): PortfolioTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all registered tools
   */
  getAll(): PortfolioTool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get all tool names
   */
  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Get tools filtered by category or pattern
   */
  getToolsByCategory(category: string): PortfolioTool[] {
    return this.getAll().filter(tool => 
      tool.name.toLowerCase().includes(category.toLowerCase()) ||
      tool.description.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Check if a tool exists
   */
  has(toolName: string): boolean {
    return this.tools.has(toolName);
  }

  /**
   * Get tool schemas for OpenAI function calling
   */
  getSchemas(): Record<string, JSONSchema7> {
    const schemas: Record<string, JSONSchema7> = {};
    
    this.tools.forEach((tool, name) => {
      schemas[name] = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            const: name
          },
          description: {
            type: 'string',
            const: tool.description
          },
          parameters: tool.parameters
        },
        required: ['name', 'parameters']
      };
    });

    return schemas;
  }

  /**
   * Get OpenAI function definitions
   */
  getFunctionDefinitions(): Array<{
    name: string;
    description: string;
    parameters: JSONSchema7;
  }> {
    return this.getAll().map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }));
  }

  /**
   * Execute a tool by name
   */
  async executeTool(
    toolName: string,
    args: Record<string, unknown>,
    context: ToolContext,
    config?: ToolExecutionConfig
  ): Promise<ToolResult> {
    const tool = this.get(toolName);
    
    if (!tool) {
      return {
        success: false,
        error: {
          code: 'TOOL_NOT_FOUND',
          message: `Tool "${toolName}" is not registered`,
          suggestions: [
            'Check the tool name spelling',
            `Available tools: ${this.getToolNames().join(', ')}`
          ]
        }
      };
    }

    try {
      // Use middleware for execution
      const result = await toolExecutionMiddleware.executeWithMiddleware(tool, args, context, config);
      
      // Record execution in history
      const toolCall: ToolCall = {
        id: `${toolName}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: toolName,
        arguments: args,
        result
      };
      
      this.addToHistory(toolCall);
      
      return result;
    } catch (error) {
      const errorResult: ToolResult = {
        success: false,
        error: {
          code: 'EXECUTION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown execution error',
          suggestions: ['Check tool arguments and try again']
        }
      };

      // Record failed execution
      const toolCall: ToolCall = {
        id: `${toolName}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: toolName,
        arguments: args,
        result: errorResult
      };
      
      this.addToHistory(toolCall);
      
      return errorResult;
    }
  }

  /**
   * Execute multiple tools in sequence
   */
  async executeToolChain(
    toolCalls: Array<{ name: string; args: Record<string, unknown> }>,
    context: ToolContext,
    _config?: ToolExecutionConfig
  ): Promise<ToolResult[]> {
    const results: ToolResult[] = [];
    
    for (const { name, args } of toolCalls) {
      const result = await this.executeTool(name, args, context, _config);
      results.push(result);
      
      // Stop execution chain if a tool fails and no error handling is specified
      if (!result.success && !_config?.retry) {
        break;
      }
    }
    
    return results;
  }

  /**
   * Get execution history
   */
  getExecutionHistory(): ToolCall[] {
    return [...this.executionHistory];
  }

  /**
   * Clear execution history
   */
  clearExecutionHistory(): void {
    this.executionHistory = [];
  }

  /**
   * Clear all registered tools
   */
  clearAllTools(): void {
    this.tools.clear();
  }

  /**
   * Get recent executions for a specific tool
   */
  getToolExecutionHistory(toolName: string, limit: number = 10): ToolCall[] {
    return this.executionHistory
      .filter(call => call.name === toolName)
      .slice(-limit);
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalTools: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    toolNames: string[];
  } {
    const successful = this.executionHistory.filter(call => call.result?.success).length;
    const failed = this.executionHistory.length - successful;

    return {
      totalTools: this.tools.size,
      totalExecutions: this.executionHistory.length,
      successfulExecutions: successful,
      failedExecutions: failed,
      toolNames: this.getToolNames()
    };
  }

  /**
   * Validate tool structure
   */
  private validateTool(tool: PortfolioTool): void {
    if (!tool.name || typeof tool.name !== 'string') {
      throw new Error('Tool must have a valid name');
    }

    if (!tool.description || typeof tool.description !== 'string') {
      throw new Error('Tool must have a valid description');
    }

    if (!tool.parameters || typeof tool.parameters !== 'object') {
      throw new Error('Tool must have valid parameters schema');
    }

    if (typeof tool.execute !== 'function') {
      throw new Error('Tool must have an execute function');
    }
  }

  /**
   * Add tool call to execution history
   */
  private addToHistory(toolCall: ToolCall): void {
    this.executionHistory.push(toolCall);
    
    // Keep only last 1000 executions
    if (this.executionHistory.length > 1000) {
      this.executionHistory.shift();
    }
  }
}

/**
 * Global tool registry instance
 */
export const toolRegistry = new ToolRegistry();