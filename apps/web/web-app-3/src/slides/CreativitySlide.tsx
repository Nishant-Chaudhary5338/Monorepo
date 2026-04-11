import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

const before = [
  "Configuring tooling & boilerplate across every repo",
  "Manual testing & QA cycles with no automation",
  "Dependency conflicts & debugging that block delivery",
];

const after = [
  "Designing scalable architecture and component systems",
  "Mentoring teams — sharing patterns, raising the bar",
  "Driving UX and DX decisions that impact products",
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
            <h3 className="mb-6 text-center text-xl font-bold text-red-500">🔴 Before</h3>
            <div className="flex flex-col gap-4">
              {before.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border-l-4 border-red-400 bg-red-50 px-5 py-4"
                >
                  <span className="text-xl mt-0.5">✗</span>
                  <span className="text-sm font-medium text-red-600 leading-snug">{item}</span>
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
            <h3 className="mb-6 text-center text-xl font-bold text-green-600">🟢 After</h3>
            <div className="flex flex-col gap-4">
              {after.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border-l-4 border-green-400 bg-green-50 px-5 py-4"
                >
                  <span className="text-xl mt-0.5">✓</span>
                  <span className="text-sm font-medium text-green-700 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-full border border-green-300 bg-linear-to-r from-green-100 to-cyan-100 px-8 py-3">
          <span className="text-lg font-bold text-gray-800">
            Engineers become <span className="text-green-600">architects</span>, not maintainers.
          </span>
        </div>
      </div>
    </Slide>
  );
}
