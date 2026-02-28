// Centralized resume data extracted from the ResumeDisplay component.
// This keeps the component lean and enables reuse (e.g. API routes, sitemap, JSON download, etc.).

// No React component usage here to keep this file usable in non-React contexts (e.g. server).

// Types
export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  achievements: string[];
}

export interface ProjectItem {
  name: string;
  technologies: string[];
  achievements: string[];
}

export interface HackathonAchievement {
  title: string;
  event: string;
  location: string;
  description: string;
  tags: string[];
  date: string; // human readable
}

export interface EducationItem {
  institution: string;
  program: string;
  cgpa: string;
  duration: string;
  location: string;
  subjects: string[];
}

export type ExploreLinkIcon = "code" | "user" | "award" | "briefcase";
export interface ExploreLink {
  href: string;
  iconName: ExploreLinkIcon;
  label: string;
  description: string;
}

export interface ResumeData {
  technicalSkillsGroups: SkillGroup[];
  experience: ExperienceItem[];
  featuredProjects: ProjectItem[];
  hackathons: HackathonAchievement[];
  education: EducationItem[];
  exploreLinks: ExploreLink[];
}

// Data
const technicalSkillsGroups: SkillGroup[] = [
  {
    category: "Generative AI & ML",
    skills: [
      "RAG",
      "GraphRAG",
      "LightRAG",
      "Agentic AI",
      "CrewAI",
      "LangGraph",
      "MCP",
      "Prompt Engineering",
      "AWS Bedrock",
      "Gemini AI",
      "Claude",
      "Azure AI",
      "LangChain",
    ],
  },
  {
    category: "Full Stack",
    skills: [
      "Java",
      "Spring Boot",
      "Python",
      "FastAPI",
      "TypeScript",
      "Node.js",
      "Next.js",
      "ReactJS",
      "Express",
      "Prisma",
      "Kafka",
      "RabbitMQ",
      "SQS",
    ],
  },
  {
    category: "Databases & Data",
    skills: [
      "Neo4j (Graph)",
      "PostgreSQL (SQL/Vector)",
      "SQLite",
      "AWS S3",
      "MongoDB",
      "Elasticsearch",
      "Firebase",
      "Elastic Cache",
    ],
  },
  {
    category: "DevOps & Infra",
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "GitHub Actions",
      "Nginx",
      "Grafana",
      "Jenkins",
      "Traefik",
      "Dokploy",
    ],
  },
  {
    category: "Dev Tools",
    skills: [
      "LiteLLM",
      "Claude Code",
      "Gemini CLI",
      "Windsurf",
      "OpenWeb UI",
      "Vercel",
      "Swagger",
      "Auth0",
      "Postman",
      "n8n",
    ],
  },
];

const experience: ExperienceItem[] = [
  {
    company: "Armorcode Inc.",
    role: "Associate Engineer",
    period: "Dec 2025 – Present",
    location: "Gurugram, India",
    achievements: [
      "Architected enterprise-scale GraphRAG platform leveraging Neo4j and PGVector to unify 500,000+ data entities from 5+ enterprise systems (Jira, Qmetry, Zendesk, security logs), enabling context-aware LLM responses with 40% improved retrieval accuracy.",
      "Orchestrated advanced GraphRAG and LightRAG ETL pipelines, reducing LLM data indexing costs by 50% through batch API integration and optimized vector embedding strategies, saving $15,000+ annually.",
      "Enhanced and maintained the backend for the core Armorcode platform agent (Java, Spring Boot), implementing new APIs, designing and refining prompts, and managing the AWS S3 vector knowledge base.",
      "Deployed and maintained 10+ REST APIs for Armorcode's core backend using Java 11+ and Spring Boot framework, serving 5,000+ daily requests across 20+ security integrations with 99.8% uptime.",
      "Enabled spec-driven AI-assisted development by connecting GraphRAG platform to LLM agents (Claude Code, Gemini CLI), creating 40+ repository-specific commands to provide real-time context for feature development.",
    ],
  },
  {
    company: "Armorcode Inc.",
    role: "AI Automation Intern",
    period: "Jan 2025 – Nov 2025",
    location: "Gurugram, India",
    achievements: [
      "Spearheaded AI-driven code-to-documentation automation using CrewAI and MCP servers, generating documentation for 250+ security integrations, reducing update latency by 99% (72h to 45m) and achieving 98.6% accuracy.",
      "Established universal LLM access layer by building OpenAI-compatible proxy API supporting Gemini, Claude via Claude Code and Gemini CLI, deployed LiteLLM for monitoring 15+ AI APIs with centralized cost management.",
      "Devised end-to-end automation suite for enterprise operations (Zendesk support, QA triage, HR screening, marketing AI images) using n8n, Java microservices, and Python scripts, eliminating 200+ manual hours monthly.",
      "Identified and resolved 30+ critical production bugs across core microservices and Gen AI platform, improving system stability and reducing customer-reported issues by 35%.",
    ],
  },
  {
    company: "Xansr Software Private Ltd.",
    role: "SDE Intern",
    period: "Jun 2024 – Jan 2025",
    location: "Remote",
    achievements: [
      "Constructed backend microservices for 'AIKO' (Sports Media Assistant), delivering 96.67% accurate AI-generated highlights with real-time commentary.",
      "Architected 'Fantasy GPT,' an SQL RAG-based chatbot using LangGraph and multi-step reasoning agents, achieving 98% query resolution accuracy.",
      "Optimized core Node.js/FastAPI microservices (100% TDD coverage), improving API performance by 40% and ensuring reliability via scalable Python/SQLAlchemy ETL pipelines.",
    ],
  },
  {
    company: "Central Electricity Authority, Government of India",
    role: "Software Development Intern",
    period: "May 2023 – Jul 2023",
    location: "New Delhi, India",
    achievements: [
      "Implemented a PHP/MySQL File Management System with RBAC, optimizing storage for 5,000+ files and reducing retrieval time by 25%.",
      "Built a MERN-based Conference Room Booking System, reducing booking errors by 40% across 10+ rooms.",
    ],
  },
];

const featuredProjects: ProjectItem[] = [
  {
    name: "LLaMa-MCP-Streamlit",
    technologies: [
      "Python",
      "MCP",
      "LLaMa",
      "Streamlit",
      "Nvidia NIM",
      "Azure OpenAI",
    ],
    achievements: [
      "Built a full-stack AI application using Python and Streamlit, showcasing real-world integration of Large Language Models (LLMs) via the Model Control Protocol (MCP); achieved 40+ stars and 10+ forks on GitHub.",
      "Achieved industry recognition by being featured on the official MCP server directory (mcp.so) and the PulseMCP community hub for innovation and effective implementation.",
    ],
  },
  {
    name: "CodeNex Images",
    technologies: [
      "React JS",
      "Vite",
      "Node JS",
      "Zod",
      "Auth0",
      "Google Gemini API",
      "MongoDB",
      "Swagger",
    ],
    achievements: [
      "Engineered a production-ready AI image generation SaaS platform using React, TypeScript, and Node.js, integrating Google Gemini for high-fidelity generative capabilities.",
      "Implemented secure Auth0 authentication and MongoDB persistence, establishing CI/CD pipelines via GitHub Actions to ensure scalable architecture with robust rate limiting and comprehensive API documentation.",
    ],
  },
];

const hackathons: HackathonAchievement[] = [
  {
    title: "IBC2024",
    event: "IBC Convention Amsterdam",
    location: "Amsterdam, Netherlands",
    description:
      "🚀 Showcased AIKO to 500+ attendees, collaborating with industry giants including Verizon, AMD, HP, and Al Jazeera at a leading international media technology event.",
    tags: [
      "Media Tech",
      "AI Innovation",
      "International Showcase",
      "Industry Collaboration",
    ],
    date: "September 2024 | Amsterdam, Netherlands",
  },
];

const education: EducationItem[] = [
  {
    institution: "The NorthCap University",
    program: "B.Tech CSE in Full Stack Development",
    cgpa: "8.16",
    duration: "Aug 2021 – Jun 2025",
    location: "Gurugram, India",
    subjects: [
      "Computer Science",
      "Full Stack Development",
      "Software Engineering",
      "Data Structures",
      "Algorithms",
    ],
  },
];

const exploreLinks: ExploreLink[] = [
  {
    href: "/projects",
    iconName: "code",
    label: "Projects",
    description: "View my latest work",
  },
  {
    href: "/about",
    iconName: "user",
    label: "About Me",
    description: "Learn more about me",
  },
  {
    href: "/#skills",
    iconName: "award",
    label: "Skills",
    description: "Technical expertise",
  },
  {
    href: "/about#experience",
    iconName: "briefcase",
    label: "Experience",
    description: "Professional journey",
  },
];

const resumeData: ResumeData = {
  technicalSkillsGroups,
  experience,
  featuredProjects,
  hackathons,
  education,
  exploreLinks,
};

export function getResumeData(): ResumeData {
  return resumeData;
}

export default resumeData;
