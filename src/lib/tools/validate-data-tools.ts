/**
 * Runtime validation for data access tools
 * This can be run to verify the tools work correctly
 */

import {
  GetProjectsTool,
  GetExperienceTool,
  GetSkillsTool,
} from "./data-access-tools";
import { ToolContext } from "@/types/tools";

// Mock context for testing
const mockContext: ToolContext = {
  currentPage: "projects",
  theme: "light",
  userAgent: "test-agent",
  sessionId: "test-session-123",
};

/**
 * Validate GetProjectsTool functionality
 */
export async function validateGetProjectsTool(): Promise<boolean> {
  console.log("🧪 Validating GetProjectsTool...");
  const tool = new GetProjectsTool();

  try {
    // Test basic functionality
    const result1 = await tool.execute({}, mockContext);
    if (!result1.success) {
      console.error("❌ Basic retrieval failed:", result1.error?.message);
      return false;
    }
    console.log("✅ Basic retrieval: PASS");

    // Test with limit
    const result2 = await tool.execute({ limit: 3 }, mockContext);
    const result2Data = result2.data as
      | { projects?: unknown[] }
      | undefined;
    if (!result2.success || (result2Data?.projects?.length ?? 0) > 3) {
      console.error("❌ Limit parameter failed");
      return false;
    }
    console.log("✅ Limit parameter: PASS");

    // Test category filter
    const result3 = await tool.execute({ category: "Enterprise" }, mockContext);
    if (!result3.success) {
      console.error("❌ Category filter failed:", result3.error?.message);
      return false;
    }
    console.log("✅ Category filter: PASS");

    // Test technology filter
    const result4 = await tool.execute({ technology: "React" }, mockContext);
    if (!result4.success) {
      console.error("❌ Technology filter failed:", result4.error?.message);
      return false;
    }
    console.log("✅ Technology filter: PASS");

    // Test search
    const result5 = await tool.execute({ search: "store" }, mockContext);
    if (!result5.success) {
      console.error("❌ Search functionality failed:", result5.error?.message);
      return false;
    }
    console.log("✅ Search functionality: PASS");

    console.log("📊 GetProjectsTool validation completed successfully\n");
    return true;
  } catch (error) {
    console.error("❌ GetProjectsTool validation failed:", error);
    return false;
  }
}

/**
 * Validate GetExperienceTool functionality
 */
export async function validateGetExperienceTool(): Promise<boolean> {
  console.log("🧪 Validating GetExperienceTool...");
  const tool = new GetExperienceTool();

  try {
    // Test basic functionality
    const result1 = await tool.execute({}, mockContext);
    if (!result1.success) {
      console.error("❌ Basic retrieval failed:", result1.error?.message);
      return false;
    }
    console.log("✅ Basic retrieval: PASS");

    // Test company filter
    const result2 = await tool.execute({ company: "Xansr" }, mockContext);
    if (!result2.success) {
      console.error("❌ Company filter failed:", result2.error?.message);
      return false;
    }
    console.log("✅ Company filter: PASS");

    // Test role filter
    const result3 = await tool.execute({ role: "intern" }, mockContext);
    if (!result3.success) {
      console.error("❌ Role filter failed:", result3.error?.message);
      return false;
    }
    console.log("✅ Role filter: PASS");

    // Test date range filter
    const result4 = await tool.execute(
      { dateRange: { start: "2024" } },
      mockContext
    );
    if (!result4.success) {
      console.error("❌ Date range filter failed:", result4.error?.message);
      return false;
    }
    console.log("✅ Date range filter: PASS");

    // Test sorting
    const result5 = await tool.execute({ sortBy: "company" }, mockContext);
    if (!result5.success) {
      console.error("❌ Sorting functionality failed:", result5.error?.message);
      return false;
    }
    console.log("✅ Sorting functionality: PASS");

    console.log("📊 GetExperienceTool validation completed successfully\n");
    return true;
  } catch (error) {
    console.error("❌ GetExperienceTool validation failed:", error);
    return false;
  }
}

/**
 * Validate GetSkillsTool functionality
 */
export async function validateGetSkillsTool(): Promise<boolean> {
  console.log("🧪 Validating GetSkillsTool...");
  const tool = new GetSkillsTool();

  try {
    // Test basic functionality
    const result1 = await tool.execute({}, mockContext);
    if (!result1.success) {
      console.error(
        "❌ Basic retrieval (grouped) failed:",
        result1.error?.message
      );
      return false;
    }
    console.log("✅ Basic retrieval (grouped): PASS");

    // Test flat grouping
    const result2 = await tool.execute({ groupBy: "flat" }, mockContext);
    if (!result2.success) {
      console.error("❌ Flat grouping failed:", result2.error?.message);
      return false;
    }
    console.log("✅ Flat grouping: PASS");

    // Test category filter
    const result3 = await tool.execute({ category: "AI/ML" }, mockContext);
    if (!result3.success) {
      console.error("❌ Category filter failed:", result3.error?.message);
      return false;
    }
    console.log("✅ Category filter: PASS");

    // Test search
    const result4 = await tool.execute(
      { search: "React", groupBy: "flat" },
      mockContext
    );
    if (!result4.success) {
      console.error("❌ Search functionality failed:", result4.error?.message);
      return false;
    }
    console.log("✅ Search functionality: PASS");

    // Test proficiency filter
    const result5 = await tool.execute(
      { proficiencyLevel: "expert", groupBy: "flat" },
      mockContext
    );
    if (!result5.success) {
      console.error("❌ Proficiency filter failed:", result5.error?.message);
      return false;
    }
    console.log("✅ Proficiency filter: PASS");

    console.log("📊 GetSkillsTool validation completed successfully\n");
    return true;
  } catch (error) {
    console.error("❌ GetSkillsTool validation failed:", error);
    return false;
  }
}

/**
 * Run all validations
 */
export async function runAllValidations(): Promise<boolean> {
  console.log("🚀 Starting data access tools validation...\n");

  const results = await Promise.all([
    validateGetProjectsTool(),
    validateGetExperienceTool(),
    validateGetSkillsTool(),
  ]);

  const allPassed = results.every((result) => result);

  console.log("📋 Validation Summary:");
  console.log(`✅ GetProjectsTool: ${results[0] ? "PASS" : "FAIL"}`);
  console.log(`✅ GetExperienceTool: ${results[1] ? "PASS" : "FAIL"}`);
  console.log(`✅ GetSkillsTool: ${results[2] ? "PASS" : "FAIL"}`);
  console.log(
    `\n🎯 Overall: ${allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`
  );

  return allPassed;
}
