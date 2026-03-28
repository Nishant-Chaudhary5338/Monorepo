import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const pillars = [
  { icon: "📦", title: "Monorepo", desc: "One codebase. Shared packages. Single source of truth.", color: "cyan" as const },
  { icon: "⚡", title: "Turborepo", desc: "30 parallel builds. Smart caching. Minutes, not hours.", color: "purple" as const },
  { icon: "🤖", title: "AI Tools", desc: "20+ custom MCP agents automating the entire workflow.", color: "green" as const },
];

const colorMap = {
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500", text: "text-cyan-600", glow: "shadow-cyan-500/20" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500", text: "text-purple-600", glow: "shadow-purple-500/20" },
  green: { bg: "bg-green-500/10", border: "border-green-500", text: "text-green-600", glow: "shadow-green-500/20" },
};

export function SolutionSlide() {
  return (
    <Slide layout="center" title="The Solution">
      <div className="bg-gradient-cyan flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="What We"
          highlight="Built"
          highlightColor="cyan"
        />

        {/* Pipeline Flow */}
        <div className="mt-10 flex items-center gap-4">
          {pillars.map((p, i) => {
            const colors = colorMap[p.color];
            return (
              <div key={p.title} className="flex items-center gap-4">
                <div
                  className={`animate-glow flex min-w-[180px] flex-col items-center gap-3 rounded-2xl border-2 ${colors.border} ${colors.bg} p-8 shadow-lg ${colors.glow}`}
                >
                  <div className="text-5xl">{p.icon}</div>
                  <h3 className={`text-2xl font-extrabold ${colors.text}`}>{p.title}</h3>
                  <p className="text-center text-sm text-gray-500">{p.desc}</p>
                </div>
                {i < pillars.length - 1 && (
                  <span className="animate-pulse text-4xl text-gray-400">→</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-full border border-cyan-300 bg-gradient-to-r from-cyan-100 to-green-100 px-8 py-3">
          <span className="text-lg font-bold text-gray-800">
            One codebase · Parallel builds · Automated everything
          </span>
        </div>
      </div>
    </Slide>
  );
}