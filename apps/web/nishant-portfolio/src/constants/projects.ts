export interface Project {
  title: string;
  description: string;
  imgPath: string;
  bgColor: string;
  tags: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    title: "AI-Driven Development System",
    description:
      "Built a Monorepo architecture with custom MCP tools that automates UI generation, refactoring, and code standardization — reducing 60–70% of repetitive frontend work and improving development speed by ~3x.",
    imgPath: "/images/thumbnails/ai-driven.webp",
    bgColor: "#1a1a2e",
    tags: ["React", "TypeScript", "Monorepo", "MCP", "AI Automation"],
  },
  {
    title: "Headless Dashboard Framework",
    description:
      "Reusable headless UI framework for production-grade dashboards with plug-and-play grid layouts, drag-and-drop, dynamic resizing, API polling, theming, and responsive design.",
    imgPath: "/images/thumbnails/headless.webp",
    bgColor: "#16213e",
    tags: ["React", "TypeScript", "Tailwind CSS", "Design System", "Headless UI"],
  },
  {
    title: "Test Suite & Admin Portal",
    description:
      "Web-based test management platform for authoring, scheduling, and monitoring automated test cases across server runners and remote DTV farms with real-time dashboards.",
    imgPath: "/images/thumbnails/testsuite.webp",
    bgColor: "#0f3460",
    tags: ["React", "Vite", "TypeScript", "Dashboard", "Test Automation"],
  },
  {
    title: "HLS Video Player",
    description:
      "High-performance browser-based video player using HLS.js with Web and Service Workers for adaptive streaming, intelligent caching, and real-time playback monitoring.",
    imgPath: "/images/thumbnails/hls.webp",
    bgColor: "#1a1a2e",
    tags: ["HLS.js", "Service Workers", "React", "Streaming", "Performance"],
  },
  {
    title: "Enterprise SSO & E-Commerce",
    description:
      "Implemented Azure AD SSO and Google OAuth 2.0 for 15,000+ B2B users. Built e-commerce platform with order tracking, bulk ordering, and analytics integration.",
    imgPath: "/images/thumbnails/sso_ecom.webp",
    bgColor: "#16213e",
    tags: ["React", "Azure AD", "OAuth 2.0", "E-Commerce", "B2B"],
  },
  {
    title: "SAP Integration Platform",
    description:
      "SAP web interface integrating SAP Cloud Platform with React via Node.js + Express backend, streamlining enterprise data workflows and operations.",
    imgPath: "/images/thumbnails/sap_integration.webp",
    bgColor: "#0f3460",
    tags: ["React", "SAP", "Node.js", "Express", "Enterprise"],
  },
];

export const words = [
  { text: "Micro-frontends", imgPath: "/images/ideas.svg" },
  { text: "MCP Servers", imgPath: "/images/concepts.svg" },
  { text: "Design Systems", imgPath: "/images/designs.svg" },
  { text: "AI Workflows", imgPath: "/images/code.svg" },
  { text: "Micro-frontends", imgPath: "/images/ideas.svg" },
  { text: "MCP Servers", imgPath: "/images/concepts.svg" },
  { text: "Design Systems", imgPath: "/images/designs.svg" },
  { text: "AI Workflows", imgPath: "/images/code.svg" },
];