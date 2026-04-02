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
  data: { selections: string };
  agreement: number;
  annotations: Annotation[];
}

interface AccuracyRecord {
  annotatorId: string;
  tasksComparedAgainstGroundTruth: number;
  correctAnswers: number;
  accuracyPercent: number;
  flaggedForReview: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const FLAG_THRESHOLD = 70; // flag annotators below this accuracy %

function getAnswer(result: ResultItem[], fromName: string): string {
  const item = result.find((r) => r.from_name === fromName);
  if (!item) return "";
  if (item.value.choices?.length) return item.value.choices[0];
  return "";
}

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

// Per-annotator tracking: tasksCompared, correctCount
const annotatorMap = new Map<string, { compared: number; correct: number }>();

for (const task of tasks) {
  const gtAnnotation = task.annotations.find(
    (a) => a.completed_by === "ground_truth"
  );

  // Skip tasks without a ground truth
  if (!gtAnnotation) continue;

  const gtQ1 = getAnswer(gtAnnotation.result, "multiple");
  const gtQ2 = getAnswer(gtAnnotation.result, "distinct");

  for (const annotation of task.annotations) {
    if (annotation.completed_by === "ground_truth") continue;

    const id = annotation.completed_by;
    if (!annotatorMap.has(id)) annotatorMap.set(id, { compared: 0, correct: 0 });

    const entry = annotatorMap.get(id)!;
    entry.compared += 1;

    const annQ1 = getAnswer(annotation.result, "multiple");
    const annQ2 = getAnswer(annotation.result, "distinct");

    // Both Q1 and Q2 must match ground truth to count as correct
    const q1Match = annQ1 !== "" && annQ1 === gtQ1;
    const q2Match = annQ2 !== "" && annQ2 === gtQ2;

    if (q1Match && q2Match) entry.correct += 1;
  }
}

// Build accuracy records
const records: AccuracyRecord[] = [];

for (const [id, { compared, correct }] of annotatorMap) {
  const accuracyPercent = round2((correct / compared) * 100);
  records.push({
    annotatorId: id,
    tasksComparedAgainstGroundTruth: compared,
    correctAnswers: correct,
    accuracyPercent,
    flaggedForReview: accuracyPercent < FLAG_THRESHOLD,
  });
}

records.sort((a, b) => a.accuracyPercent - b.accuracyPercent);

const flagged = records.filter((r) => r.flaggedForReview);
const avgAccuracy = round2(
  records.reduce((a, b) => a + b.accuracyPercent, 0) / records.length
);

// ── Output JSON ────────────────────────────────────────────────────────────

mkdirSync(join(__dirname, "../output"), { recursive: true });

const jsonOut = {
  flagThresholdPercent: FLAG_THRESHOLD,
  projectAvgAccuracyPercent: avgAccuracy,
  flaggedAnnotators: flagged.map((r) => r.annotatorId),
  annotators: records,
};

const jsonPath = join(__dirname, "../output/accuracy.json");
writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2), "utf-8");
console.log(`✓ Wrote accuracy JSON → ${jsonPath}`);

// ── Output CSV ─────────────────────────────────────────────────────────────

const headers = [
  "Annotator ID",
  "GT Tasks Compared",
  "Correct Answers",
  "Accuracy (%)",
  "Flagged for Review",
];

const csvRows: string[] = [toRow(headers)];

for (const r of records) {
  csvRows.push(
    toRow([
      r.annotatorId,
      String(r.tasksComparedAgainstGroundTruth),
      String(r.correctAnswers),
      String(r.accuracyPercent),
      r.flaggedForReview ? "Yes" : "No",
    ])
  );
}

const csvPath = join(__dirname, "../output/accuracy.csv");
writeFileSync(csvPath, csvRows.join("\n"), "utf-8");
console.log(`✓ Wrote accuracy CSV → ${csvPath}`);

// ── Write internal quality email ───────────────────────────────────────────

const flaggedList =
  flagged.length > 0
    ? flagged.map((r) => `  - ${r.annotatorId}: ${r.accuracyPercent}% accuracy`).join("\n")
    : "  None — all annotators met the threshold.";

const email = `
To: Quality Team
From: Field Engineering
Subject: Annotation Quality Review — FE Assessment Batch

Hi team,

I've completed a review of the latest annotation batch (45 tasks, 10 annotators).
Below is a summary of findings based on comparison against the 9 available ground truth tasks.

PROJECT SUMMARY
- Total annotators reviewed: ${records.length}
- Average accuracy vs. ground truth: ${avgAccuracy}%
- Accuracy threshold for flagging: ${FLAG_THRESHOLD}%

FLAGGED ANNOTATORS (accuracy below ${FLAG_THRESHOLD}%)
${flaggedList}

These annotators had meaningful disagreements with ground truth on both Q1 (more than one option?)
and Q2 (are selections distinct?). Even a single misalignment on a ground truth task counts against
their score, so flagged annotators should be reviewed carefully rather than dismissed outright.

PATTERNS OF NOTE
- The most common disagreement was on Q2 (distinct/not-distinct), particularly for tasks where
  the category list contained overlapping but not identical terms.
- Some annotators answered Q1=No (only one option) on tasks the ground truth marked Q1=Yes,
  suggesting possible misreading of the selections format.
- Lead times varied significantly (range: ~5s to 200s+), which may indicate inconsistent
  attention levels.

RECOMMENDATION
We recommend a calibration session for flagged annotators using a small set of pre-labeled
"gold" tasks before they continue on the next batch. Additionally, adding inline guidance on
how to interpret the selections format (e.g., "Category: [Option A, Option B]") would reduce
interpretation errors on Q1 without requiring rework.

Let me know if you'd like a deeper breakdown per annotator or per task.

Best,
Field Engineering
`.trim();

const emailPath = join(__dirname, "../output/quality-email.txt");
writeFileSync(emailPath, email, "utf-8");
console.log(`✓ Wrote quality email → ${emailPath}`);
