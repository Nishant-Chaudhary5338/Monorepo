import { SlideComponent as Slide } from "@repo/present";
import { Card, SlideHeader } from "../components";

const problems = [
  {
    icon: "🔴",
    title: "Scattered Codebase",
    desc: "Teams working in silos — duplicated effort, zero reuse",
    variant: "red" as const,
  },
  {
    icon: "💰",
    title: "High Costs",
    desc: "5× infra · 3× QA cycles · 2× engineers for same output",
    variant: "red" as const,
  },
  {
    icon: "🐌",
    title: "Slow Delivery",
    desc: "Weeks to ship features · Months for cross-team work",
    variant: "amber" as const,
  },
];

export function ProblemSlide() {
  return (
    <Slide layout="default" title="The Problem">
      <div className="bg-gradient-purple flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="Why We"
          highlight="Need This"
          highlightColor="amber"
        />
        <div className="mt-8 grid w-full max-w-4xl grid-cols-3 gap-8">
          {problems.map((p) => (
            <Card
              key={p.title}
              variant={p.variant}
              className="flex flex-col items-center gap-4 p-8 text-center"
            >
              <div className="animate-pulse-slow text-5xl">{p.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </Slide>
  );
}