import { type ExperienceShowcaseListItemProps } from "@/components/experience/experience-showcase-list-item";

export const EXPERIENCE: ExperienceShowcaseListItemProps[] = [
  {
    title: "Software Development Intern",
    organisation: {
      name: "Central Electricity Authority, Government of India",
      href: "https://cea.nic.in/?lang=en",
    },
    date: "May 2023 - July 2023",
    description:
      "At the CEA, I got to work on several impactful projects. My main task was to improve a national renewable energy dashboard that monitors over 150 power stations. By integrating it with the National Power Portal using Java, I successfully boosted its data accuracy by 30%. I also took the lead on building a secure file management system from scratch using PHP and MySQL. I implemented role-based access control and optimized it to handle over 5,000 files, making retrieval 25% faster. To improve office efficiency, I built a full-stack MERN conference room booking system, which was a big hit—it cut booking times by 60% and reduced scheduling errors by 40%.",
  },
  {
    title: "Software Development Engineer (SDE) Intern",
    organisation: {
      name: "Xansr Software Private Ltd.",
      href: "https://www.xansrmedia.com/",
    },
    date: "June 2024 - Jan 2025",
    description:
      "My time at Xansr was a deep dive into AI and scalable back-end systems. I was responsible for developing microservices with Node.js and FastAPI, where I applied Test-Driven Development to hit 100% test coverage and increase API performance by 40%. To streamline our workflow, I designed and implemented CI/CD pipelines using Docker and GitHub Actions, which cut our deployment time by 42%. I'm especially proud of two AI projects I engineered: 'Fantasy GPT,' a chatbot for sports fans that I built to 98% accuracy using RAG and LangGraph, and 'AIKO,' a media assistant that generates personalized sports highlights with real-time commentary. I also built the data foundation for these services, creating scalable ETL pipelines with MSSQL and Azure that ensured 100% data accuracy.",
  },
  {
    title: "AI Automation Intern",
    organisation: {
      name: "Armorcode Inc.",
      href: "https://www.armorcode.com/",
    },
    date: "Jan 2025 - Nov 2025",
    description:
      "At Armorcode, I focused on backend development for the core platform agent using Java and Spring Boot. I designed and implemented new APIs, refined AI prompts for security workflows, and managed the AWS S3 vector knowledge base. I spearheaded AI-driven code-to-documentation automation using CrewAI and MCP servers, generating documentation for 250+ security integrations and reducing update latency by 99% (72h to 45m). I also established a universal LLM access layer by building an OpenAI-compatible proxy API supporting Gemini and Claude, deployed LiteLLM for monitoring 15+ AI APIs with centralized cost management.",
  },
  {
    title: "Associate Engineer",
    organisation: {
      name: "Armorcode Inc.",
      href: "https://www.armorcode.com/",
    },
    date: "Dec 2025 - Present",
    description:
      "Promoted to Associate Engineer, I now architect enterprise-scale GenAI platforms serving 200+ enterprise customers. I designed a GraphRAG platform using Neo4j and PGVector unifying 500,000+ data entities from 5+ systems (Jira, Qmetry, Zendesk), achieving 40% improved retrieval accuracy. I orchestrated advanced GraphRAG and LightRAG ETL pipelines, reducing LLM data indexing costs by 50% and saving $15,000+ annually. I enhanced the core Armorcode platform backend (Java, Spring Boot), deploying 10+ REST APIs serving 5,000+ daily requests with 99.8% uptime. I devised end-to-end automation suites for enterprise operations (Zendesk support, QA triage, HR screening, marketing AI images) using n8n, Java microservices, and Python scripts, eliminating 200+ manual hours monthly.",
  },
];
