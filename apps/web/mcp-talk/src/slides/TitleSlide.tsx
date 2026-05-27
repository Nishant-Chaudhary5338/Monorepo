import { motion } from "framer-motion";

export function TitleSlide() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Flame orb top-right */}
      <motion.div
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute pointer-events-none"
        style={{
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)",
          top: "-10%",
          right: "-8%",
        }}
      />

      {/* Signal orb bottom-left */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
          bottom: "0%",
          left: "-5%",
        }}
      />

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mono text-xs tracking-[0.3em] uppercase mb-5"
        style={{ color: "rgba(249,115,22,0.6)" }}
      >
        Model Context Protocol
      </motion.p>

      {/* Wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-black text-center leading-none"
        style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
      >
        <span className="gradient-flame">mcp-toolkit</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-4 text-lg font-medium text-center"
        style={{ color: "var(--muted)" }}
      >
        9 AI tools for every developer workflow
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="mt-8 h-px w-32"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)",
          transformOrigin: "center",
        }}
      />

      {/* Author */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="mt-6 flex items-center gap-3"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
          style={{
            background: "linear-gradient(135deg, #f97316, #fbbf24)",
            color: "#07070f",
          }}
        >
          N
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Nishant Chaudhary
          </p>
          <p className="text-xs mono" style={{ color: "var(--muted)" }}>
            github.com/Nishant-Chaudhary5338
          </p>
        </div>
      </motion.div>

      {/* Keyboard hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-xs mono"
        style={{ color: "var(--muted-2)" }}
      >
        press → to start
      </motion.p>
    </div>
  );
}
