import { motion } from "framer-motion";

const tools = [
  { name: "Cline", cat: "IDE Agent", icon: "🔌", color: "text-violet-300", border: "border-violet-500/20 bg-violet-500/8" },
  { name: "Claude Desktop", cat: "AI App", icon: "🤖", color: "text-orange-300", border: "border-orange-500/20 bg-orange-500/8" },
  { name: "Cursor", cat: "IDE Agent", icon: "📍", color: "text-blue-300", border: "border-blue-500/20 bg-blue-500/8" },
  { name: "VS Code Copilot", cat: "IDE Agent", icon: "💠", color: "text-cyan-300", border: "border-cyan-500/20 bg-cyan-500/8" },
  { name: "Figma MCP", cat: "Design Tool", icon: "🎨", color: "text-pink-300", border: "border-pink-500/20 bg-pink-500/8" },
  { name: "Playwright MCP", cat: "Browser", icon: "🎭", color: "text-emerald-300", border: "border-emerald-500/20 bg-emerald-500/8" },
  { name: "GitHub MCP", cat: "DevOps", icon: "🐙", color: "text-white/70", border: "border-white/12 bg-white/5" },
  { name: "Postgres MCP", cat: "Database", icon: "🗄️", color: "text-sky-300", border: "border-sky-500/20 bg-sky-500/8" },
  { name: "Slack MCP", cat: "Comms", icon: "💬", color: "text-purple-300", border: "border-purple-500/20 bg-purple-500/8" },
  { name: "AWS MCP", cat: "Cloud", icon: "☁️", color: "text-amber-300", border: "border-amber-500/20 bg-amber-500/8" },
  { name: "Sentry MCP", cat: "Monitoring", icon: "🔍", color: "text-red-300", border: "border-red-500/20 bg-red-500/8" },
  { name: "Your Tool", cat: "Custom", icon: "⚡", color: "text-emerald-400", border: "border-emerald-500/30 bg-emerald-500/10" },
];

export function MCPEcosystem() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-20" />

      {/* Ambient orbs */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", top: "20%", left: "10%" }}
      />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">The Ecosystem</p>
        <h2 className="text-4xl font-black text-white">
          One Protocol. <span className="gradient-text-violet">Endless Possibilities.</span>
        </h2>
        <p className="text-white/35 mt-2 text-sm">Every tool below is available via MCP today</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-4xl">
        {tools.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 200 }}
            className={`rounded-xl border ${t.border} px-3 py-3 flex items-center gap-2.5 ${
              t.name === "Your Tool" ? "animate-glow" : ""
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <div>
              <p className={`text-xs font-bold ${t.color}`}>{t.name}</p>
              <p className="text-[10px] text-white/25">{t.cat}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-6 text-center"
      >
        <p className="text-white/30 text-xs">
          Browse 5,000+ MCP servers at{" "}
          <span className="text-violet-300/60 font-mono">punkpeye/awesome-mcp-servers</span>
          {" "}· glama.ai/mcp · mcpservers.org
        </p>
      </motion.div>
    </div>
  );
}
