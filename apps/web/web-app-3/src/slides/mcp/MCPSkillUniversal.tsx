import { motion } from "framer-motion";

const hosts = [
  {
    name: "Cline",
    icon: "🔌",
    color: "text-violet-300",
    border: "border-violet-500/30 bg-violet-500/8",
    install: ".cline/skills/mcp-server-builder.md",
    invoke: "Type /mcp-server-builder in chat",
    status: "✅ Supported",
  },
  {
    name: "Claude Code",
    icon: "🤖",
    color: "text-cyan-300",
    border: "border-cyan-500/30 bg-cyan-500/8",
    install: "anthropics/skills PR #1188",
    invoke: "Type /mcp-server-builder in terminal",
    status: "🟡 PR open (1 approval)",
  },
  {
    name: "Cursor",
    icon: "📍",
    color: "text-emerald-300",
    border: "border-emerald-500/30 bg-emerald-500/8",
    install: ".cursor/skills/ directory",
    invoke: "@ mention in Cursor Agent",
    status: "✅ Supported",
  },
];

export function MCPSkillUniversal() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-15" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Universal Format</p>
        <h2 className="text-4xl font-black text-white">
          One <span className="gradient-text-violet">SKILL.md</span> — Works Everywhere
        </h2>
        <p className="text-white/35 mt-2 text-sm">
          The same file format works in Cline, Claude Code, Cursor, and any tool that supports SKILL.md
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-5 w-full max-w-5xl mb-8">
        {hosts.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className={`rounded-2xl border ${h.border} p-5`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{h.icon}</span>
              <h3 className={`text-lg font-black ${h.color}`}>{h.name}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Install path</p>
                <code className="text-xs font-mono text-white/55 leading-relaxed">{h.install}</code>
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">How to invoke</p>
                <p className="text-xs text-white/55">{h.invoke}</p>
              </div>
              <div className={`text-xs font-semibold ${h.color} mt-2`}>{h.status}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SKILL.md anatomy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-5xl rounded-2xl border border-white/8 bg-black/30 overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6 bg-white/3">
          <span className="text-xs text-white/25 font-mono">.cline/skills/mcp-server-builder.md</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium">
            Nishant's skill · PR #1188
          </span>
        </div>
        <pre className="px-5 py-4 text-[11px] font-mono leading-relaxed text-white/55">
          <span className="text-amber-300/70">---</span>{"\n"}
          <span className="text-cyan-300/70">name</span>
          <span className="text-white/40">: mcp-server-builder</span>{"\n"}
          <span className="text-cyan-300/70">description</span>
          <span className="text-white/40">: Scaffold a production-ready MCP server in TypeScript using McpServerBase pattern</span>{"\n"}
          <span className="text-amber-300/70">---</span>{"\n\n"}
          <span className="text-white/30">## What it does</span>{"\n"}
          <span className="text-white/50">Generates: package.json, tsconfig.json, src/index.ts (McpServerBase subclass), src/index.test.ts</span>{"\n\n"}
          <span className="text-white/30">## Usage</span>{"\n"}
          <span className="text-white/50">Claude asks for: tool name, description, input/output shape → generates all files immediately</span>
        </pre>
      </motion.div>
    </div>
  );
}
