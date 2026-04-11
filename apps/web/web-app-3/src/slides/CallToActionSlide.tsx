import { SlideComponent as Slide } from "@repo/present";
import { Card, CTAButton } from "../components";

const steps = [
  { num: "1", label: "Consolidate", desc: "One monorepo, shared across all apps", color: "purple" as const },
  { num: "2", label: "Accelerate", desc: "Turborepo: parallel builds, smart cache", color: "cyan" as const },
  { num: "3", label: "Automate", desc: "AI MCP tools: code quality, UI gen, testing", color: "green" as const },
  { num: "4", label: "Scale", desc: "Architecture ready for cross-functional teams", color: "amber" as const },
];

const stats = [
  { value: "4", label: "Production Apps", color: "purple" as const },
  { value: "6+", label: "Shared Packages", color: "cyan" as const },
  { value: "24+", label: "MCP Tools", color: "green" as const },
  { value: "12 wks", label: "Build Time", color: "amber" as const },
];

const colorMap = {
  purple: "text-purple-600",
  cyan: "text-cyan-600",
  green: "text-green-600",
  amber: "text-amber-600",
};

export function CallToActionSlide() {
  return (
    <Slide layout="center" title="Call to Action">
      <div className="bg-gradient-dark flex h-full w-full flex-col items-center justify-center p-10">
        <h2 className="mb-2 text-4xl font-bold text-gray-800">
          Summary & <span className="gradient-text">What's Next</span>
        </h2>
        <p className="mb-6 text-sm text-gray-500 tracking-wide">
          A complete system — built, shipped, and running today
        </p>

        {/* Real Stats */}
        <div className="flex gap-10 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-4xl font-extrabold ${colorMap[s.color]}`}>{s.value}</div>
              <div className="mt-1 text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <Card border="top" className="min-w-35 p-5 text-center">
                <div className={`text-3xl font-extrabold ${colorMap[s.color]}`}>{s.num}</div>
                <div className="mt-1 font-semibold text-gray-800 text-sm">{s.label}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">{s.desc}</div>
              </Card>
              {i < steps.length - 1 && (
                <span className="text-2xl text-gray-400">→</span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <CTAButton>Let's Build Together</CTAButton>

        <div className="mt-6 text-2xl font-bold">
          <span className="text-gray-800">"One System. One Team. </span>
          <span className="gradient-text">Unlimited Potential."</span>
        </div>
      </div>
    </Slide>
  );
}
