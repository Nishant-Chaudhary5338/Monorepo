import { useState, useEffect } from "react";
import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

interface Pillar {
  icon: string;
  title: string;
  desc: string;
  color: "cyan" | "purple" | "green";
  benefits: string[];
  metrics: { value: string; label: string }[];
}

const pillars: Pillar[] = [
  {
    icon: "📦",
    title: "Monorepo",
    desc: "Reusable components, shared types, unified DX.",
    color: "cyan",
    benefits: [
      "Shared UI components across all apps",
      "Unified TypeScript definitions",
      "Single dependency management",
      "Consistent code quality standards",
    ],
    metrics: [
      { value: "6", label: "Shared Packages" },
      { value: "4", label: "Production Apps" },
    ],
  },
  {
    icon: "⚡",
    title: "Turborepo",
    desc: "Parallel builds, intelligent caching, performance by default.",
    color: "purple",
    benefits: [
      "Parallel task execution",
      "Intelligent build caching",
      "Incremental builds",
      "CI/CD optimization",
    ],
    metrics: [
      { value: "Parallel", label: "Execution" },
      { value: "Smart", label: "Caching" },
    ],
  },
  {
    icon: "🤖",
    title: "AI Tools",
    desc: "Automated code quality, UI generation from specs, test coverage.",
    color: "green",
    benefits: [
      "Automated code reviews",
      "Component generation from wireframes",
      "Test automation",
      "TypeScript enforcement",
    ],
    metrics: [
      { value: "24+", label: "MCP Tools" },
      { value: "3", label: "Automation Layers" },
    ],
  },
];

const colorMap = {
  cyan: {
    bg: "bg-cyan-500/10",
    bgStrong: "bg-cyan-500/20",
    border: "border-cyan-500",
    text: "text-cyan-600",
    glow: "shadow-cyan-500/30",
    gradient: "from-cyan-500 to-cyan-600",
  },
  purple: {
    bg: "bg-purple-500/10",
    bgStrong: "bg-purple-500/20",
    border: "border-purple-500",
    text: "text-purple-600",
    glow: "shadow-purple-500/30",
    gradient: "from-purple-500 to-purple-600",
  },
  green: {
    bg: "bg-green-500/10",
    bgStrong: "bg-green-500/20",
    border: "border-green-500",
    text: "text-green-600",
    glow: "shadow-green-500/30",
    gradient: "from-green-500 to-green-600",
  },
};

export function SolutionSlide() {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [animateFlow, setAnimateFlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateFlow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const workflowSteps = [
    { icon: "💻", label: "Code" },
    { icon: "📦", label: "Monorepo" },
    { icon: "⚡", label: "Turborepo" },
    { icon: "🤖", label: "AI Tools" },
    { icon: "🚀", label: "Deploy" },
  ];

  return (
    <Slide layout="center" title="The Solution">
      <div className="bg-gradient-cyan flex h-full w-full flex-col items-center justify-center p-10">
        <SlideHeader
          title="What Was"
          highlight="Built"
          highlightColor="cyan"
          subtitle="A scalable React platform built on reusable architecture"
        />

        {/* Animated Workflow */}
        <div className="mt-6 flex items-center gap-2">
          {workflowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div
                className={`flex flex-col items-center gap-1 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm transition-all duration-500 ${
                  animateFlow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="text-2xl">{step.icon}</span>
                <span className="text-[10px] font-semibold text-gray-600">
                  {step.label}
                </span>
              </div>
              {i < workflowSteps.length - 1 && (
                <span
                  className={`text-xl text-gray-400 transition-all duration-300 ${
                    animateFlow ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 150 + 100}ms` }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Main Pillars */}
        <div className="mt-8 flex items-start gap-6">
          {pillars.map((pillar, i) => {
            const colors = colorMap[pillar.color];
            const isExpanded = expandedPillar === pillar.title;

            return (
              <div
                key={pillar.title}
                className={`relative flex cursor-pointer flex-col items-center transition-all duration-500 ${
                  animateFlow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 200}ms` }}
                onClick={() => setExpandedPillar(isExpanded ? null : pillar.title)}
              >
                {/* Main Card */}
                <div
                  className={`flex min-w-[220px] flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-300 ${colors.border} ${colors.bg} ${
                    isExpanded
                      ? `scale-105 shadow-xl ${colors.glow}`
                      : "hover:shadow-lg"
                  }`}
                >
                  <div className="relative">
                    <span className="text-5xl">{pillar.icon}</span>
                    <div
                      className={`absolute -inset-2 rounded-full bg-linear-to-r ${colors.gradient} opacity-20 blur-md`}
                    />
                  </div>

                  <h3 className={`text-xl font-extrabold ${colors.text}`}>
                    {pillar.title}
                  </h3>
                  <p className="text-center text-xs text-gray-500">{pillar.desc}</p>

                  {/* Metrics */}
                  <div className="mt-2 flex gap-4">
                    {pillar.metrics.map((metric) => (
                      <div key={metric.label} className="text-center">
                        <div className={`text-lg font-extrabold ${colors.text}`}>
                          {metric.value}
                        </div>
                        <div className="text-[9px] text-gray-500">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <span className="mt-2 text-xs text-gray-400">
                    {isExpanded ? "▼ Click to collapse" : "▶ Click for details"}
                  </span>
                </div>

                {/* Expanded Content */}
                <div
                  className={`mt-3 w-full overflow-hidden rounded-xl border ${colors.border} ${colors.bgStrong} transition-all duration-300 ${
                    isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4">
                    <h4 className={`mb-2 text-sm font-bold ${colors.text}`}>
                      Key Capabilities:
                    </h4>
                    <ul className="flex flex-col gap-1.5">
                      {pillar.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2 text-xs text-gray-600"
                        >
                          <span className={`text-sm ${colors.text}`}>✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 rounded-full border border-cyan-300 bg-linear-to-r from-cyan-100 to-green-100 px-8 py-3">
          <span className="text-sm font-bold text-gray-800">
            <span className="text-cyan-600">One codebase</span> ·{" "}
            <span className="text-purple-600">Parallel builds</span> ·{" "}
            <span className="text-green-600">Automated everything</span>
          </span>
        </div>
      </div>
    </Slide>
  );
}
