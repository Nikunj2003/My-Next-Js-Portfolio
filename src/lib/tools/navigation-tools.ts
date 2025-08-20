/**
 * Navigation tools for controlling Next.js routing and page navigation
 */

import { BaseTool } from './base-tool';
import { ToolContext, ToolResult, ToolAction } from '@/types/tools';
import { JSONSchema7 } from 'json-schema';

/**
 * Valid portfolio pages that can be navigated to
 */
const VALID_PAGES = ['home', 'about', 'projects', 'resume'] as const;
type ValidPage = typeof VALID_PAGES[number];

/**
 * Valid pages array for JSON Schema (mutable version)
 */
const VALID_PAGES_ARRAY: string[] = [...VALID_PAGES];

/**
 * Valid sections within pages
 */
const PAGE_SECTIONS: Record<ValidPage, string[]> = {
  home: ['hero', 'stats', 'skills'],
  about: ['hero', 'experience', 'background'],
  projects: ['showcase', 'filters'],
  resume: ['display', 'download']
};

/**
 * Tool for navigating to different portfolio pages
 */
export class NavigateToPageTool extends BaseTool {
  constructor() {
    super(
      'navigate_to_page',
      'Navigate to a specific page in the portfolio with optional section targeting and smooth scrolling',
      {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: VALID_PAGES_ARRAY,
            description: 'The page to navigate to'
          },
          section: {
            type: 'string',
            description: 'Optional section within the page to scroll to'
          },
          smooth: {
            type: 'boolean',
            default: true,
            description: 'Whether to use smooth scrolling when navigating to sections'
          }
        },
        required: ['page'],
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: { page: ValidPage; section?: string; smooth?: boolean },
    context: ToolContext
  ): Promise<ToolResult> {
    const { page, section, smooth = true } = args;

    // Additional validation beyond schema (schema already validates enum)
    // This is redundant but kept for explicit error messages

    // Validate section if provided
    if (section && !PAGE_SECTIONS[page].includes(section)) {
      return this.createErrorResult('INVALID_SECTION', `Invalid section "${section}" for page "${page}". Valid sections are: ${PAGE_SECTIONS[page].join(', ')}`, {
        suggestions: [`Try one of: ${PAGE_SECTIONS[page].join(', ')}`],
        fallback: { page, section: null }
      });
    }

    // Convert page names to actual routes
    const pageRoutes: Record<ValidPage, string> = {
      home: '/',
      about: '/about',
      projects: '/projects',
      resume: '/resume'
    };

    const targetRoute = pageRoutes[page];
    const isCurrentPage = this.getCurrentPageFromRoute(context.currentPage) === page;

    // Create navigation action
    const navigationAction: ToolAction = {
      type: 'navigate',
      target: targetRoute,
      data: {
        section,
        smooth,
        isCurrentPage
      }
    };

    // Prepare response data
    const responseData = {
      page,
      route: targetRoute,
      section,
      smooth,
      isCurrentPage,
      message: this.generateNavigationMessage(page, section, isCurrentPage)
    };

    return this.createSuccessResult(responseData, [navigationAction]);
  }

  /**
   * Extract page name from current route
   */
  private getCurrentPageFromRoute(currentPage: string): ValidPage {
    if (currentPage === '/' || currentPage === '/home') return 'home';
    if (currentPage.startsWith('/about')) return 'about';
    if (currentPage.startsWith('/projects')) return 'projects';
    if (currentPage.startsWith('/resume')) return 'resume';
    return 'home'; // fallback
  }

  /**
   * Generate appropriate navigation message
   */
  private generateNavigationMessage(page: ValidPage, section?: string, isCurrentPage?: boolean): string {
    if (isCurrentPage && section) {
      return `Scrolling to the ${section} section on the current page.`;
    } else if (isCurrentPage && !section) {
      return `You're already on the ${page} page.`;
    } else if (section) {
      return `Navigating to the ${page} page and scrolling to the ${section} section.`;
    } else {
      return `Navigating to the ${page} page.`;
    }
  }
}

/**
 * Tool for opening modals (contact form, project details, etc.)
 */
export class OpenModalTool extends BaseTool {
  constructor() {
    super(
      'open_modal',
      'Open a modal dialog for contact forms, project details, or other interactive content',
      {
        type: 'object',
        properties: {
          modal: {
            type: 'string',
            enum: ['contact', 'project-details'],
            description: 'The type of modal to open'
          },
          data: {
            type: 'object',
            description: 'Optional data to pre-populate the modal with',
            properties: {
              projectId: {
                type: 'string',
                description: 'Project ID for project details modal'
              },
              subject: {
                type: 'string',
                description: 'Pre-filled subject for contact form'
              },
              message: {
                type: 'string',
                description: 'Pre-filled message for contact form'
              }
            },
            additionalProperties: true
          }
        },
        required: ['modal'],
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: { modal: 'contact' | 'project-details'; data?: Record<string, any> },
    context: ToolContext
  ): Promise<ToolResult> {
    const { modal, data = {} } = args;

    // Additional validation beyond schema (schema already validates enum)
    // This is redundant but kept for explicit error messages

    // Validate project details modal data
    if (modal === 'project-details' && data.projectId && typeof data.projectId !== 'string') {
      return this.createErrorResult('INVALID_PROJECT_ID', 'Project ID must be a string', {
        suggestions: ['Provide a valid project ID string']
      });
    }

    // Create modal action
    const modalAction: ToolAction = {
      type: 'modal',
      target: modal,
      data: {
        ...data,
        timestamp: Date.now()
      }
    };

    // Prepare response data
    const responseData = {
      modal,
      data,
      message: this.generateModalMessage(modal, data)
    };

    return this.createSuccessResult(responseData, [modalAction]);
  }

  /**
   * Generate appropriate modal opening message
   */
  private generateModalMessage(modal: string, data: Record<string, any>): string {
    switch (modal) {
      case 'contact':
        if (data.subject) {
          return `Opening contact form with subject: "${data.subject}"`;
        }
        return 'Opening the contact form for you.';
      
      case 'project-details':
        if (data.projectId) {
          return `Opening details for project: ${data.projectId}`;
        }
        return 'Opening project details modal.';
      
      default:
        return `Opening ${modal} modal.`;
    }
  }
}

/**
 * Tool for navigating to specific sections within pages
 */
export class NavigateToSectionTool extends BaseTool {
  constructor() {
    super(
      'navigate_to_section',
      'Navigate to a specific section within the current page or any page with smooth scrolling and highlighting',
      {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            description: 'The section to navigate to'
          },
          page: {
            type: 'string',
            enum: VALID_PAGES_ARRAY,
            description: 'Optional page to navigate to first (defaults to current page)'
          },
          smooth: {
            type: 'boolean',
            default: true,
            description: 'Whether to use smooth scrolling'
          },
          highlight: {
            type: 'boolean',
            default: true,
            description: 'Whether to highlight the section after scrolling'
          }
        },
        required: ['section'],
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: { section: string; page?: ValidPage; smooth?: boolean; highlight?: boolean },
    context: ToolContext
  ): Promise<ToolResult> {
    const { section, page, smooth = true, highlight = true } = args;

    // Determine target page (current page if not specified)
    const targetPage = page || this.getCurrentPageFromRoute(context.currentPage);

    // Validate that the section exists on the target page
    if (!PAGE_SECTIONS[targetPage]?.includes(section)) {
      const availableSections = PAGE_SECTIONS[targetPage] || [];
      return this.createErrorResult('INVALID_SECTION', `Section "${section}" not found on ${targetPage} page. Available sections: ${availableSections.join(', ')}`, {
        suggestions: availableSections.length > 0 
          ? [`Try one of: ${availableSections.join(', ')}`]
          : [`Navigate to a different page first`],
        fallback: { 
          currentPage: context.currentPage,
          availableSections 
        }
      });
    }

    const actions: ToolAction[] = [];

    // If we need to navigate to a different page first
    if (page && this.getCurrentPageFromRoute(context.currentPage) !== targetPage) {
      const pageRoutes: Record<ValidPage, string> = {
        home: '/',
        about: '/about',
        projects: '/projects',
        resume: '/resume'
      };

      actions.push({
        type: 'navigate',
        target: pageRoutes[targetPage],
        data: { section, smooth, highlight }
      });
    } else {
      // Just scroll to section on current page
      actions.push({
        type: 'scroll',
        target: section,
        data: { smooth, highlight }
      });
    }

    const needsPageNavigation = page ? this.getCurrentPageFromRoute(context.currentPage) !== targetPage : false;
    
    const responseData = {
      section,
      page: targetPage,
      smooth,
      highlight,
      needsPageNavigation,
      message: this.generateSectionNavigationMessage(section, targetPage, needsPageNavigation)
    };

    return this.createSuccessResult(responseData, actions);
  }

  /**
   * Extract page name from current route
   */
  private getCurrentPageFromRoute(currentPage: string): ValidPage {
    if (currentPage === '/' || currentPage === '/home') return 'home';
    if (currentPage.startsWith('/about')) return 'about';
    if (currentPage.startsWith('/projects')) return 'projects';
    if (currentPage.startsWith('/resume')) return 'resume';
    return 'home'; // fallback
  }

  /**
   * Generate appropriate section navigation message
   */
  private generateSectionNavigationMessage(section: string, page: ValidPage, needsPageNavigation: boolean): string {
    if (needsPageNavigation) {
      return `Navigating to the ${page} page and scrolling to the ${section} section.`;
    } else {
      return `Scrolling to the ${section} section on the current page.`;
    }
  }
}