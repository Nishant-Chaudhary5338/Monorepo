// Exactly three products, each on the Role · Users · Outcome spine.
// Everything removed from here lives on as Experience bullets.

export interface ProductProof {
  npm?: string;
  github?: string;
  live?: string;
}

export interface Product {
  name: string;
  outcome: string;      // the headline — measured result, not features
  role: string;
  users: string;
  problem: string;
  shipped: string;
  tags: string[];
  proof: ProductProof;
  adoption?: string;    // real downloads/stars/teams — pending, placeholder until provided
}

export const products: Product[] = [
  {
    name: "mcp-react-toolkit",
    outcome: "Cuts repetitive frontend work and keeps a growing codebase coherent.",
    role: "Creator & maintainer",
    users: "Frontend engineers on large React monorepos",
    problem: "Repetitive build-out, drift, and inconsistent review at scale",
    shipped: "A frontend automation platform — one protocol, two surfaces: 60+ tools, ~30 MCP packages, 27 CLI wrappers",
    tags: ["MCP", "TypeScript", "Node", "Turborepo", "npm"],
    proof: {
      npm: "https://www.npmjs.com/package/mcp-react-toolkit",
      github: "https://github.com/Nishant-Chaudhary5338/mcp-toolkit",
    },
  },
  {
    name: "code-graph-indexer",
    outcome: "Makes any TS/React monorepo legible — “what breaks if I change this?” becomes visible.",
    role: "Creator & maintainer",
    users: "Engineers navigating and refactoring big monorepos",
    problem: "Dependency impact is invisible; refactors ship on hope",
    shipped: "Live apps → packages → files → components graph with type-health and blast-radius impact analysis; ts-morph engine over CLI + MCP, rendered as an interactive 3D force graph",
    tags: ["ts-morph", "Three.js", "MCP", "CLI", "npm"],
    proof: {
      npm: "https://www.npmjs.com/package/code-graph-indexer",
    },
  },
  {
    name: "dashcraft",
    outcome: "Ship a dashboard without touching your design system.",
    role: "Creator & maintainer",
    users: "Teams shipping dashboards who don’t want to rebuild interaction logic",
    problem: "Drag, resize, and persistence get rebuilt — badly — in every dashboard",
    shipped: "A headless dashboard framework: drag/resize/persist behind five boolean props, with a live playground and docs",
    tags: ["React", "TypeScript", "Headless UI", "Zustand", "npm"],
    proof: {
      live: "https://dashcraft-site.vercel.app/",
      npm: "https://www.npmjs.com/package/dashcraft-core",
    },
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
