import { motion } from "framer-motion";
import { Tooltip } from "../components/Tooltip";

const appContains = [
  {
    label: "Business Logic",
    icon: "⚙",
    color: "border-cyan-500/30 bg-cyan-500/8",
    accent: "text-cyan-400",
    detail: "Domain-specific rules, workflows, feature state, and user-facing logic. The unique IP of each app.",
  },
  {
    label: "API Layer",
    icon: "↔",
    color: "border-violet-500/30 bg-violet-500/8",
    accent: "text-violet-400",
    detail: "REST or GraphQL clients, error handling, response normalization, and caching strategies specific to each app's data needs.",
  },
  {
    label: "App-Level Code",
    icon: "⊞",
    color: "border-emerald-500/30 bg-emerald-500/8",
    accent: "text-emerald-400",
    detail: "Route-level state, feature flags, environment config, navigation guards. Everything that is unique to this one app.",
  },
];

const qualities = [
  { label: "Less Bloated", detail: "No UI library code, no utilities, no config — it all lives in packages." },
  { label: "Readable", detail: "Open an app and see only business logic. No noise." },
  { label: "Modular", detail: "Add a feature by adding a route + slice. Remove a feature the same way." },
  { label: "Scalable", detail: "Apps grow by consuming more packages — not by accumulating internal complexity." },
  { label: "Better DX", detail: "Faster builds, faster test runs, faster onboarding. Engineers only learn what the app does, not how the tooling works." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function AppsLayerSlide() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-cyan-400/60 mb-3 font-medium">The Apps Layer</p>
        <h2 className="text-5xl font-black text-white mb-2">
          Apps Contain Only{" "}
          <span className="gradient-text-violet">What's Theirs</span>
        </h2>
        <p className="text-slate-400 text-base">
          Business logic · API layer · App-level code
        </p>
      </motion.div>

      {/* Three content cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-5 w-full max-w-3xl mb-8"
      >
        {appContains.map((c) => (
          <motion.div key={c.label} variants={item} className="flex-1">
            <Tooltip content={c.detail}>
              <div
                className={`w-full rounded-2xl border ${c.color} px-6 py-6 text-center cursor-default transition-colors duration-200 h-full flex flex-col items-center gap-3`}
              >
                <span className={`text-3xl ${c.accent}`}>{c.icon}</span>
                <span className="text-sm font-bold text-white/85">{c.label}</span>
              </div>
            </Tooltip>
          </motion.div>
        ))}
      </motion.div>

      {/* Quality tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        {qualities.map((q) => (
          <Tooltip key={q.label} content={q.detail}>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/8 text-sm text-slate-300 cursor-default hover:bg-white/8 transition-colors">
              {q.label}
            </div>
          </Tooltip>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 text-xs text-slate-600 font-mono"
      >
        Hover each item for detail
      </motion.p>
    </div>
  );
}
