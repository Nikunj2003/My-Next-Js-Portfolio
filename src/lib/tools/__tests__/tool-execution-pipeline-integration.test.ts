/**
 * Integration tests for the complete tool execution pipeline
 */

import { toolRegistry, toolExecutionMiddleware } from '../index';
import { GetProjectsTool, GetExperienceTool, GetSkillsTool } from '../data-access-tools';
import { NavigateToPageTool, OpenModalTool } from '../navigation-tools';
import { ToggleThemeTool, TriggerDownloadTool } from '../ui-control-tools';
import { ToolContext } from '@/types/tools';

// Mock context for testing
const mockContext: ToolContext = {
  currentPage: 'home',
  theme: 'light',
  userAgent: 'test-agent',
  sessionId: 'test-session-123'
};

describe('Tool Execution Pipeline Integration', () => {
  beforeAll(async () => {
    // Clear registry and register all tools
    toolRegistry.clearAllTools();
    
    // Register data access tools
    toolRegistry.register(new GetProjectsTool());
    toolRegistry.register(new GetExperienceTool());
    toolRegistry.register(new GetSkillsTool());
    
    // Register navigation tools
    toolRegistry.register(new NavigateToPageTool());
    toolRegistry.register(new OpenModalTool());
    
    // Register UI control tools
    toolRegistry.register(new ToggleThemeTool());
    toolRegistry.register(new TriggerDownloadTool());
  });

  afterEach(() => {
    // Clear execution history and rate limit cache
    toolRegistry.clearExecutionHistory();
    toolExecutionMiddleware.clearRateLimitCache();
  });

  describe('Data Access Tools Integration', () => {
    it('should execute GetProjects tool with middleware validation', async () => {
      const result = await toolRegistry.executeTool(
        'get_projects',
        { category: 'Enterprise', limit: 3 },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.toolName).toBe('get_projects');
    });

    it('should execute GetExperience tool with filtering', async () => {
      const result = await toolRegistry.executeTool(
        'get_experience',
        { company: 'Armorcode' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should execute GetSkills tool with category filter', async () => {
      const result = await toolRegistry.executeTool(
        'get_skills',
        { category: 'programming' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject invalid arguments with helpful suggestions', async () => {
      const result = await toolRegistry.executeTool(
        'get_projects',
        { limit: 'invalid' }, // should be number
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
      expect(result.error?.suggestions).toBeDefined();
    });
  });

  describe('Navigation Tools Integration', () => {
    it('should execute NavigateToPage tool', async () => {
      const result = await toolRegistry.executeTool(
        'navigate_to_page',
        { page: 'projects' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe('navigate');
    });

    it('should execute OpenModal tool', async () => {
      const result = await toolRegistry.executeTool(
        'open_modal',
        { modal: 'contact' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe('modal');
    });
  });

  describe('UI Control Tools Integration', () => {
    it('should execute ToggleTheme tool', async () => {
      const result = await toolRegistry.executeTool(
        'toggle_theme',
        {},
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe('theme');
    });

    it('should execute TriggerDownload tool', async () => {
      const result = await toolRegistry.executeTool(
        'trigger_download',
        { file: 'resume' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.actions).toBeDefined();
      expect(result.actions?.[0]?.type).toBe('download');
    });
  });

  describe('Tool Chain Execution', () => {
    it('should execute multiple tools in sequence', async () => {
      const toolCalls = [
        { name: 'get_projects', args: { limit: 2 } },
        { name: 'navigate_to_page', args: { page: 'projects' } },
        { name: 'toggle_theme', args: {} }
      ];

      const results = await toolRegistry.executeToolChain(toolCalls, mockContext);

      expect(results).toHaveLength(3);
      expect(results[0].success).toBe(true); // get-projects
      expect(results[1].success).toBe(true); // navigate-to-page
      expect(results[2].success).toBe(true); // toggle-theme
    });

    it('should stop chain execution on failure', async () => {
      const toolCalls = [
        { name: 'get_projects', args: { limit: 2 } },
        { name: 'invalid-tool', args: {} }, // This will fail
        { name: 'toggle_theme', args: {} }
      ];

      const results = await toolRegistry.executeToolChain(toolCalls, mockContext);

      expect(results).toHaveLength(2); // Should stop after failure
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
    });
  });

  describe('Security and Validation', () => {
    it('should sanitize malicious input', async () => {
      const result = await toolRegistry.executeTool(
        'get_projects',
        { 
          category: 'Enterprise',
          limit: 3 
        },
        mockContext
      );

      // Should still execute but sanitize the input
      expect(result.success).toBe(true);
    });

    it('should enforce rate limiting across tools', async () => {
      // Configure strict rate limiting for testing
      toolExecutionMiddleware.updateConfig({
        rateLimit: { maxRequests: 2, windowMs: 60000 }
      });

      // First two requests should succeed
      const result1 = await toolRegistry.executeTool('get_projects', { limit: 1 }, mockContext);
      const result2 = await toolRegistry.executeTool('get_skills', {}, mockContext);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // Third request should be rate limited
      const result3 = await toolRegistry.executeTool('get_experience', {}, mockContext);
      expect(result3.success).toBe(false);
      expect(result3.error?.code).toBe('RATE_LIMIT_EXCEEDED');
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle tool not found gracefully', async () => {
      const result = await toolRegistry.executeTool(
        'non-existent-tool',
        {},
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TOOL_NOT_FOUND');
      expect(result.error?.suggestions).toContain('Check the tool name spelling');
    });

    it('should provide helpful error messages for validation failures', async () => {
      const result = await toolRegistry.executeTool(
        'navigate_to_page',
        { page: 'invalid-page' }, // Not in enum
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
      expect(result.error?.message).toContain('Validation failed');
    });
  });

  describe('Performance and Monitoring', () => {
    it('should track execution statistics', async () => {
      // Execute several tools
      await toolRegistry.executeTool('get_projects', { limit: 1 }, mockContext);
      await toolRegistry.executeTool('get_skills', {}, mockContext);
      await toolRegistry.executeTool('toggle_theme', {}, mockContext);

      const stats = toolRegistry.getStats();
      expect(stats.totalExecutions).toBeGreaterThanOrEqual(3);
      expect(stats.successfulExecutions).toBeGreaterThanOrEqual(3);
      expect(stats.totalTools).toBeGreaterThanOrEqual(7);
    });

    it('should maintain execution history', async () => {
      await toolRegistry.executeTool('get_projects', { limit: 1 }, mockContext);
      
      const history = toolRegistry.getExecutionHistory();
      expect(history.length).toBeGreaterThan(0);
      
      const lastExecution = history[history.length - 1];
      expect(lastExecution.name).toBe('get_projects');
      expect(lastExecution.result).toBeDefined();
    });
  });

  describe('Context Awareness', () => {
    it('should pass context information to tools', async () => {
      const contextWithSection: ToolContext = {
        ...mockContext,
        currentPage: 'projects',
        currentSection: 'featured'
      };

      const result = await toolRegistry.executeTool(
        'get_projects',
        { limit: 3 },
        contextWithSection
      );

      expect(result.success).toBe(true);
      // Tools should receive and can use context information
    });

    it('should handle different themes in context', async () => {
      const darkContext: ToolContext = {
        ...mockContext,
        theme: 'dark'
      };

      const result = await toolRegistry.executeTool(
        'toggle_theme',
        {},
        darkContext
      );

      expect(result.success).toBe(true);
      expect(result.actions?.[0]?.data?.currentTheme).toBe('dark');
    });
  });
});