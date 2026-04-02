import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// ── The QA Prompt ──────────────────────────────────────────────────────────
//
// This prompt is designed to be called once per annotation. At call time,
// you interpolate the annotation's fields into the {{placeholders}} below
// and send the full string as the user message to your LLM.
//
// The system message (SYSTEM_PROMPT) provides all context the model needs —
// no additional instructions are required at call time.

const SYSTEM_PROMPT = `
You are an annotation quality assurance reviewer for a data labeling project.

PROJECT CONTEXT
Annotators were shown a product category with a list of selections and asked four questions:
  Q1 (multiple):          "Does the list have more than one option?"   → Yes / No
  Q2 (distinct):          "Are the selections distinct?"               → Yes / No
  Q3 (not_distinct):      "Which selections are not distinct?"         → free text (only if Q2 = No)
  Q4 (not_distinct_reason): "Why are they not distinct?"              → free text (only if Q2 = No)

YOUR TASK
Evaluate the annotation below for quality issues across three dimensions:

1. INTERNAL CONSISTENCY
   - If Q1 = No (only one option), Q2 should also effectively be irrelevant or unanswerable
     with a meaningful Yes/No. Flag if Q2 is answered and contradicts Q1.
   - If Q2 = No, Q3 and Q4 MUST both be present and non-empty. Flag if either is missing.
   - If Q2 = Yes, Q3 and Q4 should be absent. Flag if they are unexpectedly present.

2. FREE TEXT QUALITY (applies when Q2 = No)
   - Q3 should name specific selections from the provided list. Flag if it is vague (e.g., "some of them",
     "a few", "...") or if it names items not present in the selections.
   - Q4 should provide a clear, logical reason. Flag if it is a single word, a repetition of Q3,
     or otherwise fails to explain why the selections are not distinct.

3. LEAD TIME PLAUSIBILITY
   - Lead time is measured in seconds.
   - Flag if lead time < 5 seconds (too fast to have read and understood the task).
   - Flag if lead time > 300 seconds (5 minutes; may indicate distraction or task abandonment).
   - For context: a typical well-considered annotation takes between 15 and 120 seconds.

OUTPUT FORMAT
Return ONLY a valid JSON object. Do not include any explanation outside the JSON.

{
  "flag": "pass" | "flag",
  "confidence": <number between 0.0 and 1.0>,
  "issues": [<list of short issue strings, empty array if none>],
  "reason": "<one or two sentence summary of your assessment>"
}

Definitions:
- "flag": "pass" if no quality issues found, "flag" if one or more issues found
- "confidence": how confident you are in your assessment (1.0 = very confident, 0.5 = uncertain)
- "issues": specific problems found, e.g. ["Q2=No but Q3 is missing", "Lead time too low (3s)"]
- "reason": brief plain-English summary suitable for an operations reviewer
`.trim();

const USER_PROMPT_TEMPLATE = `
Please evaluate the following annotation.

TASK ID: {{task_id}}
SELECTIONS: {{selections}}

ANNOTATION
  Annotator ID:  {{annotator_id}}
  Lead Time:     {{lead_time}} seconds
  Q1 (More than one option?): {{q1}}
  Q2 (Are selections distinct?): {{q2}}
  Q3 (Which are not distinct?): {{q3}}
  Q4 (Why are they not distinct?): {{q4}}
`.trim();

// ── Written Explanation ────────────────────────────────────────────────────

const EXPLANATION = `
PROMPT DESIGN EXPLANATION
==========================

Quality signals chosen and why
--------------------------------
I focused on three signals: internal consistency, free-text quality, and lead time.
Internal consistency catches the most clear-cut errors — if Q2 = No but Q3/Q4 are absent,
the annotation is objectively incomplete, and no judgement call is needed. Free-text quality
catches subtler issues: vague answers like "..." or "some of them" pass schema validation but
provide no actionable information to downstream users. Lead time is a behavioral proxy — an
annotation completed in under 5 seconds cannot have involved genuine deliberation.

Tradeoffs considered
---------------------
The main tension is false positives vs. missed issues. Setting the lead-time floor at 5 seconds
is conservative — some very short tasks genuinely can be answered quickly. A higher floor (e.g.,
10 seconds) would catch more suspicious annotations but risk flagging legitimate fast responses.
I chose 5 seconds as a reasonable lower bound and kept the confidence score to signal uncertainty
rather than hard-coding a binary outcome. The LLM also gets latitude to express low confidence
rather than being forced into a pass/flag binary when evidence is ambiguous.

How I would iterate with more test data
-----------------------------------------
With a labeled set of known-good and known-bad annotations, I would track precision and recall
for the flag signal. If false positives dominate (good annotations being flagged), I would raise
the lead-time floor, tighten the free-text vagueness criteria, or add an explicit "borderline"
category. If missed issues dominate, I would add more signal dimensions — for example, checking
whether Q3 mentions terms that do not appear verbatim in the selections string, which is a strong
indicator of a careless or confused annotator.
`.trim();

// ── Write outputs ──────────────────────────────────────────────────────────

mkdirSync(join(__dirname, "../output"), { recursive: true });

const promptOut = `
=== SYSTEM PROMPT ===
${SYSTEM_PROMPT}

=== USER PROMPT TEMPLATE ===
${USER_PROMPT_TEMPLATE}

=== HOW TO USE ===
Replace each {{placeholder}} with the annotation's actual values before sending.
Send SYSTEM_PROMPT as the system message and the filled-in USER_PROMPT_TEMPLATE as the user message.
Expect a JSON response matching the schema described in the system prompt.
`.trim();

const promptPath = join(__dirname, "../output/qa-prompt.txt");
writeFileSync(promptPath, promptOut, "utf-8");
console.log(`✓ Wrote QA prompt → ${promptPath}`);

const explanationPath = join(__dirname, "../output/qa-prompt-explanation.txt");
writeFileSync(explanationPath, EXPLANATION, "utf-8");
console.log(`✓ Wrote prompt explanation → ${explanationPath}`);
