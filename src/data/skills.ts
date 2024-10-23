import {
  SiExpress,
  SiSocketdotio,
  SiNextdotjs,
  SiGithub,
  SiJira,
  SiAntdesign,
  SiGraphql,
  SiDocker,
  SiBitbucket,
} from "react-icons/si";
import {
  FramerMotionIcon,
  ReactRouterDomIcon,
} from "@/components/icons";
import { type SkillsShowcaseProps } from "@/components/skills/skills-showcase";

// Languages
import HtmlSvg from "@/public/icons/html.svg";
import CsssSvg from "@/public/icons/css.svg";
import SassSvg from "@/public/icons/sass.svg";
import JavascriptSvg from "@/public/icons/javascript.svg";
import TypescriptSvg from "@/public/icons/typescript.svg";  

// Libraries
import ReactjsSvg from "@/public/icons/reactjs.svg";
import ReduxSvg from "@/public/icons/redux.svg";
import TailwindcssSvg from "@/public/icons/tailwindcss.svg";
import MuiSvg from "@/public/icons/mui.svg";
import ViteSvg from "@/public/icons/vite.svg";

// Backend
import NodejsSvg from "@/public/icons/nodejs.svg";

// Database and ORMS
import MongoDBSvg from "@/public/icons/mongodb.svg";

// Tools and Tech
import GitSvg from "@/public/icons/git.svg";
import PostmanSvg from "@/public/icons/postman.svg";
import { CloudUploadIcon, Kanban } from "lucide-react";
import { BiLogoJava } from "react-icons/bi";

export const SKILLS_DATA: SkillsShowcaseProps["skills"] = [
  {
    sectionName: "Languages",
    skills: [
      {
        name: "HTML",
        icon: HtmlSvg,
      },
      {
        name: "CSS",
        icon: CsssSvg,
      },
      {
        name: "SASS",
        icon: SassSvg,
      },
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
        icon: BiLogoJava
      }
    ],
  },
  {
    sectionName: "Libraries and Frameworks",
    skills: [
      {
        name: "Reactjs",
        icon: ReactjsSvg,
      },
      {
        name: "Nextjs",
        icon: SiNextdotjs,
      },
      {
        name: "React Router Dom",
        icon: ReactRouterDomIcon,
      },
      {
        name: "Redux",
        icon: ReduxSvg,
      },
      {
        name: "Tailwindcss",
        icon: TailwindcssSvg,
      },
      {
        name: "MUI",
        icon: MuiSvg,
      },
      {
        name: "Framer motion",
        icon: FramerMotionIcon,
      },
      {
        name: "Vite",
        icon: ViteSvg,
      },
      {
        name: "Ant Design",
        icon: SiAntdesign,
      },
      {
        name: 'Docker',
        icon: SiDocker
      }
    ],
  },
  {
    sectionName: "Backend",
    skills: [
      {
        name: "Nodejs",
        icon: NodejsSvg,
      },
      {
        name: "Express",
        icon: SiExpress,
      },
      {
        name: "Socket.io",
        icon: SiSocketdotio,
      },
      {
        name: "MongoDB",
        icon: MongoDBSvg,
      },
      {
        name: 'GraphQL',
        icon: SiGraphql,
      }
    ],
  },
  {
    sectionName: "Tools and Technologies",
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
        name: "Postman",
        icon: PostmanSvg,
      },
      {
        name: "Bitbucket",
        icon: SiBitbucket,
      },
      {
        name: "Bitrix 24",
        icon: Kanban,
      },
      {
        name: "Cloudinary",
        icon: CloudUploadIcon
      }
    ],
  },
];
