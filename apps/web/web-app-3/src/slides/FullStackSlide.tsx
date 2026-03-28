import { SlideComponent as Slide } from "@repo/present";
import { Card, SlideHeader } from "../components";

const stacks = [
  { name: "Next.js", desc: "API routes, server components, SSR optimization, middleware" },
  { name: "Nuxt.js", desc: "Composables, server routes, Vue component automation" },
  { name: "Express.js", desc: "Route validation, middleware patterns, API documentation" },
  { name: "Node.js", desc: "Service architecture, error handling, logging patterns" },
  { name: "NestJS", desc: "Module generation, controller scaffolding, DTO validation" },
];

const capabilities = [
  "Auto-generate API endpoints with validation",
  "Enforce error handling patterns",
  "Generate OpenAPI/Swagger docs",
  "Database schema migrations",
  "Security vulnerability scanning",
];

export function FullStackSlide() {
  return (
    <Slide layout="two-column" title="Full Stack">
      <div className="bg-gradient-green flex h-full w-full grid-cols-2 items-center gap-10 p-10">
        {/* Left: Stacks */}
        <div>
          <SlideHeader
            title="Beyond Frontend —"
            highlight="Full Stack"
            highlightColor="green"
            subtitle="TypeScript-based, works everywhere"
          />
          <div className="flex flex-col gap-3">
            {stacks.map((s) => (
              <Card key={s.name} variant="green" className="p-4">
                <div className="font-semibold text-slate-200">{s.name}</div>
                <div className="text-xs text-slate-400">{s.desc}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Capabilities */}
        <div>
          <h3 className="mb-6 text-xl font-semibold text-gray-800">
            Backend Automation Capabilities
          </h3>
          <div className="flex flex-col gap-3">
            {capabilities.map((cap) => (
              <div
                key={cap}
                className="flex items-center gap-3 rounded-lg border-l-3 border-l-green-500 bg-green-50 px-4 py-3"
              >
                <span className="text-xl text-green-600">✓</span>
                <span className="text-sm text-gray-800">{cap}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-gray-100 p-4 text-center">
            <span className="gradient-text text-xl font-bold">
              One system, entire stack covered.
            </span>
          </div>
        </div>
      </div>
    </Slide>
  );
}