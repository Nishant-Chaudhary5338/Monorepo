import type { DashboardAnnotator } from "../data";

interface Props {
  data: DashboardAnnotator[];
}

export default function AnnotatorTable({ data }: Props) {
  return (
    <div className="widget-card">
      <h3 className="mb-1 text-lg font-semibold text-foreground">Annotator Details</h3>
      <p className="mb-4 text-sm text-muted-foreground">Per-annotator breakdown — flagged annotators fell below the 70% accuracy threshold</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border/60 bg-muted/30">
              <th className="px-4 py-3 font-semibold text-center text-muted-foreground tracking-wide uppercase text-xs">Annotator</th>
              <th className="px-4 py-3 font-semibold text-center text-muted-foreground tracking-wide uppercase text-xs">Annotations</th>
              <th className="px-4 py-3 font-semibold text-center text-muted-foreground tracking-wide uppercase text-xs">Avg Lead Time</th>
              <th className="px-4 py-3 font-semibold text-center text-muted-foreground tracking-wide uppercase text-xs">Agreement</th>
              <th className="px-4 py-3 font-semibold text-center text-muted-foreground tracking-wide uppercase text-xs">Accuracy</th>
              <th className="px-4 py-3 font-semibold text-center text-muted-foreground tracking-wide uppercase text-xs">GT Tasks</th>
              <th className="px-4 py-3 font-semibold text-center text-muted-foreground tracking-wide uppercase text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a, i) => (
              <tr
                key={a.id}
                className={`transition-colors border-b border-border/30 last:border-0 hover:bg-primary/5 ${i % 2 === 0 ? "bg-white" : "bg-muted/10"}`}
              >
                <td className="px-4 py-3 text-center font-mono font-semibold text-foreground tracking-wide">{a.id}</td>
                <td className="px-4 py-3 text-center text-foreground">{a.totalAnnotations}</td>
                <td className="px-4 py-3 text-center text-foreground">
                  {a.avgLeadTime.toFixed(1)}s
                  <span className={`ml-1 text-xs font-medium ${a.leadTimeDiffVsAverage > 0 ? "text-amber-500" : "text-emerald-600"}`}>
                    ({a.leadTimeDiffVsAverage > 0 ? "+" : ""}{a.leadTimeDiffVsAverage.toFixed(1)}s)
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-foreground">{a.avgAgreement.toFixed(1)}%</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${a.accuracyPercent === null ? "text-muted-foreground" : a.flagged ? "text-[#e07070]" : "text-[#c97a6a]"}`}>
                    {a.accuracyPercent !== null ? `${a.accuracyPercent}%` : "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-foreground">
                  {a.tasksCompared > 0 ? `${a.correctAnswers} / ${a.tasksCompared}` : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {a.accuracyPercent === null ? (
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-400">No GT</span>
                  ) : a.flagged ? (
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full" style={{ background: "#fdf0ee", color: "#e07070", outline: "1px solid #f5c4bc" }}>Flagged</span>
                  ) : (
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full" style={{ background: "#f0faf4", color: "#4a9e6b", outline: "1px solid #a8d5b8" }}>Passing</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
