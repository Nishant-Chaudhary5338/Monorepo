import { motion } from "framer-motion";

const orbs = [
  { size: 500, x: "-5%", y: "-10%", color: "rgba(124,58,237,0.12)", delay: 0 },
  { size: 350, x: "65%", y: "55%", color: "rgba(6,182,212,0.08)", delay: 1.5 },
  { size: 250, x: "80%", y: "0%", color: "rgba(16,185,129,0.06)", delay: 0.8 },
];

export function MCPTitle() {
  return (
    <div className="relative flex items-center justify-center w-full h-full overflow-hidden slide-bg-void">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-30" />

      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size, height: orb.size, left: orb.x, top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7 + orb.delay, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping-dot" />
          <span className="text-xs tracking-[0.35em] uppercase text-violet-400/60 font-medium">
            Model Context Protocol · Deep Dive
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[4rem] font-black leading-[1.05] tracking-tight mb-4"
        >
          <span className="text-white">The Universal Language</span>
          <br />
          <span className="gradient-text-violet">for AI Tools</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="text-white/35 text-lg mb-10"
        >
          What MCP is · How it works · stdio vs HTTP · Building your own · Cline setup
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="w-40 h-px mb-10 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-white/5 border-white/8">
            <span className="text-sm">👋</span>
            <span className="text-sm font-semibold text-white/80">Nishant Chaudhary</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border rounded-full bg-emerald-500/10 border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">May 2026</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute flex items-center gap-2 text-xs bottom-10 right-8 text-white/15">
        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/8 font-mono">→</kbd>
        <span>advance</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/8 font-mono">F</kbd>
        <span>fullscreen</span>
      </div>
    </div>
  );
}
