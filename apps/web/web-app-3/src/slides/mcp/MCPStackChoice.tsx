import { motion } from "framer-motion";

const tsPoints = [
  { pro: true, text: "Strong typing — catch bugs at compile time" },
  { pro: true, text: "McpServerBase — zero boilerplate" },
  { pro: true, text: "Best for: frontend tooling, file gen, UI automation" },
  { pro: true, text: "Runs with: node build/index.js" },
  { pro: false, text: "Less natural for data science / ML tasks" },
  { pro: false, text: "Needs build step (tsc or tsup)" },
];

const pyPoints = [
  { pro: true, text: "FastMCP — decorator-based, 20 lines to working tool" },
  { pro: true, text: "Docstring = auto description (the AI reads it!)" },
  { pro: true, text: "Best for: DB queries, data analysis, REST wrappers" },
  { pro: true, text: "Huge ecosystem: pandas, SQLAlchemy, requests, boto3" },
  { pro: false, text: "Dynamic typing can hide bugs at runtime" },
  { pro: false, text: "Need to manage virtualenv / dependencies" },
];

export function MCPStackChoice() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Stack Decision</p>
        <h2 className="text-4xl font-black text-white">TypeScript vs Python</h2>
        <p className="text-white/35 mt-2 text-sm">Both use the same protocol. Pick what your team knows.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {/* TypeScript */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-violet-500/25 bg-violet-500/6 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🟦</span>
            <div>
              <h3 className="text-lg font-black text-violet-300">TypeScript / Node</h3>
              <p className="text-xs text-white/35">For frontend & fullstack teams</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {tsPoints.map((p) => (
              <div key={p.text} className="flex items-start gap-2">
                <span className={`text-sm flex-shrink-0 mt-0.5 ${p.pro ? "text-emerald-400" : "text-red-400/60"}`}>
                  {p.pro ? "✓" : "✗"}
                </span>
                <p className={`text-sm leading-snug ${p.pro ? "text-white/70" : "text-white/35"}`}>{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 font-mono text-xs bg-black/30 rounded-lg p-3 text-violet-300/70">
            node build/index.js
          </div>
        </motion.div>

        {/* Python */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-amber-500/25 bg-amber-500/6 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🐍</span>
            <div>
              <h3 className="text-lg font-black text-amber-300">Python / FastMCP</h3>
              <p className="text-xs text-white/35">For backend & data teams</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {pyPoints.map((p) => (
              <div key={p.text} className="flex items-start gap-2">
                <span className={`text-sm flex-shrink-0 mt-0.5 ${p.pro ? "text-emerald-400" : "text-red-400/60"}`}>
                  {p.pro ? "✓" : "✗"}
                </span>
                <p className={`text-sm leading-snug ${p.pro ? "text-white/70" : "text-white/35"}`}>{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 font-mono text-xs bg-black/30 rounded-lg p-3 text-amber-300/70">
            python server.py
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 px-5 py-3 rounded-2xl border border-white/8 bg-white/3 text-center"
      >
        <p className="text-white/50 text-sm">
          🤝 They work side by side — your frontend team's TS tools + your backend team's Python tools can{" "}
          <span className="text-white/80 font-semibold">all be configured in the same Cline MCP settings</span>.
        </p>
      </motion.div>
    </div>
  );
}
