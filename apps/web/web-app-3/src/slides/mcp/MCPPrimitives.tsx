import { motion } from "framer-motion";

const primitives = [
  {
    name: "Tools",
    icon: "🔧",
    tagline: "Things the AI can DO",
    color: "border-violet-500/30 bg-violet-500/8",
    accent: "text-violet-300",
    ping: "bg-violet-400",
    description: "Executable functions the model invokes to take action.",
    examples: [
      "scaffold_component → writes files",
      "get_weather → calls API",
      "run_query → hits database",
    ],
    why: "This is what we build most often.",
  },
  {
    name: "Resources",
    icon: "📄",
    tagline: "Things the AI can READ",
    color: "border-cyan-500/30 bg-cyan-500/8",
    accent: "text-cyan-300",
    ping: "bg-cyan-400",
    description: "File-like data the model can access for context.",
    examples: [
      "file:///project/README.md",
      "db://users/schema",
      "config://env-vars",
    ],
    why: "Like giving the AI a document to read.",
  },
  {
    name: "Prompts",
    icon: "💬",
    tagline: "Things the AI can FOLLOW",
    color: "border-emerald-500/30 bg-emerald-500/8",
    accent: "text-emerald-300",
    ping: "bg-emerald-400",
    description: "Pre-built instruction templates that guide interactions.",
    examples: [
      "/review-component → code review template",
      "/write-test → test generation guide",
      "/summarise → summary workflow",
    ],
    why: "Reusable recipes for common tasks.",
  },
];

export function MCPPrimitives() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Core Concepts</p>
        <h2 className="text-5xl font-black text-white">The 3 Primitives</h2>
        <p className="text-white/35 mt-2 text-sm">Everything an MCP server can expose fits into one of these three</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-5 w-full max-w-5xl">
        {primitives.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className={`rounded-2xl border ${p.color} p-6 flex flex-col`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{p.icon}</span>
              <div>
                <h3 className={`text-lg font-black ${p.accent}`}>{p.name}</h3>
                <p className="text-xs text-white/40">{p.tagline}</p>
              </div>
            </div>

            <p className="text-sm text-white/60 mb-4 leading-relaxed">{p.description}</p>

            <div className="space-y-2 mb-4 flex-1">
              {p.examples.map((ex) => (
                <div key={ex} className="flex items-start gap-2 text-xs font-mono text-white/45">
                  <span className={`w-1 h-1 rounded-full flex-shrink-0 mt-1.5 ${p.ping}`} />
                  {ex}
                </div>
              ))}
            </div>

            <div className={`text-xs px-3 py-2 rounded-lg border ${p.color} ${p.accent} font-medium`}>
              💡 {p.why}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
