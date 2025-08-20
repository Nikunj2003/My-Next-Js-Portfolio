/**
 * Base tool implementation with error handling and validation
 */

import { JSONSchema7 } from 'json-schema';
import Ajv from 'ajv';
import { PortfolioTool, ToolContext, ToolResult, ToolError, ToolExecutionConfig, ToolExecutionStats } from '@/types/tools';

/**
 * Abstract base class for all portfolio tools
 */
export abstract class BaseTool implements PortfolioTool {
  public readonly name: string;
  public readonly description: string;
  public readonly parameters: JSONSchema7;
  
  private ajv = new Ajv({ allErrors: true });
  private executionStats: ToolExecutionStats[] = [];

  constructor(name: string, description: string, parameters: JSONSchema7) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
  }

  /**
   * Execute the tool with validation and error handling
   */
  async execute(
    args: Record<string, any>, 
    context: ToolContext, 
    config: ToolExecutionConfig = {}
  ): Promise<ToolResult> {
    const startTime = Date.now();
    const executionId = `${this.name}-${Date.now()}`;

    try {
      // Validate arguments if requested
      if (config.validateArgs !== false) {
        const validationResult = this.validateArguments(args);
        if (!validationResult.valid) {
          return this.createErrorResult('INVALID_ARGUMENTS', validationResult.message || 'Invalid arguments', {
            suggestions: ['Check the tool parameters and try again'],
            fallback: null
          });
        }
      }

      // Validate context
      const contextValidation = this.validateContext(context);
      if (!contextValidation.valid) {
        return this.createErrorResult('INVALID_CONTEXT', contextValidation.message || 'Invalid context');
      }

      // Execute with timeout
      const timeout = config.timeout || 10000; // 10 second default
      const executionPromise = this.executeInternal(args, context);
      
      const result = await Promise.race([
        executionPromise,
        this.createTimeoutPromise(timeout)
      ]);

      // Record successful execution
      this.recordExecution(startTime, true);
      
      return result;

    } catch (error) {
      // Record failed execution
      this.recordExecution(startTime, false, error instanceof Error ? error.message : 'Unknown error');

      // Handle retry logic
      if (config.retry && (config.retryAttempts || 1) > 0) {
        const retryConfig = {
          ...config,
          retryAttempts: (config.retryAttempts || 1) - 1,
          retry: (config.retryAttempts || 1) > 1
        };
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.execute(args, context, retryConfig);
      }

      return this.handleExecutionError(error);
    }
  }

  /**
   * Internal execution method to be implemented by subclasses
   */
  protected abstract executeInternal(args: Record<string, any>, context: ToolContext): Promise<ToolResult>;

  /**
   * Validate tool arguments against the schema
   */
  private validateArguments(args: Record<string, any>): { valid: boolean; message?: string } {
    const validate = this.ajv.compile(this.parameters);
    const valid = validate(args);

    if (!valid) {
      const errors = validate.errors?.map(err => `${err.instancePath} ${err.message}`).join(', ');
      return {
        valid: false,
        message: `Invalid arguments: ${errors}`
      };
    }

    return { valid: true };
  }

  /**
   * Validate tool execution context
   */
  private validateContext(context: ToolContext): { valid: boolean; message?: string } {
    if (!context.currentPage || typeof context.currentPage !== 'string') {
      return {
        valid: false,
        message: 'Invalid context: currentPage is required and must be a string'
      };
    }

    if (!context.theme || !['light', 'dark'].includes(context.theme)) {
      return {
        valid: false,
        message: 'Invalid context: theme must be either "light" or "dark"'
      };
    }

    if (!context.sessionId || typeof context.sessionId !== 'string') {
      return {
        valid: false,
        message: 'Invalid context: sessionId is required and must be a string'
      };
    }

    return { valid: true };
  }

  /**
   * Create a timeout promise that rejects after the specified time
   */
  private createTimeoutPromise(timeout: number): Promise<ToolResult> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Tool execution timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Handle execution errors and convert them to ToolResult
   */
  private handleExecutionError(error: unknown): ToolResult {
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        return this.createErrorResult('EXECUTION_TIMEOUT', error.message, {
          suggestions: ['Try again with a simpler request', 'Check if the system is responsive']
        });
      }

      return this.createErrorResult('EXECUTION_ERROR', error.message, {
        suggestions: ['Check the tool arguments and try again', 'Contact support if the issue persists']
      });
    }

    return this.createErrorResult('UNKNOWN_ERROR', 'An unknown error occurred during tool execution');
  }

  /**
   * Create a standardized error result
   */
  protected createErrorResult(code: string, message: string, additional?: Partial<ToolError>): ToolResult {
    return {
      success: false,
      error: {
        code,
        message,
        suggestions: additional?.suggestions || [],
        fallback: additional?.fallback
      }
    };
  }

  /**
   * Create a successful result
   */
  protected createSuccessResult(data?: any, actions?: any[]): ToolResult {
    return {
      success: true,
      data,
      actions
    };
  }

  /**
   * Record execution statistics
   */
  private recordExecution(startTime: number, success: boolean, errorCode?: string): void {
    const stat: ToolExecutionStats = {
      toolName: this.name,
      executionTime: Date.now() - startTime,
      success,
      timestamp: new Date(),
      errorCode
    };

    this.executionStats.push(stat);

    // Keep only last 100 executions
    if (this.executionStats.length > 100) {
      this.executionStats.shift();
    }
  }

  /**
   * Get execution statistics for this tool
   */
  public getExecutionStats(): ToolExecutionStats[] {
    return [...this.executionStats];
  }

  /**
   * Clear execution statistics
   */
  public clearExecutionStats(): void {
    this.executionStats = [];
  }
}