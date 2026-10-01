---
title: "How I write tasks that frontier coding agents fail"
description: "An expert should be able to solve it and a strong model should fail it, for a real reason. What I have learned about fairness, difficulty and the shortcuts agents take, from writing evaluation tasks for frontier models."
slug: "how-i-write-tasks-frontier-coding-agents-fail"
coverImage: "/covers/how-i-write-tasks-frontier-coding-agents-fail-1600.webp"
coverImageAlt: "Branded cover for an article about writing evaluation tasks for frontier coding agents"
ogImage: "/og/how-i-write-tasks-frontier-coding-agents-fail.png"
date: "2026-10-01"
lastUpdated: "2026-10-01"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a Senior Frontend Engineer at Samsung who also designs benchmark tasks, rubrics and verifiers for evaluating frontier AI models."
tags: ["llm-evaluation", "benchmarks", "coding-agents", "ai-training"]
---

Most of my evenings this year have gone into one strange kind of engineering. I write tasks for frontier coding agents: realistic problems, in a container, with a test that decides pass or fail. The brief is always the same. A skilled engineer should be able to solve it in a few hours. A strong agent, with tools and the internet, should fail it. And the failure has to be fair.

That last word is the whole job. Making a model fail is easy. Hide a rule, ship a broken file, or ask for something no one could guess, and every agent fails. None of that tells anyone anything. A useful task fails the model for a reason a human expert would recognise as a real gap.

Here is what I have learned doing it, mostly by getting it wrong first.

---

## Fair and hard pull in opposite directions

Every task I write starts as a tension between two reviewers that live in my head.

The fairness reviewer asks: could a careful expert solve this from what is written, without guessing? If the answer depends on a convention the task never states, the task is broken, however hard it looks.

The difficulty reviewer asks: will a strong agent actually get this wrong? If the task states every rule clearly, the answer is usually no.

Early on I kept bouncing between the two. I would hide something to make the task hard, a reviewer would call it unfair, I would state it plainly, and the next run would show the model solving it. The lesson took a while to sink in: **a rule that is written down is a rule that gets implemented.** Strong agents are very good at reading a spec and doing what it says.

So the difficulty cannot live in the rules. It has to live somewhere else.

## Agents turn your spec into a checklist

When I started reading agent trajectories closely, one pattern showed up again and again. Before writing any code, the agent restates the task as a numbered list of requirements. Then it works through the list, and checks each item off.

That is great engineering behaviour, and it changes how you design a task. Anything that can be expressed as a checklist item will be done. A numbered "accepted only if" list in the instructions is, in practice, a test plan the agent will follow line by line.

What a checklist cannot capture is a property of the data that no rule announces, or an assumption the agent brings in without noticing. A small example of the shape (not a real task): records carry a sequence number that is described, truthfully, as going up by one each time. An agent sorts by it. Every sample in the task sorts correctly. The real data is long enough that the counter wraps around, so a plain numeric sort puts things in the wrong order. Nothing was hidden. The description was accurate. The gap was an assumption, and that is exactly where real bugs come from too.

## The tools agents trust can be quietly wrong

Some of the most useful failures I have seen come from standard tools that run cleanly and return an incomplete answer.

A decompressor that stops after the first member of a multi-part stream. A columnar file reader that takes its schema from the first file and quietly drops a column that only appears later. A parser that accepts duplicate keys and keeps the last one. None of these throw an error. The agent sees a successful run and moves on.

On their own, these are unfair. If nothing in the task says the data is incomplete, an agent has no reason to look. The fix is to make completeness part of the stated contract, for example by giving a control total the output has to match. Now the requirement is written down, a careful engineer will notice the mismatch, and the hard part is the investigation, not a guess.

I like this pattern because it mirrors real work. Production bugs often look exactly like this: every tool says success, and the numbers do not add up.

## Do not point at the hard part

Whatever a task mentions gets attention. If the instructions describe a field that never matters, or a resource type that is never used, the agent will spend time on it, and so will reviewers.

The reverse is also true. If the one thing that matters is circled in the spec, it stops being hard. I now audit every task for anything mentioned but not used, and delete it. Then I look at what is left and ask whether I have accidentally highlighted the answer.

## Your own test runs lie, in both directions

Before submitting a task I run my own sealed attempts: a fresh agent, only the task and the data, no hints. It took me a while to trust these numbers less.

Sometimes my local attempt solves a task that real evaluation runs then fail every time. My local agent had more time, a friendlier environment, or a habit of checking its work beyond what the task's own tests ask for. Other times a "clearly hard" task falls on the first real run because I had leaked the answer somewhere I did not see.

What I do now:

- Treat a local solve as a signal to look closer, not as a verdict.
- Measure difficulty on the real harness, with several attempts (pass@k), not one.
- Read the trajectories, not just the score. A summary that says "the model handled X" is worth checking against the code it actually wrote.

## Make sure a fail is a real fail

Not every failure counts. If an agent runs out of time before it ever reaches the interesting part, that tells you about the time limit, not about the model. The same goes for failures caused by a broken environment, an ambiguous sentence, or a test that rejects a correct answer.

So I size tasks to be finishable within the budget, and I check where each failed run went wrong. The failures I want look like this: the agent finished, was confident, and was wrong for a reason I can point to.

| A useful fail | A fail that means nothing |
|---|---|
| Agent finished and submitted a wrong answer | Agent ran out of time before the hard part |
| The rule it missed is stated or derivable | The rule was never written anywhere |
| Several attempts fail in a similar way | One flaky attempt failed for unrelated reasons |
| A reviewer agrees an expert would catch it | Reviewers disagree on what the right answer is |

## What it changed in how I build software

This work has changed how I build AI features at my day job.

I trust models more with clear, written contracts and less with anything implied. If a behaviour matters, I write it down where the model will see it, because written rules get followed. I am more suspicious of tools that report success, and I add simple checks, like totals and counts, that would catch a quiet partial result. And I read what an agent actually did before trusting its summary of what it did.

None of this is exotic. It is the same discipline as writing a good spec and a good test. Evaluation work just makes the gaps very visible, very quickly.

If you write evaluation tasks too, I would love to compare notes. The companion post covers the other half of the job: [how I build the rubrics and verifiers that grade these tasks](/writing/grading-the-grader-rubrics-and-verifiers).
