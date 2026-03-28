import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const stats = [
  { value: "$180K+", label: "Annual Savings", icon: "💰", color: "green" as const },
  { value: "75%", label: "Faster Delivery", icon: "🚀", color: "cyan" as const },
  { value: "4×", label: "Code Reuse", icon: "🔄", color: "purple" as const },
  { value: "9×", label: "Return on Investment", icon: "📈", color: "amber" as const },
];

const colorMap = {
  green: { text: "text-green-600", bg: "bg-green-500/10", border: "border-green-400", glow: "shadow-green-500/30" },
  cyan: { text: "text-cyan-600", bg: "bg-cyan-500/10", border: "border-cyan-400", glow: "shadow-cyan-500/30" },
  purple: { text: "text-purple-600", bg: "bg-purple-500/10", border: "border-purple-400", glow: "shadow-purple-500/30" },
  amber: { text: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-400", glow: "shadow-amber-500/30" },
};

export function CostImpactSlide() {
  return (
    <Slide layout="center" title="The Impact">
      <div className="bg-gradient-dark flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="The"
          highlight="Impact"
        />

        <div className="mt-10 grid w-full max-w-4xl grid-cols-4 gap-6">
          {stats.map((s) => {
            const colors = colorMap[s.color];
            return (
              <div
                key={s.label}
                className={`animate-glow flex flex-col items-center gap-3 rounded-2xl border-2 ${colors.border} ${colors.bg} p-8 shadow-lg ${colors.glow}`}
              >
                <div className="text-4xl">{s.icon}</div>
                <div className={`animate-trend text-5xl font-extrabold ${colors.text}`}>
                  {s.value}
                </div>
                <div className="text-sm font-medium text-gray-500">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-full border border-purple-300 bg-gradient-to-r from-purple-100 to-cyan-100 px-8 py-3">
          <span className="text-lg font-bold text-gray-800">
            $20K investment → <span className="text-green-600">$180K+ saved</span> annually
          </span>
        </div>
      </div>
    </Slide>
  );
}