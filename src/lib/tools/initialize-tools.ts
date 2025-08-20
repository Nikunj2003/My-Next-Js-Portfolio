/**
 * Initialize and register all portfolio tools
 */

import { toolRegistry } from "./tool-registry";
import { contextAwareToolRegistry } from "./context-aware-tool-registry";
import {
  GetProjectsTool,
  GetExperienceTool,
  GetSkillsTool,
} from "./data-access-tools";
import {
  NavigateToPageTool,
  OpenModalTool,
  NavigateToSectionTool,
} from "./navigation-tools";
import {
  ToggleThemeTool,
  TriggerDownloadTool,
  ManageUIStateTool,
} from "./ui-control-tools";

/**
 * Initialize all data access tools and register them
 */
export function initializeDataAccessTools(): void {
  // Register data access tools
  const dataTools = [
    new GetProjectsTool(),
    new GetExperienceTool(),
    new GetSkillsTool(),
  ];

  dataTools.forEach((tool) => {
    toolRegistry.register(tool);
    contextAwareToolRegistry.register(tool);
  });
}

/**
 * Initialize all navigation tools and register them
 */
export function initializeNavigationTools(): void {
  // Register navigation tools
  const navigationTools = [
    new NavigateToPageTool(),
    new OpenModalTool(),
    new NavigateToSectionTool(),
  ];

  navigationTools.forEach((tool) => {
    toolRegistry.register(tool);
    contextAwareToolRegistry.register(tool);
  });
}

/**
 * Initialize all UI control tools and register them
 */
export function initializeUIControlTools(): void {
  // Register UI control tools
  const uiTools = [
    new ToggleThemeTool(),
    new TriggerDownloadTool(),
    new ManageUIStateTool(),
  ];

  uiTools.forEach((tool) => {
    toolRegistry.register(tool);
    contextAwareToolRegistry.register(tool);
  });
}

/**
 * Initialize all portfolio tools
 */
export function initializeAllTools(): void {
  // Clear existing tools
  toolRegistry.clearExecutionHistory();
  toolRegistry.clearAllTools();
  contextAwareToolRegistry.clearAllTools();

  // Initialize data access tools
  initializeDataAccessTools();

  // Initialize navigation tools
  initializeNavigationTools();

  // Initialize UI control tools
  initializeUIControlTools();

  console.log(
    `✅ Initialized ${
      toolRegistry.getAll().length
    } portfolio tools with contextual awareness`
  );
}

/**
 * Get initialization status
 */
export function getToolInitializationStatus(): {
  isInitialized: boolean;
  toolCount: number;
  toolNames: string[];
} {
  const tools = toolRegistry.getAll();
  return {
    isInitialized: tools.length > 0,
    toolCount: tools.length,
    toolNames: tools.map((tool) => tool.name),
  };
}
