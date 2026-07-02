import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    icon: "🤖",
    label: "You ask Cline",
    detail: "\"Scaffold a Button component with tests\"",
    color: "#60a5fa",
    borderColor: "rgba(96,165,250,0.25)",
    bg: "rgba(96,165,250,0.06)",
  },
  {
    num: "02",
    icon: "🔌",
    label: "MCP routes the request",
    detail: "Cline reads the tool list, picks the right MCP server",
    color: "#f97316",
    borderColor: "rgba(249,115,22,0.3)",
    bg: "rgba(249,115,22,0.06)",
  },
  {
    num: "03",
    icon: "⚡",
    label: "Tool executes locally",
    detail: "A Node.js or Python process runs — no cloud, no latency",
    color: "#fbbf24",
    borderColor: "rgba(251,191,36,0.25)",
    bg: "rgba(251,191,36,0.05)",
  },
  {
    num: "04",
    icon: "✅",
    label: "Result back to AI",
    detail: "Files created, data returned — AI explains what it did",
    color: "#10b981",
    borderColor: "rgba(16,185,129,0.25)",
    bg: "rgba(16,185,129,0.05)",
  },
];

export function HowItWorks() {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden px-12 pt-12 pb-10"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 flex flex-col items-center text-center mb-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mono text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(249,115,22,0.6)" }}
        >
          How It Works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black mb-3"
        >
          Ask. Route.{" "}
          <span className="gradient-flame">Execute.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg"
          style={{ color: "var(--muted)" }}
        >
          Every MCP call is just JSON-RPC — ultra-fast, fully local
        </motion.p>
      </div>

      {/* Cards — fill remaining space */}
      <div className="flex-1 min-h-0 flex items-stretch gap-4 w-full max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1 }}
            className="flex-1 rounded-2xl p-7 flex flex-col"
            style={{ border: `1px solid ${s.borderColor}`, background: s.bg }}
          >
            <span className="text-4xl mb-4">{s.icon}</span>
            <p className="mono text-xs font-bold mb-2" style={{ color: s.color }}>
              {s.num}
            </p>
            <p className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>
              {s.label}
            </p>
            <p className="text-base leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
              {s.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Wire protocol label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="shrink-0 mt-5 flex items-center justify-center gap-3"
      >
        <div className="h-px w-40" style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.3))" }} />
        <span className="mono text-xs px-3 py-1 rounded-full" style={{ border: "1px solid rgba(249,115,22,0.2)", color: "rgba(249,115,22,0.6)" }}>
          JSON-RPC 2.0 wire protocol
        </span>
        <div className="h-px w-40" style={{ background: "linear-gradient(90deg, rgba(249,115,22,0.3), transparent)" }} />
      </motion.div>
    </div>
  );
}
