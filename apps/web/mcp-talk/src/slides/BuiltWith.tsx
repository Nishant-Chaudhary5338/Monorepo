import { motion } from "framer-motion";

const stack = [
  {
    name: "@modelcontextprotocol/sdk",
    by: "Anthropic — open source, MIT",
    role: "The official MCP TypeScript SDK. Handles all JSON-RPC protocol, tool registration, and request/response lifecycle.",
    link: "github.com/modelcontextprotocol/typescript-sdk",
    badge: "TypeScript",
    badgeColor: "#3b82f6",
    icon: "🦜",
    highlight: true,
  },
  {
    name: "McpServerBase",
    by: "Nishant Chaudhary — internal wrapper",
    role: "Custom abstract class on top of the SDK. Eliminates boilerplate — extend it, register tools, call .run().",
    link: "tools/_shared/src/mcp-server/McpServerBase.ts",
    badge: "Our wrapper",
    badgeColor: "#f97316",
    icon: "🔧",
    highlight: false,
  },
  {
    name: "fastmcp",
    by: "jlowin — open source, MIT",
    role: "Python equivalent of the SDK. Decorator-based API — @mcp.tool() wraps any function as an MCP tool instantly.",
    link: "github.com/jlowin/fastmcp",
    badge: "Python",
    badgeColor: "#f59e0b",
    icon: "🐍",
    highlight: false,
  },
  {
    name: "zod",
    by: "Colin McDonnell — open source, MIT",
    role: "TypeScript-first schema validation. Used at every tool boundary to validate arguments from the AI before executing.",
    link: "github.com/colinhacks/zod",
    badge: "TypeScript",
    badgeColor: "#3b82f6",
    icon: "🛡️",
    highlight: false,
  },
];

export function BuiltWith() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Flame orb */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute pointer-events-none"
        style={{
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
          top: "20%", right: "5%",
        }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mono text-xs tracking-[0.3em] uppercase mb-3"
        style={{ color: "rgba(249,115,22,0.6)" }}
      >
        Open Source Stack
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl font-black text-center mb-3"
      >
        What we build <span className="gradient-flame">on top of</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-base text-center"
        style={{ color: "var(--muted)" }}
      >
        Every custom tool in mcp-toolkit sits on these open source foundations
      </motion.p>

      <div className="grid grid-cols-2 gap-5 w-full max-w-5xl">
        {stack.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1 }}
            className="rounded-2xl p-7"
            style={{
              border: s.highlight
                ? "1px solid rgba(249,115,22,0.35)"
                : "1px solid rgba(255,255,255,0.07)",
              background: s.highlight
                ? "rgba(249,115,22,0.06)"
                : "rgba(255,255,255,0.025)",
              boxShadow: s.highlight ? "0 0 24px rgba(249,115,22,0.08)" : "none",
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full mono"
                  style={{ background: `${s.badgeColor}18`, color: s.badgeColor }}
                >
                  {s.badge}
                </span>
              </div>
            </div>
            <p className="text-sm font-black mb-0.5 mono" style={{ color: "var(--text)" }}>
              {s.name}
            </p>
            <p className="text-[11px] mb-2" style={{ color: "var(--muted)" }}>
              {s.by}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(226,232,240,0.6)" }}>
              {s.role}
            </p>
            <p className="mt-2 text-[10px] mono" style={{ color: "var(--muted-2)" }}>
              {s.link}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
