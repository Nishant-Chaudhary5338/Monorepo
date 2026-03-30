import { SlideComponent as Slide } from "@repo/present";
import { BarChart, SlideHeader } from "../components";

const costData = [
  { label: "Infrastructure", value: 5, maxValue: 5, color: "red" as const, suffix: "×" },
  { label: "QA Cycles", value: 3, maxValue: 5, color: "amber" as const, suffix: "×" },
  { label: "Engineers", value: 2, maxValue: 5, color: "amber" as const, suffix: "×" },
  { label: "Build Time", value: 4, maxValue: 5, color: "red" as const, suffix: "×" },
];

const deliveryData = [
  { label: "Feature Ship", value: 3, maxValue: 5, color: "amber" as const, suffix: "wks" },
  { label: "Cross-team", value: 5, maxValue: 5, color: "red" as const, suffix: "mos" },
  { label: "Bug Fix", value: 2, maxValue: 5, color: "amber" as const, suffix: "days" },
];

export function ProblemSlide() {
  return (
    <Slide layout="default" title="The Problem">
      <div className="bg-gradient-purple flex h-full w-full flex-col items-center justify-center p-12">
        <SlideHeader
          title="Why We"
          highlight="Need This"
          highlightColor="amber"
          subtitle="The hidden costs of a scattered codebase"
        />

        {/* Key Stats */}
        <div className="mt-6 flex gap-8">
          <div className="flex flex-col items-center rounded-xl bg-red-500/10 px-8 py-4">
            <span className="animate-trend text-4xl font-extrabold text-red-600">$500K+</span>
            <span className="text-sm text-gray-500">Annual Waste</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-amber-500/10 px-8 py-4">
            <span className="animate-trend text-4xl font-extrabold text-amber-600">40%</span>
            <span className="text-sm text-gray-500">Duplicated Code</span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-red-500/10 px-8 py-4">
            <span className="animate-trend text-4xl font-extrabold text-red-600">3×</span>
            <span className="text-sm text-gray-500">Slower Delivery</span>
          </div>
        </div>

        {/* Bar Charts */}
        <div className="mt-8 flex w-full max-w-4xl gap-12">
          <div className="flex-1 rounded-xl bg-white/5 p-6 backdrop-blur-sm">
            <BarChart data={costData} title="Cost Multipliers" />
          </div>
          <div className="flex-1 rounded-xl bg-white/5 p-6 backdrop-blur-sm">
            <BarChart data={deliveryData} title="Delivery Delays" />
          </div>
        </div>

        <div className="mt-8 rounded-full border border-red-300 bg-red-50 px-8 py-3">
          <span className="text-lg font-bold text-red-700">
            ⚠️ Every month of delay = <span className="text-red-600">$40K+ in lost productivity</span>
          </span>
        </div>
      </div>
    </Slide>
  );
}
