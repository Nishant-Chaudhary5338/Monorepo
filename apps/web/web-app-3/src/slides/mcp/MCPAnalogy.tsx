import { motion } from "framer-motion";

const before = ["Lightning ⚡", "Micro-USB", "MagSafe", "Barrel Jack", "30-pin"];
const after = ["Claude", "GPT", "Gemini", "Cursor", "Cline"];

export function MCPAnalogy() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-3 font-medium">The Analogy</p>
        <h2 className="text-5xl font-black text-white">
          MCP is the <span className="gradient-text-violet">USB-C</span> for AI
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-10 w-full max-w-4xl">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6"
        >
          <p className="text-xs tracking-widest uppercase text-red-400/60 mb-4 font-medium">Before — Hardware</p>
          <div className="flex flex-col gap-2 mb-4">
            {before.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-red-300/70"
              >
                <span className="text-red-500/40">✕</span> {item} connector
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-red-400/50 border-t border-red-500/15 pt-3">
            Every device has its own cable. Nothing is compatible.
          </p>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-6"
        >
          <p className="text-xs tracking-widest uppercase text-emerald-400/60 mb-4 font-medium">After — MCP Standard</p>
          <div className="flex flex-col gap-2 mb-4">
            {after.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-emerald-300"
              >
                <span className="text-emerald-400">✓</span>{" "}
                <span className="text-white/70">{item}</span>
                <span className="text-emerald-400/50 text-xs">→ any MCP server</span>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-emerald-400/60 border-t border-emerald-500/15 pt-3">
            One standard. Every AI model talks to every tool.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-8 px-6 py-3 rounded-2xl border border-violet-500/20 bg-violet-500/8 text-center max-w-xl"
      >
        <p className="text-white/70 text-sm">
          <span className="text-violet-300 font-semibold">Build the server once</span>
          {" "}— Claude, Cline, Cursor, and any future model can all use it.
          <span className="text-violet-300 font-semibold"> No rewrites.</span>
        </p>
      </motion.div>
    </div>
  );
}
