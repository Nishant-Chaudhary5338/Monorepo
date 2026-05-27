import { motion } from "framer-motion";

const steps = [
  {
    cmd: "git clone https://github.com/Nishant-Chaudhary5338/mcp-toolkit",
    label: "Clone the repo",
    color: "text-cyan-300/80",
  },
  {
    cmd: "cd mcp-toolkit && pnpm install",
    label: "Install dependencies",
    color: "text-violet-300/80",
  },
  {
    cmd: "pnpm build  # builds all 9 tools",
    label: "Build all tools",
    color: "text-amber-300/80",
  },
  {
    cmd: `# Add to cline_mcp_settings.json:\n"component-factory": {\n  "type": "stdio",\n  "command": "node",\n  "args": [\n    "./tools/component-factory/build/index.js"\n  ]\n}`,
    label: "Add to Cline config",
    color: "text-emerald-300/80",
    multiline: true,
  },
];

const prompts = [
  '"Scaffold a Button component with tests and stories"',
  '"Check accessibility of my Dashboard component"',
  '"Generate Vitest tests for my utils/api.ts file"',
  '"Run a full quality audit on my src/ directory"',
];

export function MCPClineUse() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-emerald-400/60 mb-3 font-medium">Hands-On</p>
        <h2 className="text-4xl font-black text-white">
          Using <span className="gradient-text-emerald">mcp-toolkit</span> with Cline Right Now
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Setup steps */}
        <div>
          <p className="text-xs tracking-widest uppercase text-white/25 mb-3 font-medium">Setup (once)</p>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="rounded-xl border border-white/8 bg-black/30 overflow-hidden"
              >
                <div className="px-3 py-1.5 border-b border-white/5 bg-white/3">
                  <span className="text-xs text-white/30 font-medium">{step.label}</span>
                </div>
                <pre className={`px-4 py-3 text-xs font-mono leading-relaxed ${step.color}`}>
                  {step.cmd}
                </pre>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Example prompts */}
        <div>
          <p className="text-xs tracking-widest uppercase text-white/25 mb-3 font-medium">Then just ask Cline</p>
          <div className="space-y-3">
            {prompts.map((prompt, i) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 px-4 py-4 rounded-xl border border-emerald-500/15 bg-emerald-500/6"
              >
                <span className="text-emerald-400 text-sm flex-shrink-0 mt-0.5">✦</span>
                <p className="text-sm text-white/70 italic leading-snug">{prompt}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-4 px-4 py-3 rounded-xl border border-white/8 bg-white/3"
          >
            <p className="text-xs text-white/40 leading-relaxed">
              🔑 Cline automatically picks the right tool, calls it with the right args,
              and reports back — you never write any tool-call code yourself.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
