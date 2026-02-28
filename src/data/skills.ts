import {
  SiExpress,
  SiNextdotjs,
  SiGithub,
  SiOpenai,
  SiSpringboot,
  SiVercel,
  SiApachekafka,
  SiRabbitmq,
  SiPrisma,
  SiNginx,
  SiGrafana,
  SiElasticsearch,
  SiNeo4J,
  SiAmazonaws,
  SiAmazons3,
  SiRedis,
  SiAmazonsqs,
  SiPostgresql,
  SiGooglecloud,
} from "react-icons/si";
import { type SkillsShowcaseProps } from "@/components/skills/skills-showcase";
import TypescriptSvg from "@/public/icons/typescript.svg";
import NodeSvg from "@/public/icons/nodejs.svg";
import ReactjsSvg from "@/public/icons/reactjs.svg";
import PythonSvg from "@/public/icons/python.svg";
import AzureSvg from "@/public/icons/azure.svg";
import MongoDBSvg from "@/public/icons/mongodb.svg";
import GitSvg from "@/public/icons/git.svg";
import PostmanSvg from "@/public/icons/postman.svg";
import AuthSvg from "@/public/icons/auth0.svg";
import FirebaseSvg from "@/public/icons/firebase.svg";
import FastSvg from "@/public/icons/fastapi.svg";
import MysqlSvg from "@/public/icons/mysql.svg";
import JavaSvg from "@/public/icons/java.svg";
import AzureAiSvg from "@/public/icons/azureai.svg";
import LLaMaSvg from "@/public/icons/llama.svg";
import PromptSvg from "@/public/icons/prompt.svg";
import LangSvg from "@/public/icons/langchain-seeklogo.svg";
import CiCdSvg from "@/public/icons/cicd.svg";
import DockerSvg from "@/public/icons/docker.svg";
import GithubactionsSvg from "@/public/icons/actions.svg";
import JenkinsSvg from "@/public/icons/jenkins.svg";
import KubernetesSvg from "@/public/icons/kubernetes.svg";
import ADevOpsSvg from "@/public/icons/devops.svg";
import SwaggerSvg from "@/public/icons/swagger.svg";

export const SKILLS_DATA: SkillsShowcaseProps["skills"] = [
  {
    sectionName: "Generative AI & ML",
    skills: [
      {
        name: "RAG",
        icon: SiOpenai,
      },
      {
        name: "GraphRAG",
        icon: SiOpenai,
      },
      {
        name: "LightRAG",
        icon: SiOpenai,
      },
      {
        name: "Agentic AI",
        icon: LangSvg,
      },
      {
        name: "CrewAI",
        icon: LangSvg,
      },
      {
        name: "LangGraph",
        icon: LangSvg,
      },
      {
        name: "MCP",
        icon: SiOpenai,
      },
      {
        name: "Prompt Engineering",
        icon: PromptSvg,
      },
      {
        name: "AWS Bedrock",
        icon: SiAmazonaws,
      },
      {
        name: "Gemini AI",
        icon: SiOpenai,
      },
      {
        name: "Vertex AI",
        icon: SiOpenai,
      },
      {
        name: "Claude",
        icon: SiOpenai,
      },
      {
        name: "Azure AI Foundry",
        icon: AzureAiSvg,
      },
      {
        name: "Unsloth",
        icon: LLaMaSvg,
      },
      {
        name: "LangChain",
        icon: LangSvg,
      },
    ],
  },
  {
    sectionName: "Full Stack",
    skills: [
      {
        name: "Java",
        icon: JavaSvg,
      },
      {
        name: "Spring Boot",
        icon: SiSpringboot,
      },
      {
        name: "Python",
        icon: PythonSvg,
      },
      {
        name: "FastAPI",
        icon: FastSvg,
      },
      {
        name: "TypeScript",
        icon: TypescriptSvg,
      },
      {
        name: "Node.js",
        icon: NodeSvg,
      },
      {
        name: "Next.js",
        icon: SiNextdotjs,
      },
      {
        name: "ReactJS",
        icon: ReactjsSvg,
      },
      {
        name: "Express",
        icon: SiExpress,
      },
      {
        name: "Prisma",
        icon: SiPrisma,
      },
      {
        name: "Kafka",
        icon: SiApachekafka,
      },
      {
        name: "RabbitMQ",
        icon: SiRabbitmq,
      },
      {
        name: "SQS",
        icon: SiAmazonsqs,
      },
    ],
  },
  {
    sectionName: "Databases & Data",
    skills: [
      {
        name: "Neo4j (Graph)",
        icon: SiNeo4J,
      },
      {
        name: "PostgreSQL (SQL/Vector),",
        icon: SiPostgresql,
      },
      {
        name: "SQLite",
        icon: MysqlSvg,
      },
      {
        name: "Qdrant",
        icon: MysqlSvg,
      },
      {
        name: "Pinecone",
        icon: MysqlSvg,
      },
      {
        name: "Superbase",
        icon: MysqlSvg,
      },
      {
        name: "AWS S3",
        icon: SiAmazons3,
      },
      {
        name: "MongoDB",
        icon: MongoDBSvg,
      },
      {
        name: "Elasticsearch",
        icon: SiElasticsearch,
      },
      {
        name: "Firebase",
        icon: FirebaseSvg,
      },
      {
        name: "Redis",
        icon: SiRedis,
      }
    ],
  },
  {
    sectionName: "DevOps & Infra",
    skills: [
      {
        name: "AWS",
        icon: SiAmazonaws,
      },
      {
        name: "Azure",
        icon: AzureSvg,
      },
      {
        name: "Google Cloud",
        icon: SiGooglecloud,
      },
      {
        name: "Docker",
        icon: DockerSvg,
      },
      {
        name: "Kubernetes",
        icon: KubernetesSvg,
      },
      {
        name: "CI/CD",
        icon: CiCdSvg,
      },
      {
        name: "GitHub Actions",
        icon: GithubactionsSvg,
      },
      {
        name: "Nginx",
        icon: SiNginx,
      },
      {
        name: "Grafana",
        icon: SiGrafana,
      },
      {
        name: "Jenkins",
        icon: JenkinsSvg,
      },
      {
        name: "Traefik",
        icon: DockerSvg,
      },
      {
        name: "Dokploy",
        icon: DockerSvg,
      },
    ],
  },
  {
    sectionName: "Dev Tools",
    skills: [
      {
        name: "LiteLLM",
        icon: SiOpenai,
      },
      {
        name: "Claude Code",
        icon: SiOpenai,
      },
      {
        name: "Gemini CLI",
        icon: SiOpenai,
      },
      {
        name: "Windsurf",
        icon: ADevOpsSvg,
      },
      {
        name: "OpenWeb UI",
        icon: SiOpenai,
      },
      {
        name: "Vercel",
        icon: SiVercel,
      },
      {
        name: "Swagger",
        icon: SwaggerSvg,
      },
      {
        name: "Auth0",
        icon: AuthSvg,
      },
      {
        name: "Postman",
        icon: PostmanSvg,
      },
      {
        name: "n8n",
        icon: ADevOpsSvg,
      },
      {
        name: "Git",
        icon: GitSvg,
      },
      {
        name: "GitHub",
        icon: SiGithub,
      },
    ],
  },
];
