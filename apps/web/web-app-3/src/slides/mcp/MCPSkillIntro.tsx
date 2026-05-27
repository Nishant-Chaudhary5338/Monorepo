import { motion } from "framer-motion";

const pain = [
  "Copy package.json from another project",
  "Fix the name, version, scripts…",
  "Copy tsconfig.json, remember all the ESM flags",
  "Write the McpServerBase class from scratch",
  "Forget to add chmod +x in build script",
  "Write the test file boilerplate",
  "Finally: it works! …30 mins later",
];

export function MCPSkillIntro() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">The Problem</p>
        <h2 className="text-4xl font-black text-white">Want to BUILD a new MCP server?</h2>
        <p className="text-white/35 mt-2 text-base">Starting from scratch is painful. Every. Single. Time.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl items-start">
        {/* Pain points */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6"
        >
          <p className="text-xs uppercase tracking-wider text-red-400/60 mb-4 font-medium">Without the skill</p>
          <div className="space-y-2">
            {pain.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-2 text-sm text-red-300/60"
              >
                <span className="text-red-500/40 flex-shrink-0 mt-0.5">✗</span>
                <span className={i === pain.length - 1 ? "text-red-400/80 font-semibold" : ""}>{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-6"
        >
          <p className="text-xs uppercase tracking-wider text-emerald-400/60 mb-4 font-medium">With mcp-server-builder</p>

          <div className="text-center mb-6">
            <p className="text-5xl mb-2">⚡</p>
            <p className="text-2xl font-black text-emerald-300">30 seconds</p>
            <p className="text-sm text-white/45 mt-1">Answer 3 questions → get 4 files</p>
          </div>

          <div className="space-y-2">
            {["package.json — correct scripts + deps", "tsconfig.json — ESM + strict + all flags", "src/index.ts — typed McpServerBase subclass", "src/index.test.ts — Vitest tests included"].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-emerald-300"
              >
                <span className="text-emerald-400">✓</span> {f}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 text-xs text-emerald-400/50 border-t border-emerald-500/15 pt-3">
            Just type{" "}
            <code className="text-emerald-300 font-mono bg-black/20 px-1.5 py-0.5 rounded">/mcp-server-builder</code>
            {" "}in Cline and follow the prompts.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
