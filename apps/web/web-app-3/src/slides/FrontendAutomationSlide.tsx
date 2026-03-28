import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const categories = [
  {
    icon: "🔍",
    title: "Code Quality",
    desc: "Automated reviews, type enforcement, dependency audits",
    saved: "10",
    pct: 90,
    color: "purple" as const,
  },
  {
    icon: "🧩",
    title: "Component Dev",
    desc: "Auto-generate, review, and fix components from design",
    saved: "15",
    pct: 95,
    color: "cyan" as const,
  },
  {
    icon: "🧪",
    title: "Testing & QA",
    desc: "Auto-generate tests, fix failures, close coverage gaps",
    saved: "12",
    pct: 85,
    color: "green" as const,
  },
];

const colorMap = {
  purple: { text: "text-purple-600", bar: "bg-purple-500", border: "border-purple-400", bg: "bg-purple-500/10" },
  cyan: { text: "text-cyan-600", bar: "bg-cyan-500", border: "border-cyan-400", bg: "bg-cyan-500/10" },
  green: { text: "text-green-600", bar: "bg-green-500", border: "border-green-400", bg: "bg-green-500/10" },
};

export function FrontendAutomationSlide() {
  return (
    <Slide layout="center" title="How AI Powers It">
      <div className="bg-gradient-purple flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="How AI"
          highlight="Powers It"
          subtitle="Custom MCP agents built for our exact stack"
        />

        <div className="mt-10 flex w-full max-w-4xl gap-8">
          {categories.map((cat) => {
            const colors = colorMap[cat.color];
            return (
              <div
                key={cat.title}
                className={`flex flex-1 flex-col items-center gap-4 rounded-2xl border-2 ${colors.border} ${colors.bg} p-8`}
              >
                <div className="text-5xl">{cat.icon}</div>
                <h3 className={`text-xl font-bold ${colors.text}`}>{cat.title}</h3>
                <p className="text-center text-sm text-gray-500">{cat.desc}</p>

                {/* Progress Bar */}
                <div className="mt-2 w-full">
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className={`animate-fill h-3 rounded-full ${colors.bar}`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs text-gray-400">{cat.pct}% automated</div>
                </div>

                <div className="mt-auto flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${colors.text}`}>{cat.saved}</span>
                  <span className="text-sm text-gray-500">hrs/wk saved</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-2">
          <span className="animate-trend text-4xl font-extrabold text-green-600">55+</span>
          <span className="text-lg text-gray-500">engineering hours saved per week</span>
          <span className="animate-pulse text-3xl">📈</span>
        </div>
      </div>
    </Slide>
  );
}