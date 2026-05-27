import { motion } from "framer-motion";

const tools = [
  { name: "component-factory", desc: "Scaffold React components with tests + stories" },
  { name: "code-modernizer", desc: "Upgrade JS→TS, add types, modernise patterns" },
  { name: "quality-pipeline", desc: "Full QA sweep: types + a11y + tests + perf" },
  { name: "json-viewer", desc: "Visualise JSON in browser" },
  { name: "dep-auditor", desc: "Vulnerability scanning + dependency analysis" },
  { name: "accessibility-checker", desc: "WCAG compliance audit" },
  { name: "generate-tests", desc: "Auto-generate Vitest unit tests" },
  { name: "typescript-enforcer", desc: "Enforce strict TypeScript across codebase" },
  { name: "monorepo-manager", desc: "Workspace ops + dependency graph" },
];

export function MCPToolkit() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-emerald-400/60 mb-3 font-medium">Open Source</p>
        <h2 className="text-4xl font-black text-white">
          The <span className="gradient-text-emerald">mcp-toolkit</span>
        </h2>
        <p className="text-white/35 mt-2 text-sm">9 production-ready MCP tools · 134 tests · CI green · Free to use</p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex gap-4 mb-6"
      >
        {[
          { label: "Tools", value: "9" },
          { label: "Tests", value: "134" },
          { label: "CI", value: "✅ green" },
          { label: "License", value: "MIT" },
        ].map((s) => (
          <div key={s.label} className="px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-center">
            <p className="text-lg font-black text-emerald-300">{s.value}</p>
            <p className="text-xs text-white/35">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Tool list */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-4xl">
        {tools.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="rounded-xl border border-white/6 bg-white/3 px-4 py-3 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-colors"
          >
            <p className="text-xs font-mono text-emerald-300/80 mb-1">{t.name}</p>
            <p className="text-xs text-white/40 leading-snug">{t.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-6 flex items-center gap-4"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/8 bg-white/3">
          <span className="text-white/30 text-xs font-mono">github.com/</span>
          <span className="text-white/70 text-xs font-mono font-semibold">Nishant-Chaudhary5338/mcp-toolkit</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-violet-500/20 bg-violet-500/8">
          <span className="text-xs text-white/35 font-mono">npm org:</span>
          <span className="text-violet-300 text-xs font-mono font-semibold">@mcp-toolkit/*</span>
          <span className="text-white/20 text-xs">(coming soon)</span>
        </div>
      </motion.div>
    </div>
  );
}
