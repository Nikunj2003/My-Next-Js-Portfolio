/**
 * Unit tests for tool context utilities
 */

import { ToolContextUtils } from "../tool-context";

describe("ToolContextUtils", () => {
  describe("extractPageFromPath", () => {
    it("should map resume PDF path to resume page", () => {
      const result = ToolContextUtils.extractPageFromPath("/Nikunj_Resume.pdf");

      expect(result).toEqual({ page: "resume" });
    });

    it("should map resume PDF path with query to resume page", () => {
      const result = ToolContextUtils.extractPageFromPath(
        "/Nikunj_Resume.pdf?download=1"
      );

      expect(result).toEqual({ page: "resume" });
    });

    it("should map resume PDF path with hash to resume page", () => {
      const result = ToolContextUtils.extractPageFromPath("/Nikunj_Resume.pdf#top");

      expect(result).toEqual({ page: "resume" });
    });
  });
});
