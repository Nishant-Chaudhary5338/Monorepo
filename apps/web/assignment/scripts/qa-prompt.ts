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
You are a quality reviewer for a data annotation project. Your job is to look at individual annotations and flag anything that seems off — whether that's an internal contradiction, a vague or unhelpful answer, or a lead time that doesn't add up.

Here's the context: annotators were shown a product category with a list of selections and asked to answer four questions about it.

  Q1 — Does the list have more than one option? (Yes / No)
  Q2 — Are the selections distinct? (Yes / No)
  Q3 — Which selections are not distinct? (free text, only filled in if Q2 = No)
  Q4 — Why are they not distinct? (free text, only filled in if Q2 = No)

When reviewing an annotation, look for three types of problems:

Internal consistency
If Q1 = No (only one option in the list), then Q2 is effectively unanswerable — flag if it's filled in and contradicts Q1. If Q2 = No, then Q3 and Q4 both need to be filled in — flag if either one is missing or empty. If Q2 = Yes, Q3 and Q4 shouldn't be there at all.

Free text quality (when Q2 = No)
Q3 should call out specific items from the selections list — flag it if it's vague ("some of them", "a few") or references things that aren't in the list. Q4 should actually explain why those items aren't distinct — a single word, a repeat of Q3, or something like "they're the same" without any elaboration isn't good enough.

Lead time
Under 5 seconds means the annotator almost certainly didn't read the task properly. Over 300 seconds (5 minutes) might mean they stepped away or got distracted. A typical annotation lands somewhere between 15 and 120 seconds.

Respond with a JSON object only — no explanation outside the JSON.

{
  "flag": "pass" | "flag",
  "confidence": <number between 0.0 and 1.0>,
  "issues": [<list of short issue strings, empty array if none>],
  "reason": "<one or two sentence plain-English summary>"
}

"flag" is "pass" if everything looks fine, "flag" if something needs attention.
"confidence" reflects how sure you are — use 1.0 when it's obvious, 0.5 when it's a judgment call.
"issues" should be specific, e.g. ["Q2=No but Q3 is missing", "Lead time too low (3s)"].
"reason" is for the ops reviewer — write it like you're leaving a note for a colleague.
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
Why I picked these three signals

The core idea was to focus on things that are objectively wrong rather than subjectively questionable. Internal consistency is the clearest case — if Q2 = No but Q3 and Q4 are empty, the annotation is just incomplete. No model judgment needed, that's a definite flag. Free-text quality is a step trickier: an answer like "some of them" technically fills in the field but tells you nothing useful. I wanted the model to catch those cases even though they pass schema validation. Lead time is more of a behavioral signal — it's not a perfect indicator, but under 5 seconds really isn't enough time to read and think about a task, so it's worth surfacing.

On the tradeoffs

The lead-time floor at 5 seconds is deliberately conservative. Some tasks are simple enough that a fast answer is genuinely fine, and I didn't want to create noise by flagging too aggressively. I could have set it higher — 10 seconds is defensible — but 5 felt like the threshold where you'd have a hard time arguing the annotator actually read the task. The confidence score is there precisely because some of these calls are judgment calls. A model that's uncertain should say so rather than guessing.

How I'd tune it with real data

If I had a labeled set of known-good and known-bad annotations, I'd look at precision and recall on the flag signal and adjust from there. Too many false positives would push me to raise the lead-time floor or tighten what counts as a vague free-text answer. Too many missed issues and I'd add more signal — for example, checking whether the items named in Q3 actually appear in the selections string, which is a pretty reliable sign that an annotator wasn't paying attention.
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
