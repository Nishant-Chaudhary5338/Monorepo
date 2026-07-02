import { motion } from "framer-motion";

const facts = [
  {
    icon: "⚙️",
    title: "It's just a process",
    body: "An MCP server is a Node.js or Python program that runs as a subprocess (stdio) or as an HTTP server. It stays running in the background waiting for calls.",
    color: "#f97316",
    border: "rgba(249,115,22,0.2)",
    bg: "rgba(249,115,22,0.05)",
  },
  {
    icon: "📋",
    title: "It registers tools",
    body: "Each tool has a name, a plain-English description, and an input schema. The AI reads the description to decide if it should use this tool.",
    color: "#60a5fa",
    border: "rgba(96,165,250,0.2)",
    bg: "rgba(96,165,250,0.05)",
  },
  {
    icon: "🎯",
    title: "Descriptions drive everything",
    body: "\"Scaffold a React component\" → AI reads tool descriptions → picks component-factory → calls it. The description IS the interface.",
    color: "#fbbf24",
    border: "rgba(251,191,36,0.2)",
    bg: "rgba(251,191,36,0.04)",
  },
  {
    icon: "📤",
    title: "It returns structured data",
    body: "Every tool returns a JSON result — files created, data found, errors encountered. The AI reads this and explains it to you in plain English.",
    color: "#10b981",
    border: "rgba(16,185,129,0.2)",
    bg: "rgba(16,185,129,0.04)",
  },
];

export function MCPServer() {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden px-12 pt-12 pb-10"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
          bottom: "5%", left: "0%",
        }}
      />

      {/* Header */}
      <div className="shrink-0 flex flex-col items-center text-center mb-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mono text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(249,115,22,0.6)" }}
        >
          Core Concept
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black mb-3"
        >
          What is an{" "}
          <span className="gradient-flame">MCP Server?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg"
          style={{ color: "var(--muted)" }}
        >
          Not a web server. Not a cloud service. A local process that exposes functions to AI.
        </motion.p>
      </div>

      {/* 2×2 grid — fills remaining height */}
      <div
        className="flex-1 min-h-0 grid grid-cols-2 gap-5 w-full max-w-5xl mx-auto"
        style={{ gridAutoRows: "1fr" }}
      >
        {facts.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-2xl p-7 flex gap-5"
            style={{ border: `1px solid ${f.border}`, background: f.bg }}
          >
            <span className="text-4xl shrink-0 mt-1">{f.icon}</span>
            <div className="flex flex-col justify-center">
              <p className="font-bold text-lg mb-2" style={{ color: f.color }}>
                {f.title}
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                {f.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="shrink-0 mt-5 px-6 py-3 rounded-full self-center"
        style={{
          border: "1px solid rgba(249,115,22,0.25)",
          background: "rgba(249,115,22,0.06)",
        }}
      >
        <p className="text-sm text-center">
          <span className="mono font-bold" style={{ color: "#f97316" }}>component-factory</span>
          <span style={{ color: "var(--muted)" }}> is an MCP server. It runs as a Node process. Cline calls it. You just ask in plain English.</span>
        </p>
      </motion.div>
    </div>
  );
}
