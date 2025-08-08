import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, Globe, Github, Linkedin, MapPin, Calendar, ExternalLink, Award, GraduationCap, Briefcase, Code, User } from "lucide-react";

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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const backgroundColor = mounted && resolvedTheme === "dark"
    ? "bg-black/20 backdrop-blur-lg"
    : "bg-white/20 backdrop-blur-lg";

  const sectionBackgroundColor = mounted && resolvedTheme === "dark"
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
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={`${backgroundColor} border border-accent/20 rounded-2xl shadow-xl shadow-accent/10 p-6 md:p-8 lg:p-10 max-w-5xl mx-auto ${className}`}
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
          className="text-center mb-8 pb-6 border-b border-accent/20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-accent bg-clip-text text-transparent mb-2">
            Nikunj Khitha
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Software Development Engineer
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2 text-accent">
              <Mail size={16} />
              <span>njkhitha2003@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Phone size={16} />
              <span>+91 9540234616</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Globe size={16} />
              <span>nikunj.tech</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Github size={16} />
              <span>Nikunj2003</span>
            </div>
          </div>
        </motion.div>

        {/* Technical Skills Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6 flex items-center gap-3">
            <Code className="text-accent" size={32} />
            Technical Skills
          </h2>
          
          <div className="grid gap-4 md:gap-6">
            {[
              {
                category: "Languages & Databases",
                skills: ["TypeScript", "Python", "Java", "PHP", "JavaScript", "Dart", "PostgreSQL", "MongoDB", "Firebase", "Elasticsearch"]
              },
              {
                category: "AI/ML",
                skills: ["Bedrock AI", "Azure AI", "Gemini AI", "Prompt Engineering", "Unsloth", "Agentic AI", "LangChain", "MCP", "Claude", "Crew AI"]
              },
              {
                category: "Full Stack Development",
                skills: ["ReactJS", "NodeJs", "NextJs", "FastAPI", "Spring Boot", "Flutter", "Apache Kafka", "Express", "Prisma", "RabbitMQ", "OkHttp"]
              },
              {
                category: "DevOps",
                skills: ["Azure", "AWS", "Google Cloud", "CI/CD", "Docker", "GitHub Actions", "Nginx", "Traefik", "Kubernetes", "Jenkins", "Grafana", "Dozzel"]
              },
              {
                category: "Testing Automation",
                skills: ["Selenium", "Rest Assured", "Jest", "PyTest", "Deepeval", "Junit", "Test NG", "PlayWright", "Cucumber", "JMeter"]
              },
              {
                category: "Tools",
                skills: ["Git", "GitHub", "Hugging Face", "OpenWeb UI", "Vercel", "Swagger", "Auth0", "Postman", "Allure", "Report Portal", "AgentOsp", "n8n"]
              }
            ].map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                variants={itemVariants}
                className={`${sectionBackgroundColor} rounded-xl p-4 md:p-5 border border-accent/10`}
              >
                <h3 className="font-semibold text-lg text-accent mb-3">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium border border-accent/20 hover:bg-accent/20 transition-colors"
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
          <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6 flex items-center gap-3">
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
                  "Developed auto test categorization and test case discovery features, alongside implementing automatic first and second-level GitHub PR reviews using n8n automation pipelines."
                ]
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
                  "Designed and developed scalable ETL pipeline APIs using MSSQL Database and SQLAlchemy, leveraging Azure Logic Apps to automate data ingestion, resulting in enhanced scalability and 100% data accuracy."
                ]
              },
              {
                company: "Central Electricity Authority, Government of India",
                role: "Software Development Intern",
                period: "May 2023 – Jul 2023",
                location: "New Delhi, India",
                achievements: [
                  "Enhanced data accuracy by 30% on a Renewable Dashboard monitoring 150+ power stations, integrating with the National Power Portal using Java.",
                  "Spearheaded the development of a File Management System using PHP and MySQL, implementing Role-Based Access Control (RBAC) to secure access. Optimized storage for over 5,000 files, reducing retrieval time by 25%.",
                  "Built a MERN based Conference Room Booking System, cutting booking time by 60% and reducing errors by 40% across 10+ rooms, significantly improving employee efficiency."
                ]
              }
            ].map((job, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${sectionBackgroundColor} rounded-xl p-6 md:p-8 border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="text-accent" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{job.company}</h3>
                        <p className="text-lg font-semibold text-accent mb-2">{job.role}</p>
                      </div>
                      <div className="flex flex-col lg:items-end text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full mb-1">
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
                    <li key={achievementIndex} className="text-muted-foreground leading-relaxed">
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
          <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6 flex items-center gap-3">
            <ExternalLink className="text-accent" size={32} />
            Featured Projects
          </h2>
          
          <div className="space-y-6">
            {[
              {
                name: "LLaMa-MCP-Streamlit",
                technologies: ["Python", "MCP", "LLaMa", "Streamlit", "Nvidia NIM", "Ollama", "Azure Open AI", "Open AI"],
                achievements: [
                  "Developed a full-stack AI application using Python and Streamlit, showcasing real-world integration of Large Language Models (LLMs) via the Model Control Protocol (MCP); achieved 40+ stars and 10+ forks on GitHub.",
                  "Engineered a client to connect the AI model with external tools, creating a practical use case for the open-source MCP standard.",
                  "Achieved industry recognition by being featured on the official MCP server directory (mcp.so) and the PulseMCP community hub for innovation and effective implementation, earning over 40 GitHub stars and 10 forks."
                ]
              },
              {
                name: "AI-Driven Jira Reporter (ADJR)",
                technologies: ["Node JS", "Fast API", "Nvidia NIM", "Ollama", "Azure Open AI", "Open AI", "Jira API"],
                achievements: [
                  "Developed & integrated 2 APIs in a Microservice for automating daily scrum report generation from Jira, enhancing team efficiency by 30% through AI-driven insights & automated scheduling with Dockerized deployment."
                ]
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${sectionBackgroundColor} rounded-xl p-6 md:p-8 border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group cursor-pointer`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                    <Code className="text-accent" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-accent group-hover:text-accent-light transition-colors">{project.name}</h3>
                      <ExternalLink size={18} className="text-accent mt-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-accent/10 text-accent px-2 py-1 rounded-md text-xs font-medium border border-accent/20">
                      {tech}
                    </span>
                  ))}
                </div>
                <ul className="space-y-2">
                  {project.achievements.map((achievement, achievementIndex) => (
                    <li key={achievementIndex} className="text-muted-foreground leading-relaxed">
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
          <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6 flex items-center gap-3">
            <Award className="text-accent" size={32} />
            Hackathons & Achievements
          </h2>
          
          <div className={`${sectionBackgroundColor} rounded-xl p-6 md:p-8 border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Award className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-accent mb-1">IBC2024</h3>
                  <p className="text-sm font-medium text-muted-foreground italic">IBC Convention Amsterdam</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-accent bg-accent/10 px-3 py-1 rounded-full">
                <MapPin size={12} />
                <span>Amsterdam</span>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-4">
              🚀 Showcased <strong className="text-accent">AIKO</strong> to <strong>500+ attendees</strong>, collaborating with industry giants including <strong className="text-accent">Verizon, AMD, HP, and Al Jazeera</strong> at a leading international media technology event.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {["Media Tech", "AI Innovation", "International Showcase", "Industry Collaboration"].map((tag) => (
                <span key={tag} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium border border-accent/20">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-accent">
              <Calendar size={14} />
              <span className="font-medium">September 2024 | Amsterdam, Netherlands</span>
            </div>
          </div>
        </motion.section>

        {/* Education */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6 flex items-center gap-3">
            <GraduationCap className="text-accent" size={32} />
            Education
          </h2>
          
          <div className={`${sectionBackgroundColor} rounded-xl p-6 md:p-8 border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="text-accent" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">The NorthCap University</h3>
                <p className="text-lg font-semibold text-accent mb-2">B.Tech CSE in Full Stack Development</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="font-medium">CGPA:</span>
                    <span className="text-accent font-bold">8.16</span>
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
              {["Computer Science", "Full Stack Development", "Software Engineering", "Data Structures", "Algorithms"].map((subject) => (
                <span key={subject} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium border border-accent/20">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Navigation Links */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-accent mb-6 flex items-center gap-3">
            <ExternalLink className="text-accent" size={32} />
            Explore More
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                href: "/projects",
                icon: <Code size={20} />,
                label: "Projects",
                description: "View my latest work"
              },
              {
                href: "/about",
                icon: <User size={20} />,
                label: "About Me",
                description: "Learn more about me"
              },
              {
                href: "/#skills",
                icon: <Award size={20} />,
                label: "Skills",
                description: "Technical expertise"
              },
              {
                href: "/about#experience",
                icon: <Briefcase size={20} />,
                label: "Experience",
                description: "Professional journey"
              }
            ].map((link, index) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link 
                  href={link.href}
                  onClick={(e) => smoothScrollToSection(link.href, e)}
                  className={`${sectionBackgroundColor} rounded-xl p-4 border border-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:scale-105 group block`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
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
