import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";
import type { DashboardAnnotator } from "../data";
import { FLAG_THRESHOLD } from "../data";

interface Props {
  data: DashboardAnnotator[];
}

export default function AccuracyChart({ data }: Props) {
  const chartData = data
    .filter((a) => a.accuracyPercent !== null)
    .map((a) => ({
      name: a.id,
      accuracy: a.accuracyPercent,
      flagged: a.flagged,
    }))
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0));

  return (
    <div className="widget-card">
      <h3 className="mb-1 text-lg font-semibold text-foreground">Accuracy vs Ground Truth</h3>
      <p className="mb-4 text-sm text-muted-foreground">Per-annotator accuracy (threshold: {FLAG_THRESHOLD}%)</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={60} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: 13,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`${value}%`, "Accuracy"]}
          />
          <ReferenceLine x={FLAG_THRESHOLD} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: "Threshold", fill: "hsl(var(--destructive))", fontSize: 11 }} />
          <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.flagged ? "hsl(var(--destructive))" : "hsl(var(--chart-2))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}