import { motion } from "framer-motion";

const tools = [
  {
    name: "component-factory",
    emoji: "🏗️",
    what: "Scaffold any React component with tests & stories",
    cat: "Components",
    catColor: "#60a5fa",
  },
  {
    name: "accessibility-checker",
    emoji: "♿",
    what: "WCAG audit — finds and fixes a11y violations",
    cat: "Components",
    catColor: "#60a5fa",
  },
  {
    name: "generate-tests",
    emoji: "🧪",
    what: "Auto-generate Vitest unit + integration tests",
    cat: "Testing",
    catColor: "#a78bfa",
  },
  {
    name: "code-modernizer",
    emoji: "⚙️",
    what: "JS → TS conversion, type generation, state optimization",
    cat: "Code Quality",
    catColor: "#f97316",
  },
  {
    name: "typescript-enforcer",
    emoji: "🛡️",
    what: "Scan and enforce strict TypeScript rules across a path",
    cat: "Code Quality",
    catColor: "#f97316",
  },
  {
    name: "dep-auditor",
    emoji: "🔍",
    what: "Vulnerability scanning + dependency graph analysis",
    cat: "Code Quality",
    catColor: "#f97316",
  },
  {
    name: "monorepo-manager",
    emoji: "🗂️",
    what: "Workspace operations + dependency graph visualization",
    cat: "Workflow",
    catColor: "#fbbf24",
  },
  {
    name: "quality-pipeline",
    emoji: "🚀",
    what: "Full QA suite — orchestrates all tools in sequence",
    cat: "Workflow",
    catColor: "#fbbf24",
  },
  {
    name: "json-viewer",
    emoji: "📊",
    what: "Visualize JSON responses live in the browser",
    cat: "Utilities",
    catColor: "#10b981",
  },
];

export function ToolsOverview() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12 pt-14"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mono text-xs tracking-[0.3em] uppercase mb-3"
        style={{ color: "rgba(249,115,22,0.6)" }}
      >
        mcp-toolkit
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl font-black text-center mb-2"
      >
        9 tools. Every{" "}
        <span className="gradient-flame">dev workflow.</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 mb-7 text-xs"
      >
        {[
          { label: "9 tools", color: "#f97316" },
          { label: "134 tests", color: "#fbbf24" },
          { label: "CI green ✓", color: "#10b981" },
          { label: "MIT license", color: "#60a5fa" },
        ].map((b) => (
          <span
            key={b.label}
            className="px-3 py-1 rounded-full mono font-semibold"
            style={{
              background: `${b.color}15`,
              color: b.color,
              border: `1px solid ${b.color}25`,
            }}
          >
            {b.label}
          </span>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
        {tools.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.06, type: "spring", stiffness: 200 }}
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <span className="text-xl mt-0.5">{t.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p
                  className="text-[10px] font-bold mono"
                  style={{ color: t.catColor }}
                >
                  {t.cat}
                </p>
              </div>
              <p className="text-xs font-bold mono mb-0.5" style={{ color: "var(--text)" }}>
                {t.name}
              </p>
              <p className="text-[11px] leading-snug" style={{ color: "var(--muted)" }}>
                {t.what}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
