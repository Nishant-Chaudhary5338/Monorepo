import { motion } from "framer-motion";

const contributions = [
  {
    status: "✅ Merged",
    title: "punkpeye/awesome-mcp-servers",
    desc: "mcp-toolkit listed in the largest MCP directory. Invited to MCP Discord.",
    color: "border-emerald-500/30 bg-emerald-500/8",
    labelColor: "text-emerald-400",
    url: "github.com/punkpeye/awesome-mcp-servers",
  },
  {
    status: "🟡 Open",
    title: "anthropics/skills PR #1188",
    desc: "feat: add mcp-server-builder skill — 1 approval from @Chege1234. Waiting for maintainer merge.",
    color: "border-amber-500/30 bg-amber-500/8",
    labelColor: "text-amber-400",
    url: "github.com/anthropics/skills/pull/1188",
  },
  {
    status: "🟡 Open",
    title: "typescript-sdk PR #2148",
    desc: "feat(examples): multi-server chatbot with tool routing — Anthropic SDK + full chatbot loop.",
    color: "border-amber-500/30 bg-amber-500/8",
    labelColor: "text-amber-400",
    url: "github.com/modelcontextprotocol/typescript-sdk/pull/2148",
  },
  {
    status: "🟡 Open",
    title: "typescript-sdk PR #2147",
    desc: "feat(example): add tool list changed notification example.",
    color: "border-amber-500/30 bg-amber-500/8",
    labelColor: "text-amber-400",
    url: "github.com/modelcontextprotocol/typescript-sdk/pull/2147",
  },
  {
    status: "🚀 Live",
    title: "mcp-toolkit — open source repo",
    desc: "9 tools · 134 tests · CI green · Listed on GitHub topics, Glama, PulseMCP",
    color: "border-violet-500/30 bg-violet-500/8",
    labelColor: "text-violet-400",
    url: "github.com/Nishant-Chaudhary5338/mcp-toolkit",
  },
  {
    status: "🔜 Soon",
    title: "npm publish @mcp-toolkit/*",
    desc: "Publishing each tool as an individual npm package. pip install mcp-toolkit for Python.",
    color: "border-white/12 bg-white/4",
    labelColor: "text-white/45",
    url: "npmjs.com/@mcp-toolkit",
  },
];

export function MCPContributions() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12 pt-14">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-15" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Open Source Contributions</p>
        <h2 className="text-4xl font-black text-white">
          Nishant's <span className="gradient-text-violet">MCP Work</span>
        </h2>
        <p className="text-white/35 mt-2 text-sm">Built with, for, and alongside the MCP community</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-5xl mb-6">
        {contributions.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className={`rounded-xl border ${c.color} px-4 py-3`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-sm font-bold text-white/80 leading-snug">{c.title}</h3>
              <span className={`text-xs font-semibold shrink-0 ${c.labelColor}`}>{c.status}</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-1.5">{c.desc}</p>
            <code className="text-[10px] font-mono text-white/20">{c.url}</code>
          </motion.div>
        ))}
      </div>

      {/* Q&A prompt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full max-w-5xl rounded-2xl border border-violet-500/20 bg-violet-500/8 py-4 px-6 text-center"
      >
        <p className="text-2xl font-black text-white mb-1">Questions? 🙋</p>
        <p className="text-white/40 text-sm">
          Ask anything — MCP, the tools, the PRs, how to use it in your projects.
        </p>
        <div className="flex items-center justify-center gap-6 mt-3 text-xs text-white/25">
          <span>github.com/<span className="text-white/50">Nishant-Chaudhary5338</span></span>
          <span>·</span>
          <span>email: <span className="text-white/50">nishantchaudhary.dev@gmail.com</span></span>
        </div>
      </motion.div>
    </div>
  );
}
