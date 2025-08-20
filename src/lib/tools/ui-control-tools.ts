/**
 * UI Control Tools for the AI Portfolio Navigator
 * These tools handle interface interactions like theme switching and downloads
 */

import { JSONSchema7 } from 'json-schema';
import { BaseTool } from './base-tool';
import { ToolContext, ToolResult, ToolAction } from '@/types/tools';

/**
 * Tool to toggle between light and dark themes
 */
export class ToggleThemeTool extends BaseTool {
  constructor() {
    super(
      'toggle_theme',
      'Switch between light and dark themes or set a specific theme',
      {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            description: 'Theme to set: "light", "dark", or "toggle" to switch to opposite'
          }
        },
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: Record<string, any>, 
    context: ToolContext
  ): Promise<ToolResult> {
    const { theme = 'toggle' } = args;

    try {
      let targetTheme: 'light' | 'dark';

      // Determine target theme
      if (theme === 'toggle') {
        targetTheme = context.theme === 'light' ? 'dark' : 'light';
      } else if (theme === 'light' || theme === 'dark') {
        targetTheme = theme;
      } else {
        return this.createErrorResult(
          'INVALID_THEME',
          `Invalid theme value: ${theme}. Must be "light", "dark", or "toggle"`,
          {
            suggestions: ['Use "light", "dark", or "toggle" as the theme value'],
            fallback: { currentTheme: context.theme }
          }
        );
      }

      // Check if theme is already set to target
      if (context.theme === targetTheme) {
        return this.createSuccessResult(
          {
            message: `Theme is already set to ${targetTheme}`,
            currentTheme: targetTheme,
            changed: false
          }
        );
      }

      // Create theme change action
      const themeAction: ToolAction = {
        type: 'theme',
        target: targetTheme,
        data: {
          previousTheme: context.theme,
          newTheme: targetTheme
        }
      };

      return this.createSuccessResult(
        {
          message: `Theme switched from ${context.theme} to ${targetTheme}`,
          previousTheme: context.theme,
          newTheme: targetTheme,
          changed: true
        },
        [themeAction]
      );

    } catch (error) {
      return this.createErrorResult(
        'THEME_SWITCH_ERROR',
        `Failed to switch theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          suggestions: [
            'Try again with a valid theme value',
            'Check if the theme system is properly initialized'
          ],
          fallback: { currentTheme: context.theme }
        }
      );
    }
  }
}

/**
 * Tool to trigger file downloads (primarily for resume)
 */
export class TriggerDownloadTool extends BaseTool {
  constructor() {
    super(
      'trigger_download',
      'Trigger download of files like resume PDF',
      {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'File to download'
          },
          format: {
            type: 'string',
            description: 'File format (currently only PDF supported)',
            default: 'pdf'
          },
          trackDownload: {
            type: 'boolean',
            description: 'Whether to track this download for analytics',
            default: true
          }
        },
        required: ['file'],
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: Record<string, any>, 
    context: ToolContext
  ): Promise<ToolResult> {
    const { file, format = 'pdf', trackDownload = true } = args;

    try {
      // Validate file type
      if (file !== 'resume') {
        return this.createErrorResult(
          'UNSUPPORTED_FILE',
          `Unsupported file type: ${file}. Currently only "resume" is supported`,
          {
            suggestions: ['Use "resume" as the file parameter'],
            fallback: { availableFiles: ['resume'] }
          }
        );
      }

      // Validate format
      if (format !== 'pdf') {
        return this.createErrorResult(
          'UNSUPPORTED_FORMAT',
          `Unsupported format: ${format}. Currently only "pdf" is supported`,
          {
            suggestions: ['Use "pdf" as the format parameter'],
            fallback: { availableFormats: ['pdf'] }
          }
        );
      }

      // Determine file path based on file type
      let filePath: string;
      let fileName: string;

      switch (file) {
        case 'resume':
          filePath = '/Nikunj_Resume.pdf';
          fileName = 'Nikunj_Resume.pdf';
          break;
        default:
          return this.createErrorResult(
            'UNKNOWN_FILE',
            `Unknown file: ${file}`,
            {
              suggestions: ['Use "resume" as the file parameter']
            }
          );
      }

      // Create download action
      const downloadAction: ToolAction = {
        type: 'download',
        target: filePath,
        data: {
          fileName,
          fileType: file,
          format,
          trackDownload,
          timestamp: new Date().toISOString()
        }
      };

      return this.createSuccessResult(
        {
          message: `Initiating download of ${fileName}`,
          file,
          format,
          fileName,
          filePath,
          trackDownload
        },
        [downloadAction]
      );

    } catch (error) {
      return this.createErrorResult(
        'DOWNLOAD_ERROR',
        `Failed to trigger download: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          suggestions: [
            'Check if the file exists',
            'Try again with valid parameters',
            'Contact support if the issue persists'
          ]
        }
      );
    }
  }
}

/**
 * Tool to manage UI state and interface interactions
 */
export class ManageUIStateTool extends BaseTool {
  constructor() {
    super(
      'manage_ui_state',
      'Manage UI state and interface interactions like focus, scroll position, and element visibility',
      {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            description: 'UI action to perform'
          },
          target: {
            type: 'string',
            description: 'Target element selector or identifier'
          },
          options: {
            type: 'object',
            properties: {
              smooth: {
                type: 'boolean',
                description: 'Use smooth scrolling/transitions',
                default: true
              },
              duration: {
                type: 'number',
                description: 'Animation duration in milliseconds',
                default: 300
              },
              offset: {
                type: 'number',
                description: 'Scroll offset in pixels',
                default: 0
              }
            },
            additionalProperties: false
          }
        },
        required: ['action', 'target'],
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: Record<string, any>, 
    context: ToolContext
  ): Promise<ToolResult> {
    const { action, target, options = {} } = args;
    const { smooth = true, duration = 300, offset = 0 } = options;

    try {
      // Validate action
      const validActions = ['focus', 'scroll', 'highlight', 'show', 'hide'];
      if (!validActions.includes(action)) {
        return this.createErrorResult(
          'INVALID_ACTION',
          `Invalid UI action: ${action}. Must be one of: ${validActions.join(', ')}`,
          {
            suggestions: [`Use one of: ${validActions.join(', ')}`],
            fallback: { availableActions: validActions }
          }
        );
      }

      // Validate target
      if (!target || typeof target !== 'string') {
        return this.createErrorResult(
          'INVALID_TARGET',
          'Target must be a non-empty string',
          {
            suggestions: ['Provide a valid element selector or identifier']
          }
        );
      }

      // Create UI state action
      const uiAction: ToolAction = {
        type: action as any, // Type assertion since we validated above
        target,
        data: {
          smooth,
          duration,
          offset,
          timestamp: new Date().toISOString(),
          context: {
            currentPage: context.currentPage,
            theme: context.theme
          }
        }
      };

      return this.createSuccessResult(
        {
          message: `UI action "${action}" applied to target "${target}"`,
          action,
          target,
          options: { smooth, duration, offset }
        },
        [uiAction]
      );

    } catch (error) {
      return this.createErrorResult(
        'UI_STATE_ERROR',
        `Failed to manage UI state: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          suggestions: [
            'Check if the target element exists',
            'Verify the action is supported',
            'Try again with valid parameters'
          ]
        }
      );
    }
  }
}