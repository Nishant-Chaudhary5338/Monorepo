import { motion } from "framer-motion";

const rows = [
  { aspect: "Where it runs", stdio: "Your machine (local process)", http: "Any server / cloud" },
  { aspect: "Speed", stdio: "⚡ Ultra fast (in-process pipes)", http: "Network latency (~50-300ms)" },
  { aspect: "Setup", stdio: "Just a node/python command", http: "Deploy a server, expose a URL" },
  { aspect: "Port required", stdio: "❌ No ports needed", http: "✅ Needs an HTTP port" },
  { aspect: "Auth", stdio: "OS process isolation", http: "API keys / OAuth headers" },
  { aspect: "Shared with team", stdio: "❌ Local only", http: "✅ Everyone connects" },
  { aspect: "Best for", stdio: "Dev tools, file ops, CI tasks", http: "Figma, Slack, DB proxies" },
  { aspect: "Office example", stdio: "mcp-toolkit tools", http: "figma-official MCP" },
];

export function MCPTransportCompare() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Transport Comparison</p>
        <h2 className="text-4xl font-black text-white">stdio vs HTTP — When to Use What</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-3xl rounded-2xl border border-white/8 overflow-hidden"
      >
        {/* Header row */}
        <div className="grid grid-cols-3 bg-white/4 border-b border-white/8">
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30">Aspect</div>
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-violet-400 border-l border-white/8">
            stdio (local)
          </div>
          <div className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-cyan-400 border-l border-white/8">
            HTTP (remote)
          </div>
        </div>

        {/* Data rows */}
        {rows.map((row, i) => (
          <motion.div
            key={row.aspect}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className="grid grid-cols-3 border-b border-white/5 last:border-b-0 hover:bg-white/2 transition-colors"
          >
            <div className="px-4 py-2.5 text-xs text-white/40 font-medium">{row.aspect}</div>
            <div className="px-4 py-2.5 text-xs text-violet-300/80 border-l border-white/5">{row.stdio}</div>
            <div className="px-4 py-2.5 text-xs text-cyan-300/80 border-l border-white/5">{row.http}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-5 flex gap-6 text-xs text-white/25"
      >
        <span>💡 Use <span className="text-violet-300/60">stdio</span> for your own tools (default)</span>
        <span>·</span>
        <span>💡 Use <span className="text-cyan-300/60">HTTP</span> when the team shares a server</span>
      </motion.div>
    </div>
  );
}
