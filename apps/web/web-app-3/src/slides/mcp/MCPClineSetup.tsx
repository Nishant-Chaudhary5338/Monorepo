import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Open Cline in VS Code",
    detail: "Click the Cline icon in the sidebar, or press Ctrl+Shift+P → 'Cline: Open'",
    icon: "🖥️",
  },
  {
    n: "02",
    title: "Click the MCP Servers icon",
    detail: "Look for the plug icon ⚡ in the top navigation bar of the Cline panel",
    icon: "🔌",
  },
  {
    n: "03",
    title: "Go to 'Configure' tab",
    detail: "Click 'Configure MCP Servers' — this opens cline_mcp_settings.json in your editor",
    icon: "⚙️",
  },
  {
    n: "04",
    title: "Add your server entry",
    detail: 'Add a key under "mcpServers" with either stdio (local) or http (remote) type',
    icon: "📝",
  },
  {
    n: "05",
    title: "Save the file",
    detail: "Cline auto-reconnects. A green dot appears next to your server in the MCP panel.",
    icon: "✅",
  },
  {
    n: "06",
    title: "Ask Cline to use it!",
    detail: '"Use the component-factory tool to scaffold a Button component" — Cline handles the rest',
    icon: "🚀",
  },
];

export function MCPClineSetup() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-3 font-medium">Step-by-Step Setup</p>
        <h2 className="text-4xl font-black text-white">
          ⚙️ Setting Up MCP in <span className="gradient-text-violet">Cline</span>
        </h2>
        <p className="text-white/35 mt-2 text-sm">This takes about 3 minutes</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="rounded-2xl border border-white/8 bg-white/3 p-4 flex flex-col gap-3 hover:border-cyan-500/20 hover:bg-cyan-500/4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{step.icon}</span>
              <span className="text-xs font-black font-mono text-white/15">{step.n}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/85 mb-1">{step.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{step.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl border border-cyan-500/15 bg-cyan-500/6"
      >
        <span className="text-cyan-400">💡</span>
        <p className="text-sm text-white/55">
          Cline's config file:{" "}
          <code className="text-cyan-300/70 font-mono text-xs">
            ~/Library/Application Support/Cline/cline_mcp_settings.json
          </code>
          {" "}on Mac
        </p>
      </motion.div>
    </div>
  );
}
