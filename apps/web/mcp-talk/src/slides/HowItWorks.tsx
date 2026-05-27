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
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

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
        className="text-5xl font-black text-center mb-3"
      >
        Ask. Route.{" "}
        <span className="gradient-flame">Execute.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 text-center text-base"
        style={{ color: "var(--muted)" }}
      >
        Every MCP call is just JSON-RPC — ultra-fast, fully local
      </motion.p>

      <div className="flex items-stretch gap-4 w-full max-w-5xl">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.12, type: "spring", stiffness: 180 }}
            className="flex-1 rounded-2xl p-7 flex flex-col gap-4"
            style={{ border: `1px solid ${s.borderColor}`, background: s.bg }}
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="mono text-xs font-bold mb-1" style={{ color: s.color }}>
                {s.num}
              </p>
              <p className="text-base font-bold" style={{ color: "var(--text)" }}>
                {s.label}
              </p>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                {s.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wire label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex items-center gap-3"
      >
        <div
          className="h-px flex-1"
          style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)", width: 200 }}
        />
        <span className="mono text-xs px-3 py-1 rounded-full" style={{ border: "1px solid rgba(249,115,22,0.2)", color: "rgba(249,115,22,0.6)" }}>
          JSON-RPC 2.0 wire protocol
        </span>
        <div
          className="h-px flex-1"
          style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)", width: 200 }}
        />
      </motion.div>
    </div>
  );
}
