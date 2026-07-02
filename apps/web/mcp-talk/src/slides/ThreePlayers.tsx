import { motion } from "framer-motion";

export function ThreePlayers() {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden px-12 pt-12 pb-10"
      style={{ background: "var(--bg)" }}
    >
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Ambient orb */}
      <motion.div
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)",
          top: "5%", right: "-10%",
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
          Architecture
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-black mb-3"
        >
          The <span className="gradient-flame">3 Players</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg"
          style={{ color: "var(--muted)" }}
        >
          Every MCP interaction has exactly three participants
        </motion.p>
      </div>

      {/* Flow diagram — fills remaining height */}
      <div className="flex-1 min-h-0 flex items-stretch gap-0 w-full max-w-5xl mx-auto">

        {/* HOST */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 rounded-2xl p-8 flex flex-col"
          style={{
            border: "1px solid rgba(249,115,22,0.3)",
            background: "rgba(249,115,22,0.06)",
          }}
        >
          <p className="mono text-xs font-bold mb-2" style={{ color: "#f97316" }}>HOST</p>
          <p className="text-2xl font-black mb-4" style={{ color: "var(--text)" }}>Cline</p>
          <p className="text-base leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
            The app you open. Manages the conversation, shows responses, and spawns the MCP client inside itself.
          </p>
          <div
            className="mt-6 px-3 py-2 rounded-lg self-start"
            style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <p className="text-xs mono" style={{ color: "#fb923c" }}>VS Code Extension</p>
          </div>
        </motion.div>

        {/* Arrow 1 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="shrink-0 flex flex-col items-center justify-center px-3"
          style={{ minWidth: 88 }}
        >
          <div className="text-xs mono mb-1" style={{ color: "var(--muted-2)" }}>spawns +</div>
          <div className="w-full h-0.5" style={{ background: "linear-gradient(90deg, #f97316, #60a5fa)" }} />
          <div className="text-xs mono mt-1" style={{ color: "var(--muted-2)" }}>talks via</div>
          <div className="text-xs mono mt-0.5" style={{ color: "#60a5fa" }}>JSON-RPC</div>
        </motion.div>

        {/* CLIENT */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex-1 rounded-2xl p-8 flex flex-col"
          style={{
            border: "1px solid rgba(96,165,250,0.3)",
            background: "rgba(96,165,250,0.06)",
          }}
        >
          <p className="mono text-xs font-bold mb-2" style={{ color: "#60a5fa" }}>CLIENT</p>
          <p className="text-2xl font-black mb-4" style={{ color: "var(--text)" }}>Built into Cline</p>
          <p className="text-base leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
            Invisible layer inside Cline. Sends{" "}
            <span className="mono" style={{ color: "#60a5fa" }}>tools/list</span> and{" "}
            <span className="mono" style={{ color: "#60a5fa" }}>tools/call</span> to each server. You never touch this.
          </p>
          <div
            className="mt-6 px-3 py-2 rounded-lg self-start"
            style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)" }}
          >
            <p className="text-xs mono" style={{ color: "#93c5fd" }}>Automatic — zero config</p>
          </div>
        </motion.div>

        {/* Arrow 2 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="shrink-0 flex flex-col items-center justify-center px-3"
          style={{ minWidth: 88 }}
        >
          <div className="text-xs mono mb-1" style={{ color: "var(--muted-2)" }}>calls</div>
          <div className="w-full h-0.5" style={{ background: "linear-gradient(90deg, #60a5fa, #fbbf24)" }} />
          <div className="text-xs mono mt-1" style={{ color: "var(--muted-2)" }}>stdio or</div>
          <div className="text-xs mono mt-0.5" style={{ color: "#fbbf24" }}>HTTP+SSE</div>
        </motion.div>

        {/* SERVER */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="flex-1 rounded-2xl p-8 flex flex-col"
          style={{
            border: "1px solid rgba(251,191,36,0.3)",
            background: "rgba(251,191,36,0.05)",
          }}
        >
          <p className="mono text-xs font-bold mb-2" style={{ color: "#fbbf24" }}>SERVER</p>
          <p className="text-2xl font-black mb-4" style={{ color: "var(--text)" }}>Your MCP Tool</p>
          <p className="text-base leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
            A Node.js or Python process YOU write. It registers tools and runs them when called. This is{" "}
            <span style={{ color: "#fbbf24" }}>what mcp-toolkit is</span>.
          </p>
          <div
            className="mt-6 px-3 py-2 rounded-lg self-start"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            <p className="text-xs mono" style={{ color: "#fde68a" }}>component-factory, etc.</p>
          </div>
        </motion.div>
      </div>

      {/* Key insight */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="shrink-0 mt-5 text-sm text-center"
        style={{ color: "var(--muted-2)" }}
      >
        The Client and Server never know about each other until the Host connects them via config
      </motion.p>
    </div>
  );
}
