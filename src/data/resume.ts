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
    category: "Languages & Databases",
    skills: [
      "TypeScript",
      "Python",
      "Java",
      "PHP",
      "JavaScript",
      "Dart",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Elasticsearch",
    ],
  },
  {
    category: "AI/ML",
    skills: [
      "Bedrock AI",
      "Azure AI",
      "Gemini AI",
      "Prompt Engineering",
      "Unsloth",
      "Agentic AI",
      "LangChain",
      "MCP",
      "Claude",
      "Crew AI",
    ],
  },
  {
    category: "Full Stack Development",
    skills: [
      "ReactJS",
      "NodeJs",
      "NextJs",
      "FastAPI",
      "Spring Boot",
      "Flutter",
      "Apache Kafka",
      "Express",
      "Prisma",
      "RabbitMQ",
      "OkHttp",
    ],
  },
  {
    category: "DevOps",
    skills: [
      "Azure",
      "AWS",
      "Google Cloud",
      "CI/CD",
      "Docker",
      "GitHub Actions",
      "Nginx",
      "Traefik",
      "Kubernetes",
      "Jenkins",
      "Grafana",
      "Dozzel",
    ],
  },
  {
    category: "Testing Automation",
    skills: [
      "Selenium",
      "Rest Assured",
      "Jest",
      "PyTest",
      "Deepeval",
      "Junit",
      "Test NG",
      "PlayWright",
      "Cucumber",
      "JMeter",
    ],
  },
  {
    category: "Tools",
    skills: [
      "Git",
      "GitHub",
      "Hugging Face",
      "OpenWeb UI",
      "Vercel",
      "Swagger",
      "Auth0",
      "Postman",
      "Allure",
      "Report Portal",
      "AgentOsp",
      "n8n",
    ],
  },
];

const experience: ExperienceItem[] = [
  {
    company: "Armorcode Inc.",
    role: "Automation Intern",
    period: "Jan 2025 – present",
    location: "Remote",
    achievements: [
      "Co-developed a Spring Boot test framework using Playwright, TestNG (with Factory and Data Providers), MongoDB, and PostgreSQL to enable dynamic, parallel, multi-threaded test execution and runtime test data management/cleanup.",
      "Deployed Report Portal on AWS EC2 using Docker Compose and developed custom plugins (Java Spring Boot, ReactJS); built a CrewAI agent with Bedrock (Claude) to query Report Portal APIs and visualize test data using Mermaid.",
      "Completed internal AI challenge: Automated documentation for 250+ security tool integrations using CrewAI, AWS Bedrock, and MCP; cut update latency from 72h to 45m, achieved 98.6% accuracy, and ensured audit trails with PR-based Confluence publishing.",
      "Implemented AI Prompt-based locator auto-heal, reducing UI test case flakiness by 99% and decreasing false alarms in automation reports.",
      "Developed auto test categorization and test case discovery features, alongside implementing automatic first and second-level GitHub PR reviews using n8n automation pipelines.",
    ],
  },
  {
    company: "Xansr Software Private Ltd.",
    role: "SDE Intern",
    period: "Jun 2024 – Jan 2025",
    location: "Remote",
    achievements: [
      "Developed microservices using Node.js (TypeScript) and FastAPI, achieving 100% test coverage via TDD and improving API performance by 40%.",
      "Designed CI/CD pipelines with Docker and GitHub Actions, reducing deployment time by 42% and streamlining workflows.",
      "Built Fantasy GPT, an SQL RAG-based chatbot leveraging LangGraph, model fine-tuning, and a multi-step reasoning agent, to achieve 98% accuracy in answering Fantasy sports-related questions.",
      "Engineered AIKO, a personalized sports media assistant, delivering 96.67% accurate, AI-generated highlights with real-time commentary and user interactions, built on a comprehensive microservices architecture.",
      "Designed and developed scalable ETL pipeline APIs using MSSQL Database and SQLAlchemy, leveraging Azure Logic Apps to automate data ingestion, resulting in enhanced scalability and 100% data accuracy.",
    ],
  },
  {
    company: "Central Electricity Authority, Government of India",
    role: "Software Development Intern",
    period: "May 2023 – Jul 2023",
    location: "New Delhi, India",
    achievements: [
      "Enhanced data accuracy by 30% on a Renewable Dashboard monitoring 150+ power stations, integrating with the National Power Portal using Java.",
      "Spearheaded the development of a File Management System using PHP and MySQL, implementing Role-Based Access Control (RBAC) to secure access. Optimized storage for over 5,000 files, reducing retrieval time by 25%.",
      "Built a MERN based Conference Room Booking System, cutting booking time by 60% and reducing errors by 40% across 10+ rooms, significantly improving employee efficiency.",
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
      "Ollama",
      "Azure Open AI",
      "Open AI",
    ],
    achievements: [
      "Developed a full-stack AI application using Python and Streamlit, showcasing real-world integration of Large Language Models (LLMs) via the Model Control Protocol (MCP); achieved 40+ stars and 10+ forks on GitHub.",
      "Engineered a client to connect the AI model with external tools, creating a practical use case for the open-source MCP standard.",
      "Achieved industry recognition by being featured on the official MCP server directory (mcp.so) and the PulseMCP community hub for innovation and effective implementation, earning over 40 GitHub stars and 10 forks.",
    ],
  },
  {
    name: "AI-Driven Jira Reporter (ADJR)",
    technologies: [
      "Node JS",
      "Fast API",
      "Nvidia NIM",
      "Ollama",
      "Azure Open AI",
      "Open AI",
      "Jira API",
    ],
    achievements: [
      "Developed & integrated 2 APIs in a Microservice for automating daily scrum report generation from Jira, enhancing team efficiency by 30% through AI-driven insights & automated scheduling with Dockerized deployment.",
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
    duration: "2021 – 2025",
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
