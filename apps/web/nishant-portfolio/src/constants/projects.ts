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
  downloads: number;    // npm downloads over the 12 months to Oct 2026 (api.npmjs.org)
  fact: string;         // the one line the proof rail leads with
  caseStudy?: string;   // internal route to the related case study
}

export const products: Product[] = [
  {
    name: "mcp-react-toolkit",
    outcome: "Cuts repetitive frontend work and keeps a growing codebase coherent.",
    role: "Creator & maintainer",
    users: "Frontend engineers on large React monorepos",
    problem: "Repetitive build-out, drift, and inconsistent review at scale",
    shipped: "59 MCP tools for scaffolding, accessibility and dependency audits, test generation and a CRA to Vite migration. Each runs as its own MCP server or as a plain CLI script.",
    tags: ["MCP", "TypeScript", "Node", "Turborepo", "npm"],
    proof: {
      npm: "https://www.npmjs.com/package/mcp-react-toolkit",
      github: "https://github.com/Nishant-Chaudhary5338/mcp-toolkit",
    },
    downloads: 2689,
    fact: "59 tools · MCP server + CLI",
  },
  {
    name: "code-graph-indexer",
    outcome: "Makes any TS/React monorepo legible, so “what breaks if I change this?” has an answer.",
    role: "Creator & maintainer",
    users: "Engineers navigating and refactoring big monorepos",
    problem: "Dependency impact is invisible, so refactors ship on hope",
    shipped: "A live graph of apps, packages, files and components with type health and blast-radius checks. A ts-morph engine behind a CLI and an MCP server, shown as an interactive 3D graph.",
    tags: ["ts-morph", "Three.js", "MCP", "CLI", "npm"],
    proof: {
      npm: "https://www.npmjs.com/package/code-graph-indexer",
      github: "https://github.com/Nishant-Chaudhary5338/mcp-code-indexer",
    },
    downloads: 1114,
    fact: "CLI + MCP server · 3D graph explorer",
  },
  {
    name: "dashcraft",
    outcome: "Ship a dashboard without touching your design system.",
    role: "Creator & maintainer",
    users: "Teams shipping dashboards who don’t want to rebuild interaction logic",
    problem: "Drag, resize, and persistence get rebuilt, badly, in every dashboard",
    shipped: "A headless dashboard library: drag, resize and saved layouts behind four boolean props, with a live playground and docs.",
    tags: ["React", "TypeScript", "Headless UI", "Zustand", "npm"],
    proof: {
      live: "https://dashcraft-site.vercel.app/",
      npm: "https://www.npmjs.com/package/dashcraft-core",
      github: "https://github.com/Nishant-Chaudhary5338/dashcraft",
    },
    downloads: 313,
    fact: "4 boolean props · live playground",
    caseStudy: "/work/headless-dashboard-library",
  },
];
