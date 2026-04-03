import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DashboardAnnotator } from "../data";

interface Props {
  data: DashboardAnnotator[];
}

export default function AgreementChart({ data }: Props) {
  const chartData = data
    .map((a) => ({
      name: a.id,
      agreement: a.avgAgreement,
    }))
    .sort((a, b) => b.agreement - a.agreement);

  return (
    <div className="widget-card">
      <h3 className="mb-1 text-base font-semibold text-foreground tracking-tight">Agreement Scores</h3>
      <p className="mb-4 text-xs text-muted-foreground uppercase tracking-wide font-medium">Average inter-annotator agreement per annotator</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ left: 20, right: 20, top: 5, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Annotator", position: "insideBottom", offset: -15, fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Agreement (%)", angle: -90, position: "insideLeft", offset: 10, fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: 13,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`${value}%`, "Agreement"]}
          />
          <Bar dataKey="agreement" radius={[6, 6, 0, 0]} fill="#e8a598" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}