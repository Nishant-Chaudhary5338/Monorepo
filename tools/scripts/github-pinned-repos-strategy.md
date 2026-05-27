# GitHub Pinned Repos Strategy
# Goal: Senior/Staff Frontend Engineer + System Architect, EU remote

GitHub allows 6 pinned repos. Here is the recommended selection and the exact
description + topic tags to set for each one in GitHub Settings.

---

## Repos to PIN (in this order)

### 1. Monorepo
**Description to set:**
> Turborepo monorepo — 14 apps, 8 shared packages, 28 custom MCP dev-tool servers. React 19 · TypeScript · Tailwind · GSAP · Three.js · AI agents.

**Topics to add:**
`turborepo` `react` `typescript` `monorepo` `tailwindcss` `mcp` `ai` `design-system` `component-library` `vite`

**Why pin:** This is your flagship. Shows architecture thinking, scale, and breadth.

---

### 2. mfe-poc
**Description to set:**
> Micro-frontend architecture proof of concept. Module federation, independent deployability, shared design system.

**Topics to add:**
`micro-frontends` `module-federation` `react` `typescript` `architecture` `frontend`

**Why pin:** Micro-frontend architecture is a high-signal senior/staff skill. EU companies building large platforms care about this.

---

### 3. modern-ui
**Description to set:**
> Modern React UI component library — composable, accessible, and typed.

**Topics to add:**
`react` `typescript` `ui-components` `component-library` `design-system` `tailwindcss`

**Why pin:** Library authorship signals staff-level thinking. Shows you build for other engineers, not just end users.

---

### 4. digitribeHQ  *(or digitribe — pick the more complete one)*
**Description to set (update based on what the project actually does):**
> [Add 1-line description of what DigiTribe does — e.g. "SaaS platform for X. React · TypeScript · Node.js."]

**Topics to add:**
`react` `typescript` `saas` `fullstack`

**Why pin:** Shows you ship real products, not just demos.

---

### 5 & 6 — Reserve for when you publish AI Builder or jobs-bot as standalone repos
When you extract `ai-builder` and `jobs-bot` from the monorepo and publish them
separately, pin those immediately. They are your two strongest individual demos:

- **ai-builder** — "Prompt → live dashboard UI generator. React 19 · OpenAI SDK · Monaco editor · JSON diff-patching."
- **jobs-bot** — "Agentic job-application bot. Claude (Anthropic) · Playwright · SQLite. Reads JDs, picks CV variant, fills forms."

Until then, pin `digitribe` (the other one) in slot 5 and leave slot 6 empty
rather than pinning the old todo-redux or netflix-clone projects.

---

## Repos to UNPIN / leave unpinned

| Repo | Reason |
|---|---|
| `todo-redux-typescript` | Beginner-level. Hurts senior positioning. |
| `netflix-clone-js` | Beginner-level. Hurts senior positioning. |
| `quiz-codeyogi-typescript` | Beginner-level. Hurts senior positioning. |

You can keep them public (they don't harm you if not pinned), but do not feature them.

---

## Quick action checklist

- [ ] Go to github.com/Nishant-Chaudhary5338 → click "Customize your pins"
- [ ] Select: Monorepo, mfe-poc, modern-ui, digitribeHQ (or digitribe), + 2 of your choice
- [ ] For each repo → Settings (gear icon) → update Description and Topics
- [ ] Create `Nishant-Chaudhary5338/Nishant-Chaudhary5338` repo (if not exists) → add profile README
- [ ] Update GitHub profile bio (see below)

---

## GitHub profile bio (140 chars max)

Recommended:
> Senior Frontend Engineer · React · TypeScript · system architecture · open to EU remote

Or shorter:
> Building component systems and AI tooling. React 19 · TypeScript · Turborepo. Open to EU remote.
