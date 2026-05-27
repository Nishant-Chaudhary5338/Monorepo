import { motion } from "framer-motion";

const configCode = `{
  "mcpServers": {

    // ── Local tool (stdio) ─────────────────────────
    "component-factory": {
      "type": "stdio",           // runs a local process
      "command": "node",         // the runtime
      "args": [
        "/path/to/mcp-toolkit/tools/component-factory/build/index.js"
      ]
    },

    // ── Python backend tool (stdio) ────────────────
    "my-python-tool": {
      "type": "stdio",
      "command": "python",
      "args": ["/path/to/server.py"]
    },

    // ── Remote cloud service (HTTP) ────────────────
    "figma-official": {
      "type": "http",            // calls a remote URL
      "url": "https://mcp.figma.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_FIGMA_TOKEN"
      }
    }

  }
}`;

export function MCPClineConfig() {
  return (
    <div className="relative w-full h-full slide-bg-void flex items-center justify-center overflow-hidden px-12">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-15" />

      <div className="flex items-start gap-8 w-full max-w-5xl">
        {/* Left: explanation */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 w-52 pt-2"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-3 font-medium">Config File</p>
          <h2 className="text-3xl font-black text-white mb-6 leading-tight">
            cline_mcp_<br />settings.json
          </h2>

          <div className="space-y-4">
            {[
              { color: "text-violet-300", bg: "bg-violet-500/10 border-violet-500/20", icon: "🟣", label: "stdio", desc: 'Use for local tools. "command" + "args" to start the process.' },
              { color: "text-cyan-300", bg: "bg-cyan-500/10 border-cyan-500/20", icon: "🌐", label: "http", desc: 'Use for cloud services. Just a URL — no process spawning.' },
            ].map((item) => (
              <div key={item.label} className={`px-3 py-3 rounded-xl border ${item.bg}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{item.icon}</span>
                  <code className={`text-xs font-bold font-mono ${item.color}`}>type: "{item.label}"</code>
                </div>
                <p className="text-xs text-white/40 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 px-3 py-2.5 rounded-xl border border-white/8 bg-white/3">
            <p className="text-xs text-white/35 leading-relaxed">
              Add as many servers as you need. They all run independently.
            </p>
          </div>
        </motion.div>

        {/* Right: code */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 rounded-2xl border border-white/8 bg-black/40 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/3">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            <span className="ml-2 text-xs text-white/25 font-mono">cline_mcp_settings.json</span>
          </div>
          <pre className="p-5 text-[11px] font-mono leading-[1.75] text-white/60 overflow-auto" style={{ maxHeight: 460 }}>
            {configCode.split("\n").map((line, i) => {
              const isComment = line.trim().startsWith("//");
              const isKey = /^\s+"[a-z]/.test(line) && line.includes('"type"');
              const isSection = line.includes("// ──");
              return (
                <div
                  key={i}
                  className={
                    isSection
                      ? "text-cyan-400/50 italic"
                      : isComment
                      ? "text-white/25 italic"
                      : isKey
                      ? "text-amber-300/75"
                      : "text-white/60"
                  }
                >
                  {line || " "}
                </div>
              );
            })}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}
