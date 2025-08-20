import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { AI_MODEL, SYSTEM_PROMPT } from '@/config/ai';
import { rateLimiterApi, getUserId } from '@/utility/rate-limiter';


interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}


const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

// Rate limiter: max 40 requests per minute per user (IP+UA or fallback cookie)
const chatRateLimiter = rateLimiterApi({
  interval: 60_000, // 1 minute window
  uniqueTokenPerInterval: 1000, // capacity of distinct users per minute
  getUserId,
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Enforce 40 requests per minute
    try {
      await chatRateLimiter.check(res, req, 40);
    } catch (rlErr: any) {
      return res.status(429).json({ error: 'Too many requests. Please wait a minute before trying again.' });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }


    if (!process.env.LLM_API_KEY) {
      throw new Error('LLM API key not configured');
    }


    const recentMessages = conversationHistory.slice(-10);

    // Format conversation history for OpenAI API
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    // Add conversation history
    recentMessages.forEach((msg: Message) => {
      if (msg.sender === "user") {
        messages.push({ role: "user", content: msg.content });
      } else if (msg.sender === "ai") {
        messages.push({ role: "assistant", content: msg.content });
      }
    });


    messages.push({ role: "user", content: message });

    const response = await openai.chat.completions.create({
    model: AI_MODEL,
        messages,
        top_p: 0.7,
        temperature: 0.8,
      });

    const aiResponse = response.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please try asking your question again.";

    return res.status(200).json({ response: aiResponse });

  } catch (error: any) {
    console.error('AI Response Error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code
    });

    if (req.body.message?.toLowerCase().includes('contact') || req.body.message?.toLowerCase().includes('email')) {
      return res.status(200).json({
        response: `# Contact Nikunj Khitha\n\nYou can connect with Nikunj through various channels:\n\n## 📧 **Email**\n[njkhitha2003@gmail.com](mailto:njkhitha2003@gmail.com)\n\n## 💼 **LinkedIn**\n[Connect on LinkedIn](https://www.linkedin.com/in/Nikunj-Khitha/)\n\n## 🐙 **GitHub**\n[View Projects on GitHub](https://github.com/Nikunj2003)\n\n## 🌐 **Portfolio Website**\n[nikunj.tech](https://nikunj.tech)\n\n---\n\n> **Currently:** Automation Intern at Armorcode Inc.\n> \n> **Interests:** AI development, full-stack engineering, and creating innovative solutions\n> \n> Feel free to reach out for collaborations, job opportunities, or tech discussions!`
      });
    }

    // Provide intelligent fallback responses based on keywords
    const message = req.body.message?.toLowerCase() || '';

    if (message.includes('experience') || message.includes('work') || message.includes('job')) {
      return res.status(200).json({
        response: `# Nikunj's Professional Experience\n\nNikunj has diverse experience across multiple companies:\n\n## 🔧 **Current: Automation Intern at Armorcode Inc.**\n*Jan 2025 - Aug 2025*\n\n- Building next-gen testing frameworks with \`Spring Boot\`, \`Playwright\` & \`TestNG\`\n- **Won internal AI challenge** by automating documentation for 250+ tools\n- Reduced documentation update time from **72 hours to 45 minutes**\n- Implemented AI auto-heal feature reducing test flakiness by **99%**\n\n## 💻 **SDE Intern at Xansr Software**\n*June 2024 - Jan 2025*\n\n- Developed microservices with \`Node.js\` & \`FastAPI\` achieving **100% test coverage**\n- Built **"Fantasy GPT"** chatbot with 98% accuracy using \`RAG\` & \`LangGraph\`\n- Created **"AIKO"** media assistant for personalized sports highlights\n- Improved API performance by **40%** and reduced deployment time by **42%**\n\n> Would you like to know more about any specific role or project?`
      });
    }

    if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
      return res.status(200).json({
        response: `# Nikunj's Technical Skills\n\nNikunj has expertise across multiple technology stacks:\n\n## 🌐 **Full Stack Development**\n- \`React\`, \`Next.js\`, \`Node.js\`, \`Express\`\n- \`FastAPI\`, \`Spring Boot\`, \`Flutter\`\n- \`TailwindCSS\`, \`MongoDB\`, \`MySQL\`, \`Firebase\`\n\n## 🤖 **AI/ML Specialization**\n- \`OpenAI\`, \`Azure AI\`, \`LangChain\`\n- \`RAG\`, \`LangGraph\`, \`Prompt Engineering\`\n- \`LLaMA AI\`, \`Vercel AI SDK\`\n\n## 🚀 **DevOps & Cloud**\n- \`Docker\`, \`Kubernetes\`, \`CI/CD\`\n- \`GitHub Actions\`, \`Jenkins\`\n- \`AWS\`, \`Microsoft Azure\`\n\n## 💻 **Programming Languages**\n- \`JavaScript\`, \`TypeScript\`, \`Java\`\n- \`Python\`, \`PHP\`, \`Dart\`\n\n> What specific technology would you like to know more about?`
      });
    }

    if (message.includes('project') || message.includes('portfolio')) {
      return res.status(200).json({
        response: `# Nikunj's Key Projects\n\nNikunj has worked on diverse projects spanning multiple domains:\n\n## 🌍 **EarthLink**\n*Enterprise Platform*\n- American Internet service provider platform\n- **Tech Stack:** \`React\`, \`Next.js\`, \`GraphQL\`, \`Microservices\`\n- **Features:** Styled Components, SCSS integration\n\n## 🛒 **Rapid Store**\n*E-commerce Platform*\n- Electronics and gadgets marketplace\n- **Tech Stack:** \`React\`, \`Razorpay\`, \`Context API\`\n- **Features:** Payment integration, Authentication\n\n## 🤖 **Fantasy GPT**\n*AI/ML Project*\n- Sports chatbot for fantasy enthusiasts\n- **Accuracy:** 98% using \`RAG\` & \`LangGraph\`\n- **Tech Stack:** \`Node.js\`, \`AI/ML\`\n\n## 📺 **AIKO**\n*AI Media Assistant*\n- Personalized sports highlights generator\n- **Features:** Real-time commentary, Media processing\n\n## 🎨 **Rapid UI**\n*Open Source*\n- CSS library with pre-defined components\n- **Tech Stack:** \`CSS\`, \`JavaScript\`, Design System\n\n> Which project interests you most? I can share more details!`
      });
    }

    return res.status(200).json({
      response: `# Welcome! I'm here to help you learn about Nikunj Khitha\n\n## What would you like to know?\n\n### 🔹 **Professional Experience**\n- Current role at Armorcode Inc.\n- Previous internships and achievements\n- Career progression and impact\n\n### 🔹 **Technical Skills**\n- Programming languages and frameworks\n- AI/ML expertise and tools\n- DevOps and cloud technologies\n\n### 🔹 **AI/ML Projects**\n- Fantasy GPT chatbot (98% accuracy)\n- AIKO media assistant\n- Automation and testing innovations\n\n### 🔹 **Portfolio Projects**\n- Enterprise web applications\n- E-commerce platforms\n- Open source contributions\n\n### 🔹 **Contact Information**\n- How to reach Nikunj for opportunities\n- Professional social links\n\n> Just ask me anything about Nikunj's background, and I'll provide detailed information!`
    });
  }
}