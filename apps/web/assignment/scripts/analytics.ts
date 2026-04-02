import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── Types ──────────────────────────────────────────────────────────────────

interface ResultItem {
  type: string;
  from_name: string;
  value: { choices?: string[]; text?: string[] };
}

interface Annotation {
  completed_by: string;
  lead_time: number;
  result: ResultItem[];
}

interface Task {
  id: string;
  agreement: number;
  annotations: Annotation[];
}

interface AnnotatorStats {
  annotatorId: string;
  totalAnnotations: number;
  avgLeadTime: number;
  leadTimeDiffVsAverage: number; // positive = slower than average, negative = faster
  avgAgreement: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function escapeCell(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function toRow(fields: string[]): string {
  return fields.map(escapeCell).join(",");
}

// ── Main ───────────────────────────────────────────────────────────────────

const dataPath = join(__dirname, "../fe_assessment.json");
const tasks: Task[] = JSON.parse(readFileSync(dataPath, "utf-8"));

// Build a map: annotatorId → list of { lead_time, agreement }
const annotatorData = new Map<string, { leadTime: number; agreement: number }[]>();

for (const task of tasks) {
  for (const annotation of task.annotations) {
    if (annotation.completed_by === "ground_truth") continue;

    const id = annotation.completed_by;
    if (!annotatorData.has(id)) annotatorData.set(id, []);
    annotatorData.get(id)!.push({
      leadTime: annotation.lead_time,
      agreement: task.agreement, // agreement is task-level
    });
  }
}

// Project-wide average lead time across all non-GT annotations
const allLeadTimes = [...annotatorData.values()].flatMap((entries) =>
  entries.map((e) => e.leadTime)
);
const globalAvgLeadTime = allLeadTimes.reduce((a, b) => a + b, 0) / allLeadTimes.length;

// Build stats per annotator
const stats: AnnotatorStats[] = [];

for (const [id, entries] of annotatorData) {
  const avgLeadTime = entries.reduce((a, b) => a + b.leadTime, 0) / entries.length;
  const avgAgreement = entries.reduce((a, b) => a + b.agreement, 0) / entries.length;

  stats.push({
    annotatorId: id,
    totalAnnotations: entries.length,
    avgLeadTime: round2(avgLeadTime),
    leadTimeDiffVsAverage: round2(avgLeadTime - globalAvgLeadTime),
    avgAgreement: round2(avgAgreement),
  });
}

// Sort by total annotations descending
stats.sort((a, b) => b.totalAnnotations - a.totalAnnotations);

// ── Output JSON ────────────────────────────────────────────────────────────

const jsonOut = {
  projectWideAvgLeadTime: round2(globalAvgLeadTime),
  annotators: stats,
};

mkdirSync(join(__dirname, "../output"), { recursive: true });

const jsonPath = join(__dirname, "../output/analytics.json");
writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2), "utf-8");
console.log(`✓ Wrote analytics JSON → ${jsonPath}`);

// ── Output CSV ─────────────────────────────────────────────────────────────

const headers = [
  "Annotator ID",
  "Total Annotations",
  "Avg Lead Time (seconds)",
  "Diff vs Project Average (seconds)",
  "Avg Agreement Score (%)",
];

const csvRows: string[] = [toRow(headers)];

for (const s of stats) {
  const diffLabel =
    s.leadTimeDiffVsAverage >= 0
      ? `+${s.leadTimeDiffVsAverage}`
      : String(s.leadTimeDiffVsAverage);

  csvRows.push(
    toRow([
      s.annotatorId,
      String(s.totalAnnotations),
      String(s.avgLeadTime),
      diffLabel,
      String(s.avgAgreement),
    ])
  );
}

// Append a summary row at the bottom
csvRows.push(toRow(["PROJECT AVERAGE", "", String(round2(globalAvgLeadTime)), "—", ""]));

const csvPath = join(__dirname, "../output/analytics.csv");
writeFileSync(csvPath, csvRows.join("\n"), "utf-8");
console.log(`✓ Wrote analytics CSV → ${csvPath}`);
