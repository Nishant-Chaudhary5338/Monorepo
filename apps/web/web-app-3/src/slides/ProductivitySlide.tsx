import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader, StatBox } from "../components";

const stats = [
  { value: "75%", label: "Faster Builds", sub: "Minutes, not hours", color: "purple" as const },
  { value: "4x", label: "Code Reuse", sub: "60-80% shared code", color: "cyan" as const },
  { value: "70%", label: "Fewer Bugs", sub: "Automated QA coverage", color: "green" as const },
];

const metrics = [
  { label: "Feature Delivery", before: "2-4 weeks", after: "3-5 days", improvement: "75% faster" },
  { label: "PR Review Time", before: "2-4 hours", after: "30-60 min", improvement: "70% faster" },
  { label: "Onboarding", before: "1-2 weeks", after: "1-2 days", improvement: "80% faster" },
  { label: "Time to Market", before: "Months", after: "Weeks", improvement: "4x faster" },
];

export function ProductivitySlide() {
  return (
    <Slide layout="default" title="Productivity">
      <div className="bg-gradient-dark flex h-full w-full flex-col p-10">
        <SlideHeader
          title="Productivity & Efficiency"
          highlight="Gains"
        />

        {/* Big Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <StatBox
              key={s.label}
              value={s.value}
              label={s.label}
              sub={s.sub}
              color={s.color}
            />
          ))}
        </div>

        {/* Metrics Table */}
        <table className="w-full flex-1 border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Metric
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-red-500">
                Before
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-green-600">
                After
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-cyan-600">
                Improvement
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.label}>
                <td className="rounded-l-lg bg-black/[0.03] px-4 py-3 text-sm font-medium text-gray-800">
                  {m.label}
                </td>
                <td className="bg-black/[0.03] px-4 py-3 text-sm text-red-500">
                  {m.before}
                </td>
                <td className="bg-black/[0.03] px-4 py-3 text-sm text-green-600">
                  {m.after}
                </td>
                <td className="rounded-r-lg bg-black/[0.03] px-4 py-3 text-sm font-bold text-cyan-600">
                  {m.improvement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Slide>
  );
}