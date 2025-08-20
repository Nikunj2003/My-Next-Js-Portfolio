/**
 * Unit tests for UI Control Tools
 */

import { ToggleThemeTool, TriggerDownloadTool, ManageUIStateTool } from '../ui-control-tools';
import { ToolContext } from '@/types/tools';

describe('UI Control Tools', () => {
  const mockContext: ToolContext = {
    currentPage: 'home',
    theme: 'light',
    userAgent: 'test-agent',
    sessionId: 'test-session-123'
  };

  describe('ToggleThemeTool', () => {
    let tool: ToggleThemeTool;

    beforeEach(() => {
      tool = new ToggleThemeTool();
    });

    it('should have correct name and description', () => {
      expect(tool.name).toBe('toggle_theme');
      expect(tool.description).toContain('Switch between light and dark themes');
    });

    it('should toggle from light to dark theme', async () => {
      const result = await tool.execute({ theme: 'toggle' }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.newTheme).toBe('dark');
      expect(result.data?.previousTheme).toBe('light');
      expect(result.data?.changed).toBe(true);
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('theme');
      expect(result.actions?.[0].target).toBe('dark');
    });

    it('should toggle from dark to light theme', async () => {
      const darkContext = { ...mockContext, theme: 'dark' as const };
      const result = await tool.execute({ theme: 'toggle' }, darkContext);

      expect(result.success).toBe(true);
      expect(result.data?.newTheme).toBe('light');
      expect(result.data?.previousTheme).toBe('dark');
      expect(result.data?.changed).toBe(true);
    });

    it('should set specific theme (light)', async () => {
      const darkContext = { ...mockContext, theme: 'dark' as const };
      const result = await tool.execute({ theme: 'light' }, darkContext);

      expect(result.success).toBe(true);
      expect(result.data?.newTheme).toBe('light');
      expect(result.data?.previousTheme).toBe('dark');
      expect(result.data?.changed).toBe(true);
    });

    it('should set specific theme (dark)', async () => {
      const result = await tool.execute({ theme: 'dark' }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.newTheme).toBe('dark');
      expect(result.data?.previousTheme).toBe('light');
      expect(result.data?.changed).toBe(true);
    });

    it('should handle when theme is already set to target', async () => {
      const result = await tool.execute({ theme: 'light' }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.changed).toBe(false);
      expect(result.data?.currentTheme).toBe('light');
      expect(result.actions).toBeUndefined();
    });

    it('should handle invalid theme value', async () => {
      const result = await tool.execute({ theme: 'invalid' }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_THEME');
      expect(result.error?.message).toContain('Invalid theme value');
      expect(result.error?.suggestions).toContain('Use "light", "dark", or "toggle" as the theme value');
    });

    it('should default to toggle when no theme specified', async () => {
      const result = await tool.execute({}, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.newTheme).toBe('dark'); // Should toggle from light to dark
    });
  });

  describe('TriggerDownloadTool', () => {
    let tool: TriggerDownloadTool;

    beforeEach(() => {
      tool = new TriggerDownloadTool();
    });

    it('should have correct name and description', () => {
      expect(tool.name).toBe('trigger_download');
      expect(tool.description).toContain('Trigger download of files');
    });

    it('should trigger resume download', async () => {
      const result = await tool.execute({ file: 'resume' }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.file).toBe('resume');
      expect(result.data?.format).toBe('pdf');
      expect(result.data?.fileName).toBe('Nikunj_Resume.pdf');
      expect(result.data?.filePath).toBe('/Nikunj_Resume.pdf');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('download');
      expect(result.actions?.[0].target).toBe('/Nikunj_Resume.pdf');
    });

    it('should handle custom format parameter', async () => {
      const result = await tool.execute({ file: 'resume', format: 'pdf' }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.format).toBe('pdf');
    });

    it('should handle trackDownload parameter', async () => {
      const result = await tool.execute({ 
        file: 'resume', 
        trackDownload: false 
      }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.trackDownload).toBe(false);
      expect(result.actions?.[0].data?.trackDownload).toBe(false);
    });

    it('should default trackDownload to true', async () => {
      const result = await tool.execute({ file: 'resume' }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.trackDownload).toBe(true);
    });

    it('should handle unsupported file type', async () => {
      const result = await tool.execute({ file: 'unknown' }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNSUPPORTED_FILE');
      expect(result.error?.message).toContain('Unsupported file type');
      expect(result.error?.fallback?.availableFiles).toContain('resume');
    });

    it('should handle unsupported format', async () => {
      const result = await tool.execute({ 
        file: 'resume', 
        format: 'docx' 
      }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNSUPPORTED_FORMAT');
      expect(result.error?.message).toContain('Unsupported format');
      expect(result.error?.fallback?.availableFormats).toContain('pdf');
    });

    it('should require file parameter', async () => {
      const result = await tool.execute({}, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
    });
  });

  describe('ManageUIStateTool', () => {
    let tool: ManageUIStateTool;

    beforeEach(() => {
      tool = new ManageUIStateTool();
    });

    it('should have correct name and description', () => {
      expect(tool.name).toBe('manage_ui_state');
      expect(tool.description).toContain('Manage UI state and interface interactions');
    });

    it('should handle scroll action', async () => {
      const result = await tool.execute({
        action: 'scroll',
        target: '#projects-section'
      }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.action).toBe('scroll');
      expect(result.data?.target).toBe('#projects-section');
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe('scroll');
      expect(result.actions?.[0].target).toBe('#projects-section');
    });

    it('should handle focus action', async () => {
      const result = await tool.execute({
        action: 'focus',
        target: '#contact-form'
      }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.action).toBe('focus');
      expect(result.data?.target).toBe('#contact-form');
    });

    it('should handle custom options', async () => {
      const result = await tool.execute({
        action: 'scroll',
        target: '#about-section',
        options: {
          smooth: false,
          duration: 500,
          offset: 100
        }
      }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.options.smooth).toBe(false);
      expect(result.data?.options.duration).toBe(500);
      expect(result.data?.options.offset).toBe(100);
      expect(result.actions?.[0].data?.smooth).toBe(false);
      expect(result.actions?.[0].data?.duration).toBe(500);
      expect(result.actions?.[0].data?.offset).toBe(100);
    });

    it('should use default options when not specified', async () => {
      const result = await tool.execute({
        action: 'highlight',
        target: '.skill-item'
      }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.options.smooth).toBe(true);
      expect(result.data?.options.duration).toBe(300);
      expect(result.data?.options.offset).toBe(0);
    });

    it('should handle invalid action', async () => {
      const result = await tool.execute({
        action: 'invalid',
        target: '#some-element'
      }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ACTION');
      expect(result.error?.message).toContain('Invalid UI action');
      expect(result.error?.fallback?.availableActions).toContain('focus');
    });

    it('should handle missing target', async () => {
      const result = await tool.execute({
        action: 'scroll'
      }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_ARGUMENTS');
    });

    it('should handle empty target', async () => {
      const result = await tool.execute({
        action: 'scroll',
        target: ''
      }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_TARGET');
      expect(result.error?.message).toContain('Target must be a non-empty string');
    });

    it('should include context information in action data', async () => {
      const result = await tool.execute({
        action: 'show',
        target: '.modal'
      }, mockContext);

      expect(result.success).toBe(true);
      expect(result.actions?.[0].data?.context.currentPage).toBe('home');
      expect(result.actions?.[0].data?.context.theme).toBe('light');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid context in ToggleThemeTool', async () => {
      const tool = new ToggleThemeTool();
      const invalidContext = { ...mockContext, theme: 'invalid' as any };

      const result = await tool.execute({ theme: 'toggle' }, invalidContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_CONTEXT');
    });

    it('should handle missing required fields in context', async () => {
      const tool = new TriggerDownloadTool();
      const invalidContext = { ...mockContext, sessionId: '' };

      const result = await tool.execute({ file: 'resume' }, invalidContext);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_CONTEXT');
    });
  });
});