/**
 * Integration tests for navigation tools
 */

import { initializeNavigationTools, toolRegistry } from '../index';
import { NavigateToPageTool, OpenModalTool, NavigateToSectionTool } from '../navigation-tools';

describe('Navigation Tools Integration', () => {
  beforeEach(() => {
    // Clear registry before each test
    toolRegistry.clearExecutionHistory();
    // Clear all tools
    const toolNames = toolRegistry.getToolNames();
    toolNames.forEach(name => toolRegistry.unregister(name));
  });

  describe('Tool Registration', () => {
    it('should register all navigation tools', () => {
      initializeNavigationTools();
      
      const registeredTools = toolRegistry.getAll();
      const toolNames = toolRegistry.getToolNames();
      
      expect(registeredTools).toHaveLength(3);
      expect(toolNames).toContain('navigate_to_page');
      expect(toolNames).toContain('open_modal');
      expect(toolNames).toContain('navigate_to_section');
    });

    it('should provide correct tool schemas', () => {
      initializeNavigationTools();
      
      const schemas = toolRegistry.getSchemas();
      
      expect(schemas).toHaveProperty('navigate_to_page');
      expect(schemas).toHaveProperty('open_modal');
      expect(schemas).toHaveProperty('navigate_to_section');
    });

    it('should provide OpenAI function definitions', () => {
      initializeNavigationTools();
      
      const functions = toolRegistry.getFunctionDefinitions();
      
      expect(functions).toHaveLength(3);
      expect(functions.map(f => f.name)).toContain('navigate_to_page');
      expect(functions.map(f => f.name)).toContain('open_modal');
      expect(functions.map(f => f.name)).toContain('navigate_to_section');
    });
  });

  describe('Tool Execution', () => {
    beforeEach(() => {
      initializeNavigationTools();
    });

    it('should execute NavigateToPage tool through registry', async () => {
      const mockContext = {
        currentPage: '/',
        theme: 'light' as const,
        userAgent: 'test-agent',
        sessionId: 'test-session'
      };

      const result = await toolRegistry.executeTool(
        'navigate_to_page',
        { page: 'about' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.page).toBe('about');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('navigate');
    });

    it('should execute OpenModal tool through registry', async () => {
      const mockContext = {
        currentPage: '/',
        theme: 'light' as const,
        userAgent: 'test-agent',
        sessionId: 'test-session'
      };

      const result = await toolRegistry.executeTool(
        'open_modal',
        { modal: 'contact' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.modal).toBe('contact');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('modal');
    });

    it('should execute NavigateToSection tool through registry', async () => {
      const mockContext = {
        currentPage: '/about',
        theme: 'light' as const,
        userAgent: 'test-agent',
        sessionId: 'test-session'
      };

      const result = await toolRegistry.executeTool(
        'navigate_to_section',
        { section: 'experience' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.section).toBe('experience');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('scroll');
    });
  });

  describe('Tool Chain Execution', () => {
    beforeEach(() => {
      initializeNavigationTools();
    });

    it('should execute multiple navigation tools in sequence', async () => {
      const mockContext = {
        currentPage: '/about', // Start on about page so section navigation works
        theme: 'light' as const,
        userAgent: 'test-agent',
        sessionId: 'test-session'
      };

      const toolCalls = [
        { name: 'open_modal', args: { modal: 'contact' } },
        { name: 'navigate_to_section', args: { section: 'experience' } }
      ];

      const results = await toolRegistry.executeToolChain(toolCalls, mockContext);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[0].data?.modal).toBe('contact');
      expect(results[1].data?.section).toBe('experience');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      initializeNavigationTools();
    });

    it('should handle invalid tool names gracefully', async () => {
      const mockContext = {
        currentPage: '/',
        theme: 'light' as const,
        userAgent: 'test-agent',
        sessionId: 'test-session'
      };

      const result = await toolRegistry.executeTool(
        'invalid_tool',
        {},
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TOOL_NOT_FOUND');
    });

    it('should track execution history', async () => {
      const mockContext = {
        currentPage: '/',
        theme: 'light' as const,
        userAgent: 'test-agent',
        sessionId: 'test-session'
      };

      await toolRegistry.executeTool('navigate_to_page', { page: 'about' }, mockContext);
      await toolRegistry.executeTool('open_modal', { modal: 'contact' }, mockContext);

      const history = toolRegistry.getExecutionHistory();
      expect(history).toHaveLength(2);
      expect(history[0].name).toBe('navigate_to_page');
      expect(history[1].name).toBe('open_modal');
    });
  });
});