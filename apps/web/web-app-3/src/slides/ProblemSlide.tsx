import { motion } from "framer-motion";
import { Tooltip } from "../components/Tooltip";

const problems = [
  {
    label: "Scattered Codebase",
    icon: "⎇",
    color: "border-red-500/30 bg-red-500/8 hover:bg-red-500/12",
    accent: "text-red-400",
    detail: "Each app lives in its own repo with its own setup, config, and dependencies. No shared code, no shared types — everything duplicated.",
  },
  {
    label: "Multiple Teams, No Sync",
    icon: "⊗",
    color: "border-orange-500/30 bg-orange-500/8 hover:bg-orange-500/12",
    accent: "text-orange-400",
    detail: "Teams work in silos. A fix in one repo stays in that repo. Bug fixed here, still broken there. Inconsistency ships to users.",
  },
  {
    label: "Slow Delivery",
    icon: "⏳",
    color: "border-amber-500/30 bg-amber-500/8 hover:bg-amber-500/12",
    accent: "text-amber-400",
    detail: "Cross-team features require coordination across repos, release cycles, and roadmaps. Simple changes take weeks instead of hours.",
  },
  {
    label: "High Cost",
    icon: "↑",
    color: "border-red-500/30 bg-red-500/8 hover:bg-red-500/12",
    accent: "text-red-400",
    detail: "More repos = more infrastructure, more CI/CD pipelines, more maintenance. Costs multiply faster than output.",
  },
  {
    label: "Average Efficiency",
    icon: "~",
    color: "border-orange-500/30 bg-orange-500/8 hover:bg-orange-500/12",
    accent: "text-orange-400",
    detail: "Engineers spend time managing tooling, resolving conflicts, and duplicating work instead of building features.",
  },
  {
    label: "Low Productivity",
    icon: "↓",
    color: "border-amber-500/30 bg-amber-500/8 hover:bg-amber-500/12",
    accent: "text-amber-400",
    detail: "No shared standards, no shared components, no shared utilities. Every team reinvents the wheel. Velocity suffers.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ProblemSlide() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-red-400/60 mb-3 font-medium">The Problem</p>
        <h2 className="text-5xl font-black text-white">
          The Current Ecosystem
        </h2>
        <p className="text-slate-500 mt-2 text-sm">Hover each card for detail</p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-4 w-full max-w-4xl"
      >
        {problems.map((p) => (
          <motion.div key={p.label} variants={item}>
            <Tooltip content={p.detail}>
              <div
                className={`w-full rounded-2xl border ${p.color} px-6 py-5 flex items-center gap-4 cursor-default transition-colors duration-200`}
              >
                <span className={`text-2xl font-black ${p.accent} w-8 text-center shrink-0`}>{p.icon}</span>
                <span className="text-sm font-semibold text-white/85 leading-snug">{p.label}</span>
              </div>
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
