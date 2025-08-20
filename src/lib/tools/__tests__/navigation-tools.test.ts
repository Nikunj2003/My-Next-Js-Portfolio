/**
 * Unit tests for navigation tools
 */

import {
  NavigateToPageTool,
  OpenModalTool,
  NavigateToSectionTool,
} from "../navigation-tools";
import { ToolContext } from "@/types/tools";

describe("NavigateToPageTool", () => {
  let tool: NavigateToPageTool;
  let mockContext: ToolContext;

  beforeEach(() => {
    tool = new NavigateToPageTool();
    mockContext = {
      currentPage: "/",
      theme: "light",
      userAgent: "test-agent",
      sessionId: "test-session",
    };
  });

  describe("executeInternal", () => {
    it("should navigate to valid page", async () => {
      const result = await tool.execute({ page: "about" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.page).toBe("about");
      expect(result.data?.route).toBe("/about");
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe("navigate");
      expect(result.actions?.[0].target).toBe("/about");
    });

    it("should navigate to page with section", async () => {
      const result = await tool.execute(
        {
          page: "about",
          section: "experience",
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.section).toBe("experience");
      expect(result.actions?.[0].data?.section).toBe("experience");
    });

    it("should handle navigation to current page", async () => {
      mockContext.currentPage = "/about";
      const result = await tool.execute({ page: "about" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.isCurrentPage).toBe(true);
      expect(result.data?.message).toContain("already on");
    });

    it("should reject invalid page", async () => {
      const result = await tool.execute(
        { page: "invalid" as any },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("INVALID_ARGUMENTS");
      expect(result.error?.message).toContain("Invalid arguments");
    });

    it("should reject invalid section for page", async () => {
      const result = await tool.execute(
        {
          page: "about",
          section: "invalid-section",
        },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("INVALID_SECTION");
      expect(result.error?.message).toContain(
        'Invalid section "invalid-section" for page "about"'
      );
    });

    it("should handle smooth scrolling option", async () => {
      const result = await tool.execute(
        {
          page: "projects",
          section: "showcase",
          smooth: false,
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.smooth).toBe(false);
      expect(result.actions?.[0].data?.smooth).toBe(false);
    });

    it("should default smooth scrolling to true", async () => {
      const result = await tool.execute({ page: "home" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.smooth).toBe(true);
    });
  });

  describe("page route mapping", () => {
    it("should map home to /", async () => {
      const result = await tool.execute({ page: "home" }, mockContext);
      expect(result.data?.route).toBe("/");
    });

    it("should map about to /about", async () => {
      const result = await tool.execute({ page: "about" }, mockContext);
      expect(result.data?.route).toBe("/about");
    });

    it("should map projects to /projects", async () => {
      const result = await tool.execute({ page: "projects" }, mockContext);
      expect(result.data?.route).toBe("/projects");
    });

    it("should map resume to /resume", async () => {
      const result = await tool.execute({ page: "resume" }, mockContext);
      expect(result.data?.route).toBe("/resume");
    });
  });
});

describe("OpenModalTool", () => {
  let tool: OpenModalTool;
  let mockContext: ToolContext;

  beforeEach(() => {
    tool = new OpenModalTool();
    mockContext = {
      currentPage: "/",
      theme: "light",
      userAgent: "test-agent",
      sessionId: "test-session",
    };
  });

  describe("executeInternal", () => {
    it("should open contact modal", async () => {
      const result = await tool.execute({ modal: "contact" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.modal).toBe("contact");
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe("modal");
      expect(result.actions?.[0].target).toBe("contact");
    });

    it("should open contact modal with pre-filled data", async () => {
      const data = { subject: "Test Subject", message: "Test Message" };
      const result = await tool.execute(
        { modal: "contact", data },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.data).toEqual(data);
      expect(result.actions?.[0].data).toMatchObject(data);
      expect(result.data?.message).toContain("Test Subject");
    });

    it("should open project details modal", async () => {
      const result = await tool.execute(
        { modal: "project-details" },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.modal).toBe("project-details");
      expect(result.actions?.[0].target).toBe("project-details");
    });

    it("should open project details modal with project ID", async () => {
      const data = { projectId: "test-project" };
      const result = await tool.execute(
        { modal: "project-details", data },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.data?.projectId).toBe("test-project");
      expect(result.data?.message).toContain("test-project");
    });

    it("should reject invalid modal type", async () => {
      const result = await tool.execute(
        { modal: "invalid" as any },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("INVALID_ARGUMENTS");
      expect(result.error?.message).toContain("Invalid arguments");
    });

    it("should handle project ID validation", async () => {
      const result = await tool.execute(
        {
          modal: "project-details",
          data: { projectId: "valid-project-id" },
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.data?.projectId).toBe("valid-project-id");
    });

    it("should include timestamp in action data", async () => {
      const beforeTime = Date.now();
      const result = await tool.execute({ modal: "contact" }, mockContext);
      const afterTime = Date.now();

      expect(result.success).toBe(true);
      const timestamp = result.actions?.[0].data?.timestamp;
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });
});

describe("NavigateToSectionTool", () => {
  let tool: NavigateToSectionTool;
  let mockContext: ToolContext;

  beforeEach(() => {
    tool = new NavigateToSectionTool();
    mockContext = {
      currentPage: "/about",
      theme: "light",
      userAgent: "test-agent",
      sessionId: "test-session",
    };
  });

  describe("executeInternal", () => {
    it("should navigate to section on current page", async () => {
      const result = await tool.execute({ section: "experience" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.section).toBe("experience");
      expect(result.data?.page).toBe("about");
      expect(result.data?.needsPageNavigation).toBe(false);
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe("scroll");
      expect(result.actions?.[0].target).toBe("experience");
    });

    it("should navigate to section on different page", async () => {
      const result = await tool.execute(
        {
          section: "showcase",
          page: "projects",
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.section).toBe("showcase");
      expect(result.data?.page).toBe("projects");
      expect(result.data?.needsPageNavigation).toBe(true);
      expect(result.actions).toHaveLength(1);
      expect(result.actions?.[0].type).toBe("navigate");
      expect(result.actions?.[0].target).toBe("/projects");
      expect(result.actions?.[0].data?.section).toBe("showcase");
    });

    it("should handle smooth scrolling and highlighting options", async () => {
      const result = await tool.execute(
        {
          section: "hero",
          smooth: false,
          highlight: false,
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.smooth).toBe(false);
      expect(result.data?.highlight).toBe(false);
      expect(result.actions?.[0].data?.smooth).toBe(false);
      expect(result.actions?.[0].data?.highlight).toBe(false);
    });

    it("should default smooth and highlight to true", async () => {
      const result = await tool.execute({ section: "hero" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.smooth).toBe(true);
      expect(result.data?.highlight).toBe(true);
    });

    it("should reject invalid section for current page", async () => {
      const result = await tool.execute(
        { section: "invalid-section" },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("INVALID_SECTION");
      expect(result.error?.message).toContain(
        'Section "invalid-section" not found on about page'
      );
      expect(result.error?.suggestions).toContain(
        "Try one of: hero, experience, background"
      );
    });

    it("should reject invalid section for specified page", async () => {
      const result = await tool.execute(
        {
          section: "invalid-section",
          page: "projects",
        },
        mockContext
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("INVALID_SECTION");
      expect(result.error?.message).toContain(
        'Section "invalid-section" not found on projects page'
      );
    });

    it("should handle home page route variations", async () => {
      mockContext.currentPage = "/";
      const result = await tool.execute({ section: "hero" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.page).toBe("home");
    });

    it("should handle page route with trailing paths", async () => {
      mockContext.currentPage = "/projects/some-project";
      const result = await tool.execute({ section: "showcase" }, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.page).toBe("projects");
    });
  });

  describe("cross-page navigation messages", () => {
    it("should generate appropriate message for same page navigation", async () => {
      const result = await tool.execute({ section: "experience" }, mockContext);
      expect(result.data?.message).toContain("current page");
    });

    it("should generate appropriate message for cross-page navigation", async () => {
      const result = await tool.execute(
        {
          section: "showcase",
          page: "projects",
        },
        mockContext
      );
      expect(result.data?.message).toContain("Navigating to the projects page");
      expect(result.data?.message).toContain("showcase section");
    });
  });
});
