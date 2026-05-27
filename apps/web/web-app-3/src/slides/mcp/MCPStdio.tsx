import { motion } from "framer-motion";

export function MCPStdio() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Transport Layer</p>
        <h2 className="text-5xl font-black text-white">
          Local Transport: <span className="gradient-text-violet">stdio</span>
        </h2>
        <p className="text-white/35 mt-2 text-base">For tools running on your own machine</p>
      </motion.div>

      {/* Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <svg width="100%" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cline box */}
          <rect x="20" y="60" width="160" height="80" rx="12" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" />
          <text x="100" y="98" textAnchor="middle" fill="rgba(167,139,250,0.9)" fontSize="13" fontWeight="700">VS Code + Cline</text>
          <text x="100" y="118" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">MCP Host + Client</text>

          {/* Arrow: spawn */}
          <path d="M180 100 L260 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 3" />
          <polygon points="260,95 270,100 260,105" fill="rgba(255,255,255,0.3)" />
          <text x="220" y="90" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">spawn process</text>

          {/* Node process box */}
          <rect x="270" y="50" width="160" height="100" rx="12" fill="rgba(6,182,212,0.10)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
          <text x="350" y="88" textAnchor="middle" fill="rgba(103,232,249,0.9)" fontSize="12" fontWeight="700">node index.js</text>
          <text x="350" y="108" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">or python server.py</text>
          <text x="350" y="126" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">MCP Server process</text>

          {/* stdin arrow down */}
          <path d="M350 150 L350 178 L560 178 L560 160" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="455" y="195" textAnchor="middle" fill="rgba(16,185,129,0.5)" fontSize="9">stdin — JSON-RPC requests</text>

          {/* stdout arrow up */}
          <path d="M350 50 L350 22 L560 22 L560 40" stroke="rgba(249,115,22,0.5)" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="455" y="15" textAnchor="middle" fill="rgba(249,115,22,0.5)" fontSize="9">stdout — JSON-RPC responses</text>

          {/* Tool logic box */}
          <rect x="560" y="40" width="200" height="120" rx="12" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.35)" strokeWidth="1.5" />
          <text x="660" y="80" textAnchor="middle" fill="rgba(52,211,153,0.9)" fontSize="12" fontWeight="700">Your Tool Logic</text>
          <text x="660" y="100" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">reads/writes files</text>
          <text x="660" y="115" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">runs AST transforms</text>
          <text x="660" y="130" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">calls local CLIs</text>
          <text x="660" y="145" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9">no network needed</text>
        </svg>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mt-4">
        {[
          { icon: "⚡", label: "Ultra fast", desc: "No network — just pipes between processes" },
          { icon: "🔒", label: "Secure", desc: "Runs locally, never leaves your machine" },
          { icon: "🧹", label: "Clean", desc: "Fresh process per call — no shared state" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/6 bg-white/3"
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white/80">{item.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
