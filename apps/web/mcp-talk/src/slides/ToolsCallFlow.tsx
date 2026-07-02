import { motion } from "framer-motion";

const steps = [
  {
    phase: "DISCOVER",
    emoji: "🔍",
    call: "tools/list",
    who: "Client → Server",
    what: "Cline asks: \"what tools do you have?\"",
    response: "Server replies with a list of tool names + descriptions + input schemas",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.06)",
    border: "rgba(96,165,250,0.25)",
  },
  {
    phase: "DECIDE",
    emoji: "🤔",
    call: "AI reasoning",
    who: "LLM (Claude/GPT/etc.)",
    what: "AI reads the user's message AND the tool descriptions",
    response: "Picks the best tool based on description match — no hard-coded routing",
    color: "#f97316",
    bg: "rgba(249,115,22,0.06)",
    border: "rgba(249,115,22,0.25)",
  },
  {
    phase: "EXECUTE",
    emoji: "⚡",
    call: "tools/call",
    who: "Client → Server",
    what: "Client sends: tool name + arguments (validated against schema)",
    response: "Server runs your function, returns JSON — files created, data found, error if any",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.05)",
    border: "rgba(251,191,36,0.25)",
  },
  {
    phase: "RESPOND",
    emoji: "✅",
    call: "Result to AI",
    who: "Server → Client → AI",
    what: "AI receives the JSON result from the tool",
    response: "Summarises it in plain English: \"Done! I created Button.tsx, Button.test.tsx, Button.stories.tsx\"",
    color: "#10b981",
    bg: "rgba(16,185,129,0.05)",
    border: "rgba(16,185,129,0.25)",
  },
];

export function ToolsCallFlow() {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden px-12 pt-12 pb-10"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 flex flex-col items-center text-center mb-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mono text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(249,115,22,0.6)" }}
        >
          Execution Flow
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black mb-3"
        >
          How a tool{" "}
          <span className="gradient-flame">gets called</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg"
          style={{ color: "var(--muted)" }}
        >
          From "scaffold a Button" to files on disk — 4 JSON-RPC messages
        </motion.p>
      </div>

      {/* 4-phase cards — fill remaining height */}
      <div className="flex-1 min-h-0 flex items-stretch gap-3 w-full max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.phase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex-1 rounded-2xl p-6 flex flex-col gap-4"
            style={{ border: `1px solid ${s.border}`, background: s.bg }}
          >
            {/* Phase badge + emoji */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">{s.emoji}</span>
              <span
                className="mono text-[11px] font-black px-2 py-0.5 rounded-full"
                style={{ background: `${s.color}18`, color: s.color }}
              >
                {s.phase}
              </span>
            </div>

            {/* JSON-RPC call */}
            <div
              className="px-3 py-2 rounded-lg"
              style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${s.color}30` }}
            >
              <p className="mono text-sm font-bold" style={{ color: s.color }}>{s.call}</p>
              <p className="mono text-xs mt-0.5" style={{ color: "var(--muted-2)" }}>{s.who}</p>
            </div>

            {/* What happens */}
            <div className="flex-1 flex flex-col justify-evenly">
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{s.what}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{s.response}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Round-trip note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="shrink-0 mt-5 flex items-center justify-center gap-2"
      >
        <span className="text-sm mono" style={{ color: "var(--muted-2)" }}>Total round-trip:</span>
        <span
          className="px-4 py-1.5 rounded-full mono text-sm font-bold"
          style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          ~50–200ms locally (stdio) · no network call
        </span>
      </motion.div>
    </div>
  );
}
