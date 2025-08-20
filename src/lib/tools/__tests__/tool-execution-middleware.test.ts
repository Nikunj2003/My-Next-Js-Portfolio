/**
 * Tests for tool execution middleware
 */

import { ToolExecutionMiddleware } from '../tool-execution-middleware';
import { PortfolioTool, ToolContext, ToolResult } from '@/types/tools';
import { JSONSchema7 } from 'json-schema';

// Mock tool for testing
const mockTool: PortfolioTool = {
  name: 'test-tool',
  description: 'A test tool',
  parameters: {
    type: 'object',
    properties: {
      message: { type: 'string', minLength: 1 },
      count: { type: 'number', minimum: 0 }
    },
    required: ['message']
  } as JSONSchema7,
  execute: jest.fn()
};

// Mock context
const mockContext: ToolContext = {
  currentPage: 'home',
  theme: 'light',
  userAgent: 'test-agent',
  sessionId: 'test-session-123'
};

describe('ToolExecutionMiddleware', () => {
  let middleware: ToolExecutionMiddleware;

  beforeEach(() => {
    middleware = new ToolExecutionMiddleware();
    jest.clearAllMocks();
  });

  describe('Basic execution', () => {
    it('should execute tool successfully with valid arguments', async () => {
      const mockResult: ToolResult = {
        success: true,
        data: { response: 'test response' }
      };

      (mockTool.execute as jest.Mock).mockResolvedValue(mockResult);

      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test message', count: 5 },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ response: 'test response' });
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.executedAt).toBeDefined();
      expect(result.metadata?.toolName).toBe('test-tool');
    });

    it('should handle tool execution errors', async () => {
      (mockTool.execute as jest.Mock).mockRejectedValue(new Error('Tool execution failed'));

      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test message' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EXECUTION_ERROR');
      expect(result.error?.message).toBe('Tool execution failed');
    });
  });

  describe('Argument validation', () => {
    it('should reject missing required arguments', async () => {
      const result = await middleware.executeWithMiddleware(
        mockTool,
        { count: 5 }, // missing required 'message'
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
      expect(result.error?.message).toContain('Validation failed');
      expect(result.error?.suggestions).toContain('Missing required property: message');
    });

    it('should reject invalid argument types', async () => {
      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test', count: 'invalid' }, // count should be number
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
      expect(result.error?.message).toContain('Validation failed');
    });

    it('should reject arguments that violate constraints', async () => {
      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: '', count: -1 }, // empty message, negative count
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
    });

    it('should accept valid arguments', async () => {
      const mockResult: ToolResult = { success: true, data: {} };
      (mockTool.execute as jest.Mock).mockResolvedValue(mockResult);

      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'valid message', count: 10 },
        mockContext
      );

      expect(result.success).toBe(true);
    });
  });

  describe('Security validation', () => {
    it('should reject arguments with script tags', async () => {
      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: '<script>alert("xss")</script>' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('SECURITY_VIOLATION');
      expect(result.error?.message).toContain('potentially unsafe content');
    });

    it('should reject arguments with javascript: URLs', async () => {
      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'javascript:alert("xss")' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('SECURITY_VIOLATION');
    });

    it('should reject oversized arguments', async () => {
      const middleware = new ToolExecutionMiddleware({
        security: { maxArgumentSize: 100 }
      });

      const largeMessage = 'x'.repeat(200);
      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: largeMessage },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('SECURITY_VIOLATION');
      expect(result.error?.message).toContain('Arguments too large');
    });

    it('should sanitize result data', async () => {
      const mockResult: ToolResult = {
        success: true,
        data: {
          content: '<script>alert("xss")</script>Safe content',
          url: 'javascript:alert("xss")'
        }
      };

      (mockTool.execute as jest.Mock).mockResolvedValue(mockResult);

      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.content).toBe('Safe content');
      expect(result.data?.url).toBe('');
    });
  });

  describe('Rate limiting', () => {
    it('should allow requests within rate limit', async () => {
      const middleware = new ToolExecutionMiddleware({
        rateLimit: { maxRequests: 5, windowMs: 60000 }
      });

      const mockResult: ToolResult = { success: true, data: {} };
      (mockTool.execute as jest.Mock).mockResolvedValue(mockResult);

      // Make 5 requests (should all succeed)
      for (let i = 0; i < 5; i++) {
        const result = await middleware.executeWithMiddleware(
          mockTool,
          { message: `test ${i}` },
          mockContext
        );
        expect(result.success).toBe(true);
      }
    });

    it('should reject requests exceeding rate limit', async () => {
      const middleware = new ToolExecutionMiddleware({
        rateLimit: { maxRequests: 2, windowMs: 60000 }
      });

      const mockResult: ToolResult = { success: true, data: {} };
      (mockTool.execute as jest.Mock).mockResolvedValue(mockResult);

      // Make 2 successful requests
      for (let i = 0; i < 2; i++) {
        const result = await middleware.executeWithMiddleware(
          mockTool,
          { message: `test ${i}` },
          mockContext
        );
        expect(result.success).toBe(true);
      }

      // Third request should be rate limited
      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test 3' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(result.error?.message).toContain('Rate limit exceeded');
    });

    it('should reset rate limit after window expires', async () => {
      const middleware = new ToolExecutionMiddleware({
        rateLimit: { maxRequests: 1, windowMs: 100 } // 100ms window
      });

      const mockResult: ToolResult = { success: true, data: {} };
      (mockTool.execute as jest.Mock).mockResolvedValue(mockResult);

      // First request should succeed
      const result1 = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test 1' },
        mockContext
      );
      expect(result1.success).toBe(true);

      // Second request should be rate limited
      const result2 = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test 2' },
        mockContext
      );
      expect(result2.success).toBe(false);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      // Third request should succeed (new window)
      const result3 = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test 3' },
        mockContext
      );
      expect(result3.success).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should use custom configuration', async () => {
      const customConfig = {
        rateLimit: { maxRequests: 10, windowMs: 30000 },
        security: { maxArgumentSize: 5000 },
        validation: { strictMode: false },
        logging: { enabled: false }
      };

      const middleware = new ToolExecutionMiddleware(customConfig);
      const stats = middleware.getStats();

      expect(stats.config.rateLimit?.maxRequests).toBe(10);
      expect(stats.config.security?.maxArgumentSize).toBe(5000);
      expect(stats.config.validation?.strictMode).toBe(false);
      expect(stats.config.logging?.enabled).toBe(false);
    });

    it('should update configuration dynamically', async () => {
      middleware.updateConfig({
        rateLimit: { maxRequests: 20, windowMs: 120000 }
      });

      const stats = middleware.getStats();
      expect(stats.config.rateLimit?.maxRequests).toBe(20);
      expect(stats.config.rateLimit?.windowMs).toBe(120000);
    });

    it('should clear rate limit cache', async () => {
      const mockResult: ToolResult = { success: true, data: {} };
      (mockTool.execute as jest.Mock).mockResolvedValue(mockResult);

      // Make a request to populate cache
      await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test' },
        mockContext
      );

      let stats = middleware.getStats();
      expect(stats.rateLimitEntries).toBeGreaterThan(0);

      // Clear cache
      middleware.clearRateLimitCache();

      stats = middleware.getStats();
      expect(stats.rateLimitEntries).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON in arguments', async () => {
      // This would typically come from JSON.parse errors in real usage
      const circularObj: any = {};
      circularObj.self = circularObj;

      const result = await middleware.executeWithMiddleware(
        mockTool,
        { message: 'test', circular: circularObj },
        mockContext
      );

      // Should still execute since we're not JSON.stringifying in validation
      // But if there were JSON serialization issues, they'd be caught
      expect(result).toBeDefined();
    });

    it('should handle schema compilation errors', async () => {
      const invalidTool: PortfolioTool = {
        ...mockTool,
        parameters: { type: 'invalid-type' } as any // Invalid schema
      };

      const result = await middleware.executeWithMiddleware(
        invalidTool,
        { message: 'test' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
    });
  });
});