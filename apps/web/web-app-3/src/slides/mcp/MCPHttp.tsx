import { motion } from "framer-motion";

export function MCPHttp() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-3 font-medium">Transport Layer</p>
        <h2 className="text-5xl font-black text-white">
          Remote Transport: <span className="gradient-text-violet">HTTP + SSE</span>
        </h2>
        <p className="text-white/35 mt-2 text-base">For tools hosted in the cloud or on a shared server</p>
      </motion.div>

      {/* Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <svg width="100%" viewBox="0 0 800 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* AI App box */}
          <rect x="20" y="50" width="160" height="80" rx="12" fill="rgba(124,58,237,0.12)" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" />
          <text x="100" y="87" textAnchor="middle" fill="rgba(167,139,250,0.9)" fontSize="13" fontWeight="700">Your AI App</text>
          <text x="100" y="107" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">Claude / Cline / Cursor</text>

          {/* HTTPS arrow */}
          <path d="M180 90 L310 90" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" />
          <polygon points="310,85 320,90 310,95" fill="rgba(6,182,212,0.6)" />
          <text x="250" y="78" textAnchor="middle" fill="rgba(6,182,212,0.6)" fontSize="9" fontWeight="600">HTTPS POST</text>
          <text x="250" y="104" textAnchor="middle" fill="rgba(6,182,212,0.35)" fontSize="8">tools/call request</text>

          {/* Remote MCP Server */}
          <rect x="320" y="30" width="180" height="120" rx="12" fill="rgba(6,182,212,0.10)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" />
          <text x="410" y="68" textAnchor="middle" fill="rgba(103,232,249,0.9)" fontSize="12" fontWeight="700">Remote MCP Server</text>
          <text x="410" y="86" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">mcp.figma.com/mcp</text>
          <text x="410" y="104" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">your-company.com/mcp</text>
          <text x="410" y="122" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">localhost:8080/mcp</text>
          <text x="410" y="140" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8">Python/Node server</text>

          {/* SSE arrow back */}
          <path d="M500 75 L620 75" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" strokeDasharray="5 3" />
          <polygon points="620,70 630,75 620,80" fill="rgba(16,185,129,0.5)" />
          <text x="560" y="63" textAnchor="middle" fill="rgba(16,185,129,0.6)" fontSize="9" fontWeight="600">SSE stream back</text>
          <text x="560" y="88" textAnchor="middle" fill="rgba(16,185,129,0.35)" fontSize="8">real-time responses</text>

          {/* Backend systems */}
          <rect x="630" y="30" width="150" height="120" rx="12" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
          <text x="705" y="62" textAnchor="middle" fill="rgba(52,211,153,0.8)" fontSize="10" fontWeight="700">Backend Systems</text>
          <text x="705" y="82" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">Figma API</text>
          <text x="705" y="98" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">Postgres DB</text>
          <text x="705" y="114" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">Internal APIs</text>
          <text x="705" y="130" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">Cloud Storage</text>
        </svg>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mt-4">
        {[
          { icon: "🌍", label: "Team-shared", desc: "One server, whole team connects to it" },
          { icon: "☁️", label: "Cloud-powered", desc: "Access external APIs, services, databases" },
          { icon: "🔑", label: "Auth support", desc: "Supports API keys and OAuth in headers" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl border border-cyan-500/15 bg-cyan-500/5"
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white/80">{item.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-4 text-white/25 text-xs"
      >
        Real example from our config:{" "}
        <code className="text-cyan-400/50 font-mono">figma-official → type: http → url: https://mcp.figma.com/mcp</code>
      </motion.p>
    </div>
  );
}
