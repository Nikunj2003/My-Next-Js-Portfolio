// Knowledge base about Nikunj Khitha
const NIKUNJ_KNOWLEDGE = {
  personal: {
    name: "Nikunj Khitha",
    title: "Software Development Engineer",
    email: "njkhitha2003@gmail.com",
    github: "https://github.com/Nikunj2003",
    linkedin: "https://www.linkedin.com/in/Nikunj-Khitha/",
    website: "https://nikunj.tech",
    description:
      "AI Specialist and Full Stack Developer passionate about creating innovative web and mobile solutions",
  },
  experience: [
    {
      title: "Automation Intern",
      company: "Armorcode Inc.",
      duration: "Jan 2025 - Aug 2025",
      highlights: [
        "Co-developed a Spring Boot test framework with Playwright and TestNG for dynamic, parallel tests",
        "Deployed Report Portal on AWS using Docker and built custom plugins with Java and React",
        "Created a CrewAI agent with AWS Bedrock for automated test data querying and visualization",
        "Won internal AI challenge by creating system that automates documentation for 250+ tools",
        "Reduced documentation update times from 72 hours to 45 minutes",
        "Implemented AI-based auto-heal feature reducing UI test flakiness by 99%",
        "Built n8n pipelines for automated GitHub PR reviews",
      ],
    },
    {
      title: "Software Development Engineer (SDE) Intern",
      company: "Xansr Software Private Ltd.",
      duration: "June 2024 - Jan 2025",
      highlights: [
        "Developed microservices with Node.js and FastAPI using Test-Driven Development",
        "Achieved 100% test coverage and increased API performance by 40%",
        "Designed CI/CD pipelines using Docker and GitHub Actions",
        "Reduced deployment time by 42%",
        "Engineered 'Fantasy GPT' chatbot for sports fans with 98% accuracy using RAG and LangGraph",
        "Built 'AIKO' media assistant for personalized sports highlights with real-time commentary",
        "Created scalable ETL pipelines with MSSQL and Azure ensuring 100% data accuracy",
      ],
    },
    {
      title: "Software Development Intern",
      company: "Central Electricity Authority, Government of India",
      duration: "May 2023 - July 2023",
      highlights: [
        "Improved national renewable energy dashboard monitoring 150+ power stations",
        "Integrated with National Power Portal using Java, boosting data accuracy by 30%",
        "Built secure file management system with PHP and MySQL",
        "Implemented role-based access control handling 5,000+ files",
        "Optimized file retrieval speed by 25%",
        "Developed MERN conference room booking system",
        "Reduced booking times by 60% and scheduling errors by 40%",
      ],
    },
  ],
  skills: {
    fullstack: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "FastAPI",
      "Spring Boot",
      "Flutter",
      "TailwindCSS",
      "MongoDB",
      "MySQL",
      "Firebase",
      "Auth0",
    ],
    ai_ml: [
      "OpenAI",
      "Azure AI",
      "Vercel AI SDK",
      "LLaMA AI",
      "Prompt Engineering",
      "LangChain",
      "RAG",
      "LangGraph",
    ],
    devops: [
      "CI/CD",
      "Docker",
      "GitHub Actions",
      "API Gateway",
      "Kubernetes",
      "Jenkins",
    ],
    tools: [
      "Git",
      "GitHub",
      "Azure DevOps",
      "Jira",
      "Postman",
      "Swagger",
      "Vercel",
      "Microsoft Azure",
    ],
    languages: ["JavaScript", "TypeScript", "Java", "Dart", "PHP", "Python"],
  },
  projects: [
    {
      name: "EarthLink",
      category: "Enterprise",
      technologies: [
        "React",
        "Next.js",
        "Styled Components",
        "SCSS",
        "GraphQL",
        "Microservices",
      ],
      description: "American Internet service provider platform",
    },
    {
      name: "Rapid Store",
      category: "E-commerce",
      technologies: ["React", "Razorpay", "Context API", "Authentication"],
      description:
        "E-commerce platform for electronics and gadgets with payment integration",
    },
    {
      name: "Fantasy GPT",
      category: "AI/ML",
      technologies: ["RAG", "LangGraph", "Node.js", "AI"],
      description:
        "Sports chatbot with 98% accuracy for fantasy sports enthusiasts",
    },
    {
      name: "AIKO",
      category: "AI/ML",
      technologies: ["AI", "Real-time Processing", "Media"],
      description:
        "Media assistant generating personalized sports highlights with commentary",
    },
    {
      name: "Rapid UI",
      category: "Open Source",
      technologies: ["CSS", "JavaScript", "Design System"],
      description:
        "Open source CSS library with pre-defined styled classes and utilities",
    },
    {
      name: "Rapid Fire",
      category: "Social Media",
      technologies: ["React", "Redux Toolkit", "Dark Mode"],
      description: "Social media app for sharing moments and connecting",
    },
  ],
  achievements: [
    "Won internal AI challenge at Armorcode",
    "Reduced deployment time by 42% through CI/CD optimization",
    "Achieved 100% test coverage in microservices development",
    "Built AI systems with 98% accuracy",
    "Reduced UI test flakiness by 99% with AI-based auto-heal",
    "Improved national dashboard data accuracy by 30%",
    "Created system reducing documentation time from 72 hours to 45 minutes",
  ],
};

// Simple keyword matching for responses
export async function getAIResponse(userMessage: string): Promise<string> {
  const message = userMessage.toLowerCase();

  // Simulate AI processing delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Experience related queries
  if (
    message.includes("experience") ||
    message.includes("work") ||
    message.includes("job") ||
    message.includes("intern")
  ) {
    return `Nikunj has diverse experience across multiple companies:

🔧 **Current: Automation Intern at Armorcode Inc. (Jan 2025 - Aug 2025)**
- Building next-gen testing frameworks with Spring Boot, Playwright & TestNG
- Won internal AI challenge by automating documentation for 250+ tools
- Reduced documentation update time from 72 hours to 45 minutes
- Implemented AI auto-heal feature reducing test flakiness by 99%

💻 **SDE Intern at Xansr Software (June 2024 - Jan 2025)**
- Developed microservices with Node.js & FastAPI achieving 100% test coverage
- Built "Fantasy GPT" chatbot with 98% accuracy using RAG & LangGraph
- Created "AIKO" media assistant for personalized sports highlights
- Improved API performance by 40% and reduced deployment time by 42%

🏛️ **Software Intern at Central Electricity Authority (May 2023 - July 2023)**
- Enhanced national renewable energy dashboard monitoring 150+ power stations
- Built secure file management system handling 5,000+ files
- Developed MERN conference room booking system reducing booking times by 60%

Would you like to know more about any specific role or project?`;
  }

  // Skills related queries
  if (
    message.includes("skill") ||
    message.includes("technology") ||
    message.includes("tech") ||
    message.includes("language") ||
    message.includes("framework")
  ) {
    return `Nikunj has expertise across multiple technology stacks:

🌐 **Full Stack Development:**
React, Next.js, Node.js, Express, FastAPI, Spring Boot, Flutter, TailwindCSS, MongoDB, MySQL, Firebase

🤖 **AI/ML Specialization:**
OpenAI, Azure AI, LangChain, RAG, LangGraph, Prompt Engineering, LLaMA AI

🚀 **DevOps & Cloud:**
Docker, Kubernetes, CI/CD, GitHub Actions, Jenkins, AWS, Microsoft Azure

💻 **Programming Languages:**
JavaScript, TypeScript, Java, Python, PHP, Dart

🛠️ **Tools & Platforms:**
Git, GitHub, Jira, Postman, Swagger, Azure DevOps

He's particularly strong in AI development, having built chatbots with 98% accuracy and automated systems that significantly improve efficiency. What specific technology would you like to know more about?`;
  }

  // Projects related queries
  if (
    message.includes("project") ||
    message.includes("portfolio") ||
    message.includes("built") ||
    message.includes("created")
  ) {
    return `Nikunj has worked on diverse projects spanning enterprise, AI, and open source:

🌍 **EarthLink** - Enterprise ISP platform using React, Next.js, GraphQL & Microservices

🛒 **Rapid Store** - E-commerce platform with Razorpay payment integration

🤖 **Fantasy GPT** - AI sports chatbot with 98% accuracy using RAG & LangGraph

📺 **AIKO** - AI media assistant generating personalized sports highlights

🎨 **Rapid UI** - Open source CSS library with pre-defined components

🐤 **Rapid Fire** - Social media app with Redux Toolkit and dark mode

Each project demonstrates his ability to work across different domains - from enterprise solutions to cutting-edge AI applications. Which project interests you most?`;
  }

  // AI related queries
  if (
    message.includes("ai") ||
    message.includes("artificial intelligence") ||
    message.includes("machine learning") ||
    message.includes("chatbot") ||
    message.includes("gpt")
  ) {
    return `Nikunj is passionate about AI and has significant experience in this field:

🏆 **AI Achievements:**
- Won internal AI challenge at Armorcode
- Built "Fantasy GPT" with 98% accuracy using RAG & LangGraph
- Created "AIKO" AI media assistant for sports highlights
- Developed CrewAI agent with AWS Bedrock for data visualization
- Implemented AI-based auto-heal reducing test flakiness by 99%

🛠️ **AI Technologies:**
- RAG (Retrieval-Augmented Generation)
- LangChain & LangGraph
- OpenAI & Azure AI platforms
- Prompt Engineering
- LLaMA AI models

💡 **AI Applications:**
- Chatbots for sports enthusiasts
- Automated documentation systems
- Test automation with AI healing
- Real-time media content generation

His AI work focuses on practical applications that solve real business problems and improve efficiency. Would you like to know more about any specific AI project?`;
  }

  // Contact related queries
  if (
    message.includes("contact") ||
    message.includes("email") ||
    message.includes("reach") ||
    message.includes("hire") ||
    message.includes("linkedin")
  ) {
    return `You can connect with Nikunj through various channels:

📧 **Email:** njkhitha2003@gmail.com
💼 **LinkedIn:** https://www.linkedin.com/in/Nikunj-Khitha/
🐙 **GitHub:** https://github.com/Nikunj2003
🌐 **Website:** https://nikunj.tech

He's currently working as an Automation Intern at Armorcode and is passionate about AI development, full-stack engineering, and creating innovative solutions. Feel free to reach out for collaborations, job opportunities, or just to discuss technology!`;
  }

  // Education related queries
  if (
    message.includes("education") ||
    message.includes("degree") ||
    message.includes("university") ||
    message.includes("college") ||
    message.includes("study")
  ) {
    return `While specific educational details aren't provided in my knowledge base, I can tell you that Nikunj has demonstrated strong technical expertise through his internships and projects. His experience spans multiple companies and he's shown proficiency in:

- Software Development Engineering
- AI/ML Development  
- Full Stack Development
- DevOps and Cloud Technologies

His practical experience includes working with government organizations (Central Electricity Authority), private companies (Xansr Software), and cybersecurity firms (Armorcode), showing a well-rounded professional background.

Would you like to know more about his specific technical experience or projects?`;
  }

  // Current work queries
  if (
    message.includes("current") ||
    message.includes("now") ||
    message.includes("present") ||
    message.includes("today") ||
    message.includes("armorcode")
  ) {
    return `Currently, Nikunj is working as an **Automation Intern at Armorcode Inc.** (Jan 2025 - Aug 2025), where he's:

🔬 **Building Advanced Testing Solutions:**
- Co-developing Spring Boot test frameworks with Playwright & TestNG
- Creating dynamic, parallel test execution systems
- Deploying Report Portal on AWS with custom Java & React plugins

🤖 **AI Innovation:**
- Built CrewAI agent with AWS Bedrock for automated test data querying
- Won internal AI challenge by creating documentation automation for 250+ tools
- Reduced documentation update time from 72 hours to just 45 minutes

🛡️ **Quality Assurance:**
- Implemented AI-based auto-heal feature reducing UI test flakiness by 99%
- Built n8n pipelines for automated GitHub PR reviews

This role showcases his expertise in automation, AI, and building robust testing infrastructure for cybersecurity applications.`;
  }

  // General greeting or introduction
  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("who") ||
    message.includes("tell me about") ||
    message.includes("introduce")
  ) {
    return `Hello! I'm here to tell you about **Nikunj Khitha** - a talented Software Development Engineer with a passion for AI and full-stack development.

🎯 **Quick Overview:**
- **Current Role:** Automation Intern at Armorcode Inc.
- **Expertise:** AI/ML Development, Full Stack Engineering, DevOps
- **Achievements:** 98% accuracy AI chatbots, 99% reduction in test flakiness, 42% faster deployments

💡 **What makes him special:**
- Won AI challenges and built innovative solutions
- Experience across government, private, and cybersecurity sectors
- Strong in both cutting-edge AI and robust enterprise development

Feel free to ask me about:
- His work experience and internships
- Technical skills and projects  
- AI/ML expertise and achievements
- Contact information
- Specific technologies he works with

What would you like to know more about?`;
  }

  // Achievements and accomplishments
  if (
    message.includes("achievement") ||
    message.includes("award") ||
    message.includes("accomplishment") ||
    message.includes("recognition")
  ) {
    return `Nikunj has several notable achievements throughout his career:

🏆 **Competition & Recognition:**
- Won internal AI challenge at Armorcode Inc.
- Successfully built multiple enterprise-level applications

📈 **Performance Improvements:**
- Achieved 98% accuracy with "Fantasy GPT" AI chatbot
- Reduced deployment time by 42% through CI/CD optimization
- Improved API performance by 40% with microservices
- Boosted data accuracy by 30% for national energy dashboard
- Reduced UI test flakiness by 99% with AI auto-heal
- Cut documentation time from 72 hours to 45 minutes (automated system)
- Decreased booking times by 60% and scheduling errors by 40%

🎯 **Technical Excellence:**
- Achieved 100% test coverage in microservices development
- Built systems handling 5,000+ files with 25% faster retrieval
- Created solutions monitoring 150+ power stations nationally

These achievements demonstrate his ability to deliver measurable improvements and innovative solutions across different domains.`;
  }

  // Default response for unrecognized queries
  return `I'd be happy to help you learn more about Nikunj Khitha! Here are some things you can ask me about:

🔹 **Professional Experience** - His internships and work history
🔹 **Technical Skills** - Programming languages, frameworks, and tools
🔹 **AI/ML Projects** - His chatbots and AI innovations  
🔹 **Portfolio Projects** - Web apps, e-commerce platforms, and more
🔹 **Achievements** - Awards, performance improvements, and recognitions
���� **Contact Information** - How to reach him for opportunities

Or you can ask specific questions like:
- "What AI projects has he worked on?"
- "Tell me about his experience at Xansr"
- "What technologies does he specialize in?"
- "How can I contact him?"

What would you like to know?`;
}
