/**
 * Data access tools for retrieving portfolio information
 */

import { BaseTool } from './base-tool';
import { ToolContext, ToolResult } from '@/types/tools';
import { PROJECTS_CARD, PROJECT_SHOWCASE, BLOGS_CARD } from '@/data/projects';
import { EXPERIENCE } from '@/data/experience';
import { SKILLS_DATA } from '@/data/skills';
// JSONSchema7 is imported in base-tool.ts, no need to import here

/**
 * Tool to retrieve project data with filtering and search capabilities
 */
export class GetProjectsTool extends BaseTool {
  constructor() {
    super(
      'get_projects',
      'Retrieve project data with filtering by technology, category, and keyword search',
      {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter projects by category (e.g., "Enterprise", "E-commerce", "Open Source")',
            enum: ['Enterprise', 'E-commerce', 'Agency Work', 'Social Media', 'Open Source', 'Media Platform', 'Blog']
          },
          technology: {
            type: 'string',
            description: 'Filter projects by technology used (e.g., "React", "Next.js", "GraphQL")'
          },
          search: {
            type: 'string',
            description: 'Search projects by keyword in name or description'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of projects to return',
            minimum: 1,
            maximum: 50,
            default: 10
          },
          includeDetails: {
            type: 'boolean',
            description: 'Include detailed project information (images, links, full description)',
            default: true
          },
          includeShowcase: {
            type: 'boolean',
            description: 'Include showcase projects in results',
            default: true
          },
          includeBlogs: {
            type: 'boolean',
            description: 'Include blog posts in results',
            default: false
          }
        },
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: Record<string, any>,
    _context: ToolContext
  ): Promise<ToolResult> {
    try {
      const {
        category,
        technology,
        search,
        limit = 10,
        includeDetails = true,
        includeShowcase = true,
        includeBlogs = false
      } = args;

      let allProjects: any[] = [];

      // Combine different project sources
      if (includeShowcase) {
        const showcaseProjects = PROJECT_SHOWCASE.map(project => ({
          ...project,
          type: 'showcase',
          category: this.inferCategoryFromTags(project.tags),
          technologies: project.tags,
          description: `Showcase project: ${project.title}`,
          images: [project.image.LIGHT, project.image.DARK]
        }));
        allProjects.push(...showcaseProjects);
      }

      // Add detailed projects
      const detailedProjects = PROJECTS_CARD.map(project => ({
        ...project,
        type: 'detailed',
        technologies: project.technologies,
        images: project.imageUrl
      }));
      allProjects.push(...detailedProjects);

      // Add blogs if requested
      if (includeBlogs) {
        const blogProjects = BLOGS_CARD.map(blog => ({
          ...blog,
          type: 'blog',
          technologies: blog.technologies,
          images: blog.imageUrl
        }));
        allProjects.push(...blogProjects);
      }

      // Apply filters
      let filteredProjects = allProjects;

      // Filter by category
      if (category) {
        filteredProjects = filteredProjects.filter(project => 
          project.category?.toLowerCase().includes(category.toLowerCase())
        );
      }

      // Filter by technology
      if (technology) {
        filteredProjects = filteredProjects.filter(project => 
          project.technologies?.some((tech: string) => 
            tech.toLowerCase().includes(technology.toLowerCase())
          )
        );
      }

      // Search by keyword
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          project.name?.toLowerCase().includes(searchLower) ||
          project.title?.toLowerCase().includes(searchLower) ||
          project.description?.toLowerCase().includes(searchLower) ||
          project.technologies?.some((tech: string) => 
            tech.toLowerCase().includes(searchLower)
          )
        );
      }

      // Apply limit
      const limitedProjects = filteredProjects.slice(0, limit);

      // Format results based on includeDetails
      const results = limitedProjects.map(project => {
        const baseProject = {
          name: project.name || project.title,
          type: project.type,
          category: project.category,
          technologies: project.technologies
        };

        if (includeDetails) {
          return {
            ...baseProject,
            description: project.description,
            images: project.images || project.imageUrl,
            links: {
              source: project.sourceCodeHref,
              live: project.liveWebsiteHref,
              href: project.href
            },
            favicon: project.favicon
          };
        }

        return baseProject;
      });

      // Generate summary
      const summary = {
        totalFound: filteredProjects.length,
        returned: results.length,
        filters: {
          category: category || null,
          technology: technology || null,
          search: search || null
        },
        categories: Array.from(new Set(filteredProjects.map(p => p.category).filter(Boolean))),
        technologies: Array.from(new Set(filteredProjects.flatMap(p => p.technologies || [])))
      };

      return this.createSuccessResult({
        projects: results,
        summary
      });

    } catch (error) {
      return this.createErrorResult(
        'DATA_ACCESS_ERROR',
        `Failed to retrieve projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          suggestions: [
            'Try with different filter parameters',
            'Check if the search term is valid',
            'Reduce the limit if too many results are requested'
          ]
        }
      );
    }
  }

  /**
   * Infer category from project tags for showcase projects
   */
  private inferCategoryFromTags(tags: string[]): string {
    const tagString = tags.join(' ').toLowerCase();
    
    if (tagString.includes('payment') || tagString.includes('store') || tagString.includes('razorpay')) {
      return 'E-commerce';
    }
    if (tagString.includes('microservices') || tagString.includes('graphql')) {
      return 'Enterprise';
    }
    if (tagString.includes('social') || tagString.includes('fire')) {
      return 'Social Media';
    }
    
    return 'Web Application';
  }
}

/**
 * Tool to retrieve experience data with filtering capabilities
 */
export class GetExperienceTool extends BaseTool {
  constructor() {
    super(
      'get_experience',
      'Retrieve professional experience data with filtering by company, role, and date range',
      {
        type: 'object',
        properties: {
          company: {
            type: 'string',
            description: 'Filter by company name (partial match supported)'
          },
          role: {
            type: 'string',
            description: 'Filter by job role or title (partial match supported)'
          },
          dateRange: {
            type: 'object',
            properties: {
              start: {
                type: 'string',
                description: 'Start date for filtering (YYYY-MM format or year)'
              },
              end: {
                type: 'string',
                description: 'End date for filtering (YYYY-MM format or year)'
              }
            },
            additionalProperties: false
          },
          includeDetails: {
            type: 'boolean',
            description: 'Include detailed descriptions and achievements',
            default: true
          },
          sortBy: {
            type: 'string',
            description: 'Sort order for results',
            enum: ['date_desc', 'date_asc', 'company', 'role'],
            default: 'date_desc'
          }
        },
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: Record<string, any>,
    _context: ToolContext
  ): Promise<ToolResult> {
    try {
      const {
        company,
        role,
        dateRange,
        includeDetails = true,
        sortBy = 'date_desc'
      } = args;

      let filteredExperience = [...EXPERIENCE];

      // Filter by company
      if (company) {
        filteredExperience = filteredExperience.filter(exp =>
          exp.organisation?.name.toLowerCase().includes(company.toLowerCase())
        );
      }

      // Filter by role
      if (role) {
        filteredExperience = filteredExperience.filter(exp =>
          exp.title.toLowerCase().includes(role.toLowerCase())
        );
      }

      // Filter by date range
      if (dateRange) {
        filteredExperience = filteredExperience.filter(exp => {
          const expDate = this.parseExperienceDate(exp.date);
          
          if (dateRange.start) {
            const startDate = this.parseFilterDate(dateRange.start);
            if (expDate.end < startDate) return false;
          }
          
          if (dateRange.end) {
            const endDate = this.parseFilterDate(dateRange.end);
            if (expDate.start > endDate) return false;
          }
          
          return true;
        });
      }

      // Sort results
      filteredExperience = this.sortExperience(filteredExperience, sortBy);

      // Format results
      const results = filteredExperience.map(exp => {
        const baseExp = {
          title: exp.title,
          company: exp.organisation?.name || 'Unknown Company',
          companyUrl: exp.organisation?.href || '',
          date: exp.date,
          duration: this.calculateDuration(exp.date)
        };

        if (includeDetails) {
          return {
            ...baseExp,
            description: exp.description,
            achievements: this.extractAchievements(exp.description),
            technologies: this.extractTechnologies(exp.description),
            keyMetrics: this.extractMetrics(exp.description)
          };
        }

        return baseExp;
      });

      // Generate summary
      const summary = {
        totalExperience: results.length,
        companies: Array.from(new Set(results.map(exp => exp.company))),
        roles: Array.from(new Set(results.map(exp => exp.title))),
        totalDuration: this.calculateTotalDuration(results),
        filters: {
          company: company || null,
          role: role || null,
          dateRange: dateRange || null
        }
      };

      return this.createSuccessResult({
        experience: results,
        summary
      });

    } catch (error) {
      return this.createErrorResult(
        'DATA_ACCESS_ERROR',
        `Failed to retrieve experience: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          suggestions: [
            'Check date format (use YYYY-MM or YYYY)',
            'Try with different filter parameters',
            'Verify company or role names'
          ]
        }
      );
    }
  }

  /**
   * Parse experience date string to start/end dates
   */
  private parseExperienceDate(dateString: string): { start: Date; end: Date } {
    // Handle formats like "May 2023 - July 2023", "June 2024 - Jan 2025"
    const parts = dateString.split(' - ');
    const startStr = parts[0].trim();
    const endStr = parts[1]?.trim() || 'Present';

    const start = this.parseDate(startStr);
    const end = endStr === 'Present' ? new Date() : this.parseDate(endStr);

    return { start, end };
  }

  /**
   * Parse date string to Date object
   */
  private parseDate(dateStr: string): Date {
    const monthMap: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const month = monthMap[parts[0]];
      const year = parseInt(parts[1]);
      return new Date(year, month);
    }

    // Fallback to year only
    const year = parseInt(dateStr);
    return new Date(year, 0);
  }

  /**
   * Parse filter date (YYYY-MM or YYYY format)
   */
  private parseFilterDate(dateStr: string): Date {
    if (dateStr.includes('-')) {
      const [year, month] = dateStr.split('-').map(Number);
      return new Date(year, month - 1);
    }
    
    const year = parseInt(dateStr);
    return new Date(year, 0);
  }

  /**
   * Sort experience based on criteria
   */
  private sortExperience(experience: typeof EXPERIENCE, sortBy: string): typeof EXPERIENCE {
    return experience.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return this.parseExperienceDate(a.date).start.getTime() - this.parseExperienceDate(b.date).start.getTime();
        case 'date_desc':
          return this.parseExperienceDate(b.date).start.getTime() - this.parseExperienceDate(a.date).start.getTime();
        case 'company':
          return (a.organisation?.name || '').localeCompare(b.organisation?.name || '');
        case 'role':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  /**
   * Calculate duration from date string
   */
  private calculateDuration(dateString: string): string {
    const { start, end } = this.parseExperienceDate(dateString);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  }

  /**
   * Calculate total duration across all experience
   */
  private calculateTotalDuration(experience: any[]): string {
    const totalMonths = experience.reduce((total, exp) => {
      const duration = exp.duration;
      const matches = duration.match(/(\d+)\s*year|(\d+)\s*month/g);
      let months = 0;
      
      if (matches) {
        matches.forEach((match: string) => {
          if (match.includes('year')) {
            months += parseInt(match) * 12;
          } else if (match.includes('month')) {
            months += parseInt(match);
          }
        });
      }
      
      return total + months;
    }, 0);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  }

  /**
   * Extract achievements from description
   */
  private extractAchievements(description: string): string[] {
    const achievements: string[] = [];
    
    // Look for sentences with metrics or accomplishments
    const sentences = description.split(/[.!]/).filter(s => s.trim());
    
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.includes('%') || 
          trimmed.includes('increased') || 
          trimmed.includes('improved') || 
          trimmed.includes('reduced') || 
          trimmed.includes('built') || 
          trimmed.includes('developed') || 
          trimmed.includes('implemented') ||
          trimmed.includes('created')) {
        achievements.push(trimmed);
      }
    });

    return achievements;
  }

  /**
   * Extract technologies from description
   */
  private extractTechnologies(description: string): string[] {
    const techKeywords = [
      'Java', 'JavaScript', 'TypeScript', 'Python', 'PHP', 'React', 'Next.js', 'Node.js',
      'FastAPI', 'Spring Boot', 'MySQL', 'MongoDB', 'GraphQL', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GitHub Actions', 'CI/CD', 'MERN', 'RAG', 'LangGraph', 'OpenAI',
      'Playwright', 'TestNG', 'MSSQL', 'ETL'
    ];

    const foundTech = techKeywords.filter(tech => 
      description.toLowerCase().includes(tech.toLowerCase())
    );

    return Array.from(new Set(foundTech));
  }

  /**
   * Extract key metrics from description
   */
  private extractMetrics(description: string): string[] {
    const metrics: string[] = [];
    
    // Look for percentage improvements
    const percentMatches = description.match(/\d+%/g);
    if (percentMatches) {
      percentMatches.forEach(match => {
        const context = description.substring(
          Math.max(0, description.indexOf(match) - 50),
          description.indexOf(match) + match.length + 50
        );
        metrics.push(context.trim());
      });
    }

    // Look for other numeric achievements
    const numericMatches = description.match(/\d+[,\d]*\s*(files|stations|hours|minutes)/g);
    if (numericMatches) {
      metrics.push(...numericMatches);
    }

    return metrics;
  }
}
/**
 
* Tool to retrieve skills data with categorization and search capabilities
 */
export class GetSkillsTool extends BaseTool {
  constructor() {
    super(
      'get_skills',
      'Retrieve skills data with category-based organization and search functionality',
      {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter skills by category',
            enum: ['Fullstack & Databases', 'AI/ML', 'DevOps', 'Tools & Cloud Platforms', 'Languages']
          },
          search: {
            type: 'string',
            description: 'Search skills by name or related terms'
          },
          includeIcons: {
            type: 'boolean',
            description: 'Include icon information for skills',
            default: false
          },
          groupBy: {
            type: 'string',
            description: 'Group skills by category or return flat list',
            enum: ['category', 'flat'],
            default: 'category'
          },
          proficiencyLevel: {
            type: 'string',
            description: 'Filter by proficiency level (inferred from usage context)',
            enum: ['beginner', 'intermediate', 'advanced', 'expert']
          }
        },
        additionalProperties: false
      }
    );
  }

  protected async executeInternal(
    args: Record<string, any>,
    _context: ToolContext
  ): Promise<ToolResult> {
    try {
      const {
        category,
        search,
        includeIcons = false,
        groupBy = 'category',
        proficiencyLevel
      } = args;

      let skillsData = [...SKILLS_DATA];

      // Filter by category
      if (category) {
        skillsData = skillsData.filter(section => 
          section.sectionName === category
        );
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        skillsData = skillsData.map(section => ({
          ...section,
          skills: section.skills.filter(skill =>
            skill.name.toLowerCase().includes(searchLower) ||
            this.getSkillAliases(skill.name).some(alias => 
              alias.toLowerCase().includes(searchLower)
            )
          )
        })).filter(section => section.skills.length > 0);
      }

      // Apply proficiency filter (inferred from skill context)
      if (proficiencyLevel) {
        skillsData = skillsData.map(section => ({
          ...section,
          skills: section.skills.filter(skill => 
            this.inferProficiencyLevel(skill.name, section.sectionName) === proficiencyLevel
          )
        })).filter(section => section.skills.length > 0);
      }

      // Format results based on groupBy
      let results: any;
      
      if (groupBy === 'flat') {
        const allSkills = skillsData.flatMap(section => 
          section.skills.map(skill => ({
            name: skill.name,
            category: section.sectionName,
            proficiency: this.inferProficiencyLevel(skill.name, section.sectionName),
            aliases: this.getSkillAliases(skill.name),
            relatedSkills: this.getRelatedSkills(skill.name),
            ...(includeIcons && { icon: skill.icon })
          }))
        );
        
        results = {
          skills: allSkills,
          totalCount: allSkills.length
        };
      } else {
        const categorizedSkills = skillsData.map(section => ({
          category: section.sectionName,
          skills: section.skills.map(skill => ({
            name: skill.name,
            proficiency: this.inferProficiencyLevel(skill.name, section.sectionName),
            aliases: this.getSkillAliases(skill.name),
            relatedSkills: this.getRelatedSkills(skill.name),
            ...(includeIcons && { icon: skill.icon })
          })),
          skillCount: section.skills.length
        }));

        results = {
          categories: categorizedSkills,
          totalCategories: categorizedSkills.length,
          totalSkills: categorizedSkills.reduce((sum, cat) => sum + cat.skillCount, 0)
        };
      }

      // Generate summary
      const allSkillNames = skillsData.flatMap(section => 
        section.skills.map(skill => skill.name)
      );

      const summary = {
        totalFound: allSkillNames.length,
        categories: skillsData.map(section => section.sectionName),
        topSkills: this.getTopSkills(allSkillNames),
        filters: {
          category: category || null,
          search: search || null,
          proficiencyLevel: proficiencyLevel || null
        },
        proficiencyDistribution: this.getProficiencyDistribution(skillsData)
      };

      return this.createSuccessResult({
        ...results,
        summary
      });

    } catch (error) {
      return this.createErrorResult(
        'DATA_ACCESS_ERROR',
        `Failed to retrieve skills: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          suggestions: [
            'Check if the category name is valid',
            'Try with different search terms',
            'Verify proficiency level parameter'
          ]
        }
      );
    }
  }

  /**
   * Get skill aliases and alternative names
   */
  private getSkillAliases(skillName: string): string[] {
    const aliasMap: Record<string, string[]> = {
      'React': ['ReactJS', 'React.js'],
      'Nextjs': ['Next.js', 'NextJS'],
      'Nodejs': ['Node.js', 'NodeJS'],
      'Javascript': ['JS', 'ECMAScript'],
      'Typescript': ['TS'],
      'MongoDB': ['Mongo'],
      'MySql': ['MySQL', 'My SQL'],
      'FastAPI': ['Fast API'],
      'Spring Boot': ['SpringBoot'],
      'OpenAI': ['GPT', 'ChatGPT'],
      'Azure AI': ['Azure Cognitive Services'],
      'LLaMa AI': ['LLaMA', 'Meta AI'],
      'LangChain': ['Lang Chain'],
      'CI/CD': ['Continuous Integration', 'Continuous Deployment'],
      'GitHub Actions': ['Github Actions'],
      'API Gateway': ['APIM', 'API Management'],
      'Microsoft Azure': ['Azure', 'MS Azure'],
      'Azure DevOps': ['ADO', 'VSTS']
    };

    return aliasMap[skillName] || [];
  }

  /**
   * Infer proficiency level based on skill and context
   */
  private inferProficiencyLevel(skillName: string, _category: string): string {
    // Expert level skills (primary technologies)
    const expertSkills = [
      'React', 'Javascript', 'Typescript', 'Nodejs', 'Python', 'Java',
      'FastAPI', 'Spring Boot', 'MongoDB', 'MySql', 'Git', 'GitHub'
    ];

    // Advanced level skills (frequently used)
    const advancedSkills = [
      'Nextjs', 'Express', 'Tailwindcss', 'Docker', 'CI/CD', 'Azure',
      'OpenAI', 'LangChain', 'Postman', 'Jira'
    ];

    // Intermediate level skills
    const intermediateSkills = [
      'Flutter', 'Dart', 'PHP', 'Firebase', 'Kubernetes', 'Jenkins',
      'Azure AI', 'LLaMa AI', 'Swagger', 'Vercel'
    ];

    if (expertSkills.includes(skillName)) return 'expert';
    if (advancedSkills.includes(skillName)) return 'advanced';
    if (intermediateSkills.includes(skillName)) return 'intermediate';
    
    return 'intermediate'; // Default
  }

  /**
   * Get related skills for a given skill
   */
  private getRelatedSkills(skillName: string): string[] {
    const relatedMap: Record<string, string[]> = {
      'React': ['Nextjs', 'Javascript', 'Typescript', 'Tailwindcss'],
      'Nextjs': ['React', 'Nodejs', 'Vercel'],
      'Nodejs': ['Express', 'Javascript', 'MongoDB', 'FastAPI'],
      'Python': ['FastAPI', 'LangChain', 'OpenAI', 'Azure AI'],
      'Java': ['Spring Boot', 'MySql', 'Jenkins'],
      'Docker': ['Kubernetes', 'CI/CD', 'Azure'],
      'MongoDB': ['Nodejs', 'Express', 'Mongoose'],
      'OpenAI': ['LangChain', 'Python', 'Azure AI'],
      'Azure': ['Azure DevOps', 'Azure AI', 'Docker'],
      'Git': ['GitHub', 'GitHub Actions', 'CI/CD']
    };

    return relatedMap[skillName] || [];
  }

  /**
   * Get top skills based on usage and importance
   */
  private getTopSkills(skills: string[]): string[] {
    const topSkillsOrder = [
      'React', 'Javascript', 'Typescript', 'Nodejs', 'Python', 'Java',
      'Nextjs', 'FastAPI', 'Spring Boot', 'MongoDB', 'Docker', 'Azure'
    ];

    return topSkillsOrder.filter(skill => skills.includes(skill)).slice(0, 8);
  }

  /**
   * Get proficiency distribution across all skills
   */
  private getProficiencyDistribution(skillsData: typeof SKILLS_DATA): Record<string, number> {
    const distribution = { expert: 0, advanced: 0, intermediate: 0, beginner: 0 };

    skillsData.forEach(section => {
      section.skills.forEach(skill => {
        const level = this.inferProficiencyLevel(skill.name, section.sectionName);
        distribution[level as keyof typeof distribution]++;
      });
    });

    return distribution;
  }
}