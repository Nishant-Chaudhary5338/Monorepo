---
title: "Grading the grader: rubrics and verifiers I can trust"
description: "A score is only as honest as the thing that produces it. How I write rubrics two graders agree on, build verifiers that are hard to game, and test the grader before trusting its numbers."
slug: "grading-the-grader-rubrics-and-verifiers"
coverImage: "/covers/grading-the-grader-rubrics-and-verifiers-1600.webp"
coverImageAlt: "Branded cover for an article about designing rubrics and verifiers for LLM evaluation"
ogImage: "/og/grading-the-grader-rubrics-and-verifiers.png"
date: "2026-10-01"
lastUpdated: "2026-10-01"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a Senior Frontend Engineer at Samsung who also designs benchmark tasks, rubrics and verifiers for evaluating frontier AI models."
tags: ["llm-evaluation", "rubrics", "verifiers", "reward-hacking"]
---

Every evaluation task has two parts: the problem, and the thing that decides whether the answer is right. People spend most of their attention on the first part. In my experience the second part is where most of the bugs live.

A grader that accepts a wrong answer makes a model look better than it is. A grader that rejects a right answer makes a hard task look harder than it is. Either way the number is wrong, and nobody downstream can tell.

This post is about how I build graders, both automated verifiers and written rubrics, so that a score means what it claims to mean. [The companion post](/writing/how-i-write-tasks-frontier-coding-agents-fail) covers the task side.

---

## A pass should mean the work is right

I think about every grader in terms of two mistakes:

- **False accept**: a wrong or lazy answer passes.
- **False reject**: a correct answer, written differently than I expected, fails.

The first one is the dangerous one, because it hides. So before I trust a verifier, I try to break it. I write the weakest submission that should still fail, such as one that handles the sample input and nothing else, or one that hard-codes the expected output, and I check that it scores zero. Then I change one thing at a time in my own correct solution and watch the score. If I can delete a whole feature and still pass, the verifier is not testing that feature.

For false rejects, the best test set I have found is real submissions. Earlier attempts by models, collected from previous runs, often solve the problem in ways I did not think of. Replaying them through a new version of the verifier shows quickly whether I have made it too strict.

## Verifiers run next to the code they judge

This is the part that surprised me most. In many setups the verifier runs in the same environment as the agent's code, and the agent can write files there. That opens doors you would never think about in normal testing.

A few examples of the kind of thing I now check for, all of them general and well known once you look:

- **Test-runner configuration.** Many test runners pick up configuration files from the working directory. If an agent can drop one in, it can change how tests run, or whether failures count. The fix is to point the runner at a configuration the verifier writes itself, and to ignore anything else.
- **Answer files on disk.** If the expected output sits somewhere readable while the agent's code runs, a submission can just read it. Expected results should be sealed away before agent code runs, or kept somewhere it cannot reach.
- **Shared imports.** If the verifier imports a module by name, and the agent can place a file with that name earlier on the path, the verifier runs the agent's version. Run the agent's code unprivileged and keep the verifier's own code out of reach.

None of these need a clever adversary. A model that is trying hard to make the tests pass will sometimes find them by accident. A good verifier assumes it will.

## Know what your check is blind to

Every check looks at some projection of the output and ignores the rest. Most of my verifier bugs came from not asking what that projection was.

A check that compares the files inside an archive will miss that the archive itself was rebuilt. A tolerance of a cent on a float total can accept a real rounding error or reject an exact answer, depending on the numbers; integer arithmetic in the smallest unit avoids the question. A check that a percentile stays under a limit says nothing about how wrong any single row can be. A check on the average says nothing about the worst case.

So for each check I write one line: what does this prove, and what would slip past it? If the answer to the second half matters, I add a second check aimed exactly at that gap.

## Writing rubrics two graders agree on

Not everything can be checked by code. For document work, writing, or design tasks, the grader is a rubric that a person or a model applies. The same discipline applies, with a few extra rules I now follow every time.

- **One thing per line.** "The table is correct and well formatted" is two items. If they are on one line, graders will disagree about partial credit.
- **Observable evidence.** Each item should name something a grader can point to: a value in a cell, a sentence in a section, a file that exists. "The summary is clear" invites opinion. "The summary states the final total" does not.
- **Quote, do not paraphrase.** When an item depends on a specific value or phrase, write it exactly, so the grader is matching, not interpreting.
- **Keep penalties small and bounded.** If one slip can wipe out the whole score, a mostly correct answer and a useless one look the same. I cap the total that deductions can take away.
- **No free points.** Items that every answer gets right, like "the response is in English", make every score look better and hide real differences. I delete them.

The test I use: give the rubric and one answer to two graders separately. If they land on different scores, the rubric is ambiguous somewhere, and I fix the wording before anything else.

## Same input, same score

A grader that is random is not a grader. If a verifier shuffles test cases, picks samples, or generates inputs, it should do that from a fixed seed, or from something derived from the task itself, so two runs on the same submission agree.

There is a catch. The seed should not be something the submission can read, or a clever answer can reproduce the exact cases it will be tested on. Deterministic for the reviewer, unguessable for the agent.

## Keep the explanation in sync with the code

Most evaluation tasks ship with written notes for reviewers: what the task tests, why the answer is what it is, how the grader works. Whenever I change the solution or the verifier, I reread all of those notes. More than once a reviewer has failed a task, correctly, because an explanation still described an older version of the grader. The code was right and the paperwork was wrong, and from the outside that looks exactly like a broken task.

## What carries over to product work

Writing graders changed how I write tests at my day job. A test suite is a grader for your own code, and it has the same two failure modes. I now ask of every important test what wrong implementation would still pass it, and I write the cheap mutation by hand to find out. I keep test fixtures and expected values out of reach of the code under test. And I treat a green run as a claim to verify, not as proof.

Good evaluation is not about clever tasks. It is about a number you can trust. Most of that trust is earned in the grader.
