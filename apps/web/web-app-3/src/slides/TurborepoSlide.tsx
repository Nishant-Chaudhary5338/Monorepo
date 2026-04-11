import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "../components/Tooltip";

const benefits = [
  {
    label: "Manageable",
    detail: "One repository. One git history. One place to search, refactor, and review code across all apps and packages.",
    color: "border-violet-500/30 bg-violet-500/8",
    accent: "text-violet-400",
  },
  {
    label: "Maintainable",
    detail: "Update a shared package once and every app gets the fix. No chasing the same bug across four repositories.",
    color: "border-cyan-500/30 bg-cyan-500/8",
    accent: "text-cyan-400",
  },
  {
    label: "Scalable",
    detail: "Add a new app or package without changing the build system. Turborepo's task graph scales to any number of packages.",
    color: "border-emerald-500/30 bg-emerald-500/8",
    accent: "text-emerald-400",
  },
];

interface Task {
  id: string;
  label: string;
  color: string;
  start: number;
  duration: number;
}

const seqTasks: Task[] = [
  { id: "s1", label: "lint", color: "#7c3aed", start: 0, duration: 115 },
  { id: "s2", label: "build:ui", color: "#06b6d4", start: 115, duration: 155 },
  { id: "s3", label: "build:apps", color: "#06b6d4", start: 270, duration: 185 },
  { id: "s4", label: "test", color: "#10b981", start: 455, duration: 160 },
  { id: "s5", label: "typecheck", color: "#f59e0b", start: 615, duration: 120 },
];

const parTasks: Task[] = [
  { id: "p1", label: "lint", color: "#7c3aed", start: 0, duration: 60 },
  { id: "p2", label: "build:ui", color: "#06b6d4", start: 0, duration: 80 },
  { id: "p3", label: "typecheck ⚡", color: "#f59e0b", start: 0, duration: 12 },
  { id: "p4", label: "build:apps", color: "#06b6d4", start: 80, duration: 85 },
  { id: "p5", label: "test", color: "#10b981", start: 80, duration: 70 },
];

const SEQ_TOTAL = 735;
const PAR_TOTAL = 170;
const BAR_W = 260;

function Gantt({ tasks, total, animated }: { tasks: Task[]; total: number; animated: boolean }) {
  return (
    <div className="space-y-1.5">
      {tasks.map((t) => {
        const left = (t.start / total) * BAR_W;
        const width = Math.max((t.duration / total) * BAR_W, 28);
        return (
          <div key={t.id} className="relative h-6" style={{ width: BAR_W }}>
            <motion.div
              className="absolute h-full rounded flex items-center px-2 overflow-hidden"
              style={{
                left,
                width,
                background: `${t.color}22`,
                border: `1px solid ${t.color}55`,
                transformOrigin: "left center",
              }}
              initial={animated ? { scaleX: 0 } : false}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: (t.start / total) * 0.6 + 0.1 }}
            >
              <span className="text-[9px] font-mono whitespace-nowrap" style={{ color: t.color }}>{t.label}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export function TurborepoSlide() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-amber-400/60 mb-3 font-medium">The Answer</p>
        <p className="text-slate-400 text-base mb-1 italic">"Is it manageable? Maintainable? Scalable?"</p>
        <h2 className="text-5xl font-black text-white">
          Yes —{" "}
          <span className="gradient-text-gold">Turborepo + pnpm Workspaces</span>
        </h2>
      </motion.div>

      <div className="flex gap-10 w-full max-w-4xl items-start">
        {/* Build comparison */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col gap-4"
        >
          {/* Sequential */}
          <div className="rounded-2xl bg-red-500/6 border border-red-500/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-red-400">Sequential — Before</span>
              <span className="text-lg font-black text-red-400">15 min</span>
            </div>
            <Gantt tasks={seqTasks} total={SEQ_TOTAL} animated={animated} />
          </div>
          {/* Parallel */}
          <div className="rounded-2xl bg-emerald-500/6 border border-emerald-500/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-emerald-400">Parallel — After</span>
              <span className="text-lg font-black text-emerald-400">2 min</span>
            </div>
            <Gantt tasks={parTasks} total={PAR_TOTAL} animated={animated} />
            <p className="text-[9px] text-slate-600 mt-2 font-mono">⚡ = remote cache hit (zero rebuild)</p>
          </div>
        </motion.div>

        {/* Right: what it solves */}
        <div className="flex-1 flex flex-col gap-4 mt-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-center rounded-2xl bg-white/4 border border-white/8 px-6 py-5 mb-1"
          >
            <div className="text-5xl font-black gradient-text-gold mb-1">87%</div>
            <div className="text-sm text-slate-400">Faster builds</div>
            <div className="text-xs text-slate-600 mt-0.5">15 min → 2 min with parallel execution + caching</div>
          </motion.div>

          <div className="flex flex-col gap-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.4 }}
              >
                <Tooltip content={b.detail}>
                  <div
                    className={`w-full rounded-xl border ${b.color} px-5 py-3 flex items-center gap-3 cursor-default hover:opacity-90 transition-opacity`}
                  >
                    <span className={`text-sm font-bold ${b.accent}`}>✓</span>
                    <span className="text-sm font-semibold text-white/80">{b.label}</span>
                  </div>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
