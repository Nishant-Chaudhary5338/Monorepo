import { motion } from "framer-motion";

const orbs = [
  { size: 400, x: "0%", y: "0%", color: "rgba(124,58,237,0.1)", delay: 0 },
  { size: 300, x: "70%", y: "60%", color: "rgba(6,182,212,0.07)", delay: 1.5 },
  { size: 200, x: "85%", y: "5%", color: "rgba(124,58,237,0.07)", delay: 0.8 },
];

export function TitleSlide() {
  return (
    <div className="relative w-full h-full slide-bg-void flex items-center justify-center overflow-hidden">
      {/* Ambient grid */}
      <div className="absolute inset-0 slide-bg-grid opacity-40 pointer-events-none" />

      {/* Orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6 + orb.delay, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs tracking-[0.35em] uppercase text-violet-400/60 mb-8 font-medium"
        >
          Frontend Architecture · AI Automation · Scale
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[4.5rem] font-black leading-[1.05] tracking-tight mb-4"
        >
          <span className="text-white">AI-Driven</span>
          <br />
          <span className="gradient-text-violet">Development System</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="h-px w-32 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent mb-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="text-lg text-slate-400 leading-relaxed mb-10"
        >
          One engineer. Four production apps. 24 AI tools. 12 weeks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs text-emerald-400 font-medium">Running in production</span>
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-8 flex items-center gap-2 text-xs text-white/15">
        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/8 font-mono">→</kbd>
        <span>advance</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/8 font-mono">F</kbd>
        <span>fullscreen</span>
      </div>
    </div>
  );
}
