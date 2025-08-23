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
import { getResumeData } from "@/data/resume";

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

  // pull data once (pure, static)
  const {
    technicalSkillsGroups,
    experience,
    featuredProjects,
    hackathons,
    education,
    exploreLinks,
  } = getResumeData();

  const renderExploreIcon = (iconName: string) => {
    switch (iconName) {
      case "code":
        return <Code size={20} />;
      case "user":
        return <User size={20} />;
      case "award":
        return <Award size={20} />;
      case "briefcase":
        return <Briefcase size={20} />;
      default:
        return <ExternalLink size={20} />;
    }
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
            {technicalSkillsGroups.map((skillGroup) => (
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
            {experience.map((job, index) => (
              <motion.div
                key={job.company + index}
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
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.name + index}
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

          {hackathons.map((h) => (
            <div
              key={h.title}
              className={`${sectionBackgroundColor} rounded-xl border border-accent/10 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 md:p-8`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <Award className="text-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-accent">
                      {h.title}
                    </h3>
                    <p className="text-sm font-medium italic text-muted-foreground">
                      {h.event}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">
                  <MapPin size={12} />
                  <span>{h.location.split(",")[0]}</span>
                </div>
              </div>

              <p className="mb-4 leading-relaxed text-muted-foreground">
                {h.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {h.tags.map((tag) => (
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
                <span className="font-medium">{h.date}</span>
              </div>
            </div>
          ))}
        </motion.section>

        {/* Education */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <GraduationCap className="text-accent" size={32} />
            Education
          </h2>

          {education.map((edu) => (
            <div
              key={edu.institution}
              className={`${sectionBackgroundColor} rounded-xl border border-accent/10 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 md:p-8`}
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10">
                  <GraduationCap className="text-accent" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-foreground">
                    {edu.institution}
                  </h3>
                  <p className="mb-2 text-lg font-semibold text-accent">
                    {edu.program}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="font-medium">CGPA:</span>
                      <span className="font-bold text-accent">{edu.cgpa}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar size={14} />
                      <span>{edu.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin size={14} />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {edu.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.section>

        {/* Navigation Links */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-accent md:text-3xl">
            <ExternalLink className="text-accent" size={32} />
            Explore More
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {exploreLinks.map((link) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={(e) => smoothScrollToSection(link.href, e)}
                  className={`${sectionBackgroundColor} group block rounded-xl border border-accent/10 p-4 transition-all duration-300 hover:scale-105 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                      {renderExploreIcon(link.iconName)}
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
