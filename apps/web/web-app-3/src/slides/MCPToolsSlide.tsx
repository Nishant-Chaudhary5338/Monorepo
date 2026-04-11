import { motion } from "framer-motion";
import { Tooltip } from "../components/Tooltip";

const capabilities = [
  {
    label: "Code Quality",
    icon: "⊗",
    color: "border-violet-500/30 bg-violet-500/8",
    accent: "text-violet-400",
    detail: "typescript-enforcer · accessibility-checker · dep-auditor · complexity-scanner. Automated code review on every commit.",
  },
  {
    label: "Component Dev",
    icon: "⊞",
    color: "border-cyan-500/30 bg-cyan-500/8",
    accent: "text-cyan-400",
    detail: "component-factory · component-reviewer · component-fixer · improve-component. From spec to production-ready component, automated.",
  },
  {
    label: "Testing",
    icon: "✓",
    color: "border-emerald-500/30 bg-emerald-500/8",
    accent: "text-emerald-400",
    detail: "test-generator · coverage-analyzer · snapshot-updater · e2e-scaffolder. Auto-generated tests with real coverage.",
  },
  {
    label: "Performance",
    icon: "⚡",
    color: "border-amber-500/30 bg-amber-500/8",
    accent: "text-amber-400",
    detail: "bundle-analyzer · render-profiler · lighthouse-runner · perf-budget. Automated performance gates on every build.",
  },
];

export function MCPToolsSlide() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-emerald-400/60 mb-3 font-medium">Automation</p>
        <h2 className="text-5xl font-black text-white mb-3">
          Custom{" "}
          <span className="gradient-text-emerald">MCP Tools</span>
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto font-mono">
          Model Context Protocol — a JSON-RPC interface between an LLM and your codebase tooling
        </p>
      </motion.div>

      {/* Communication diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <svg viewBox="0 0 400 70" className="w-full max-w-lg">
          {/* Claude LLM */}
          <rect x="10" y="15" width="90" height="40" rx="8" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" />
          <text x="55" y="33" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="monospace" fontWeight="bold">Claude</text>
          <text x="55" y="46" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="monospace">LLM</text>

          {/* Arrow right */}
          <motion.line x1="102" y1="31" x2="148" y2="31" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }} />
          <path d="M146 27 L152 31 L146 35" fill="none" stroke="#7c3aed" strokeWidth="1.5" />
          <text x="125" y="26" textAnchor="middle" fill="rgba(124,58,237,0.5)" fontSize="8" fontFamily="monospace">tool_call</text>

          {/* Arrow left */}
          <motion.line x1="148" y1="42" x2="102" y2="42" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.5 }} />
          <path d="M104 38 L98 42 L104 46" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="125" y="57" textAnchor="middle" fill="rgba(6,182,212,0.5)" fontSize="8" fontFamily="monospace">result</text>

          {/* MCP Server */}
          <rect x="152" y="15" width="96" height="40" rx="8" fill="rgba(6,182,212,0.12)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
          <text x="200" y="33" textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">MCP Server</text>
          <text x="200" y="46" textAnchor="middle" fill="#06b6d4" fontSize="9" fontFamily="monospace">tool registry</text>

          {/* Arrow right */}
          <motion.line x1="250" y1="31" x2="290" y2="31" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.5 }} />
          <path d="M288 27 L294 31 L288 35" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <text x="271" y="26" textAnchor="middle" fill="rgba(16,185,129,0.5)" fontSize="8" fontFamily="monospace">read/write</text>

          {/* Arrow left */}
          <motion.line x1="290" y1="42" x2="250" y2="42" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 0.5 }} />
          <path d="M252 38 L246 42 L252 46" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="271" y="57" textAnchor="middle" fill="rgba(245,158,11,0.5)" fontSize="8" fontFamily="monospace">output</text>

          {/* Codebase */}
          <rect x="294" y="15" width="96" height="40" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          <text x="342" y="33" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">Codebase</text>
          <text x="342" y="46" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">24+ tools</text>
        </svg>
      </motion.div>

      {/* Capability cards */}
      <div className="flex gap-4 w-full max-w-3xl mb-6">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            className="flex-1"
          >
            <Tooltip content={cap.detail}>
              <div
                className={`w-full rounded-xl border ${cap.color} px-4 py-4 text-center cursor-default hover:opacity-90 transition-opacity`}
              >
                <div className={`text-xl mb-1 ${cap.accent}`}>{cap.icon}</div>
                <div className={`text-xs font-bold ${cap.accent}`}>{cap.label}</div>
              </div>
            </Tooltip>
          </motion.div>
        ))}
      </div>

      {/* Stat */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/8 border border-emerald-500/25"
      >
        <span className="text-3xl font-black gradient-text-emerald">65%</span>
        <span className="text-sm text-slate-400">of frontend tasks automated · 48+ hours saved per week</span>
      </motion.div>
    </div>
  );
}
