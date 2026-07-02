import { motion } from "framer-motion";

export function TitleSlide() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-evenly overflow-hidden px-12 py-16"
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
          width: 500,
          height: 500,
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
          width: 400,
          height: 400,
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
        className="mono text-sm tracking-[0.3em] uppercase"
        style={{ color: "rgba(249,115,22,0.6)" }}
      >
        Model Context Protocol
      </motion.p>

      {/* Wordmark + subtitle */}
      <div className="flex flex-col items-center gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black text-center leading-none"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}
        >
          <span className="gradient-flame">mcp-toolkit</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xl font-medium text-center"
          style={{ color: "var(--muted)" }}
        >
          9 AI tools for every developer workflow
        </motion.p>
      </div>

      {/* Divider + author */}
      <div className="flex flex-col items-center gap-5">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="h-px w-40"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)",
            transformOrigin: "center",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-base font-black"
            style={{
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
              color: "#07070f",
            }}
          >
            N
          </div>
          <div>
            <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
              Nishant Chaudhary
            </p>
            <p className="text-sm mono" style={{ color: "var(--muted)" }}>
              github.com/Nishant-Chaudhary5338
            </p>
          </div>
        </motion.div>
      </div>

      {/* Keyboard hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="text-sm mono"
        style={{ color: "var(--muted-2)" }}
      >
        press → to start
      </motion.p>
    </div>
  );
}
