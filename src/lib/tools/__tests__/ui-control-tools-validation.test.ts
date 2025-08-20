/**
 * Validation tests to ensure UI control tools are properly integrated
 */

import {
  ToggleThemeTool,
  TriggerDownloadTool,
  ManageUIStateTool,
  initializeUIControlTools,
  toolRegistry,
} from "../index";

describe("UI Control Tools Validation", () => {
  beforeEach(() => {
    toolRegistry.clearAllTools();
    toolRegistry.clearExecutionHistory();
  });

  it("should export all UI control tool classes", () => {
    expect(ToggleThemeTool).toBeDefined();
    expect(TriggerDownloadTool).toBeDefined();
    expect(ManageUIStateTool).toBeDefined();
    expect(initializeUIControlTools).toBeDefined();
  });

  it("should be able to create instances of all UI control tools", () => {
    const toggleTool = new ToggleThemeTool();
    const downloadTool = new TriggerDownloadTool();
    const uiStateTool = new ManageUIStateTool();

    expect(toggleTool.name).toBe("toggle_theme");
    expect(downloadTool.name).toBe("trigger_download");
    expect(uiStateTool.name).toBe("manage_ui_state");
  });

  it("should initialize UI control tools without errors", () => {
    expect(() => {
      initializeUIControlTools();
    }).not.toThrow();

    const tools = toolRegistry.getAll();
    const uiControlToolNames = [
      "toggle_theme",
      "trigger_download",
      "manage_ui_state",
    ];

    uiControlToolNames.forEach((toolName) => {
      const tool = tools.find((t) => t.name === toolName);
      expect(tool).toBeDefined();
    });
  });

  it("should have proper tool schemas for OpenAI function calling", () => {
    initializeUIControlTools();

    const functions = toolRegistry.getFunctionDefinitions();
    const uiControlFunctions = functions.filter((f) =>
      ["toggle_theme", "trigger_download", "manage_ui_state"].includes(f.name)
    );

    expect(uiControlFunctions).toHaveLength(3);

    uiControlFunctions.forEach((func) => {
      expect(func.name).toBeDefined();
      expect(func.description).toBeDefined();
      expect(func.parameters).toBeDefined();
      expect(func.parameters.type).toBe("object");
      expect(func.parameters.properties).toBeDefined();
    });
  });

  it("should have all required tool functionality", () => {
    const toggleTool = new ToggleThemeTool();
    const downloadTool = new TriggerDownloadTool();
    const uiStateTool = new ManageUIStateTool();

    // Check that all tools have required methods
    expect(typeof toggleTool.execute).toBe("function");
    expect(typeof downloadTool.execute).toBe("function");
    expect(typeof uiStateTool.execute).toBe("function");

    // Check that all tools have proper parameters
    expect(toggleTool.parameters.type).toBe("object");
    expect(downloadTool.parameters.type).toBe("object");
    expect(uiStateTool.parameters.type).toBe("object");

    // Check that all tools have descriptions
    expect(toggleTool.description).toContain("theme");
    expect(downloadTool.description).toContain("download");
    expect(uiStateTool.description).toContain("UI state");
  });
});
