/**
 * Tool system exports
 */

// Types
export * from '@/types/tools';

// Base classes and utilities
export { BaseTool } from './base-tool';
export { ToolRegistry, toolRegistry } from './tool-registry';
export { ContextAwareToolRegistry, contextAwareToolRegistry } from './context-aware-tool-registry';
export { ToolExecutionMiddleware, toolExecutionMiddleware } from './tool-execution-middleware';
export { ToolContextManager, ToolContextValidator, ToolContextUtils } from './tool-context';
export { ContextSanitizer, ContextValidator, ContextTransformer, ContextComparator } from './context-utils';

// Contextual awareness system
export { PageContextDetector, ContextTracker } from './page-context-detector';
export { ContextualToolSuggestions } from './contextual-tool-suggestions';
export type {
  PageContextDetection,
  ContextTrackingEntry
} from './page-context-detector';
export type {
  ToolSuggestion as ContextualToolSuggestion,
  ContextualHelp,
  ToolFilterCriteria
} from './contextual-tool-suggestions';

// Data access tools
export { GetProjectsTool, GetExperienceTool, GetSkillsTool } from './data-access-tools';

// Navigation tools
export { NavigateToPageTool, OpenModalTool, NavigateToSectionTool } from './navigation-tools';

// UI control tools
export { ToggleThemeTool, TriggerDownloadTool, ManageUIStateTool } from './ui-control-tools';

// Tool initialization
export { initializeDataAccessTools, initializeNavigationTools, initializeUIControlTools, initializeAllTools, getToolInitializationStatus } from './initialize-tools';

// Tool validation
export { validateGetProjectsTool, validateGetExperienceTool, validateGetSkillsTool, runAllValidations } from './validate-data-tools';

// Re-export commonly used types
export type {
  PortfolioTool,
  ToolContext,
  ToolResult,
  ToolError,
  ToolAction,
  ToolCall,
  ToolExecutionConfig,
  ToolExecutionStats
} from '@/types/tools';