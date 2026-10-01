export interface ProductLinks {
  live?: string;
  npm?: string;
  github?: string;
}

export interface Product {
  name: string;
  summary: string;
  detail: string;
  // npm downloads over the 12 months before STATS_AS_OF (api.npmjs.org)
  downloads: number;
  tags: string[];
  links: ProductLinks;
}

export interface Contribution {
  repo: string;
  title: string;
  url: string;
}

export const STATS_AS_OF = "Oct 2026";

export const products: Product[] = [
  {
    name: "mcp-react-toolkit",
    summary: "**59 MCP tools** for everyday React and TypeScript work.",
    detail:
      "Component scaffolding, accessibility and dependency audits, test generation and a CRA to Vite migration. Each tool runs as its own MCP server or as a plain CLI script.",
    downloads: 2689,
    tags: ["TypeScript", "MCP", "Node", "CLI"],
    links: {
      npm: "https://www.npmjs.com/package/mcp-react-toolkit",
      github: "https://github.com/Nishant-Chaudhary5338/mcp-toolkit",
    },
  },
  {
    name: "code-graph-indexer",
    summary: "See what a change will break before you make it.",
    detail:
      "Turns a TypeScript or React monorepo into a dependency graph you can query, with type health and blast-radius checks. Works as a CLI or an MCP server and ships a 3D graph explorer.",
    downloads: 1114,
    tags: ["TypeScript", "ts-morph", "MCP", "Three.js"],
    links: {
      npm: "https://www.npmjs.com/package/code-graph-indexer",
      github: "https://github.com/Nishant-Chaudhary5338/mcp-code-indexer",
    },
  },
  {
    name: "dashcraft",
    summary: "Interactive dashboards without touching your design system.",
    detail:
      "A headless React dashboard library: drag-and-drop grids, resizable widgets and saved layouts behind four boolean props, with no styles of its own.",
    downloads: 313,
    tags: ["React", "TypeScript", "Headless UI", "Zustand"],
    links: {
      live: "https://dashcraft-site.vercel.app/",
      npm: "https://www.npmjs.com/package/dashcraft-core",
      github: "https://github.com/Nishant-Chaudhary5338/dashcraft",
    },
  },
];

export const contributions: Contribution[] = [
  {
    repo: "vercel/turborepo",
    title: "Added the with-mcp-servers example (merged)",
    url: "https://github.com/vercel/turborepo/pull/12997",
  },
  {
    repo: "punkpeye/awesome-mcp-servers",
    title: "Listed mcp-toolkit and code-graph-indexer (both merged)",
    url: "https://github.com/punkpeye/awesome-mcp-servers/pull/8724",
  },
];
