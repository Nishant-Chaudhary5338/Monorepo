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
    title: "dashcraft — Headless Dashboard Library",
    description:
      "Drag-and-drop grids, resizable widgets, and persistent layouts behind five boolean props — teams ship a dashboard without touching their design system. Headless React + TypeScript, published on npm with a live playground and docs.",
    imgPath: "/images/thumbnails/headless.webp",
    bgColor: "#16213e",
    tags: ["React", "TypeScript", "Headless UI", "Zustand", "npm"],
    link: "https://dashcraft.digitribe.world",
  },
  {
    title: "Code Graph — 3D Code Indexer",
    description:
      "Indexes any TS/React monorepo into a live apps → packages → files → components graph with dependency edges, type-health status, and impact analysis — rendered as an interactive 3D force graph. ts-morph engine exposed over CLI and MCP.",
    imgPath: "/images/thumbnails/ai-driven.webp",
    bgColor: "#0f3460",
    tags: ["Three.js", "TypeScript", "ts-morph", "MCP", "Zustand"],
  },
  {
    title: "AI-Driven Development System",
    description:
      "A monorepo tooling layer of custom MCP servers that standardizes how UI is generated, refactored, and reviewed — keeping a large React codebase coherent as it grows and cutting ~60% of repetitive build-out.",
    imgPath: "/images/thumbnails/ai-driven.webp",
    bgColor: "#1a1a2e",
    tags: ["React", "TypeScript", "Monorepo", "MCP", "AI Automation"],
  },
  {
    title: "HLS Video Player",
    description:
      "Browser video that just plays — adaptive HLS streaming with Web and Service Workers for instant starts, intelligent caching, and smooth quality switching, with real-time playback monitoring.",
    imgPath: "/images/thumbnails/hls.webp",
    bgColor: "#16213e",
    tags: ["HLS.js", "Service Workers", "React", "Streaming", "Performance"],
  },
  {
    title: "Enterprise SSO & E-Commerce",
    description:
      "Sign-in and checkout for 25,000+ B2B users — Azure AD and Google OAuth 2.0 SSO with role-based access, plus a bulk-ordering storefront that lifted repeat orders ~22% and cut load time 4.2s → 2.5s.",
    imgPath: "/images/thumbnails/sso_ecom.webp",
    bgColor: "#0f3460",
    tags: ["React", "Azure AD", "OAuth 2.0", "E-Commerce", "B2B"],
  },
  {
    title: "Test Suite & Admin Portal",
    description:
      "Web platform for authoring, scheduling, and monitoring automated test runs across server runners and remote DTV farms — real-time dashboards over a React + Vite + TypeScript stack.",
    imgPath: "/images/thumbnails/testsuite.webp",
    bgColor: "#1a1a2e",
    tags: ["React", "Vite", "TypeScript", "Dashboard", "Test Automation"],
  },
];

export const words = [
  { text: "product UI", imgPath: "/images/ideas.svg" },
  { text: "design systems", imgPath: "/images/designs.svg" },
  { text: "React + TypeScript", imgPath: "/images/code.svg" },
  { text: "MCP tooling", imgPath: "/images/concepts.svg" },
  { text: "product UI", imgPath: "/images/ideas.svg" },
  { text: "design systems", imgPath: "/images/designs.svg" },
  { text: "React + TypeScript", imgPath: "/images/code.svg" },
  { text: "MCP tooling", imgPath: "/images/concepts.svg" },
];