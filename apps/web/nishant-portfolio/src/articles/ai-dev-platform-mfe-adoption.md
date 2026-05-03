---
title: "The AI Dev Platform That Made Our MFE Architecture Accessible to Every Engineer"
description: "The architecture was built. The adoption problem remained. I built a GUI over MCP tools and Express APIs so any engineer — frontend or not — could create, build, test, and deploy plugins without a terminal."
slug: "ai-dev-platform-mfe-adoption"
coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=jpg&q=80&w=1200&h=630&fit=crop"
coverImageAlt: "Abstract AI neural network with glowing connections representing an intelligent developer platform"
ogImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=jpg&q=80&w=1200&h=630&fit=crop"
date: "2026-05-03"
lastUpdated: "2026-05-03"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a frontend engineer at Samsung Electronics who built the AI-assisted dev platform that made Samsung TV Plus's new MFE architecture accessible to engineers of all backgrounds."
tags: ["developer-experience", "ai-tooling", "mcp", "micro-frontends", "samsung", "platform-engineering"]
---

The architecture was finished. The [Vite Module Federation shell](/writing/plugin-onboarding-vite-module-federation) was running. Four domain plugin remotes were wired to a registry. Content-MD5 comparisons were proving isolation. Every technical decision I'd made in Part 1 had held up.

Then I looked at the team.

Turborepo, pnpm workspaces, Vite Module Federation, remote registries, shared dependency negotiation — none of it was something most engineers on the team had touched before. Some came from backend backgrounds. Some had never opened a `turbo.json`. A few had never used pnpm at all. The gap between "this architecture works" and "this team can use this architecture" was large enough to sink the whole thing.

This is Part 2. Not the architecture. The adoption.

---

> **Key Takeaways**
> - A powerful architecture fails if only senior engineers can operate it. Accessibility is a feature.
> - The platform wraps complex CLI operations behind a GUI: scaffold, build, test, audit, deploy — all point-and-click.
> - In 2025, 80% of developers use AI tools in their daily workflows ([Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)) — but most AI tools don't know your platform's conventions. Custom MCP tools fix that.
> - Code generation from a description produces working React components in seconds, directly in VS Code.
> - Making complex systems accessible is as important as building them right.

---

## 1. The adoption problem, precisely

The new stack had too many unfamiliar surfaces. Turborepo's task graph, pnpm workspace filter syntax, Vite Module Federation's build-then-preview requirement, the registry service, the shared-dependency rules — these aren't things you absorb from a README over a weekend. They're things you learn by spending a week breaking things and reading error messages.

[PERSONAL EXPERIENCE] I watched one engineer spend two hours trying to scaffold a new plugin by hand. He had the docs open. He was following them carefully. He still got the `vite.config.ts` federation config wrong three times, because the `singleton: true` + `requiredVersion: false` + `eager: true` combination isn't obvious until you've been burned by each missing piece once. He eventually got it working. He also never wanted to do it again.

That's the adoption problem. Not that engineers can't learn. They can. It's that the tax on learning is too high when there's actual product work to ship. If scaffolding a new plugin takes two hours of careful documentation-reading plus a good chance of a failed build, most people will avoid creating plugins unless they absolutely have to. The architecture's flexibility is wasted.

The fix isn't better documentation, either. Documentation goes stale. It doesn't stop you from getting the config wrong. It doesn't run `pnpm install` for you or open VS Code when the scaffold is done.

The fix is removing the surface entirely.

---

## 2. What I built

I built an AI-assisted dev platform: a React web app that sits in front of the entire plugin development lifecycle. From this one UI, without opening a terminal or touching a config file, any engineer on the team can:

- **Scaffold a new plugin** — fill a form, click Create, get a fully wired app opened in VS Code in about 30 seconds.
- **Generate code** — paste API documentation or describe a feature in plain English, get working React components placed directly in the plugin's source tree.
- **Build** — trigger a build for any plugin and watch the output live.
- **Run tests** — kick off the test suite from the UI.
- **Audit** — run code quality and architecture checks against any plugin.
- **Deploy** — publish a plugin through the platform, no CLI required.
- **Manage the registry** — add, edit, disable, or delete plugin entries through a CRUD interface.

The complexity is still there. It's just invisible to the engineer using the platform.

> **Citation Capsule:** Developer experience directly affects output. In 2023, McKinsey found that improving developer experience can increase productivity by 20-45% ([McKinsey Developer Velocity](https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/yes-you-can-measure-software-developer-productivity), 2023). An AI-assisted dev platform that abstracts CLI complexity behind a GUI compounds that gain by lowering the skill floor: engineers without deep frontend experience can contribute from day one without learning the underlying toolchain.

<!-- [INTERNAL-LINK: Vite Module Federation architecture and registry → plugin-onboarding-vite-module-federation] -->

---

## 3. The architecture: GUI, Express, MCP tools

Three layers. The engineer sees only the first one.

```
┌─────────────────────────────────┐
│     React GUI (web app)         │  ← engineer interacts here only
│  forms, buttons, live output    │
└────────────┬────────────────────┘
             │  HTTP (REST)
             ▼
┌─────────────────────────────────┐
│   Express API server (:5001)    │  ← orchestrates everything
│  routing, auth, job queue       │
└────────────┬────────────────────┘
             │  JSON-RPC / exec
             ▼
┌─────────────────────────────────┐
│   MCP Tools + shell scripts     │  ← actual operations happen here
│  file creation, builds,         │
│  code gen, audits, deploys      │
└────────────┬────────────────────┘
             │  writes to
             ▼
┌─────────────────────────────────┐
│   Filesystem + VS Code          │
│   (workspaces, registry.json)   │
└─────────────────────────────────┘
```

<figure>
<svg viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture diagram showing four layers: React GUI connects to Express API, which connects to MCP Tools and scripts, which writes to the filesystem and VS Code">
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#3b82f6"/>
    </marker>
  </defs>
  <rect width="560" height="340" rx="12" style="fill:var(--bg-secondary);stroke:var(--border-color)" stroke-width="1"/>
  <text x="280" y="28" text-anchor="middle" font-family="monospace" font-size="13" font-weight="600" style="fill:var(--text-primary)">AI Dev Platform — Architecture</text>

  <!-- Layer 1: GUI -->
  <rect x="80" y="50" width="400" height="52" rx="6" fill="#3b82f6" opacity="0.9"/>
  <text x="280" y="73" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#ffffff">React GUI</text>
  <text x="280" y="91" text-anchor="middle" font-family="monospace" font-size="10" fill="rgba(255,255,255,0.8)">Forms · buttons · live build output · the only surface engineers see</text>

  <!-- Arrow 1 -->
  <line x1="280" y1="102" x2="280" y2="128" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="295" y="119" font-family="monospace" font-size="9" style="fill:var(--text-muted)">HTTP REST</text>

  <!-- Layer 2: Express -->
  <rect x="80" y="130" width="400" height="52" rx="6" style="fill:var(--bg-secondary);stroke:#3b82f6" stroke-width="2"/>
  <text x="280" y="153" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" style="fill:var(--text-primary)">Express API Server  :5001</text>
  <text x="280" y="171" text-anchor="middle" font-family="monospace" font-size="10" style="fill:var(--text-muted)">Routing · job queue · orchestrates all tool calls</text>

  <!-- Arrow 2 -->
  <line x1="280" y1="182" x2="280" y2="208" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="295" y="199" font-family="monospace" font-size="9" style="fill:var(--text-muted)">JSON-RPC / exec</text>

  <!-- Layer 3: MCP Tools -->
  <rect x="80" y="210" width="400" height="52" rx="6" style="fill:var(--bg-secondary);stroke:#3b82f6" stroke-width="2"/>
  <text x="280" y="233" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" style="fill:var(--text-primary)">MCP Tools + Scripts</text>
  <text x="280" y="251" text-anchor="middle" font-family="monospace" font-size="10" style="fill:var(--text-muted)">File creation · builds · code gen · audits · deploys</text>

  <!-- Arrow 3 -->
  <line x1="280" y1="262" x2="280" y2="288" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="295" y="279" font-family="monospace" font-size="9" style="fill:var(--text-muted)">writes to</text>

  <!-- Layer 4: Filesystem -->
  <rect x="80" y="290" width="400" height="36" rx="6" fill="#374151"/>
  <text x="280" y="313" text-anchor="middle" font-family="monospace" font-size="11" font-weight="600" fill="#9ca3af">Filesystem · registry.json · VS Code</text>
</svg>
<figcaption>Three active layers; the engineer interacts with only the first. The Express API is the bridge; MCP tools handle all actual operations.</figcaption>
</figure>

The React GUI is the only surface engineers interact with. It submits form data and displays results. Everything below that is invisible to the person using the platform.

The Express API server is the bridge. When you click "Create Plugin," the GUI POSTs to `/api/scaffold`. The server validates the payload, picks the right MCP tool, invokes it, streams progress back to the GUI, and returns the result.

The MCP tools handle the actual work. Each operation has a dedicated tool: scaffolding, building, code generation, audits, deploys. They read from and write to the filesystem. Some of them open VS Code programmatically when work lands in the workspace.

<!-- [INTERNAL-LINK: MCP tool architecture and the dual-surface CLI pattern → one-protocol-two-surfaces] -->

---

## 4. The scaffold flow, in detail

This is the most common operation and the one that removes the most friction. Here's exactly what happens when an engineer fills in the New Plugin form and clicks Create.

The form collects five fields:

```
Plugin ID:     analytics           (kebab-case, becomes folder name + federation id)
Display label: Analytics Dashboard (human-readable, shown in the shell card grid)
Port:          3005                (dev + preview port for this plugin)
Accent color:  #6366f1             (optional — used in the plugin's card in the shell)
Routes:        overview, reports, exports  (comma-separated, generates route stubs)
```

The GUI POSTs this to `POST /api/scaffold`. The Express server invokes the scaffold MCP tool:

```javascript
// devtools/server.js — scaffold handler
app.post('/api/scaffold', async (req, res) => {
  const { id, label, port, color, routes } = req.body;

  // 1. Create the workspace directory and all config files
  await scaffoldPlugin({ id, label, port, color, routes });

  // 2. Install dependencies for the new workspace member
  execSync(`pnpm install`, { cwd: MONOREPO_ROOT, stdio: 'inherit' });

  // 3. Build the plugin (required before vite preview can serve it)
  execSync(`pnpm --filter ${id} build`, { cwd: MONOREPO_ROOT, stdio: 'inherit' });

  // 4. Register in the plugin registry
  const registry = readRegistry();
  registry.push({ id, label, port, color, url: `http://localhost:${port}/assets/remoteEntry.js`, disabled: false });
  writeRegistry(registry);

  // 5. Increment the revision counter so the shell reloads
  incrementRevision();

  // 6. Open the new plugin in VS Code
  execSync(`code apps/${id}`, { cwd: MONOREPO_ROOT });

  res.json({ success: true, id, port });
});
```

The `scaffoldPlugin` function templates out the entire workspace: `vite.config.ts`, `package.json`, `App.tsx`, `index.html`, one `.tsx` stub per route, Tailwind config, TypeScript config, all wired correctly. The generated `vite.config.ts` has the `singleton: true` + `requiredVersion: false` + `eager: true` trio already in place. The engineer never touches it.

[ORIGINAL DATA] The whole flow — form submission to VS Code opening with the new plugin folder — takes about 30 seconds on a warm pnpm cache. The engineer's first interaction with the new plugin is opening a route stub file in VS Code, not debugging a federation config.

From there, the shell's revision poller (polling `/api/revision` every 3 seconds) detects the new build and reloads the plugin grid. The new plugin card appears. The engineer clicks it and sees their app running.

That's the moment the architecture becomes real to someone who wasn't involved in building it.

---

## 5. Code generation: describe what you need, get working React

The scaffold creates the structure. The code generation fills it in.

The platform has a Code Studio tab. An engineer pastes API documentation or describes a feature in plain English, picks a target route, and clicks Generate. Working React components appear directly in their VS Code within a few seconds.

[PERSONAL EXPERIENCE] The first time I demoed this to a backend engineer on the team, she described a table view for a REST endpoint she owned: "a filterable table showing users, with columns for name, email, role, and created date, sortable by any column." She got back a fully typed React component with the right prop interface, a `useQuery` call stubbed to her endpoint's shape, column definitions, a filter input, and sort handlers. It wasn't perfect — she adjusted two things. But it was 90% there, and she could read and modify it without knowing how to write it from scratch.

That's the actual value. Not that the AI writes perfect code. It's that the gap between "I can describe what I need" and "I have working code to modify" shrinks from hours to seconds.

The generation pipeline works like this:

```
Engineer describes feature or pastes API docs
           │
           ▼
GUI POSTs to /api/generate
           │
           ▼
Express server calls the code-gen MCP tool with description + target plugin path
           │
           ▼
MCP tool reads the plugin's existing structure (types, routes, shared patterns)
then generates components that match the plugin's conventions
           │
           ▼
Files written to disk, VS Code detects changes and hot-reloads
```

The MCP tool knows the plugin's conventions because it reads the scaffold-generated structure. It knows which imports to use, how routes are organised, which shared components from `@repo/ui` are available. The output looks like code written by someone who knows the platform, not generic boilerplate.

> **Citation Capsule:** AI-assisted code generation tools reduce time-to-working-code significantly. In 2024, GitHub's survey found developers complete tasks up to 55% faster with AI code tools ([GitHub Octoverse 2024](https://github.blog/news-insights/octoverse/ai-coding-tools-developer-experience/), 2024). The compounding effect is larger when the AI tool knows your platform's conventions — it generates idiomatic code, not generic boilerplate that needs to be rewritten before it fits.

<!-- [INTERNAL-LINK: MCP tool code generation patterns → one-protocol-two-surfaces] -->

---

## 6. The rest of the platform surface

Scaffolding and code generation are the headline features. The other capabilities matter too.

**Build.** Any engineer can trigger a build for any plugin from the UI. The platform streams build output live. If there's an error, it's in the UI — no terminal hunting required.

**Test.** Same pattern. Click the plugin, click Run Tests, watch Vitest output appear in the browser.

**Audit.** The platform runs code quality and architecture checks via the quality-pipeline MCP tool. It produces a letter grade — A through F — with specific findings. Engineers can see whether their plugin has TypeScript errors, accessibility issues, hardcoded colors, or console.log calls before they submit a PR.

**Deploy.** The deploy flow snapshots the plugin's `dist/` folder to a versioned directory and patches the registry URL. From the UI, an engineer can also roll back to any previous version with one click. Under the hood, that's the same `PATCH /api/registry/:id` that updates the `url` field — the shell picks up the change on its next registry fetch.

**Registry manager.** A CRUD interface for `registry.json`. Add a plugin, enable or disable one, update a URL, delete an entry that's no longer needed. Everything the registry needs, visible and editable in the browser.

![Dark analytics dashboard with multiple data visualisation panels showing plugin registry and build status](https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=80&w=1200&h=630&fit=crop)

[UNIQUE INSIGHT] The registry manager turned out to be more important than I expected. Before it existed, engineers would come to me when they needed to disable a plugin, change its display label, or point it at a different build. With a UI, they could do it themselves — and more importantly, they understood why the change worked. The registry became legible to the whole team, not just to whoever set it up.

That's a different kind of value than automation. It's transparency.

---

## 7. What this unlocked for the team

[PERSONAL EXPERIENCE] The clearest signal that the platform worked was when a backend engineer who had never written a React component created a working plugin in his second week on the project. He used the scaffold form, described a few views to the code generator, and had something running in the shell before lunch. He never opened a terminal. He never read the Turborepo docs. He didn't need to know what `vite preview` was.

That's the outcome I was building toward. Not automation for its own sake. Access.

The developer experience improvements compounded in a few specific ways:

**The architecture change became durable.** When only two engineers can use a system, it's fragile. A team change, a priority shift, and the whole thing becomes technical debt. When ten engineers can operate it independently, the architecture has real staying power.

**Review cycles shortened.** Code generated by the platform starts from the right conventions. It uses the correct shared components, the right import paths, the correct TypeScript patterns. The review conversation shifts from "this doesn't follow our patterns" to "here's how to improve what you've already got right."

**Onboarding time dropped significantly.** New engineers could contribute to plugin development on day one. Not because the work was trivial — because the tooling handled the parts that required deep platform knowledge.

> **Citation Capsule:** Teams with strong developer experience infrastructure see measurable onboarding improvements. Research by DORA (DevOps Research and Assessment) found that high-performing teams recover from incidents and onboard new members significantly faster than low performers ([DORA State of DevOps 2024](https://dora.dev/research/2024/dora-report/), 2024). A platform that removes CLI and config knowledge as prerequisites for contribution is the practical implementation of that finding.

<!-- [INTERNAL-LINK: Turborepo cache invalidation patterns at team scale → turborepo-cache-invalidation-patterns] -->

---

## 8. The lesson I keep coming back to

I spent most of my time on the MFE architecture in Part 1. The registry pattern, the chunk-hash isolation proof, the shared-dependency war, the `vite preview` requirement — those problems were technical and specific and satisfying to solve.

The platform in this post took less technical ingenuity. The problems were softer: what does a backend engineer need to see to feel confident? What error messages will confuse someone who's never touched pnpm? Which operations are scary enough in the terminal that people will avoid them but obvious enough in a form that they'll try?

Those questions matter as much as the technical ones. An architecture that works perfectly is still a failed project if the team can't use it.

In 2025, 45% of developers reported that poor developer experience was a top contributor to slow delivery ([Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)). The platform I built is a direct response to that problem inside a specific context. But the principle is general: when you introduce a complex system, your job doesn't end when the architecture is correct. It ends when the team can use it without you in the room.

The terminal is a barrier for a lot of people who are otherwise perfectly capable engineers. Removing it — wrapping it in a GUI they can understand, backed by tools that enforce the conventions they don't know yet — is a legitimate engineering problem. It was the harder problem to solve on this project.

Build the platform before you need it. Don't wait for adoption to fail.

---

## Frequently Asked Questions

### Do engineers need to understand the MCP tools to use the platform?

No. That's the point. Engineers interact only with the React GUI. The Express API and MCP tools are invisible implementation details. An engineer who has never heard of Model Context Protocol can scaffold a plugin, generate code, and run audits without knowing any of that infrastructure exists.

[INTERNAL-LINK: how MCP tools work and the dual-surface CLI pattern → one-protocol-two-surfaces]

### Can the platform handle plugins in separate Git repositories?

The platform as built works within the monorepo. The registry manager can point any plugin's URL at any `remoteEntry.js` location — including externally hosted builds. In that setup, the scaffold and build features don't apply to external plugins, but the registry manager, access control, and deploy versioning still work. According to the [2024 State of JavaScript Survey](https://2024.stateofjs.com/en-US/libraries/monorepo_tools/), 58% of JS developers use zero dedicated monorepo tools, which means many teams encounter this hybrid case.

[INTERNAL-LINK: Vite Module Federation with plugins in separate repos → plugin-onboarding-vite-module-federation]

### What happens if the Express server is down?

The shell falls back to its static `public/registry.json` file and loads whatever plugins are registered there. Engineers lose access to the platform features (scaffold, build, code gen) but existing plugins keep running. The fallback is documented and the static registry is kept in sync on every deploy so it's never more than one release out of date.

### How do you handle code generation quality?

The code generator produces working code, not production-ready code. I'm deliberate about framing this to the team: the output is a starting point, not a final answer. Engineers review what's generated before committing it. The platform includes the audit feature partly for this reason — run a quality check immediately after generating code to catch obvious issues before they reach PR review. GitHub's research shows developers accept AI suggestions about 30% of the time ([GitHub Copilot productivity research](https://github.blog/news-insights/research/survey-reveals-ais-impact-on-the-developer-experience/), 2024), which aligns with what I see: the value isn't blind acceptance, it's a dramatically shorter path from description to reviewable code.

[INTERNAL-LINK: code quality auditing with MCP tools → one-protocol-two-surfaces]

---

The architecture described in [Part 1](/writing/plugin-onboarding-vite-module-federation) made the system possible. The platform described here made it real for the team.

If you've built something similar — a developer platform that wraps complex infrastructure in a simpler surface — I'd genuinely like to hear what worked and what didn't. The corners of internal tooling that don't get written about are the ones I most want to learn from.

Write to me at <a href="mailto:nishantchaudhary5338@gmail.com">nishantchaudhary5338@gmail.com</a>.

— Nishant

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "The AI Dev Platform That Made Our MFE Architecture Accessible to Every Engineer",
      "description": "The architecture was built. The adoption problem remained. I built a GUI over MCP tools and Express APIs so any engineer — frontend or not — could create, build, test, and deploy plugins without a terminal.",
      "datePublished": "2026-05-03",
      "dateModified": "2026-05-03",
      "author": {
        "@type": "Person",
        "name": "Nishant Chaudhary"
      },
      "image": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=jpg&q=80&w=1200&h=630&fit=crop",
      "keywords": ["developer experience", "AI tooling", "MCP", "micro-frontends", "platform engineering", "React", "Express"]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do engineers need to understand MCP tools to use the platform?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Engineers interact only with the React GUI. The Express API and MCP tools are invisible implementation details. An engineer who has never heard of Model Context Protocol can scaffold a plugin, generate code, and run audits without knowing that infrastructure exists."
          }
        },
        {
          "@type": "Question",
          "name": "Can the platform handle plugins in separate Git repositories?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The platform works within the monorepo by default. The registry manager can point any plugin's URL at any remoteEntry.js location, including externally hosted builds. In that setup, scaffold and build features don't apply to external plugins, but registry management, access control, and deploy versioning still work."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if the Express server is down?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The shell falls back to its static public/registry.json file. Existing plugins keep running. Engineers lose access to platform features like scaffold and code generation, but the static registry is kept in sync on every deploy so it's never more than one release out of date."
          }
        },
        {
          "@type": "Question",
          "name": "How do you handle code generation quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generated code is a starting point, not a final answer. Engineers review what's generated before committing. The platform's built-in audit feature catches obvious issues immediately after generation. GitHub research shows developers accept AI suggestions about 30% of the time — the value is a shorter path from description to reviewable code, not blind acceptance."
          }
        }
      ]
    }
  ]
}
</script>
