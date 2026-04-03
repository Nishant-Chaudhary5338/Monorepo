import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";
import type { DashboardAnnotator } from "../data";
import { PROJECT_AVG_LEAD_TIME } from "../data";

interface Props {
  data: DashboardAnnotator[];
}

export default function LeadTimeChart({ data }: Props) {
  const chartData = data
    .map((a) => ({
      name: a.id,
      leadTime: a.avgLeadTime,
      diff: a.leadTimeDiffVsAverage,
    }))
    .sort((a, b) => a.leadTime - b.leadTime);

  return (
    <div className="widget-card">
      <h3 className="mb-1 text-base font-semibold text-foreground tracking-tight">Avg Lead Time</h3>
      <p className="mb-4 text-xs text-muted-foreground uppercase tracking-wide font-medium">Seconds per annotation · project avg: {PROJECT_AVG_LEAD_TIME}s</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Lead Time (seconds)", position: "insideBottom", offset: -15, fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={60} label={{ value: "Annotator", angle: -90, position: "insideLeft", offset: -5, fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: 13,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value, _name, props) => {
              const diff = props.payload.diff;
              const sign = diff >= 0 ? "+" : "";
              return [`${value}s (${sign}${diff.toFixed(1)}s vs avg)`, "Lead Time"];
            }}
          />
          <ReferenceLine x={PROJECT_AVG_LEAD_TIME} stroke="hsl(var(--chart-4))" strokeDasharray="5 5" label={{ value: "Avg", fill: "hsl(var(--chart-4))", fontSize: 11 }} />
          <Bar dataKey="leadTime" radius={[0, 6, 6, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.diff > 5 ? "#e07070" : "#e8a598"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}