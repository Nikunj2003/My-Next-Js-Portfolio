/**
 * Integration tests for UI Control Tools
 */

import { toolRegistry } from '../tool-registry';
import { initializeUIControlTools } from '../initialize-tools';
import { ToggleThemeTool, TriggerDownloadTool, ManageUIStateTool } from '../ui-control-tools';
import { ToolContext } from '@/types/tools';

describe('UI Control Tools Integration', () => {
  const mockContext: ToolContext = {
    currentPage: 'home',
    theme: 'light',
    userAgent: 'test-agent',
    sessionId: 'test-session-123'
  };

  beforeEach(() => {
    // Clear registry and initialize UI control tools
    toolRegistry.clearExecutionHistory();
    toolRegistry.clearAllTools();
    initializeUIControlTools();
  });

  describe('Tool Registration', () => {
    it('should register all UI control tools', () => {
      const tools = toolRegistry.getAll();
      const uiControlToolNames = ['toggle_theme', 'trigger_download', 'manage_ui_state'];
      
      uiControlToolNames.forEach(toolName => {
        const tool = tools.find(t => t.name === toolName);
        expect(tool).toBeDefined();
      });
    });

    it('should provide correct tool schemas', () => {
      const schemas = toolRegistry.getSchemas();
      
      expect(schemas.toggle_theme).toBeDefined();
      expect(schemas.toggle_theme.properties?.parameters).toBeDefined();
      
      expect(schemas.trigger_download).toBeDefined();
      expect(schemas.trigger_download.properties?.parameters).toBeDefined();
      
      expect(schemas.manage_ui_state).toBeDefined();
      expect(schemas.manage_ui_state.properties?.parameters).toBeDefined();
    });

    it('should provide OpenAI function definitions', () => {
      const functions = toolRegistry.getFunctionDefinitions();
      
      const themeFunction = functions.find(f => f.name === 'toggle_theme');
      expect(themeFunction).toBeDefined();
      expect(themeFunction?.description).toContain('Switch between light and dark themes');
      
      const downloadFunction = functions.find(f => f.name === 'trigger_download');
      expect(downloadFunction).toBeDefined();
      expect(downloadFunction?.description).toContain('Trigger download of files');
      
      const uiStateFunction = functions.find(f => f.name === 'manage_ui_state');
      expect(uiStateFunction).toBeDefined();
      expect(uiStateFunction?.description).toContain('Manage UI state');
    });
  });

  describe('Tool Execution', () => {
    it('should execute ToggleTheme tool through registry', async () => {
      const result = await toolRegistry.executeTool(
        'toggle_theme',
        { theme: 'dark' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.newTheme).toBe('dark');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('theme');
    });

    it('should execute TriggerDownload tool through registry', async () => {
      const result = await toolRegistry.executeTool(
        'trigger_download',
        { file: 'resume' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.fileName).toBe('Nikunj_Resume.pdf');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('download');
    });

    it('should execute ManageUIState tool through registry', async () => {
      const result = await toolRegistry.executeTool(
        'manage_ui_state',
        { action: 'scroll', target: '#projects' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.action).toBe('scroll');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('scroll');
    });
  });

  describe('Tool Chain Execution', () => {
    it('should execute multiple UI control tools in sequence', async () => {
      // First, toggle theme
      const themeResult = await toolRegistry.executeTool(
        'toggle_theme',
        { theme: 'dark' },
        mockContext
      );

      expect(themeResult.success).toBe(true);

      // Then trigger download
      const downloadResult = await toolRegistry.executeTool(
        'trigger_download',
        { file: 'resume', trackDownload: true },
        mockContext
      );

      expect(downloadResult.success).toBe(true);

      // Finally, manage UI state
      const uiResult = await toolRegistry.executeTool(
        'manage_ui_state',
        { action: 'highlight', target: '.download-button' },
        mockContext
      );

      expect(uiResult.success).toBe(true);

      // Check execution history
      const history = toolRegistry.getExecutionHistory();
      expect(history).toHaveLength(3);
      expect(history.map(h => h.name)).toEqual([
        'toggle_theme',
        'trigger_download',
        'manage_ui_state'
      ]);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid tool names gracefully', async () => {
      const result = await toolRegistry.executeTool(
        'invalid_ui_tool',
        {},
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TOOL_NOT_FOUND');
    });

    it('should track execution history including failures', async () => {
      // Execute a successful tool
      const result1 = await toolRegistry.executeTool('toggle_theme', { theme: 'dark' }, mockContext);
      expect(result1.success).toBe(true);

      // Execute an invalid tool (this should return an error but not be added to history since tool doesn't exist)
      const result2 = await toolRegistry.executeTool('invalid_tool', {}, mockContext);
      expect(result2.success).toBe(false);

      // Execute another successful tool
      const result3 = await toolRegistry.executeTool('trigger_download', { file: 'resume' }, mockContext);
      expect(result3.success).toBe(true);

      const history = toolRegistry.getExecutionHistory();
      // Only successful tool executions and tools that exist but fail should be in history
      // Invalid tool names don't get added to history
      expect(history).toHaveLength(2);
      expect(history[0].result?.success).toBe(true);
      expect(history[1].result?.success).toBe(true);
    });
  });

  describe('Tool Interaction with Context', () => {
    it('should handle theme context changes', async () => {
      // Start with light theme
      const lightContext = { ...mockContext, theme: 'light' as const };
      
      const result1 = await toolRegistry.executeTool(
        'toggle_theme',
        { theme: 'toggle' },
        lightContext
      );

      expect(result1.success).toBe(true);
      expect(result1.data?.newTheme).toBe('dark');

      // Simulate context update to dark theme
      const darkContext = { ...mockContext, theme: 'dark' as const };
      
      const result2 = await toolRegistry.executeTool(
        'toggle_theme',
        { theme: 'toggle' },
        darkContext
      );

      expect(result2.success).toBe(true);
      expect(result2.data?.newTheme).toBe('light');
    });

    it('should include context information in UI state actions', async () => {
      const result = await toolRegistry.executeTool(
        'manage_ui_state',
        { action: 'focus', target: '#contact-form' },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.actions?.[0].data?.context.currentPage).toBe('home');
      expect(result.actions?.[0].data?.context.theme).toBe('light');
    });
  });

  describe('Tool Validation', () => {
    it('should validate theme tool arguments', async () => {
      const result = await toolRegistry.executeTool(
        'toggle_theme',
        { theme: 'invalid-theme' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_THEME');
    });

    it('should validate download tool arguments', async () => {
      const result = await toolRegistry.executeTool(
        'trigger_download',
        { file: 'invalid-file' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNSUPPORTED_FILE');
    });

    it('should validate UI state tool arguments', async () => {
      const result = await toolRegistry.executeTool(
        'manage_ui_state',
        { action: 'invalid-action', target: '#element' },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ACTION');
    });
  });

  describe('Performance and Statistics', () => {
    it('should track execution statistics for UI control tools', async () => {
      const toggleTool = toolRegistry.get('toggle_theme') as ToggleThemeTool;
      const downloadTool = toolRegistry.get('trigger_download') as TriggerDownloadTool;
      const uiStateTool = toolRegistry.get('manage_ui_state') as ManageUIStateTool;

      // Execute tools multiple times
      await toggleTool.execute({ theme: 'dark' }, mockContext);
      await downloadTool.execute({ file: 'resume' }, mockContext);
      await uiStateTool.execute({ action: 'scroll', target: '#top' }, mockContext);

      // Check statistics
      const toggleStats = toggleTool.getExecutionStats();
      const downloadStats = downloadTool.getExecutionStats();
      const uiStateStats = uiStateTool.getExecutionStats();

      expect(toggleStats).toHaveLength(1);
      expect(downloadStats).toHaveLength(1);
      expect(uiStateStats).toHaveLength(1);

      expect(toggleStats[0].success).toBe(true);
      expect(downloadStats[0].success).toBe(true);
      expect(uiStateStats[0].success).toBe(true);
    });
  });
});