import { SlideComponent as Slide } from "@repo/present";
import { Card, CTAButton } from "../components";

const steps = [
  { num: "1", label: "Consolidate", desc: "One monorepo", color: "purple" as const },
  { num: "2", label: "Accelerate", desc: "Turborepo parallel builds", color: "cyan" as const },
  { num: "3", label: "Automate", desc: "AI-powered MCP tools", color: "green" as const },
  { num: "4", label: "Innovate", desc: "Focus on what matters", color: "amber" as const },
];

const stats = [
  { value: "$180K+", label: "Annual Savings", color: "green" as const },
  { value: "75%", label: "Faster Builds", color: "cyan" as const },
  { value: "70-80%", label: "Tasks Automated", color: "purple" as const },
  { value: "4x", label: "Faster to Market", color: "amber" as const },
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
      <div className="bg-gradient-dark flex h-full w-full flex-col items-center justify-center p-12">
        <h2 className="mb-4 text-4xl font-bold text-gray-800">
          Summary & <span className="gradient-text">Call to Action</span>
        </h2>

        {/* ROI Numbers */}
        <div className="my-8 flex gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-4xl font-extrabold ${colorMap[s.color]}`}>
                {s.value}
              </div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="my-6 flex items-center gap-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-4">
              <Card border="top" className="min-w-[140px] p-5 text-center">
                <div className={`text-3xl font-extrabold ${colorMap[s.color]}`}>
                  {s.num}
                </div>
                <div className="mt-1 font-semibold text-gray-800">{s.label}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </Card>
              {i < steps.length - 1 && (
                <span className="text-2xl text-gray-400">→</span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <CTAButton>Get Started Today</CTAButton>
        </div>

        <div className="mt-8 text-2xl font-bold">
          <span className="text-gray-800">"One System. One Team. </span>
          <span className="gradient-text">Unlimited Potential."</span>
        </div>
      </div>
    </Slide>
  );
}