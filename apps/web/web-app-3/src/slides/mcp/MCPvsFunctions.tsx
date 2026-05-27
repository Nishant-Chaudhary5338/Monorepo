import { motion } from "framer-motion";

const rows = [
  { aspect: "Where code lives", fc: "Embedded in your app", mcp: "Separate server process" },
  { aspect: "Reusability", fc: "One app only", mcp: "Any AI client can use it" },
  { aspect: "Model support", fc: "Vendor-specific (OpenAI syntax)", mcp: "Any model (Claude, GPT, Gemini)" },
  { aspect: "Setup", fc: "5 minutes — just pass the schema", mcp: "15 minutes — build + configure" },
  { aspect: "Scales to 20+ tools", fc: "❌ Gets messy fast", mcp: "✅ Each tool is its own server" },
  { aspect: "Version control", fc: "Mixed with app code", mcp: "Independent repository" },
  { aspect: "Testing", fc: "Mock API in app tests", mcp: "Test the tool independently" },
  { aspect: "Team sharing", fc: "Tied to one codebase", mcp: "One server, whole team uses it" },
];

export function MCPvsFunctions() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Architecture Decision</p>
        <h2 className="text-4xl font-black text-white">MCP vs Function Calling</h2>
        <p className="text-white/35 mt-2 text-sm">Both let AI call code. The difference is architecture and scale.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl rounded-2xl border border-white/8 overflow-hidden"
      >
        <div className="grid grid-cols-3 border-b border-white/8">
          <div className="px-4 py-3 bg-white/4 text-xs font-bold uppercase tracking-wider text-white/30">Aspect</div>
          <div className="px-4 py-3 bg-orange-500/8 border-l border-white/8 text-xs font-bold uppercase tracking-wider text-orange-400">
            Function Calling
          </div>
          <div className="px-4 py-3 bg-violet-500/8 border-l border-white/8 text-xs font-bold uppercase tracking-wider text-violet-400">
            MCP
          </div>
        </div>

        {rows.map((row, i) => (
          <motion.div
            key={row.aspect}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.07 }}
            className="grid grid-cols-3 border-b border-white/5 last:border-b-0 hover:bg-white/2 transition-colors"
          >
            <div className="px-4 py-2.5 text-xs text-white/40 font-medium">{row.aspect}</div>
            <div className="px-4 py-2.5 text-xs text-orange-300/70 border-l border-white/5 leading-snug">{row.fc}</div>
            <div className="px-4 py-2.5 text-xs text-violet-300/80 border-l border-white/5 leading-snug">{row.mcp}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-5 grid grid-cols-2 gap-4 w-full max-w-4xl"
      >
        <div className="px-4 py-3 rounded-xl border border-orange-500/20 bg-orange-500/6 text-xs text-white/50">
          <span className="text-orange-300 font-semibold">Use function calling when:</span>{" "}
          Quick prototype, 1-3 tools, single app, don't want to maintain a server.
        </div>
        <div className="px-4 py-3 rounded-xl border border-violet-500/20 bg-violet-500/6 text-xs text-white/50">
          <span className="text-violet-300 font-semibold">Use MCP when:</span>{" "}
          Production system, 4+ tools, multiple apps/teams, need reusability and independence.
        </div>
      </motion.div>
    </div>
  );
}
