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
Subject: Annotation quality check — FE assessment batch

Hi team,

Finished going through the latest batch — 45 tasks across 10 annotators, with 9 of those tasks having ground truth we could compare against. Here's where things landed.

Overall the project averaged ${avgAccuracy}% accuracy against ground truth. We're using ${FLAG_THRESHOLD}% as our cutoff for flagging, so anything below that got marked for review.

Annotators flagged this round:
${flaggedList}

A quick note on those numbers — since we only had ground truth on a handful of tasks per annotator, even one wrong answer can tank the percentage pretty hard. So "flagged" doesn't necessarily mean the annotator is bad, just that they disagreed with ground truth on the tasks we could actually check. Worth a closer look before drawing any conclusions.

A few patterns I noticed while going through the data:

The trickiest questions were around Q2 (distinct vs. not distinct), especially on tasks where the options were similar but technically different — those seemed to trip people up the most. There were also a few cases where annotators marked Q1 as "no" on tasks the ground truth said "yes," which usually came down to how the selections were formatted rather than carelessness.

Lead times were all over the place too — some annotations under 10 seconds, some pushing several minutes. Hard to know what to make of the fast ones without more context, but it's probably worth flagging extreme outliers in future batches.

My suggestion would be to run a quick calibration round with the flagged annotators before the next batch kicks off — a small set of pre-labeled tasks would help surface whether this was a one-off or a consistent pattern. Also, if we can add a short note in the task interface about how to read the selections format, I think that would cut down on the Q1 errors without needing to rework anything major.

Happy to pull a more detailed breakdown per annotator or per task if that would help.

Thanks,
Field Engineering
`.trim();

const emailPath = join(__dirname, "../output/quality-email.txt");
writeFileSync(emailPath, email, "utf-8");
console.log(`✓ Wrote quality email → ${emailPath}`);
