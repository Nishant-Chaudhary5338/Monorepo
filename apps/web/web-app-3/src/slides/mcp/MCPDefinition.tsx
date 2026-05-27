import { motion } from "framer-motion";

const facts = [
  { icon: "📅", label: "Released", value: "November 2024 by Anthropic" },
  { icon: "🔓", label: "License", value: "Open standard · MIT · Free forever" },
  { icon: "🌐", label: "Works with", value: "Claude, GPT, Gemini, Llama, any LLM" },
  { icon: "🔌", label: "Runs", value: "Local (stdio) or Remote (HTTP/SSE)" },
];

export function MCPDefinition() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">The Definition</p>
        <h2 className="text-5xl font-black text-white mb-4">What is MCP?</h2>
      </motion.div>

      {/* Main definition card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-2xl border border-violet-500/20 bg-violet-500/8 p-7 max-w-3xl w-full mb-8 text-center"
      >
        <p className="text-xl text-white/85 leading-relaxed">
          MCP is a{" "}
          <span className="text-violet-300 font-bold">standard protocol</span> that lets AI models
          securely connect to{" "}
          <span className="text-cyan-300 font-bold">external tools, data, and services</span> —
          using a{" "}
          <span className="text-emerald-300 font-bold">single, universal interface</span>.
        </p>
      </motion.div>

      {/* Fact grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        {facts.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-start gap-3 px-5 py-4 rounded-xl border border-white/6 bg-white/3"
          >
            <span className="text-2xl mt-0.5 flex-shrink-0">{f.icon}</span>
            <div>
              <p className="text-xs text-white/35 uppercase tracking-wider font-medium mb-0.5">{f.label}</p>
              <p className="text-sm text-white/80 font-medium">{f.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-6 text-white/25 text-xs text-center"
      >
        Think of it as a standardised "API contract" between AI and the outside world.
      </motion.p>
    </div>
  );
}
