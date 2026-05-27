import { motion } from "framer-motion";

const messages = [
  {
    phase: "1. Handshake",
    color: "border-violet-500/30 bg-violet-500/6",
    labelColor: "text-violet-400",
    code: `// Client → Server
{ "jsonrpc": "2.0", "id": 1, "method": "initialize",
  "params": { "protocolVersion": "2024-11-05",
               "clientInfo": { "name": "cline", "version": "1.0" } } }

// Server → Client
{ "jsonrpc": "2.0", "id": 1, "result": {
  "serverInfo": { "name": "component-factory", "version": "2.0.0" },
  "capabilities": { "tools": {} } } }`,
  },
  {
    phase: "2. Discover Tools",
    color: "border-amber-500/30 bg-amber-500/6",
    labelColor: "text-amber-400",
    code: `// Client → Server
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }

// Server → Client
{ "jsonrpc": "2.0", "id": 2, "result": { "tools": [
  { "name": "scaffold_component",
    "description": "Generate a React component",
    "inputSchema": { "type": "object",
      "properties": { "name": { "type": "string" } } } }
]}}`,
  },
  {
    phase: "3. Call a Tool",
    color: "border-emerald-500/30 bg-emerald-500/6",
    labelColor: "text-emerald-400",
    code: `// Client → Server
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call",
  "params": { "name": "scaffold_component",
              "arguments": { "name": "Button" } } }

// Server → Client
{ "jsonrpc": "2.0", "id": 3, "result": { "content": [
  { "type": "text", "text": "{\"success\":true,\"files\":[...]}" }
]}}`,
  },
];

export function MCPProtocol() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-10">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">The Protocol</p>
        <h2 className="text-4xl font-black text-white">
          JSON-RPC 2.0 — <span className="gradient-text-violet">The Language of MCP</span>
        </h2>
        <p className="text-white/35 mt-2 text-sm">Every MCP conversation follows the same 3-phase pattern</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-6xl">
        {messages.map((m, i) => (
          <motion.div
            key={m.phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className={`rounded-xl border ${m.color} p-4 flex flex-col`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${m.labelColor}`}>{m.phase}</p>
            <pre className="text-[10px] leading-relaxed text-white/55 font-mono whitespace-pre-wrap flex-1 overflow-hidden">
              {m.code}
            </pre>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-5 flex items-center gap-6 text-xs text-white/25"
      >
        <span>✓ JSON over stdin/stdout (local)</span>
        <span>·</span>
        <span>✓ JSON over HTTPS (remote)</span>
        <span>·</span>
        <span>✓ Same protocol either way</span>
      </motion.div>
    </div>
  );
}
