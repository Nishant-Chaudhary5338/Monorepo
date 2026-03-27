import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartComponentProps } from "../recharts.types";

// ============================================================
// PieChartWidget Component
// ============================================================

export const PieChartWidget = React.memo(function PieChartWidget({
  data,
  series,
  showLegend,
  showTooltip,
  animate,
}: ChartComponentProps): React.JSX.Element {
  // ==========================================================
  // For pie charts, we use the first series dataKey as the value
  // and "name" as the label
  // ==========================================================

  const valueKey = series[0]?.dataKey ?? "value";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {showTooltip && <Tooltip />}
        {showLegend && (
          <Legend wrapperStyle={{ fontSize: 12 }} />
        )}
        <Pie
          data={[...data]}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="80%"
          dataKey={valueKey}
          nameKey="name"
          isAnimationActive={animate}
          label={({ name, percent }) =>
            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={series[index % series.length]?.color ?? "#8884d8"}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
});

PieChartWidget.displayName = "PieChartWidget";