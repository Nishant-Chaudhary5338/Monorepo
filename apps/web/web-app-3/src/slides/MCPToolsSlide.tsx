import { SlideComponent as Slide } from "@repo/present";
import { Card, SlideHeader } from "../components";

const categories = [
  { icon: "🔍", title: "Code Quality", tools: "typescript-enforcer, accessibility-checker, dep-auditor", saved: "10 hrs/week", color: "purple" as const },
  { icon: "🧩", title: "Component Dev", tools: "component-factory, component-reviewer, component-fixer", saved: "15 hrs/week", color: "cyan" as const },
  { icon: "🧪", title: "Testing", tools: "generate-tests, fix-failing-tests, test-gap-analyzer", saved: "12 hrs/week", color: "green" as const },
  { icon: "⚡", title: "Performance", tools: "performance-audit, lighthouse-runner, render-analyzer", saved: "8 hrs/week", color: "amber" as const },
];

const colorMap = {
  purple: "text-purple-500",
  cyan: "text-cyan-500",
  green: "text-green-500",
  amber: "text-amber-500",
};

export function MCPToolsSlide() {
  return (
    <Slide layout="default" title="AI-Driven Development">
      <div className="bg-gradient-dark flex h-full w-full flex-col p-10">
        <SlideHeader
          title="AI-Driven Development —"
          highlight="MCP Tools"
          subtitle="20+ Specialized AI Tools Automating Engineering"
        />
        <div className="grid flex-1 grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.title}
              variant="default"
              border="top"
              className="flex flex-col gap-2 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
              </div>
              <p className="text-xs text-gray-500">{cat.tools}</p>
              <div className="mt-auto flex items-center gap-2">
                <span className={`text-3xl font-extrabold ${colorMap[cat.color]}`}>
                  {cat.saved.split(" ")[0]}
                </span>
                <span className="text-xs text-gray-500">hrs/week saved</span>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-green-300 bg-gradient-to-r from-green-100 to-cyan-100 p-3 text-center">
          <span className="font-semibold text-gray-800">Total: </span>
          <span className="text-xl font-bold text-green-600">55+ engineering hours saved per week per team</span>
        </div>
      </div>
    </Slide>
  );
}