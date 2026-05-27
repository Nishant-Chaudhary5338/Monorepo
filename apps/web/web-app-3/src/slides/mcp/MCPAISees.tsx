import { motion } from "framer-motion";

const steps = [
  { icon: "👤", label: "User asks Cline", detail: '"Scaffold a Button component"', color: "text-white" },
  { icon: "🧠", label: "AI reads tool list", detail: "tools/list → sees scaffold_component, get_templates…", color: "text-violet-300" },
  { icon: "🎯", label: "AI decides to call a tool", detail: "tool: scaffold_component · args: { name: 'Button' }", color: "text-amber-300" },
  { icon: "⚙️", label: "MCP executes the tool", detail: "Node process spawns → runs → writes files to disk", color: "text-cyan-300" },
  { icon: "📨", label: "Result returned to AI", detail: '{ success: true, files: ["Button.tsx", "Button.test.tsx"] }', color: "text-emerald-300" },
  { icon: "💬", label: "AI responds to user", detail: '"Done! I created Button.tsx with a test and a story."', color: "text-white" },
];

export function MCPAISees() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">How It Works</p>
        <h2 className="text-5xl font-black text-white">How the AI "Sees" Your Tools</h2>
        <p className="text-white/35 mt-2 text-sm">A real Cline + MCP tool call, step by step</p>
      </motion.div>

      <div className="flex flex-col gap-3 w-full max-w-3xl">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.15 }}
            className="flex items-center gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs font-bold text-white/40">
              {i + 1}
            </div>
            <div className="flex-1 flex items-center gap-4 px-4 py-3 rounded-xl border border-white/6 bg-white/3">
              <span className="text-xl flex-shrink-0">{step.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white/80">{step.label}</p>
                <p className={`text-xs font-mono mt-0.5 ${step.color} opacity-70`}>{step.detail}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="absolute left-[calc(50%-1.5rem)] mt-12 ml-3">
                {/* connector handled by flex layout */}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-6 text-center"
      >
        <p className="text-white/25 text-xs">
          The AI never sees your code directly — it only sees{" "}
          <span className="text-white/50">tool names, descriptions, and input schemas</span>.
        </p>
      </motion.div>
    </div>
  );
}
