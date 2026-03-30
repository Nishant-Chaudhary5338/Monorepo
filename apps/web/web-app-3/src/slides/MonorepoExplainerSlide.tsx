import { SlideComponent as Slide } from "@repo/present";
import { ExpandableCard, SlideHeader } from "../components";

export function MonorepoExplainerSlide() {
  return (
    <Slide layout="center" title="What is Monorepo?">
      <div className="bg-gradient-cyan flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="What is a"
          highlight="Monorepo?"
          subtitle="One codebase to rule them all"
        />

        {/* Visual Diagram */}
        <div className="mt-8 flex items-center gap-12">
          {/* Before */}
          <div className="flex flex-col items-center">
            <h4 className="mb-4 text-lg font-bold text-red-500">❌ Before</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-red-300 bg-red-100 text-2xl"
                >
                  📁
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">4 separate repos</p>
            <div className="mt-2 flex gap-1">
              {["App A", "App B", "Pkg X", "Pkg Y"].map((name) => (
                <span key={name} className="rounded bg-red-200 px-2 py-1 text-xs text-red-700">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <span className="animate-pulse text-5xl text-gray-400">→</span>
            <span className="mt-2 text-sm font-semibold text-green-600">Consolidate</span>
          </div>

          {/* After */}
          <div className="flex flex-col items-center">
            <h4 className="mb-4 text-lg font-bold text-green-600">✅ After</h4>
            <div className="flex h-24 w-48 items-center justify-center rounded-xl border-2 border-green-400 bg-green-100">
              <div className="flex flex-col items-center">
                <span className="text-3xl">📦</span>
                <span className="text-sm font-bold text-green-700">Monorepo</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">1 unified codebase</p>
            <div className="mt-2 flex gap-1">
              {["apps/", "packages/", "tools/"].map((name) => (
                <span key={name} className="rounded bg-green-200 px-2 py-1 text-xs text-green-700">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Benefits */}
        <div className="mt-10 grid w-full max-w-4xl grid-cols-3 gap-4">
          <ExpandableCard
            icon="🔄"
            title="Shared Code"
            subtitle="Write once, use everywhere"
            color="cyan"
          >
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              <li>• UI components shared across apps</li>
              <li>• Utility functions in one place</li>
              <li>• Type definitions unified</li>
              <li>• No more copy-paste!</li>
            </ul>
          </ExpandableCard>

          <ExpandableCard
            icon="🔍"
            title="Single Source"
            subtitle="One place for everything"
            color="purple"
          >
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              <li>• All code in one repository</li>
              <li>• Unified search across projects</li>
              <li>• Single CI/CD pipeline</li>
              <li>• Consistent tooling</li>
            </ul>
          </ExpandableCard>

          <ExpandableCard
            icon="🤝"
            title="Team Sync"
            subtitle="Everyone on same page"
            color="green"
          >
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              <li>• See all changes in one place</li>
              <li>• Cross-team PRs easy</li>
              <li>• Shared standards</li>
              <li>• Better collaboration</li>
            </ul>
          </ExpandableCard>
        </div>

        <div className="mt-8 rounded-full border border-cyan-300 bg-cyan-50 px-8 py-3">
          <span className="text-lg font-bold text-gray-800">
            Think of it like a <span className="text-cyan-600">shared Google Drive</span> for your code
          </span>
        </div>
      </div>
    </Slide>
  );
}