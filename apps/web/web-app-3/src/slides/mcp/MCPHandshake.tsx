import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const phases = [
  {
    step: 1,
    title: "Initialize",
    color: "text-violet-300",
    border: "border-violet-500/30",
    bg: "bg-violet-500/8",
    client: `{ "method": "initialize",
  "params": { "protocolVersion": "2024-11-05" } }`,
    server: `{ "result": {
  "serverInfo": { "name": "component-factory" },
  "capabilities": { "tools": {} } } }`,
    note: "Client greets server. Server announces capabilities.",
  },
  {
    step: 2,
    title: "Discover Tools",
    color: "text-amber-300",
    border: "border-amber-500/30",
    bg: "bg-amber-500/8",
    client: `{ "method": "tools/list" }`,
    server: `{ "result": { "tools": [
  { "name": "scaffold_component",
    "description": "Generate a React component..." }
]}}`,
    note: "Client asks: what can you do? Server lists all tools.",
  },
  {
    step: 3,
    title: "Call a Tool",
    color: "text-emerald-300",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/8",
    client: `{ "method": "tools/call",
  "params": { "name": "scaffold_component",
    "arguments": { "name": "Button" } } }`,
    server: `{ "result": { "content": [
  { "type": "text",
    "text": "{\"success\":true,\"files\":[...]}" }
]}}`,
    note: "Client invokes. Server executes and returns result.",
  },
];

export function MCPHandshake() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">The Protocol Flow</p>
        <h2 className="text-4xl font-black text-white">The 3-Step Handshake</h2>
        <p className="text-white/35 mt-2 text-sm">Every single MCP tool call goes through these exact steps</p>
      </motion.div>

      {/* Phase pills */}
      <div className="flex gap-3 mb-6">
        {phases.map((p, i) => (
          <button
            key={p.step}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer ${
              active === i ? `${p.bg} ${p.border} ${p.color}` : "border-white/8 bg-white/3 text-white/30"
            }`}
          >
            {p.step}. {p.title}
          </button>
        ))}
      </div>

      {/* Active phase detail */}
      {phases.map((p, i) => (
        <motion.div
          key={p.step}
          initial={false}
          animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-x-12 ${active !== i ? "pointer-events-none" : ""}`}
          style={{ top: "42%" }}
        >
          <div className={`rounded-2xl border ${p.border} ${p.bg} p-6 max-w-4xl mx-auto`}>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/30 mb-2 font-medium">
                  🔷 Client sends
                </p>
                <pre className="text-xs font-mono text-white/65 leading-relaxed bg-black/20 rounded-lg p-3 whitespace-pre-wrap">
                  {p.client}
                </pre>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/30 mb-2 font-medium">
                  🔶 Server responds
                </p>
                <pre className="text-xs font-mono text-white/65 leading-relaxed bg-black/20 rounded-lg p-3 whitespace-pre-wrap">
                  {p.server}
                </pre>
              </div>
            </div>
            <p className={`mt-4 text-sm ${p.color} font-medium text-center`}>💡 {p.note}</p>
          </div>
        </motion.div>
      ))}

      <div style={{ height: 220 }} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/20 text-xs text-center"
      >
        Click the phase buttons above · auto-advances every 2s
      </motion.p>
    </div>
  );
}
