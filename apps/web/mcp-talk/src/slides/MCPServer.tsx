import { motion } from "framer-motion";

const facts = [
  {
    icon: "⚙️",
    title: "It's just a process",
    body: "An MCP server is a Node.js or Python program that runs as a subprocess (stdio) or as an HTTP server. It stays running in the background waiting for calls.",
    color: "#f97316",
  },
  {
    icon: "📋",
    title: "It registers tools",
    body: "Each tool has a name, a plain-English description, and an input schema. The AI reads the description to decide if it should use this tool.",
    color: "#60a5fa",
  },
  {
    icon: "🎯",
    title: "Descriptions drive everything",
    body: "\"Scaffold a React component\" → AI reads tool descriptions → picks component-factory → calls it. The description IS the interface.",
    color: "#fbbf24",
  },
  {
    icon: "📤",
    title: "It returns structured data",
    body: "Every tool returns a JSON result — files created, data found, errors encountered. The AI reads this and explains it to you in plain English.",
    color: "#10b981",
  },
];

export function MCPServer() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12"
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
        className="text-5xl font-black text-center mb-3"
      >
        What is an{" "}
        <span className="gradient-flame">MCP Server?</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-9 text-base text-center"
        style={{ color: "var(--muted)" }}
      >
        Not a web server. Not a cloud service. A local process that exposes functions to AI.
      </motion.p>

      <div className="grid grid-cols-2 gap-5 w-full max-w-5xl">
        {facts.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-2xl p-6 flex gap-4"
            style={{
              border: `1px solid ${f.color}22`,
              background: `${f.color}07`,
            }}
          >
            <span className="text-3xl flex-shrink-0 mt-0.5">{f.icon}</span>
            <div>
              <p className="font-bold text-base mb-1.5" style={{ color: f.color }}>
                {f.title}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {f.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-7 px-6 py-3 rounded-full"
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
