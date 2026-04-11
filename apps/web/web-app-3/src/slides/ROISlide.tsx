import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const costData = [
  { month: "M1", without: 50, with: 50 },
  { month: "M2", without: 68, with: 58 },
  { month: "M3", without: 88, with: 62 },
  { month: "M4", without: 112, with: 65 },
  { month: "M5", without: 138, with: 67 },
  { month: "M6", without: 168, with: 68 },
  { month: "M7", without: 200, with: 69 },
  { month: "M8", without: 235, with: 70 },
  { month: "M9", without: 272, with: 71 },
  { month: "M10", without: 312, with: 72 },
  { month: "M11", without: 355, with: 73 },
  { month: "M12", without: 400, with: 74 },
];


export function ROISlide() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-amber-400/60 mb-3 font-medium">Business Case</p>
        <h2 className="text-5xl font-black text-white">
          The Cost of{" "}
          <span className="gradient-text-gold">Staying Fragmented</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">Engineering cost trajectory over 12 months</p>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-3xl h-52 mb-6"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={costData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradWithout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradWith" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
            <RechartsTooltip
              contentStyle={{ background: "#0f0f1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }}
              cursor={{ stroke: "rgba(255,255,255,0.08)" }}
            />
            <Area type="monotone" dataKey="without" name="Fragmented repos" stroke="#ef4444" strokeWidth={2} fill="url(#gradWithout)" />
            <Area type="monotone" dataKey="with" name="This system" stroke="#10b981" strokeWidth={2} fill="url(#gradWith)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-6 mb-8"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-400" />
          <span className="text-xs text-slate-500">Fragmented repos — cost compounds</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-400" />
          <span className="text-xs text-slate-500">This system — cost flattens</span>
        </div>
      </motion.div>

    </div>
  );
}
