import type { DashboardAnnotator } from "../data";

interface Props {
  data: DashboardAnnotator[];
}

export default function AnnotatorTable({ data }: Props) {
  return (
    <div className="widget-card">
      <h3 className="mb-1 text-lg font-semibold text-foreground">Annotator Details</h3>
      <p className="mb-4 text-sm text-muted-foreground">Color-coded by accuracy status (red = flagged, green = passing)</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-3 py-2 font-medium text-left text-muted-foreground">Annotator</th>
              <th className="px-3 py-2 font-medium text-right text-muted-foreground">Annotations</th>
              <th className="px-3 py-2 font-medium text-right text-muted-foreground">Avg Lead Time</th>
              <th className="px-3 py-2 font-medium text-right text-muted-foreground">Agreement</th>
              <th className="px-3 py-2 font-medium text-right text-muted-foreground">Accuracy</th>
              <th className="px-3 py-2 font-medium text-right text-muted-foreground">GT Tasks</th>
              <th className="px-3 py-2 font-medium text-center text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <tr
                key={a.id}
                className="transition-colors border-b border-border/30 last:border-0 hover:bg-muted/10"
              >
                <td className="px-3 py-2 font-medium text-foreground">{a.id}</td>
                <td className="px-3 py-2 text-right text-foreground">{a.totalAnnotations}</td>
                <td className="px-3 py-2 text-right text-foreground">
                  {a.avgLeadTime.toFixed(1)}s
                  <span className={`ml-1 text-xs ${a.leadTimeDiffVsAverage > 0 ? "text-destructive" : "text-[hsl(var(--chart-2))]"}`}>
                    ({a.leadTimeDiffVsAverage > 0 ? "+" : ""}{a.leadTimeDiffVsAverage.toFixed(1)}s)
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-foreground">{a.avgAgreement.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right text-foreground">
                  {a.accuracyPercent !== null ? `${a.accuracyPercent}%` : "—"}
                </td>
                <td className="px-3 py-2 text-right text-foreground">
                  {a.tasksCompared > 0 ? `${a.correctAnswers}/${a.tasksCompared}` : "—"}
                </td>
                <td className="px-3 py-2 text-center">
                  {a.accuracyPercent === null ? (
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">No GT</span>
                  ) : a.flagged ? (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/15 text-destructive">Flagged</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--chart-2))]/15 text-[hsl(var(--chart-2))] font-medium">Passing</span>
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
