---
title: "The AX Platform: Modular, Scalable Web Development That Runs Entirely on Your Machine"
description: "Developers write code just 16% of the week. I built an on-device AX platform — one core exposed over MCP, CLI, and HTTP — that automates 60–70% of routine frontend work."
slug: "on-device-ax-platform-modular-web-development"
coverImage: "https://images.unsplash.com/photo-1759661990336-51bd4b951fea?fm=webp&q=80&w=1200&h=630&fit=crop"
coverImageAlt: "A multi-monitor developer workstation glowing with code under neon light, evoking a local, on-device engineering platform"
ogImage: "https://images.unsplash.com/photo-1759661990336-51bd4b951fea?fm=webp&q=80&w=1200&h=630&fit=crop"
date: "2026-07-04"
lastUpdated: "2026-07-04"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a frontend platform engineer specialising in React monorepos, micro-frontend architecture, and AI-native developer tooling. He builds on-device developer platforms that automate 60–70% of routine frontend work, and has trained 30+ engineers across 5 teams on agentic development."
tags: ["developer-experience", "platform-engineering", "mcp", "ai-tooling", "monorepo"]
---

A backend engineer on a neighbouring team needed to ship a small plugin into our micro-frontend platform. The old path went like this: clone the monorepo, read a 40-minute onboarding doc, hand-scaffold the plugin folder, wire it into the runtime registry, guess at the federation config, and fight the build until the shell loaded it. Most people gave up and filed a ticket for a frontend engineer to do it instead.

Here's what he actually did. He opened a panel inside VS Code, filled in three fields — plugin name, a route, a data source — and clicked *Scaffold*. Under a minute later the plugin existed, was registered, had built, and was hot-loaded into the running shell. He never opened a terminal. He never read the doc.

That panel is the visible tip of something I've been building for two years: an internal platform I call the **AX platform**. AX for *agent experience* — because its users are engineers and, increasingly, the AI agents working on their behalf. It composes a code indexer, a React automation toolkit, and a fleet of custom MCP servers into one system, exposed three ways — MCP, CLI, and HTTP — and it runs **entirely on the developer's machine**. Nothing leaves the box.

This is what it is, why "on your machine" turned out to be the most important design decision, and what happens when you treat internal tooling as an actual product.

---

> **Key Takeaways**
> - Developers write code only **16% of the work week**; the other 84% goes to friction ([Atlassian & DX State of Developer Experience 2025](https://www.atlassian.com/blog/developer/developer-experience-report-2025)). The AX platform attacks that 84%.
> - One core of tools, exposed over **three surfaces** — MCP for agents, CLI for scripts, HTTP for the in-editor console — so the same logic serves humans and AI without duplication.
> - Everything runs **locally**: your code never leaves your machine, which matters when only **3.1% of developers highly trust** AI output ([Stack Overflow 2025](https://survey.stackoverflow.co/2025/ai)).
> - Measured impact: **60–70% of routine frontend workflows automated**, plugin onboarding cut to **under a minute**, **30+ engineers across 5 teams** trained on it.
> - Treated as a product — developers are the users, adoption is the metric, onboarding time is the KPI. That framing is what made it stick.

---

## 1. The problem was never writing the code

The expensive part of frontend work isn't typing React. In 2025, Atlassian and DX surveyed thousands of developers and found they spend just **16% of the work week actually writing code** — while **50% lose 10 or more hours a week**, and **90% lose 6 or more hours a week**, to organizational friction and non-coding tasks ([Atlassian & DX, State of Developer Experience 2025](https://www.atlassian.com/blog/developer/developer-experience-report-2025)). The bottleneck is everything *around* the code.

What does that friction look like on a frontend team? Scaffolding the same plugin shape for the thirtieth time. Wiring a new page into routing, state, and the design system by hand. Finding out which twelve packages break when you touch a shared type. Waiting on a frontend engineer because you don't know the monorepo's conventions. None of it is hard. All of it is slow, and it compounds.

AI was supposed to fix this, and for individuals it partly does. But there's a paradox the same Atlassian study surfaced: developers save roughly **10 hours a week with AI and lose about the same 10 hours** back to organizational friction, so net productivity stays nearly flat ([IT Pro on Atlassian's 2025 data](https://www.itpro.com/software/development/atlassian-says-ai-has-created-an-unexpected-paradox-for-software-developers)). Handing an engineer a smarter autocomplete doesn't help if they still can't ship a plugin without a terminal and a tribal-knowledge doc.

> **Citation Capsule:** Developers write code only 16% of the work week, and 90% lose six or more hours weekly to non-coding friction ([Atlassian & DX, State of Developer Experience 2025](https://www.atlassian.com/blog/developer/developer-experience-report-2025)). AI tools save roughly 10 hours a week but organizational friction takes an equal 10 back, leaving net productivity flat. The leverage isn't a better code generator — it's removing the friction around the code.

So I stopped thinking about "an AI coding assistant" and started thinking about the whole surface an engineer touches to ship a change. That surface is the product.

<!-- [INTERNAL-LINK: micro-frontend plugin platform → plugin-onboarding-vite-module-federation] -->

---

## 2. AX: designing for two users at once

The platform has two kinds of user, and they want the same things for different reasons.

The **engineer** wants to ship without holding the monorepo's entire structure in their head. The **agent** — Cline, Claude, whatever's driving — wants a live, programmatic connection to the team's actual conventions, because a model with a stale prompt writes code that's technically correct and culturally wrong. Both users are defeated by the same enemy: cognitive load. The difference is the engineer feels it as friction and the agent feels it as hallucination.

This matters because trust in AI output is genuinely low. In the 2025 Stack Overflow survey, developers who **actively distrust AI accuracy (45.7%) outnumbered those who trust it (32.7%)**, and only **3.1% said they highly trust it** ([Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)). The top frustration, cited by **66%**, was "AI solutions that are almost right, but not quite." An agent that guesses at your import paths produces exactly that almost-right output. An agent that can *call a tool* which reads your real design system does not.

![Lines of source code displayed across dual monitors in a modern development setup](https://images.unsplash.com/photo-1754039984985-ef607d80113a?fm=webp&q=80&w=1200&h=630&fit=crop)

So the design rule for every capability is: **make it callable, make it deterministic, and make it read from the source of truth.** If a tool satisfies those three, it serves the engineer through a button and the agent through MCP with zero divergence. The reasoning stays in the human or the model; the tool just does the thing, the same way every time.

<!-- [INTERNAL-LINK: teaching the AI your team's conventions → one-protocol-two-surfaces] -->

---

## 3. One core, three surfaces

Every capability in the platform is built once and exposed three ways. This is the architectural spine, and it's the reason the thing scales without turning into three parallel codebases.

- **MCP** — for the agent. Tools speak JSON-RPC over stdio, the protocol Cline, Claude, and Cursor use. The agent decides *when* to scaffold a plugin; the tool decides *how*.
- **CLI** — for scripts and CI. The same tool, invoked from the terminal or a pipeline, deterministically. No model in the loop.
- **HTTP** — for the in-editor console. An Express server exposes the same tools as REST endpoints so a VS Code panel — or any GUI — can call them.

<figure>
<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing three surfaces — MCP for agents, CLI for scripts, HTTP for the editor console — all calling one shared tool core on the developer's machine">
  <defs>
    <marker id="ax-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#3b82f6"/>
    </marker>
  </defs>
  <rect width="560" height="300" rx="12" style="fill:var(--bg-secondary);stroke:var(--border-color)" stroke-width="1"/>
  <text x="280" y="30" text-anchor="middle" font-family="monospace" font-size="14" font-weight="600" style="fill:var(--text-primary)">One Core · Three Surfaces · On Your Machine</text>
  <!-- three surface boxes -->
  <rect x="30" y="60" width="150" height="62" rx="6" fill="#3b82f6"/>
  <text x="105" y="86" text-anchor="middle" font-family="monospace" font-size="13" font-weight="600" fill="#ffffff">MCP</text>
  <text x="105" y="105" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#ffffff" opacity="0.85">agents · Cline / Claude</text>
  <rect x="205" y="60" width="150" height="62" rx="6" fill="#3b82f6"/>
  <text x="280" y="86" text-anchor="middle" font-family="monospace" font-size="13" font-weight="600" fill="#ffffff">CLI</text>
  <text x="280" y="105" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#ffffff" opacity="0.85">scripts · CI · pipelines</text>
  <rect x="380" y="60" width="150" height="62" rx="6" fill="#3b82f6"/>
  <text x="455" y="86" text-anchor="middle" font-family="monospace" font-size="13" font-weight="600" fill="#ffffff">HTTP</text>
  <text x="455" y="105" text-anchor="middle" font-family="monospace" font-size="9.5" fill="#ffffff" opacity="0.85">VS Code console</text>
  <!-- core box -->
  <rect x="150" y="175" width="260" height="60" rx="6" style="fill:var(--bg-secondary);stroke:#3b82f6" stroke-width="2"/>
  <text x="280" y="200" text-anchor="middle" font-family="monospace" font-size="13" font-weight="600" style="fill:var(--text-primary)">Tool Core</text>
  <text x="280" y="220" text-anchor="middle" font-family="monospace" font-size="9.5" style="fill:var(--text-muted)">indexer · toolkit · MCP servers</text>
  <!-- arrows -->
  <line x1="105" y1="122" x2="230" y2="175" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#ax-arrow)"/>
  <line x1="280" y1="122" x2="280" y2="175" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#ax-arrow)"/>
  <line x1="455" y1="122" x2="330" y2="175" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#ax-arrow)"/>
  <!-- machine boundary -->
  <rect x="30" y="255" width="500" height="30" rx="6" style="fill:none;stroke:var(--border-color)" stroke-width="1" stroke-dasharray="4 3"/>
  <text x="280" y="274" text-anchor="middle" font-family="monospace" font-size="10" style="fill:var(--text-muted)">— localhost boundary · nothing leaves the machine —</text>
</svg>
<figcaption>The whole platform is one tool core with three front doors. Build a capability once; call it from an agent, a script, or a button.</figcaption>
</figure>

The insight underneath this is boring and load-bearing: **MCP isn't AI-specific — it's just JSON-RPC.** Once a capability is a well-shaped, deterministic function, the transport is a detail. I go deep on that pattern in a [separate post on the MCP toolkit](https://www.npmjs.com/package/mcp-react-toolkit); the short version is that the public [`mcp-react-toolkit`](https://www.npmjs.com/package/mcp-react-toolkit) package — 60+ tools with 27 CLI wrappers — is the open-source distillation of this core. The AX platform is what happens when you wire that core into an editor and a running application.

<!-- [INTERNAL-LINK: the dual-surface CLI pattern → one-protocol-two-surfaces] -->

---

## 4. The Express server that puts it inside the editor

The HTTP surface is what turns a toolkit into a platform. A small Express server runs on localhost and exposes each tool as an endpoint the VS Code console calls.

```typescript
// devtools-server: the HTTP surface over the same tool core
app.post('/api/scaffold-plugin', async (req, res) => {
  const { id, label, route, dataSource } = pluginSchema.parse(req.body);
  const result = await core.scaffoldPlugin({ id, label, route, dataSource });
  res.json(result); // files created, registry updated, build status
});

app.post('/api/generate-crud', async (req, res) => {
  const { plugin, entity, fields } = crudSchema.parse(req.body);
  res.json(await core.generateCrud({ plugin, entity, fields }));
});
```

The console is a thin React panel. It renders a form, POSTs to the endpoint, and shows the result. Scaffold a plugin, generate a CRUD page from a data shape, add a route, run a build, manage the plugin registry — all without a terminal. That's what let the backend engineer from the intro ship in under a minute.

[PERSONAL EXPERIENCE] The endpoints are deliberately thin proxies. The Express handler validates input with Zod, calls the core, and returns a JSON summary — files touched, next suggested step — never the generated file contents. Early on I returned full file bodies in the response, and the console tried to render thousand-line blobs while the agent surface re-emitted them and doubled its context cost. Return plans and patches; let the filesystem hold the artifact. That one rule fixed both surfaces at once.

Onboarding time is the metric I watch here, because platform research is blunt about it: onboarding time and developer satisfaction are the earliest, truest signals of whether an internal platform is actually usable. Ours went from "read the doc, ask a frontend engineer, ~a day" to **under a minute** for a new plugin, on the back of the same Vite Module Federation runtime injection that lets the shell hot-load a plugin without a redeploy.

![Syntax-highlighted code on a black terminal screen, suggesting a CLI-first developer toolchain](https://images.unsplash.com/photo-1743090660977-babf07732432?fm=webp&q=80&w=1200&h=630&fit=crop)

<!-- [INTERNAL-LINK: how the GUI drove adoption → ai-dev-platform-mfe-adoption] -->

---

## 5. Making the monorepo legible: the code indexer

You can't automate work on a codebase the agent can't see. A large monorepo is opaque — to a new engineer *and* to a model. So the platform's foundation is a code indexer that turns the repo into a queryable graph: apps → packages → files → components, with dependency edges, type-health status, and blast-radius analysis. It's published as [`code-graph-indexer`](https://www.npmjs.com/package/code-graph-indexer).

The reason this is load-bearing: the single most-asked, least-answerable question in a big frontend codebase is *"what breaks if I change this?"* The indexer answers it deterministically by walking the real dependency graph with a `ts-morph` engine, so both a human refactoring a shared type and an agent planning an edit can ask before they touch anything.

```bash
# same query, from the CLI or as an MCP tool
$ code-graph blast-radius packages/ui/src/tokens.ts
  → 3 packages, 41 files, 12 components directly affected
  → run scans on: @repo/ui, @repo/dashcraft, plugin-analytics
```

> **Citation Capsule:** By 2026, Gartner projects **80% of large software engineering organizations will have platform engineering teams**, up from 45% in 2022 ([Gartner, Platform Engineering](https://www.gartner.com/en/articles/what-is-platform-engineering)). The discipline's core principle is treating the internal platform as a product and developers as its customers — which means the platform must make the codebase legible to its users before it can automate work on it.

[UNIQUE INSIGHT] The indexer isn't a feature bolted onto the platform — it's the substrate every other tool reads from. A code generator that doesn't know the dependency graph produces plausible files in the wrong place. Give the tools a map first, and the automation stops being a guess.

<!-- [INTERNAL-LINK: cache invalidation across a monorepo → turborepo-cache-invalidation-patterns] -->

---

## 6. Why it all runs on your machine

The most important decision in the whole platform is the least flashy one: it runs locally, and your code never leaves the box.

This isn't ideology — it's a response to how developers actually feel about cloud AI tools. When distrust of AI accuracy (45.7%) outweighs trust (32.7%) and only 3.1% highly trust the output ([Stack Overflow 2025](https://survey.stackoverflow.co/2025/ai)), "send our proprietary codebase to a third-party endpoint" is a hard sell in a large enterprise. And the caution isn't paranoia: a controlled 2025 METR study found AI tools made experienced developers **19% slower** on real tasks — while those same developers *believed* they'd been **20% faster** ([METR, 2025](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)). The perception gap is exactly why you want verification, determinism, and inspectability close to home.

Local-first buys three things:

- **Privacy by architecture.** MCP servers are local processes reading your local filesystem. The data path is agent ↔ tool ↔ source of truth, all on localhost. There's no "did our tokens get logged by a vendor" conversation because there's no vendor in the path.
- **Token efficiency.** Because the tools return summaries and patches instead of whole files, and because deterministic work (scaffolding, refactors, scans) never touches a model at all, you spend model tokens only on genuine reasoning. The CLI surface runs a 60-component review-and-fix pass with zero model calls.
- **No lock-in.** If the AI tooling layer churns — and it will — the CLI and HTTP surfaces keep working. You built for a protocol and a core, not for one vendor's client.

That last point compounds. MCP itself went from roughly **100K server downloads in November 2024 to over 8 million by April 2025**, and was donated to the Linux Foundation's Agentic AI foundation in December 2025 ([Thoughtworks, 2025](https://www.thoughtworks.com/en-us/insights/blog/generative-ai/model-context-protocol-mcp-impact-2025)). Betting on the open protocol rather than a single host has aged well in the span of a single year.

---

## 7. Running it like a product

Here's the framing that actually made the platform succeed, and it's not a technical one: **I ran it like a product, and the developers were the customers.**

That means adoption is the metric, not tool count. It means onboarding time is a KPI, not an afterthought. It means when a tool gets ignored, that's a product signal — the tool was too broad, or its output wasn't actionable, and it needs a redesign, not a defence. The whole platform-engineering discipline exists to make this credible: treat the internal platform as a product, do user research with your engineers, measure adoption, iterate.

The results I can point to:

- **60–70% of routine frontend workflows automated** — scaffolding, CRUD generation, code review, test generation.
- **Under a minute** to onboard a new plugin, down from most of a day.
- **30+ engineers across 5 teams** at Samsung R&D trained on the platform and agentic workflows — including engineers who don't consider themselves frontend developers.
- **6 product teams** running production dashboards on the headless UI library the platform generates against.

[ORIGINAL DATA] The number I care about most isn't automation percentage — it's that the skeptics adopted it. The engineers who actively distrust AI got the same speed-up as the believers, because the CLI and HTTP surfaces don't require you to trust a model at all. A deterministic button that scaffolds a plugin correctly is trustworthy in a way a chat prompt never will be. That's the force-multiplier math: impact per engineer, multiplied by every engineer you can bring along — not just the ones who already liked AI.

> **Citation Capsule:** The AX platform automates 60–70% of routine frontend workflows and cut plugin onboarding to under a minute, adopted by 30+ engineers across 5 teams. The design that made skeptics adopt it: deterministic CLI and HTTP surfaces that require no trust in a model, so an engineer who distrusts AI gets the same speed-up as one who embraces it. Adoption, not automation percentage, is the real signal.

<!-- [INTERNAL-LINK: the headless dashboard library it generates → headless-dashboard-library] -->

---

## 8. What it costs, and what I'd do differently

Nothing about this is free, and pretending otherwise would be the kind of almost-right story I don't trust.

**What it costs.** Three surfaces mean three integration tests per capability. A local-first platform means every engineer's machine is the deployment target, so setup scripts and path parameterization matter more than they would for a hosted service. And an indexer-backed system is only as good as the indexer's freshness — a stale graph produces confidently wrong blast-radius answers.

**What I'd do differently.** I'd build the HTTP console *first*, not last. The GUI is what converted non-frontend engineers, and I under-weighted it for a year while polishing the agent surface. I'd also invest earlier in the indexer's incremental updates — re-indexing the whole monorepo on every change was fine at ten packages and painful at forty. And I'd measure onboarding time from day one instead of reconstructing it later; it's the KPI that most cleanly proves the platform is working, and I didn't start logging it until engineers were already fast.

The through-line, if there is one: internal tooling becomes a *platform* the moment you stop treating it as your personal automation and start treating it as a product with users who don't work the way you do. Build for the engineer who distrusts AI, the one who never opens a terminal, and the agent that needs a map — and you've built something that multiplies a whole org, not just yourself.

---

## Frequently Asked Questions

### What does "AX" mean?

AX stands for *agent experience* — the platform is designed for two users at once: the engineer and the AI agent acting on their behalf. It extends developer experience (DX) thinking to the era where 84% of developers use or plan to use AI in their workflow ([Stack Overflow 2025](https://survey.stackoverflow.co/2025/ai)).

### Why expose the same tools over MCP, CLI, and HTTP?

Because each surface serves a different user with zero duplicated logic. MCP serves agents, the CLI serves scripts and CI, and HTTP serves the in-editor console. One deterministic tool core behind all three means a fix ships to every surface at once — and if any single surface's ecosystem churns, the others keep working.

### How does running on-device improve trust?

Only 3.1% of developers highly trust AI output ([Stack Overflow 2025](https://survey.stackoverflow.co/2025/ai)), and enterprises are wary of sending proprietary code to third-party endpoints. Local-first architecture keeps the data path on localhost — agent to tool to source of truth — so there's no vendor in the loop and deterministic work never calls a model at all.

### Does automating 60–70% of work replace frontend engineers?

No — it removes the 84% of the week developers lose to friction and non-coding tasks ([Atlassian 2025](https://www.atlassian.com/blog/developer/developer-experience-report-2025)), freeing them for the judgment-heavy 16%. The platform decides *how* to scaffold or refactor; the engineer still decides *what* to build and *why*.

---

If you've built an internal developer platform and disagree with any of this — the three-surface split, the local-first bet, or running it like a product — I'd genuinely like to hear it. The patterns here aren't settled, and the corners that aren't well-documented are the ones I most want to learn from.

Write to me at <a href="mailto:nishantchaudhary5338@gmail.com">nishantchaudhary5338@gmail.com</a>.

— Nishant
