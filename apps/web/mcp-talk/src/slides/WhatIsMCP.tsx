import { motion } from "framer-motion";

const before = [
  { ai: "ChatGPT",  tool: "GitHub",    color: "#10b981" },
  { ai: "Claude",   tool: "Jira",      color: "#6366f1" },
  { ai: "Gemini",   tool: "Postgres",  color: "#f59e0b" },
  { ai: "Copilot",  tool: "Slack",     color: "#ec4899" },
];

export function WhatIsMCP() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mono text-xs tracking-[0.3em] uppercase mb-4"
        style={{ color: "rgba(249,115,22,0.6)" }}
      >
        The Problem
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl font-black text-center mb-3"
      >
        Every AI talks a{" "}
        <span className="gradient-flame">different language</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 text-center text-lg"
        style={{ color: "var(--muted)" }}
      >
        4 AI models × 5 tools = 20 custom integrations. Every. Time.
      </motion.p>

      <div className="flex items-center gap-10 w-full max-w-4xl">
        {/* Before: tangled lines */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 rounded-2xl p-5"
          style={{
            border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.04)",
          }}
        >
          <p className="text-xs mono mb-4" style={{ color: "rgba(239,68,68,0.7)" }}>
            ✗ BEFORE MCP
          </p>
          <div className="space-y-2">
            {before.map((b, i) => (
              <motion.div
                key={b.ai}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ background: `${b.color}18`, color: b.color, minWidth: 68, textAlign: "center" }}
                >
                  {b.ai}
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(239,68,68,0.25)", borderTop: "1px dashed rgba(239,68,68,0.3)" }} />
                <span className="text-xs" style={{ color: "var(--muted)", minWidth: 60 }}>
                  {b.tool}
                </span>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-xs text-center" style={{ color: "rgba(239,68,68,0.5)" }}>
            custom glue for every pair 😭
          </p>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="text-3xl flex-shrink-0"
        >
          →
        </motion.div>

        {/* After: MCP hub */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="flex-1 rounded-2xl p-5 glow-flame"
          style={{
            border: "1px solid rgba(249,115,22,0.25)",
            background: "rgba(249,115,22,0.05)",
          }}
        >
          <p className="text-xs mono mb-4" style={{ color: "rgba(249,115,22,0.7)" }}>
            ✓ WITH MCP
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {["ChatGPT", "Claude", "Gemini", "Copilot"].map((ai) => (
                <span
                  key={ai}
                  className="text-[10px] font-bold px-2 py-1 rounded"
                  style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}
                >
                  {ai}
                </span>
              ))}
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>↓ one protocol</div>
            <div
              className="px-6 py-2 rounded-xl font-black text-sm glow-flame"
              style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(251,191,36,0.1))",
                border: "1px solid rgba(249,115,22,0.4)",
                color: "#f97316",
              }}
            >
              MCP
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>↓ any tool</div>
            <div className="flex gap-2">
              {["GitHub", "Jira", "Postgres", "Slack"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-bold px-2 py-1 rounded"
                  style={{ background: "rgba(249,115,22,0.1)", color: "#fb923c" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs text-center" style={{ color: "rgba(249,115,22,0.6)" }}>
            N + M instead of N × M 🎉
          </p>
        </motion.div>
      </div>
    </div>
  );
}
