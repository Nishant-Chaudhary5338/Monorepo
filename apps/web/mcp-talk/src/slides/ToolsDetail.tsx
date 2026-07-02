import { motion } from "framer-motion";

const categories = [
  {
    label: "Components & Testing",
    color: "#60a5fa",
    borderColor: "rgba(96,165,250,0.25)",
    bg: "rgba(96,165,250,0.05)",
    tools: [
      {
        name: "component-factory",
        emoji: "🏗️",
        desc: "Tell Cline the component name — it scaffolds the TSX, a Vitest test file, and a Storybook story in seconds.",
        prompt: "\"Scaffold a Modal component with variants and tests\"",
      },
      {
        name: "accessibility-checker",
        emoji: "♿",
        desc: "Audits React components against WCAG 2.1 rules. Returns violations with severity, the exact element, and a fix.",
        prompt: "\"Check my NavBar for accessibility issues\"",
      },
      {
        name: "generate-tests",
        emoji: "🧪",
        desc: "Reads your component or utility file and generates Vitest unit tests covering the happy path and edge cases.",
        prompt: "\"Generate tests for my utils/api.ts\"",
      },
    ],
  },
  {
    label: "Code Quality",
    color: "#f97316",
    borderColor: "rgba(249,115,22,0.25)",
    bg: "rgba(249,115,22,0.05)",
    tools: [
      {
        name: "code-modernizer",
        emoji: "⚙️",
        desc: "Converts JavaScript files to TypeScript, generates types from usage, and flags state management anti-patterns.",
        prompt: "\"Modernize src/utils/auth.js to TypeScript\"",
      },
      {
        name: "typescript-enforcer",
        emoji: "🛡️",
        desc: "Scans a path for any, loose types, and strict-mode violations. Returns a report with line numbers and fixes.",
        prompt: "\"Enforce TypeScript rules across src/\"",
      },
      {
        name: "dep-auditor",
        emoji: "🔍",
        desc: "Runs a vulnerability scan on package.json, detects unused deps, and shows a dependency graph.",
        prompt: "\"Audit my project dependencies\"",
      },
    ],
  },
  {
    label: "Workflow & Utilities",
    color: "#fbbf24",
    borderColor: "rgba(251,191,36,0.25)",
    bg: "rgba(251,191,36,0.04)",
    tools: [
      {
        name: "monorepo-manager",
        emoji: "🗂️",
        desc: "Manages workspace packages — add/remove deps, visualize the dependency graph, detect circular imports.",
        prompt: "\"Show me the dependency graph for @repo/ui\"",
      },
      {
        name: "quality-pipeline",
        emoji: "🚀",
        desc: "Orchestration tool — runs component-factory, accessibility-checker, generate-tests, and typescript-enforcer in one shot.",
        prompt: "\"Run full QA pipeline on my src/ directory\"",
      },
      {
        name: "json-viewer",
        emoji: "📊",
        desc: "Opens a browser tab to visualize any JSON response from an API call — great for exploring API output.",
        prompt: "\"Visualize the response from /api/users\"",
      },
    ],
  },
];

export function ToolsDetail() {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden px-10 pt-12 pb-10"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 flex flex-col items-center text-center mb-5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mono text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(249,115,22,0.6)" }}
        >
          Tool Deep-Dive
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-black"
        >
          What each tool <span className="gradient-flame">actually does</span>
        </motion.h2>
      </div>

      {/* 3-column grid — fills remaining height */}
      <div
        className="flex-1 min-h-0 grid grid-cols-3 gap-4 w-full max-w-5xl mx-auto"
        style={{ gridAutoRows: "1fr" }}
      >
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + ci * 0.1 }}
            className="rounded-2xl p-5 flex flex-col"
            style={{ border: `1px solid ${cat.borderColor}`, background: cat.bg }}
          >
            <p className="text-sm font-bold mono mb-4" style={{ color: cat.color }}>
              {cat.label}
            </p>
            <div className="flex-1 flex flex-col justify-between gap-3">
              {cat.tools.map((tool, ti) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + ci * 0.1 + ti * 0.07 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{tool.emoji}</span>
                    <p className="text-sm font-bold mono" style={{ color: "var(--text)" }}>
                      {tool.name}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted)" }}>
                    {tool.desc}
                  </p>
                  <div
                    className="rounded px-2 py-1.5"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <p className="text-xs mono italic" style={{ color: cat.color + "99" }}>
                      {tool.prompt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
