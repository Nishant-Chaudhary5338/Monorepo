import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const beforeMetrics = [
  { label: "Build Time", value: "15 min", icon: "⏱️" },
  { label: "Code Reuse", value: "10%", icon: "🔄" },
  { label: "Team Size", value: "2× needed", icon: "👥" },
  { label: "Deploy Freq", value: "Weekly", icon: "🚀" },
  { label: "Bug Fix Time", value: "3-5 days", icon: "🐛" },
  { label: "Onboarding", value: "2 weeks", icon: "📚" },
];

const afterMetrics = [
  { label: "Build Time", value: "2 min", icon: "⏱️" },
  { label: "Code Reuse", value: "80%", icon: "🔄" },
  { label: "Team Size", value: "Optimal", icon: "👥" },
  { label: "Deploy Freq", value: "Multiple/day", icon: "🚀" },
  { label: "Bug Fix Time", value: "Hours", icon: "🐛" },
  { label: "Onboarding", value: "2 days", icon: "📚" },
];

export function BeforeAfterSlide() {
  return (
    <Slide layout="center" title="Before vs After">
      <div className="bg-gradient-purple flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="The"
          highlight="Transformation"
          subtitle="See the difference for yourself"
        />

        <div className="mt-8 flex w-full max-w-4xl gap-8">
          {/* Before */}
          <div className="flex-1">
            <h3 className="mb-6 text-center text-xl font-bold text-red-500">
              🔴 Before — Struggling
            </h3>
            <div className="flex flex-col gap-3">
              {beforeMetrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-3 rounded-xl border-l-4 border-red-400 bg-red-50 px-4 py-3"
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{m.label}</span>
                  <span className="text-sm font-bold text-red-600">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="animate-pulse text-5xl text-gray-400">→</span>
              <span className="rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-1 text-xs font-bold text-white">
                10× Better
              </span>
            </div>
          </div>

          {/* After */}
          <div className="flex-1">
            <h3 className="mb-6 text-center text-xl font-bold text-green-600">
              🟢 After — Thriving
            </h3>
            <div className="flex flex-col gap-3">
              {afterMetrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-3 rounded-xl border-l-4 border-green-400 bg-green-50 px-4 py-3"
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{m.label}</span>
                  <span className="text-sm font-bold text-green-600">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-full border border-green-300 bg-gradient-to-r from-green-100 to-cyan-100 px-8 py-3">
          <span className="text-lg font-bold text-gray-800">
            From <span className="text-red-600">frustration</span> to{" "}
            <span className="text-green-600">acceleration</span>
          </span>
        </div>
      </div>
    </Slide>
  );
}