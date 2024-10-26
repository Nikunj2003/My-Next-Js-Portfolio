import {
  SiExpress,
  SiNextdotjs,
  SiGithub,
  SiOpenai,
  SiSpringboot,
  SiPhp,
  SiVercel
} from "react-icons/si";
import { type SkillsShowcaseProps } from "@/components/skills/skills-showcase";
import JavascriptSvg from "@/public/icons/javascript.svg";
import TypescriptSvg from "@/public/icons/typescript.svg";
import NodeSvg from "@/public/icons/nodejs.svg";
import ReactjsSvg from "@/public/icons/reactjs.svg";
import FlutterSvg from "@/public/icons/Flutter.svg";
import TailwindcssSvg from "@/public/icons/tailwindcss.svg";
import PythonSvg from "@/public/icons/python.svg";
import AzureSvg from "@/public/icons/azure.svg";
import MongoDBSvg from "@/public/icons/mongodb.svg";
import GitSvg from "@/public/icons/git.svg";
import PostmanSvg from "@/public/icons/postman.svg";
import AuthSvg from "@/public/icons/auth0.svg";
import DartSvg from "@/public/icons/dart.svg";
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
import ApimSvg from "@/public/icons/api-management.svg";
import ADevOpsSvg from "@/public/icons/devops.svg";
import JiraSvg from "@/public/icons/jira.svg";
import NpmSvg from "@/public/icons/npm.svg";
import SwaggerSvg from "@/public/icons/swagger.svg";
import PiSvg from "@/public/icons/pi.svg"
import ArduinoSvg from "@/public/icons/arduino.svg";

export const SKILLS_DATA: SkillsShowcaseProps["skills"] = [
  {
    sectionName: "Fullstack & Databases",
    skills: [
      {
        name: "React",
        icon: ReactjsSvg,
      },
      {
        name: "Nextjs",
        icon: SiNextdotjs,
      },
      {
        name: "Nodejs",
        icon: NodeSvg,
      },
      {
        name: "Express",
        icon: SiExpress,
      },
      {
        name: "FastAPI",
        icon: FastSvg,
      },
      {
        name: "Tailwindcss",
        icon: TailwindcssSvg,
      },
      {
        name: "Spring Boot",
        icon: SiSpringboot,
      },
      {
        name: "Flutter",
        icon: FlutterSvg,
      },
      {
        name: "Auth0",
        icon: AuthSvg,
      },
      {
        name: "MongoDB",
        icon: MongoDBSvg,
      },
      {
        name: "MySql",
        icon: MysqlSvg,
      },
      {
        name: "Firebase",
        icon: FirebaseSvg,
      },
    ],
  },
  {
    sectionName: "AI/ML",
    skills: [
      {
        name: "OpenAI",
        icon: SiOpenai,
      },
      {
        name: "Azure AI",
        icon: AzureAiSvg,
      },
      {
        name: "Vercel AI SDK",
        icon: SiVercel,
      },
      {
        name: "LLaMa AI",
        icon: LLaMaSvg,
      },
      {
        name: "Prompt Engineering",
        icon: PromptSvg,
      },
      {
        name: "LangChain",
        icon: LangSvg,
      },
    ],
  },
  {
    sectionName: "DevOps",
    skills: [
      {
        name: "CI/CD",
        icon: CiCdSvg,
      },
      {
        name: "Docker",
        icon: DockerSvg,
      },
      {
        name: "GitHub Actions",
        icon: GithubactionsSvg,
      },
      {
        name: "API Gateway",
        icon: ApimSvg,
      },
      {
        name: "Kubernetes",
        icon: KubernetesSvg,
      },
      {
        name: "Jenkins",
        icon: JenkinsSvg,
      },
    ],
  },
  {
    sectionName: "Tools & Cloud Platforms",
    skills: [
      {
        name: "Git",
        icon: GitSvg,
      },
      {
        name: "Github",
        icon: SiGithub,
      },
      {
        name: "Azure DevOps",
        icon: ADevOpsSvg,
      },
      {
        name: "Jira",
        icon: JiraSvg,
      },
      {
        name: "Npm",
        icon: NpmSvg,
      },
      {
        name: "Postman",
        icon: PostmanSvg,
      },
      {
        name: "Swagger",
        icon: SwaggerSvg,
      },
      {
        name: "Microsoft Azure",
        icon: AzureSvg,
      },
      {
        name: "Vercel",
        icon: SiVercel,
      },
      {
        name: "Raspberry PI",
        icon: PiSvg,
      },
      {
        name: "Arduino",
        icon: ArduinoSvg,
      },
    ],
  },
  {
    sectionName: "Languages",
    skills: [
      {
        name: "Javascript",
        icon: JavascriptSvg,
      },
      {
        name: "Typescript",
        icon: TypescriptSvg,
      },
      {
        name: "Java",
        icon: JavaSvg,
      },
      {
        name: "Dart",
        icon: DartSvg,
      },
      {
        name: "PHP",
        icon: SiPhp,
      },
      {
        name: "Python",
        icon: PythonSvg,
      },
    ],
  }
];
