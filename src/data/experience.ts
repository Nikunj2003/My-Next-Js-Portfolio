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
    title: "Automation Intern",
    organisation: {
      name: "Armorcode Inc.",
      href: "https://www.armorcode.com/",
    },
    date: "Jan 2025 - Aug 2025",
    description:
      "At Armorcode, I'm focused on building next-generation testing and automation solutions. I co-developed a powerful Spring Boot test framework with Playwright and TestNG that runs dynamic, parallel tests. I deployed Report Portal on AWS using Docker and even built custom plugins for it with Java and React. A highlight for me was building a CrewAI agent with AWS Bedrock to automatically query and visualize our test data. I also won an internal AI challenge by creating a system that automates documentation for over 250 tools, slashing update times from 72 hours to just 45 minutes. To improve our test stability, I implemented an AI-based auto-heal feature that cut UI test flakiness by 99% and built n8n pipelines to fully automate our GitHub PR reviews.",
  },
];
