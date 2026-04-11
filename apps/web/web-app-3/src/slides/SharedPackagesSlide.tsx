import { motion } from "framer-motion";
import { Tooltip } from "../components/Tooltip";

const benefits = [
  {
    label: "DRY",
    accent: "text-violet-400",
    color: "border-violet-500/30 bg-violet-500/8",
    detail: "Write once, use everywhere. Zero code duplication across apps. Change one file, all apps get the update.",
  },
  {
    label: "Single Source of Truth",
    accent: "text-cyan-400",
    color: "border-cyan-500/30 bg-cyan-500/8",
    detail: "One component definition, one type contract, one design token. No drift between apps.",
  },
  {
    label: "Source Code Access",
    accent: "text-emerald-400",
    color: "border-emerald-500/30 bg-emerald-500/8",
    detail: "Unlike npm packages, workspace packages give full TypeScript intellisense and instant hot-reload across package boundaries. No publish step.",
  },
  {
    label: "Reusable",
    accent: "text-amber-400",
    color: "border-amber-500/30 bg-amber-500/8",
    detail: "Each package is purpose-built to be consumed by multiple apps. Built once — used in all four production apps.",
  },
  {
    label: "Separately Tested",
    accent: "text-violet-400",
    color: "border-violet-500/30 bg-violet-500/8",
    detail: "Each package has its own test suite. Shared code has guaranteed coverage before any app consumes it.",
  },
  {
    label: "Isolation",
    accent: "text-cyan-400",
    color: "border-cyan-500/30 bg-cyan-500/8",
    detail: "Apps can only consume public exports — never reach into internals. Clean boundaries, predictable contracts.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SharedPackagesSlide() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-3 font-medium">Shared Packages</p>
        <h2 className="text-5xl font-black text-white mb-3">
          Think of Each Package as a{" "}
          <span className="gradient-text-emerald">Small App</span>
        </h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          All reusable logic lives here. Every app consumes these packages. Built once — available everywhere.
        </p>
      </motion.div>

      {/* Stat */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-white/5 border border-white/8"
      >
        <span className="text-2xl font-black gradient-text-violet">40–50%</span>
        <span className="text-sm text-slate-400">of the total frontend codebase — solved once in packages</span>
      </motion.div>

      {/* Benefit badges */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-3 w-full max-w-3xl"
      >
        {benefits.map((b) => (
          <motion.div key={b.label} variants={item}>
            <Tooltip content={b.detail}>
              <div
                className={`w-full rounded-xl border ${b.color} px-5 py-4 text-center cursor-default transition-colors duration-200`}
              >
                <span className={`text-sm font-bold ${b.accent}`}>{b.label}</span>
              </div>
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 text-xs text-slate-600 font-mono"
      >
        Hover each benefit for detail
      </motion.p>
    </div>
  );
}
