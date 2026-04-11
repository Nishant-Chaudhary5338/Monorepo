import { motion } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";
import { Tooltip } from "../components/Tooltip";

const stats = [
  {
    value: 65,
    suffix: "%",
    label: "Frontend Tasks Automated",
    color: "gradient-text-violet",
    detail: "65% of routine frontend work — code review, component generation, testing, and performance auditing — runs automatically through MCP tools.",
  },
  {
    value: 87,
    suffix: "%",
    label: "Build Time Reduction",
    color: "gradient-text-emerald",
    detail: "Builds went from 15 minutes (sequential) to 2 minutes (Turborepo parallel execution + remote cache). Cache hits are near-instant.",
  },
  {
    value: 78,
    suffix: "%",
    label: "Code Reuse",
    color: "gradient-text-violet",
    detail: "78% of the codebase is now shared across all four apps via workspace packages. Before the monorepo: 12%.",
  },
  {
    value: 7,
    suffix: "×",
    label: "Deploy Frequency",
    color: "gradient-text-emerald",
    detail: "From weekly releases to multiple deploys per day. Smaller changesets, automated gates, and parallel builds make this possible.",
  },
];

function StatCard({ value, suffix, label, color, detail, delay }: {
  value: number; suffix: string; label: string; color: string; detail: string; delay: number;
}) {
  const count = useCountUp(value, 1200);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Tooltip content={detail}>
        <div className="rounded-2xl bg-white/4 border border-white/8 px-8 py-8 text-center cursor-default hover:bg-white/6 transition-colors">
          <div className={`text-6xl font-black ${color} mb-2`}>
            {count}{suffix}
          </div>
          <div className="text-sm text-slate-400">{label}</div>
        </div>
      </Tooltip>
    </motion.div>
  );
}

export function ResultsSlide() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-16">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Results</p>
        <h2 className="text-5xl font-black text-white">
          Efficiency ·{" "}
          <span className="gradient-text-violet">Productivity</span>{" "}
          · Output
        </h2>
        <p className="text-slate-500 text-sm mt-2">Hover each stat for breakdown</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-5 w-full max-w-4xl">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={0.1 + i * 0.1} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-base text-slate-500 italic"
      >
        "One engineer. One system. Four production apps. 12 weeks."
      </motion.p>
    </div>
  );
}
