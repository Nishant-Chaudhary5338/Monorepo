import { motion } from "framer-motion";

const componentFlow = [
  { label: "component-factory", color: "#06b6d4", stroke: "#06b6d4" },
  { label: "component-reviewer", color: "#7c3aed", stroke: "#7c3aed" },
  { label: "component-fixer", color: "#ef4444", stroke: "#ef4444", optional: true },
  { label: "improve-component", color: "#06b6d4", stroke: "#06b6d4" },
  { label: "test-generator", color: "#10b981", stroke: "#10b981" },
  { label: "✓ Done", color: "#10b981", stroke: "#10b981" },
];

const prFlow = [
  { label: "PR Opened", color: "#7c3aed", stroke: "#7c3aed" },
  { label: "typescript-enforcer", color: "#06b6d4", stroke: "#06b6d4" },
  { label: "accessibility-checker", color: "#f59e0b", stroke: "#f59e0b" },
  { label: "audit-standards", color: "#f59e0b", stroke: "#f59e0b" },
  { label: "approve / block", color: "#ef4444", stroke: "#ef4444" },
  { label: "⊕ Deploy", color: "#10b981", stroke: "#10b981" },
];

const NODE_H = 30;
const NODE_W = 150;
const V_GAP = 12;

function Pipeline({ nodes, title, dotColor }: { nodes: typeof componentFlow; title: string; dotColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 rounded-2xl bg-white/4 border border-white/8 p-5 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: dotColor }} />
        <span className="text-xs font-semibold text-white/70">{title}</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${NODE_W + 20} ${nodes.length * (NODE_H + V_GAP)}`}
          className="w-full"
          style={{ maxHeight: "280px" }}
        >
          {nodes.map((node, i) => {
            const y = i * (NODE_H + V_GAP);
            const isLast = i === nodes.length - 1;
            return (
              <g key={i}>
                <motion.rect
                  x={0}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={6}
                  fill={`${node.color}20`}
                  stroke={`${node.stroke}60`}
                  strokeWidth="1"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                  style={{ transformOrigin: `${NODE_W / 2}px ${y + NODE_H / 2}px` }}
                />
                {node.optional && (
                  <text x={NODE_W + 3} y={y + 14} fill="rgba(239,68,68,0.4)" fontSize="7" fontFamily="monospace">if issues</text>
                )}
                <text x={10} y={y + 19} fill={`${node.color}dd`} fontSize="9" fontFamily="monospace" fontWeight="bold">{node.label}</text>
                {!isLast && (
                  <motion.line
                    x1={NODE_W / 2}
                    y1={y + NODE_H}
                    x2={NODE_W / 2}
                    y2={y + NODE_H + V_GAP}
                    stroke={nodes[i + 1].stroke}
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    opacity="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                  />
                )}
              </g>
            );
          })}
          {/* Feedback loop for fixer → reviewer */}
          <motion.path
            d={`M${NODE_W} ${2 * (NODE_H + V_GAP) + NODE_H / 2} Q${NODE_W + 22} ${2 * (NODE_H + V_GAP) + NODE_H / 2} ${NODE_W + 22} ${1 * (NODE_H + V_GAP) + NODE_H / 2} Q${NODE_W + 22} ${1 * (NODE_H + V_GAP)} ${NODE_W} ${1 * (NODE_H + V_GAP) + NODE_H / 2}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

export function WorkflowSlide() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-12 pt-10 pb-6 text-center"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">Workflows</p>
        <h2 className="text-5xl font-black text-white">
          How Automation{" "}
          <span className="gradient-text-violet">Flows</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">Two pipelines running in parallel — both MCP-powered</p>
      </motion.div>

      {/* Pipelines */}
      <div className="flex flex-1 gap-8 px-12 pb-12 min-h-0">
        <Pipeline
          nodes={componentFlow}
          title="Component Factory Pipeline"
          dotColor="#06b6d4"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-16 bg-white/5" />
            <span className="text-xs text-white/15 font-mono" style={{ writingMode: "vertical-rl" }}>parallel</span>
            <div className="w-px h-16 bg-white/5" />
          </div>
        </motion.div>

        <Pipeline
          nodes={prFlow}
          title="PR / Audit Pipeline"
          dotColor="#f59e0b"
        />

        {/* Right: key insight */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-45 flex flex-col gap-4 justify-center"
        >
          <div className="rounded-2xl bg-violet-500/8 border border-violet-500/20 p-5 text-center">
            <div className="text-4xl font-black gradient-text-violet mb-1">24+</div>
            <div className="text-xs text-slate-400">MCP tools</div>
          </div>
          <div className="rounded-xl bg-white/4 border border-white/8 p-4 text-center">
            <div className="text-3xl font-black gradient-text-emerald">65%</div>
            <div className="text-xs text-slate-400 mt-1">Tasks automated</div>
          </div>
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            Turborepo runs both pipelines in parallel using the same task graph
          </p>
        </motion.div>
      </div>
    </div>
  );
}
