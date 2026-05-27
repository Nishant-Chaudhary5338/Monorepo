import { motion } from "framer-motion";

const ais = ["Claude", "GPT-4", "Gemini", "Llama"];
const services = ["Database", "GitHub", "Figma", "Slack", "File System"];

export function MCPProblem() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-red-400/60 mb-3 font-medium">The Problem</p>
        <h2 className="text-5xl font-black text-white">The World Before MCP</h2>
        <p className="text-white/35 mt-2 text-base">Every AI model needed a custom integration per service</p>
      </motion.div>

      <div className="flex items-center gap-16 w-full max-w-5xl">
        {/* AI Models column */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-1 font-medium text-center">AI Models</p>
          {ais.map((ai, i) => (
            <motion.div
              key={ai}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="px-4 py-2.5 rounded-xl border border-violet-500/25 bg-violet-500/8 text-sm font-semibold text-violet-300 w-28 text-center"
            >
              {ai}
            </motion.div>
          ))}
        </div>

        {/* Connection lines */}
        <div className="flex-1 relative" style={{ height: 220 }}>
          <svg width="100%" height="100%" viewBox="0 0 300 220" preserveAspectRatio="none">
            {ais.map((_, ai) =>
              services.map((_, svc) => (
                <motion.line
                  key={`${ai}-${svc}`}
                  x1="0" y1={27 + ai * 46}
                  x2="300" y2={22 + svc * 44}
                  stroke="rgba(239,68,68,0.25)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + (ai * 5 + svc) * 0.04, duration: 0.3 }}
                />
              ))
            )}
          </svg>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="px-4 py-2 rounded-full bg-red-500/15 border border-red-500/30 text-center">
              <p className="text-red-400 font-black text-xl">4 × 5 = 20</p>
              <p className="text-red-400/60 text-xs font-medium">custom integrations 😵</p>
            </div>
          </motion.div>
        </div>

        {/* Services column */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          <p className="text-xs tracking-widest uppercase text-white/30 mb-1 font-medium text-center">Services</p>
          {services.map((svc, i) => (
            <motion.div
              key={svc}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="px-4 py-2.5 rounded-xl border border-cyan-500/25 bg-cyan-500/8 text-sm font-semibold text-cyan-300 w-32 text-center"
            >
              {svc}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-white/25 text-sm"
      >
        Each line = a separate, brittle, vendor-specific integration. N models × M services = chaos.
      </motion.p>
    </div>
  );
}
