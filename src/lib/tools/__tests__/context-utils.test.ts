/**
 * Unit tests for context transformation utilities
 */

import { ContextTransformer } from "../context-utils";

describe("ContextTransformer", () => {
  describe("pathToPageSection", () => {
    it("should map resume PDF path to resume page", () => {
      const result = ContextTransformer.pathToPageSection("/Nikunj_Resume.pdf");

      expect(result).toEqual({ page: "resume" });
    });

    it("should map resume PDF path with query to resume page", () => {
      const result = ContextTransformer.pathToPageSection(
        "/Nikunj_Resume.pdf?download=1"
      );

      expect(result).toEqual({ page: "resume" });
    });
  });

  describe("pageSectionToPath", () => {
    it("should map resume page to canonical resume PDF path", () => {
      const result = ContextTransformer.pageSectionToPath("resume");

      expect(result).toBe("/Nikunj_Resume.pdf");
    });

    it("should ignore section when mapping resume page to PDF path", () => {
      const result = ContextTransformer.pageSectionToPath("resume", "skills");

      expect(result).toBe("/Nikunj_Resume.pdf");
    });
  });
});
