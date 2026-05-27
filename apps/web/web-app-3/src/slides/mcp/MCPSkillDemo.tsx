import { motion } from "framer-motion";

const conversation = [
  { who: "you", text: "/mcp-server-builder", color: "text-white/70" },
  { who: "cline", text: "🛠️ Starting mcp-server-builder scaffold!\n\nQ1: What's the name of your tool?\n(e.g. \"weather-fetcher\", \"db-query\", \"file-processor\")", color: "text-violet-300/80" },
  { who: "you", text: "db-query", color: "text-white/70" },
  { who: "cline", text: "Q2: Describe what it does in one sentence.\n(This becomes the AI's description — make it clear!)", color: "text-violet-300/80" },
  { who: "you", text: "Run SQL queries against a Postgres database and return results as JSON", color: "text-white/70" },
  { who: "cline", text: "Q3: What inputs does it need?\n(e.g. sql: string, db_url: string)", color: "text-violet-300/80" },
  { who: "you", text: "sql: string, db_url: string", color: "text-white/70" },
  { who: "cline", text: "✅ Generated 4 files:\n  📄 package.json\n  📄 tsconfig.json\n  📄 src/index.ts  ← McpServerBase with run_query tool\n  📄 src/index.test.ts\n\nNext: pnpm install && pnpm build → add to Cline config → done!", color: "text-emerald-300/80" },
];

export function MCPSkillDemo() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Live Demo</p>
        <h2 className="text-4xl font-black text-white">
          Using the Skill in <span className="gradient-text-violet">Cline</span>
        </h2>
        <p className="text-white/35 mt-2 text-sm">3 questions → 4 files → working MCP server</p>
      </motion.div>

      {/* Chat window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-black/50 overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>
          <span className="ml-2 text-xs text-white/25">Cline — my-project</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-ping-dot" />
        </div>

        <div className="p-4 space-y-3 overflow-auto" style={{ maxHeight: 380 }}>
          {conversation.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className={`flex gap-3 ${msg.who === "you" ? "justify-end" : "justify-start"}`}
            >
              {msg.who === "cline" && (
                <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                  msg.who === "you"
                    ? "bg-white/8 border border-white/10 text-white/70 rounded-tr-sm"
                    : "bg-violet-500/12 border border-violet-500/20 rounded-tl-sm"
                } ${msg.color}`}
              >
                {msg.text}
              </div>
              {msg.who === "you" && (
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  👤
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-5 flex gap-4 text-xs text-white/25"
      >
        <span>Install: <code className="text-white/45 font-mono">cp mcp-server-builder.md .cline/skills/</code></span>
        <span>·</span>
        <span>Invoke: <code className="text-white/45 font-mono">/mcp-server-builder</code> in Cline chat</span>
      </motion.div>
    </div>
  );
}
