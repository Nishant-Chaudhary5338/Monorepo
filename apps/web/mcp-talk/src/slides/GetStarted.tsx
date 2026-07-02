import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Choice = null | "ts" | "py";

const tsSteps = [
  { label: "1. Clone mcp-toolkit", cmd: "git clone https://github.com/Nishant-Chaudhary5338/mcp-toolkit" },
  { label: "2. Install & build", cmd: "cd mcp-toolkit && pnpm install && pnpm build" },
  { label: "3. Open Cline → MCP Servers → Configure", cmd: "# paste the config on the right into cline_mcp_settings.json" },
];

const pySteps = [
  { label: "1. Install fastmcp", cmd: "pip install fastmcp" },
  { label: "2. Create your server", cmd: "touch my_tool.py\n# add @mcp.tool() functions below" },
  { label: "3. Open Cline → MCP Servers → Configure", cmd: "# paste the config on the right into cline_mcp_settings.json" },
];

const tsConfig = `{
  "mcpServers": {
    "component-factory": {
      "type": "stdio",
      "command": "node",
      "args": [
        "./mcp-toolkit/tools/component-factory/build/index.js"
      ]
    },
    "generate-tests": {
      "type": "stdio",
      "command": "node",
      "args": [
        "./mcp-toolkit/tools/generate-tests/build/index.js"
      ]
    }
  }
}`;

const pyConfig = `{
  "mcpServers": {
    "my-python-tool": {
      "type": "stdio",
      "command": "python",
      "args": ["/path/to/my_tool.py"]
    }
  }
}`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="mono text-xs px-3 py-1 rounded-full transition-all"
      style={{
        background: copied ? "rgba(16,185,129,0.2)" : "rgba(249,115,22,0.15)",
        border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(249,115,22,0.3)"}`,
        color: copied ? "#10b981" : "#f97316",
        cursor: "pointer",
      }}
    >
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

export function GetStarted() {
  const [choice, setChoice] = useState<Choice>(null);
  const steps = choice === "ts" ? tsSteps : pySteps;
  const config = choice === "ts" ? tsConfig : pyConfig;

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden px-12 pt-12 pb-16"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Flame orb */}
      <motion.div
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          bottom: "10%", right: "0%",
        }}
      />

      {/* Header */}
      <div className="shrink-0 flex flex-col items-center text-center mb-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mono text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(249,115,22,0.6)" }}
        >
          Get Started
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black mb-3"
        >
          Build your own{" "}
          <span className="gradient-flame">MCP server</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-lg"
          style={{ color: "var(--muted)" }}
        >
          Pick your language — get the exact setup steps + copy-ready Cline config
        </motion.p>
      </div>

      {/* Language chooser */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="shrink-0 flex gap-4 justify-center mb-6"
      >
        {[
          { id: "ts" as const, label: "TypeScript", icon: "🟦", sub: "Node.js · McpServerBase" },
          { id: "py" as const, label: "Python", icon: "🐍", sub: "fastmcp · @mcp.tool()" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setChoice(opt.id)}
            className="rounded-2xl px-10 py-5 text-left transition-all"
            style={{
              border: choice === opt.id
                ? "1px solid rgba(249,115,22,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
              background: choice === opt.id
                ? "rgba(249,115,22,0.1)"
                : "rgba(255,255,255,0.025)",
              boxShadow: choice === opt.id ? "0 0 20px rgba(249,115,22,0.1)" : "none",
              cursor: "pointer",
              minWidth: 220,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-lg font-bold" style={{ color: choice === opt.id ? "#f97316" : "var(--text)" }}>
                {opt.label}
              </span>
            </div>
            <p className="text-sm mono" style={{ color: "var(--muted)" }}>{opt.sub}</p>
          </button>
        ))}
      </motion.div>

      {/* Steps + Config — fills remaining height */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {choice ? (
            <motion.div
              key={choice}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-5 h-full"
            >
              {/* Steps */}
              <div className="flex flex-col">
                <p className="mono text-xs font-bold mb-3" style={{ color: "var(--muted)" }}>
                  SETUP STEPS
                </p>
                <div className="flex flex-col gap-3 flex-1">
                  {steps.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl overflow-hidden flex-1"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="px-4 py-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>{s.label}</p>
                      </div>
                      <pre
                        className="px-4 py-3 text-sm mono leading-relaxed"
                        style={{ color: "#f97316", whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                      >
                        {s.cmd}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Config */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <p className="mono text-xs font-bold" style={{ color: "var(--muted)" }}>
                    cline_mcp_settings.json
                  </p>
                  <CopyButton text={config} />
                </div>
                <div
                  className="flex-1 rounded-xl overflow-hidden"
                  style={{ border: "1px solid rgba(249,115,22,0.2)", background: "rgba(0,0,0,0.4)" }}
                >
                  <pre
                    className="p-5 text-sm mono leading-relaxed h-full"
                    style={{ color: "#fb923c", whiteSpace: "pre", overflowX: "auto" }}
                  >
                    {config}
                  </pre>
                </div>
                <p className="mt-2 text-sm text-center" style={{ color: "var(--muted-2)" }}>
                  Then ask Cline:{" "}
                  <span style={{ color: "#fbbf24" }}>"scaffold a Button component"</span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="h-full flex items-center justify-center"
            >
              <p className="text-base mono" style={{ color: "var(--muted)" }}>
                ↑ pick a language to see setup steps
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 text-xs mono"
        style={{ color: "var(--muted-2)" }}
      >
        <span>
          github.com/<span style={{ color: "rgba(249,115,22,0.7)" }}>Nishant-Chaudhary5338/mcp-toolkit</span>
        </span>
        <span>·</span>
        <span>
          Questions?{" "}
          <span style={{ color: "rgba(249,115,22,0.7)" }}>nishantchaudhary.dev@gmail.com</span>
        </span>
      </motion.div>
    </div>
  );
}
