import { motion } from "framer-motion";

export function MonorepoSlide() {
  return (
    <div className="relative w-full h-full slide-bg-deep flex flex-col items-center justify-center overflow-hidden px-16">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">The Solution</p>
        <h2 className="text-5xl font-black text-white mb-2">
          Monorepo Architecture
        </h2>
        <p className="text-slate-400 text-base">
          The codebase is divided into two layers
        </p>
      </motion.div>

      {/* Diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-3xl"
      >
        {/* Apps tier */}
        <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-6 mb-3">
          <p className="text-xs font-mono text-violet-400/60 uppercase tracking-widest mb-4">apps/ — Business logic lives here</p>
          <div className="grid grid-cols-4 gap-3">
            {["web-app-1", "web-app-2", "web-app-3", "portfolio"].map((app) => (
              <div key={app} className="rounded-xl bg-violet-500/10 border border-violet-500/20 py-3 text-center">
                <p className="text-xs font-mono text-violet-300">{app}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-3">
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
          >
            <line x1="12" y1="0" x2="12" y2="20" stroke="rgba(124,58,237,0.35)" strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M7 16 L12 22 L17 16" fill="none" stroke="rgba(124,58,237,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>

        {/* Packages tier */}
        <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6">
          <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest mb-4">packages/ — All reusable logic lives here</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "@repo/ui", color: "cyan" },
              { name: "@repo/dashcraft", color: "emerald" },
              { name: "@repo/present", color: "amber" },
              { name: "@repo/router", color: "violet" },
              { name: "tailwind-config", color: "slate" },
              { name: "typescript-config", color: "slate" },
            ].map(({ name, color }) => {
              const c: Record<string, string> = {
                cyan: "bg-cyan-500/10 border-cyan-500/25 text-cyan-300",
                emerald: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
                amber: "bg-amber-500/10 border-amber-500/25 text-amber-300",
                violet: "bg-violet-500/10 border-violet-500/25 text-violet-300",
                slate: "bg-slate-500/10 border-slate-500/25 text-slate-400",
              };
              return (
                <div key={name} className={`rounded-xl border py-3 text-center ${c[color]}`}>
                  <p className="text-xs font-mono">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6 text-xs text-slate-600 font-mono"
      >
        All reusable logic is moved outside into shared packages · Apps consume packages · pnpm workspace
      </motion.p>
    </div>
  );
}
