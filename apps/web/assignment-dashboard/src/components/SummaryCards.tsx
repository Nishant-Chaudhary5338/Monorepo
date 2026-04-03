import type { DashboardAnnotator } from "../data";
import { PROJECT_AVG_LEAD_TIME, PROJECT_AVG_ACCURACY, FLAG_THRESHOLD } from "../data";

interface Props {
  data: DashboardAnnotator[];
}

export default function SummaryCards({ data }: Props) {
  const totalAnnotators = data.length;
  const flaggedCount = data.filter((a) => a.flagged).length;
  const passingCount = totalAnnotators - flaggedCount;
  const avgAgreement = (data.reduce((sum, a) => sum + a.avgAgreement, 0) / totalAnnotators).toFixed(1);

  const cards = [
    { label: "Total Annotators", value: totalAnnotators, sub: `${passingCount} passing · ${flaggedCount} flagged` },
    { label: "Avg Accuracy", value: `${PROJECT_AVG_ACCURACY}%`, sub: `Threshold: ${FLAG_THRESHOLD}%` },
    { label: "Avg Lead Time", value: `${PROJECT_AVG_LEAD_TIME}s`, sub: "Per annotation" },
    { label: "Avg Agreement", value: `${avgAgreement}%`, sub: "Across all tasks" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="widget-card">
          <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}