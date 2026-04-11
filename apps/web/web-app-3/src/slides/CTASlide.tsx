import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "Consolidate", desc: "One monorepo. One codebase. Shared packages.", color: "border-violet-500/30 bg-violet-500/8", num: "text-violet-400" },
  { n: "02", title: "Accelerate", desc: "Turborepo + pnpm. Parallel builds. Smart cache.", color: "border-cyan-500/30 bg-cyan-500/8", num: "text-cyan-400" },
  { n: "03", title: "Automate", desc: "24+ MCP tools. 65% of tasks done automatically.", color: "border-emerald-500/30 bg-emerald-500/8", num: "text-emerald-400" },
  { n: "04", title: "Scale", desc: "Architecture ready for any team size.", color: "border-amber-500/30 bg-amber-500/8", num: "text-amber-400" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function CTASlide() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-16">
      {/* Ambient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">The System is Live</p>
          <h2 className="text-5xl font-black text-white mb-2">
            Built to{" "}
            <span className="gradient-text-emerald">Last</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-4 gap-4 mb-10"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              variants={item}
              className={`rounded-2xl border ${s.color} p-6 relative`}
            >
              {i < steps.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-white/15 text-sm z-10">→</span>
              )}
              <div className={`text-3xl font-black ${s.num} mb-2`}>{s.n}</div>
              <div className="text-sm font-bold text-white/85 mb-1">{s.title}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <button className="px-8 py-3 rounded-full bg-linear-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer border-0 pulse-glow">
            Explore the Repository
          </button>
          <button className="px-8 py-3 rounded-full border border-white/15 text-white/60 font-semibold text-sm hover:bg-white/5 transition-colors cursor-pointer bg-transparent">
            Schedule a Walkthrough
          </button>
        </motion.div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-base text-slate-500 italic"
        >
          "One engineer. One system.{" "}
          <span className="gradient-text-violet font-semibold not-italic">
            Built to outlast the team that built it.
          </span>"
        </motion.p>
      </div>
    </div>
  );
}
