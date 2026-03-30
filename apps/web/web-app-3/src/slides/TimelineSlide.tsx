import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const phases = [
  {
    phase: "Phase 1",
    title: "Foundation",
    duration: "Week 1-2",
    items: ["Set up monorepo", "Configure Turborepo", "Migrate shared packages"],
    color: "purple",
    status: "complete",
  },
  {
    phase: "Phase 2",
    title: "Build System",
    duration: "Week 3-4",
    items: ["Parallel builds", "Smart caching", "CI/CD integration"],
    color: "cyan",
    status: "complete",
  },
  {
    phase: "Phase 3",
    title: "AI Tools",
    duration: "Week 5-8",
    items: ["Component factory", "TypeScript enforcer", "Test generator"],
    color: "green",
    status: "current",
  },
  {
    phase: "Phase 4",
    title: "Scale",
    duration: "Week 9-12",
    items: ["Full automation", "Team training", "Documentation"],
    color: "amber",
    status: "upcoming",
  },
];

const colorMap = {
  purple: {
    bg: "bg-purple-500",
    border: "border-purple-400",
    text: "text-purple-600",
    light: "bg-purple-50",
  },
  cyan: {
    bg: "bg-cyan-500",
    border: "border-cyan-400",
    text: "text-cyan-600",
    light: "bg-cyan-50",
  },
  green: {
    bg: "bg-green-500",
    border: "border-green-400",
    text: "text-green-600",
    light: "bg-green-50",
  },
  amber: {
    bg: "bg-amber-500",
    border: "border-amber-400",
    text: "text-amber-600",
    light: "bg-amber-50",
  },
};

export function TimelineSlide() {
  return (
    <Slide layout="center" title="Timeline">
      <div className="bg-gradient-dark flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="Implementation"
          highlight="Roadmap"
          subtitle="12 weeks to transformation"
        />

        {/* Timeline */}
        <div className="mt-8 flex w-full max-w-4xl items-start gap-4">
          {phases.map((phase, i) => {
            const colors = colorMap[phase.color as keyof typeof colorMap];
            const isComplete = phase.status === "complete";
            const isCurrent = phase.status === "current";

            return (
              <div key={phase.phase} className="flex flex-1 flex-col items-center">
                {/* Phase Card */}
                <div
                  className={`w-full rounded-xl border-2 p-5 transition-all duration-300 ${
                    isCurrent
                      ? `${colors.border} ${colors.light} scale-105 shadow-lg`
                      : isComplete
                        ? `${colors.border} ${colors.light}`
                        : "border-gray-200 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-xs font-bold ${colors.text}`}>
                      {phase.phase}
                    </span>
                    {isComplete && <span className="text-green-500">✅</span>}
                    {isCurrent && (
                      <span className="animate-pulse rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                        NOW
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{phase.title}</h3>
                  <p className="mb-3 text-xs text-gray-500">{phase.duration}</p>
                  <ul className="flex flex-col gap-1">
                    {phase.items.map((item) => (
                      <li key={item} className="text-xs text-gray-600">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connector */}
                {i < phases.length - 1 && (
                  <div className="mt-2 h-1 w-full bg-gray-200">
                    <div
                      className={`h-full ${isComplete ? colors.bg : "bg-gray-200"}`}
                      style={{ width: isComplete ? "100%" : isCurrent ? "50%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full max-w-4xl">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>60% Complete</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full animate-fill rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500" style={{ width: "60%" }} />
          </div>
        </div>

        <div className="mt-6 rounded-full border border-gray-300 bg-white/50 px-8 py-3">
          <span className="text-lg font-bold text-gray-800">
            <span className="text-green-600">Phase 1-2 complete</span> ·{" "}
            <span className="text-cyan-600">Phase 3 in progress</span>
          </span>
        </div>
      </div>
    </Slide>
  );
}