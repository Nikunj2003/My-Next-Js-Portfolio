import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  ExternalLink,
  Award,
  GraduationCap,
  Briefcase,
  Code,
  User,
} from "lucide-react";

interface ResumeDisplayProps {
  className?: string;
}

// Smooth scroll helper function
const smoothScrollToSection = (href: string, e: React.MouseEvent) => {
  const url = new URL(href, window.location.origin);
  const hash = url.hash;

  if (hash && url.pathname === window.location.pathname) {
    // Same page, scroll to section
    e.preventDefault();
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else if (hash && url.pathname !== window.location.pathname) {
    // Different page, navigate normally (browser will handle scrolling to hash)
    return;
  }
};

export default function ResumeDisplay({ className = "" }: ResumeDisplayProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const backgroundColor =
    mounted && resolvedTheme === "dark"
      ? "bg-black/20 backdrop-blur-lg"
      : "bg-white/20 backdrop-blur-lg";

  const sectionBackgroundColor =
    mounted && resolvedTheme === "dark"
      ? "bg-black/10 backdrop-blur-sm"
      : "bg-white/10 backdrop-blur-sm";

  if (!mounted) return null;

  // Subtle animation variants - only animate once on load
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={`${backgroundColor} mx-auto max-w-6xl rounded-2xl border border-accent/20 p-4 shadow-xl shadow-accent/10 sm:p-6 md:p-8 lg:p-10 ${className}`}
    >
      {/* Content Container with Stagger Animation */}
      <motion.div
        variants={staggerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="mb-8 border-b border-accent/20 pb-6 text-center"
        >
          <h1 className="mb-2 bg-accent bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
            Nikunj Khitha
          </h1>
          <p className="mb-4 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Software Development Engineer
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm sm:gap-4 md:text-base">
            <a
              href="mailto:njkhitha2003@gmail.com"
              className="flex items-center gap-2 text-accent underline-offset-4 hover:underline"
              aria-label="Email Nikunj"
            >
              <Mail size={16} />
              <span className="truncate">njkhitha2003@gmail.com</span>
            </a>
            <a
              href="tel:+919540234616"
              className="flex items-center gap-2 text-accent underline-offset-4 hover:underline"
              aria-label="Call Nikunj"
            >
              <Phone size={16} />
              <span>+91 9540234616</span>
            </a>
            <a
              href="https://nikunj.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent underline-offset-4 hover:underline"
              aria-label="Visit website"
            >
              <Globe size={16} />
              <span className="truncate">nikunj.tech</span>
            </a>
            <a
              href="https://github.com/Nikunj2003"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent underline-offset-4 hover:underline"
              aria-label="Visit GitHub profile"
            >
              <Github size={16} />
              <span className="truncate">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/nikunj-khitha/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent underline-offset-4 hover:underline"
              aria-label="Visit LinkedIn profile"
            >
              <Linkedin size={16} />
              <span className="truncate">LinkedIn</span>
            </a>
          </div>
        </motion.div>

        {/* Technical Skills Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <Code className="text-accent" size={32} />
            Technical Skills
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
            {[
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
            ].map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                variants={itemVariants}
                className={`${sectionBackgroundColor} rounded-xl border border-accent/10 p-4 md:p-5`}
              >
                <h3 className="mb-3 text-lg font-semibold text-accent">
                  {skillGroup.category}
                </h3>
                <div className="flex max-w-full flex-wrap gap-2">
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Professional Experience Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <Briefcase className="text-accent" size={32} />
            Professional Experience
          </h2>

          <div className="space-y-6">
            {[
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
            ].map((job, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${sectionBackgroundColor} rounded-xl border border-accent/10 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 md:p-8`}
              >
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/10">
                    <Briefcase className="text-accent" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="mb-1 text-xl font-bold text-foreground">
                          {job.company}
                        </h3>
                        <p className="mb-2 text-lg font-semibold text-accent">
                          {job.role}
                        </p>
                      </div>
                      <div className="flex flex-col text-sm text-muted-foreground lg:items-end">
                        <div className="mb-1 flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1">
                          <Calendar size={12} />
                          <span className="font-medium">{job.period}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {job.achievements.map((achievement, achievementIndex) => (
                    <li
                      key={achievementIndex}
                      className="leading-relaxed text-muted-foreground"
                    >
                      • {achievement}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <ExternalLink className="text-accent" size={32} />
            Featured Projects
          </h2>

          <div className="space-y-6">
            {[
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
            ].map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${sectionBackgroundColor} group cursor-pointer rounded-xl border border-accent/10 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 md:p-8`}
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/10">
                    <Code className="text-accent" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-accent transition-colors group-hover:text-accent-light">
                        {project.name}
                      </h3>
                      <ExternalLink
                        size={18}
                        className="mt-1 text-accent transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="rounded-md border border-accent/20 bg-accent/10 px-2 py-1 text-xs font-medium text-accent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <ul className="space-y-2">
                  {project.achievements.map((achievement, achievementIndex) => (
                    <li
                      key={achievementIndex}
                      className="leading-relaxed text-muted-foreground"
                    >
                      • {achievement}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Hackathons & Achievements */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <Award className="text-accent" size={32} />
            Hackathons & Achievements
          </h2>

          <div
            className={`${sectionBackgroundColor} rounded-xl border border-accent/10 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 md:p-8`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <Award className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold text-accent">
                    IBC2024
                  </h3>
                  <p className="text-sm font-medium italic text-muted-foreground">
                    IBC Convention Amsterdam
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
                <MapPin size={12} />
                <span>Amsterdam</span>
              </div>
            </div>

            <p className="mb-4 leading-relaxed text-muted-foreground">
              🚀 Showcased <strong className="text-accent">AIKO</strong> to{" "}
              <strong>500+ attendees</strong>, collaborating with industry
              giants including{" "}
              <strong className="text-accent">
                Verizon, AMD, HP, and Al Jazeera
              </strong>{" "}
              at a leading international media technology event.
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {[
                "Media Tech",
                "AI Innovation",
                "International Showcase",
                "Industry Collaboration",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-accent">
              <Calendar size={14} />
              <span className="font-medium">
                September 2024 | Amsterdam, Netherlands
              </span>
            </div>
          </div>
        </motion.section>

        {/* Education */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <GraduationCap className="text-accent" size={32} />
            Education
          </h2>

          <div
            className={`${sectionBackgroundColor} rounded-xl border border-accent/10 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 md:p-8`}
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
                <GraduationCap className="text-accent" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  The NorthCap University
                </h3>
                <p className="mb-2 text-lg font-semibold text-accent">
                  B.Tech CSE in Full Stack Development
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="font-medium">CGPA:</span>
                    <span className="font-bold text-accent">8.16</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={14} />
                    <span>2021 – 2025</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin size={14} />
                    <span>Gurugram, India</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Computer Science",
                "Full Stack Development",
                "Software Engineering",
                "Data Structures",
                "Algorithms",
              ].map((subject) => (
                <span
                  key={subject}
                  className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Navigation Links */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <ExternalLink className="text-accent" size={32} />
            Explore More
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/projects",
                icon: <Code size={20} />,
                label: "Projects",
                description: "View my latest work",
              },
              {
                href: "/about",
                icon: <User size={20} />,
                label: "About Me",
                description: "Learn more about me",
              },
              {
                href: "/#skills",
                icon: <Award size={20} />,
                label: "Skills",
                description: "Technical expertise",
              },
              {
                href: "/about#experience",
                icon: <Briefcase size={20} />,
                label: "Experience",
                description: "Professional journey",
              },
            ].map((link, index) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={(e) => smoothScrollToSection(link.href, e)}
                  className={`${sectionBackgroundColor} group block rounded-xl border border-accent/10 p-4 transition-all duration-300 hover:scale-105 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">
                        {link.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
