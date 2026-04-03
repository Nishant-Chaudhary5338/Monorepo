import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── Types ──────────────────────────────────────────────────────────────────

interface ResultItem {
  type: string;
  from_name: "multiple" | "distinct" | "not_distinct" | "not_distinct_reason";
  value: { choices?: string[]; text?: string[] };
}

interface Annotation {
  completed_by: string;
  lead_time: number;
  was_cancelled: boolean;
  result: ResultItem[];
}

interface Task {
  id: string;
  data: { selections: string };
  agreement: number;
  annotations: Annotation[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getAnswer(result: ResultItem[], fromName: string): string {
  const item = result.find((r) => r.from_name === fromName);
  if (!item) return "";
  if (item.value.choices?.length) return item.value.choices.join("; ");
  if (item.value.text?.length) return item.value.text.join("; ");
  return "";
}

function escapeCell(val: string): string {
  // Wrap in quotes if value contains comma, quote, or newline
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

const headers = [
  "Task ID",
  "Selections",
  "Annotator ID",
  "Lead Time (seconds)",
  "Q1: More than one option?",
  "Q2: Are selections distinct?",
  "Q3: Which selections are not distinct?",
  "Q4: Why are they not distinct?",
];

const rows: string[] = [toRow(headers)];

for (const task of tasks) {
  for (const annotation of task.annotations) {
    // Requirement: exclude ground_truth annotations
    if (annotation.completed_by === "ground_truth") continue;

    const q1 = getAnswer(annotation.result, "multiple");
    const q2 = getAnswer(annotation.result, "distinct");
    // Q3 and Q4 only present when Q2 = No — will be empty string otherwise
    const q3 = getAnswer(annotation.result, "not_distinct");
    const q4 = getAnswer(annotation.result, "not_distinct_reason");

    rows.push(
      toRow([
        task.id,
        task.data.selections,
        annotation.completed_by,
        String(annotation.lead_time),
        q1,
        q2,
        q3,
        q4,
      ])
    );
  }
}

mkdirSync(join(__dirname, "../output"), { recursive: true });
const outPath = join(__dirname, "../output/annotations-1.csv");
writeFileSync(outPath, rows.join("\n"), "utf-8");

console.log(`✓ Wrote ${rows.length - 1} annotations → ${outPath}`);
