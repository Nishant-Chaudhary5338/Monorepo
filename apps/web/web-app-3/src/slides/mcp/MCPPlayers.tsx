import { motion } from "framer-motion";

const players = [
  {
    role: "Host",
    icon: "🖥️",
    color: "border-violet-500/30 bg-violet-500/8",
    accent: "text-violet-300",
    desc: "The environment where the AI lives",
    examples: ["VS Code + Cline", "Claude Desktop", "Cursor IDE"],
  },
  {
    role: "Client",
    icon: "🔗",
    color: "border-amber-500/30 bg-amber-500/8",
    accent: "text-amber-300",
    desc: "Manages the MCP connection inside the host",
    examples: ["Built into Cline", "Built into Claude", "Your app code"],
  },
  {
    role: "Server",
    icon: "⚙️",
    color: "border-cyan-500/30 bg-cyan-500/8",
    accent: "text-cyan-300",
    desc: "Exposes tools, resources, or prompts to the AI",
    examples: ["component-factory", "figma-official", "your-python-tool"],
  },
];

export function MCPPlayers() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Architecture</p>
        <h2 className="text-5xl font-black text-white">The 3 Players</h2>
      </motion.div>

      {/* Flow diagram */}
      <div className="flex items-center gap-0 w-full max-w-5xl">
        {players.map((p, i) => (
          <div key={p.role} className="flex items-center flex-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.2 }}
              className={`flex-1 rounded-2xl border ${p.color} p-6`}
            >
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className={`text-xl font-black mb-1 ${p.accent}`}>{p.role}</h3>
              <p className="text-white/50 text-sm mb-4 leading-snug">{p.desc}</p>
              <div className="space-y-1.5">
                {p.examples.map((ex) => (
                  <div key={ex} className="flex items-center gap-2 text-xs text-white/40">
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${p.accent} opacity-60`} style={{ background: "currentColor" }} />
                    {ex}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Arrow between players */}
            {i < players.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6 + i * 0.2 }}
                className="flex flex-col items-center gap-1 px-3 flex-shrink-0"
              >
                <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                  <path d="M2 12H38" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" className="animate-flow" />
                  <path d="M30 6l8 6-8 6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs text-white/20 font-mono">JSON-RPC</span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-8 text-center"
      >
        <p className="text-white/30 text-sm">
          Real example: <span className="text-white/60">VS Code + Cline</span>
          {" "}→{" "}<span className="text-white/60">Cline MCP Client</span>
          {" "}↔{" "}<span className="text-cyan-400/70">component-factory server</span>
        </p>
      </motion.div>
    </div>
  );
}
