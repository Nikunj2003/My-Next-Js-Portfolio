// Portfolio data for AI responses
const PORTFOLIO_DATA = {
  personal: {
    name: "Nikunj Khitha",
    title: "Software Development Engineer",
    email: "njkhitha2003@gmail.com",
    linkedin: "https://www.linkedin.com/in/Nikunj-Khitha/",
    github: "https://github.com/Nikunj2003",
    website: "https://nikunj.tech"
  },
  
  experience: [
    {
      title: "Automation Intern",
      company: "Armorcode Inc.",
      duration: "Jan 2025 - Aug 2025",
      description: "Building next-generation testing and automation solutions with Spring Boot, Playwright, TestNG. Deployed Report Portal on AWS, built CrewAI agent with AWS Bedrock, won internal AI challenge by creating documentation automation system.",
      keyAchievements: [
        "Built Spring Boot test framework with Playwright and TestNG",
        "Won AI challenge - automated documentation for 250+ tools",
        "Reduced UI test flakiness by 99% with AI-based auto-heal",
        "Cut update times from 72 hours to 45 minutes"
      ]
    },
    {
      title: "Software Development Engineer (SDE) Intern",
      company: "Xansr Software Private Ltd.",
      duration: "June 2024 - Jan 2025",
      description: "Deep dive into AI and scalable back-end systems. Developed microservices with Node.js and FastAPI, implemented CI/CD pipelines, engineered Fantasy GPT and AIKO AI projects.",
      keyAchievements: [
        "100% test coverage with TDD, 40% API performance increase",
        "42% deployment time reduction with CI/CD pipelines",
        "Built Fantasy GPT with 98% accuracy using RAG and LangGraph",
        "Created AIKO media assistant for personalized sports highlights"
      ]
    },
    {
      title: "Software Development Intern",
      company: "Central Electricity Authority, Government of India",
      duration: "May 2023 - July 2023",
      description: "Improved national renewable energy dashboard monitoring 150+ power stations, built secure file management system, created MERN conference room booking system.",
      keyAchievements: [
        "30% boost in data accuracy for renewable energy dashboard",
        "25% faster file retrieval with optimized system handling 5,000+ files",
        "60% reduction in booking times, 40% fewer scheduling errors"
      ]
    }
  ],

  skills: {
    "Fullstack & Databases": ["React", "Next.js", "Node.js", "Express", "FastAPI", "Spring Boot", "Flutter", "MongoDB", "MySQL", "Firebase"],
    "AI/ML": ["OpenAI", "Azure AI", "Vercel AI SDK", "LLaMA AI", "Prompt Engineering", "LangChain"],
    "DevOps": ["CI/CD", "Docker", "GitHub Actions", "API Gateway", "Kubernetes", "Jenkins"],
    "Languages": ["JavaScript", "TypeScript", "Java", "Python", "PHP", "Dart"],
    "Cloud & Tools": ["Git", "GitHub", "Azure DevOps", "Jira", "Postman", "Swagger", "Vercel", "Microsoft Azure"]
  },

  projects: [
    {
      name: "EarthLink",
      category: "Enterprise",
      description: "American Internet service provider solution with React, Next.js, GraphQL, and microservices architecture.",
      technologies: ["React", "Next.js", "Styled Components", "SCSS", "GraphQL", "Microservices"]
    },
    {
      name: "Rapid Store",
      category: "E-commerce",
      description: "Electronics & gadgets e-commerce platform with Razorpay integration and authentication.",
      technologies: ["React", "Razorpay", "Context API", "Authentication"]
    },
    {
      name: "Rapid Fire",
      category: "Social Media",
      description: "Social media app for sharing moments and connecting with others.",
      technologies: ["React", "Redux Toolkit", "Dark Mode", "Real-time Features"]
    },
    {
      name: "Rapid UI",
      category: "Open Source",
      description: "Open Source CSS library with pre-defined styled classes and utilities for quick website creation.",
      technologies: ["CSS", "JavaScript", "Design System", "Component Library"]
    },
    {
      name: "Rapid TV",
      category: "Media Platform",
      description: "Video library for tech enthusiasts featuring gadget reviews, tech news, and market updates.",
      technologies: ["React", "Video API", "Content Management", "Responsive Design"]
    }
  ],

  blogs: [
    "Understand Debouncing and Throttling in JavaScript with examples",
    "How to create your own custom Hooks in React (extensive guide)",
    "10 Important productivity tools to make developer life easier",
    "map, filter, reduce functions in JavaScript made easy"
  ]
};

export class AIPortfolioService {
  private static instance: AIPortfolioService;

  static getInstance(): AIPortfolioService {
    if (!AIPortfolioService.instance) {
      AIPortfolioService.instance = new AIPortfolioService();
    }
    return AIPortfolioService.instance;
  }

  async generateResponse(userInput: string): Promise<string> {
    const lowerInput = userInput.toLowerCase();
    const tokens = lowerInput.split(/\s+/);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));

    // Greetings
    if (this.matchKeywords(tokens, ['hello', 'hi', 'hey', 'greetings'])) {
      return `Hello! 👋 I'm Nikunj's AI assistant. I can help you learn about his experience as a Software Development Engineer, his projects, skills, and guide you through this portfolio. What would you like to know?`;
    }

    // Experience queries
    if (this.matchKeywords(tokens, ['experience', 'work', 'job', 'career', 'internship'])) {
      const experiences = PORTFOLIO_DATA.experience.map(exp => 
        `**${exp.title}** at ${exp.company} (${exp.duration}): ${exp.description}`
      ).join('\n\n');
      
      return `Here's Nikunj's professional experience:\n\n${experiences}\n\nWould you like to know more about any specific role or achievement?`;
    }

    // Skills queries
    if (this.matchKeywords(tokens, ['skills', 'technologies', 'tech', 'programming', 'languages'])) {
      const skillCategories = Object.entries(PORTFOLIO_DATA.skills)
        .map(([category, skills]) => `**${category}**: ${skills.join(', ')}`)
        .join('\n\n');
      
      return `Nikunj has expertise in various technologies:\n\n${skillCategories}\n\nAny specific technology you'd like to know more about?`;
    }

    // Projects queries
    if (this.matchKeywords(tokens, ['projects', 'portfolio', 'built', 'created', 'developed'])) {
      const projectList = PORTFOLIO_DATA.projects.map(project => 
        `**${project.name}** (${project.category}): ${project.description}`
      ).join('\n\n');
      
      return `Here are some of Nikunj's key projects:\n\n${projectList}\n\nWould you like details about any specific project?`;
    }

    // AI/ML specific queries
    if (this.matchKeywords(tokens, ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'ml', 'gpt'])) {
      return `Nikunj has significant AI/ML experience! 🤖\n\n• **Fantasy GPT**: Sports chatbot with 98% accuracy using RAG and LangGraph\n• **AIKO**: Media assistant generating personalized sports highlights\n• **CrewAI Agent**: Built with AWS Bedrock for automated data querying\n• **Documentation AI**: Won internal challenge, automated docs for 250+ tools\n\nHe's skilled in OpenAI, Azure AI, LangChain, prompt engineering, and more!`;
    }

    // Contact queries
    if (this.matchKeywords(tokens, ['contact', 'email', 'reach', 'connect', 'linkedin'])) {
      return `You can reach Nikunj through:\n\n📧 **Email**: ${PORTFOLIO_DATA.personal.email}\n💼 **LinkedIn**: Connect with him professionally\n🐙 **GitHub**: Check out his code repositories\n📝 **Contact Form**: Use the contact form on this website\n\nHe's always open to discussing opportunities and collaborations!`;
    }

    // Navigation help
    if (this.matchKeywords(tokens, ['navigate', 'navigation', 'sections', 'pages', 'menu'])) {
      return `Here's how to navigate this portfolio:\n\n🏠 **Home**: Landing page with overview\n👨‍💻 **About**: Personal info and skills showcase\n🚀 **Projects**: Detailed project gallery\n📄 **Resume**: Downloadable CV with full details\n\nYou can use the navigation menu at the top or scroll through sections. What section interests you most?`;
    }

    // Resume/CV queries
    if (this.matchKeywords(tokens, ['resume', 'cv', 'download', 'pdf'])) {
      return `📄 You can view and download Nikunj's complete resume from the **Resume** section of this website. It includes:\n\n• Detailed work experience\n• Technical skills breakdown\n• Project descriptions\n• Educational background\n• Achievements and certifications\n\nThere's a download button available on the resume page for the PDF version!`;
    }

    // Specific company queries
    if (this.matchKeywords(tokens, ['armorcode', 'xansr', 'cea', 'government'])) {
      const company = tokens.find(token => ['armorcode', 'xansr', 'cea'].includes(token)) || 'company';
      const experience = PORTFOLIO_DATA.experience.find(exp => 
        exp.company.toLowerCase().includes(company) || 
        (company === 'cea' && exp.company.includes('Central Electricity'))
      );
      
      if (experience) {
        const achievements = experience.keyAchievements.map(achievement => `• ${achievement}`).join('\n');
        return `At **${experience.company}**, Nikunj worked as ${experience.title} (${experience.duration}):\n\n${experience.description}\n\n**Key Achievements:**\n${achievements}`;
      }
    }

    // Blog queries
    if (this.matchKeywords(tokens, ['blog', 'articles', 'writing', 'posts'])) {
      const blogList = PORTFOLIO_DATA.blogs.map((blog, index) => `${index + 1}. ${blog}`).join('\n');
      return `Nikunj has written several technical blogs:\n\n${blogList}\n\nThese cover JavaScript, React, performance optimization, and developer productivity. Great reads for fellow developers!`;
    }

    // Education queries
    if (this.matchKeywords(tokens, ['education', 'university', 'degree', 'study'])) {
      return `Based on Nikunj's impressive internships and technical skills, he has a strong educational foundation in Computer Science/Software Engineering. His progression from foundational programming to advanced AI/ML and cloud technologies demonstrates excellent academic preparation and continuous learning mindset.`;
    }

    // Achievements queries
    if (this.matchKeywords(tokens, ['achievements', 'accomplishments', 'awards', 'recognition'])) {
      return `🏆 **Key Achievements:**\n\n• Won internal AI challenge at Armorcode (reduced documentation time by 98%)\n• Built Fantasy GPT with 98% accuracy using advanced AI techniques\n• Improved renewable energy dashboard accuracy by 30% for government project\n• Achieved 100% test coverage with TDD practices\n• Reduced deployment time by 42% with optimized CI/CD pipelines\n• Cut UI test flakiness by 99% with AI-based solutions`;
    }

    // Default helpful response
    return `I'd be happy to help! I can provide information about:\n\n🔹 **Experience**: Nikunj's work at Armorcode, Xansr, and CEA\n🔹 **Skills**: Full-stack development, AI/ML, DevOps, and more\n🔹 **Projects**: EarthLink, Rapid Store, Fantasy GPT, AIKO, etc.\n🔹 **Contact**: How to reach Nikunj\n🔹 **Navigation**: How to explore this portfolio\n\nWhat specific aspect would you like to learn about?`;
  }

  private matchKeywords(tokens: string[], keywords: string[]): boolean {
    return keywords.some(keyword => 
      tokens.some(token => token.includes(keyword) || keyword.includes(token))
    );
  }
}

export const aiService = AIPortfolioService.getInstance();
