import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const before = [
  "Configuring tooling & boilerplate",
  "Manual testing & QA cycles",
  "Dependency conflicts & debugging",
];

const after = [
  "Designing architecture & features",
  "User research & product innovation",
  "Creative problem solving & optimization",
];

export function CreativitySlide() {
  return (
    <Slide layout="center" title="What Changes">
      <div className="bg-gradient-purple flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="Engineers Shift From"
          highlight="Maintenance → Innovation"
        />

        <div className="mt-10 flex w-full max-w-4xl gap-12">
          {/* Before */}
          <div className="flex-1">
            <h3 className="mb-6 text-center text-xl font-bold text-red-500">🔴 Now — Draining</h3>
            <div className="flex flex-col gap-4">
              {before.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border-l-4 border-red-400 bg-red-50 px-5 py-4"
                >
                  <span className="text-xl">✗</span>
                  <span className="text-sm font-medium text-red-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <span className="animate-pulse text-5xl text-gray-400">→</span>
          </div>

          {/* After */}
          <div className="flex-1">
            <h3 className="mb-6 text-center text-xl font-bold text-green-600">🟢 Future — Driving</h3>
            <div className="flex flex-col gap-4">
              {after.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border-l-4 border-green-400 bg-green-50 px-5 py-4"
                >
                  <span className="text-xl">✓</span>
                  <span className="text-sm font-medium text-green-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-full border border-green-300 bg-gradient-to-r from-green-100 to-cyan-100 px-8 py-3">
          <span className="text-lg font-bold text-gray-800">
            Engineers become <span className="text-green-600">creators</span>, not maintainers.
          </span>
        </div>
      </div>
    </Slide>
  );
}