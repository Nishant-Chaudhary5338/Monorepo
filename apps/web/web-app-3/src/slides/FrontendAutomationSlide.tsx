import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const categories = [
  {
    icon: "🔍",
    title: "Code Quality",
    desc: "Automated reviews, type enforcement, dependency audits",
    capability: "Type errors caught before PR — quality enforced automatically",
    color: "purple" as const,
  },
  {
    icon: "🧩",
    title: "Component Dev",
    desc: "Auto-generate, review, and fix components from design",
    capability: "From wireframes or prompts → clean React components, no boilerplate",
    color: "cyan" as const,
  },
  {
    icon: "🧪",
    title: "Testing & QA",
    desc: "Auto-generate tests, fix failures, close coverage gaps",
    capability: "Test cases auto-generated — coverage gaps closed at the source",
    color: "green" as const,
  },
];

const colorMap = {
  purple: { text: "text-purple-600", bar: "bg-purple-500", border: "border-purple-400", bg: "bg-purple-500/10", chip: "bg-purple-100 text-purple-700" },
  cyan: { text: "text-cyan-600", bar: "bg-cyan-500", border: "border-cyan-400", bg: "bg-cyan-500/10", chip: "bg-cyan-100 text-cyan-700" },
  green: { text: "text-green-600", bar: "bg-green-500", border: "border-green-400", bg: "bg-green-500/10", chip: "bg-green-100 text-green-700" },
};

export function FrontendAutomationSlide() {
  return (
    <Slide layout="center" title="How AI Powers It">
      <div className="bg-gradient-purple flex h-full w-full flex-col items-center justify-center p-10">
        <SlideHeader
          title="How AI"
          highlight="Powers It"
          subtitle="MCP agents for the full React + TypeScript stack"
        />

        <div className="mt-8 flex w-full max-w-4xl gap-6">
          {categories.map((cat) => {
            const colors = colorMap[cat.color];
            return (
              <div
                key={cat.title}
                className={`flex flex-1 flex-col items-center gap-4 rounded-2xl border-2 ${colors.border} ${colors.bg} p-6`}
              >
                <div className="text-5xl">{cat.icon}</div>
                <h3 className={`text-xl font-bold ${colors.text}`}>{cat.title}</h3>
                <p className="text-center text-sm text-gray-500">{cat.desc}</p>

                <div className={`mt-auto w-full rounded-xl px-4 py-3 text-center text-xs font-medium leading-snug ${colors.chip}`}>
                  {cat.capability}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-full border border-gray-300 bg-white/60 px-8 py-3">
          <span className="text-base font-semibold text-gray-700">
            Automation handles the repetitive —{" "}
            <span className="text-purple-600">focus stays on architecture.</span>
          </span>
        </div>
      </div>
    </Slide>
  );
}
