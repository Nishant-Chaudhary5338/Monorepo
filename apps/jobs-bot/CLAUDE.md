# Jobs Bot — Session Guide

Automated job application bot for Nishant Chaudhary. Built in April 2026.
Full agentic system: Claude vision + Playwright fills real multi-step forms on company websites.

---

## What it does

1. **Discovers jobs** — LinkedIn (378 queries across EU/India/USA) + Wellfound EU startups
2. **Evaluates each job** — Claude reads the JD, decides to apply or skip, picks best CV variant
3. **Tailors CV** — picks from 4 resume variants, converts docx→pdf, renames to `NishantChaudhary.pdf`
4. **Generates cover letter** — Claude writes a tailored one per role, saved as `NishantChaudhary_CoverLetter.pdf`
5. **Fills the application** — screenshot loop: Claude sees each form page → returns JSON actions → Playwright executes with human-like mouse/keyboard behaviour
6. **Multi-page forms** — continues through page 1, 2, 3... account creation, screening questions, uploads, until submitted
7. **Tracks everything** — SQLite at `data/applications.db`
8. **Direct outreach** — separately finds CTOs/Eng leads at EU companies, Claude writes a casual human-sounding LinkedIn message, Playwright sends it

---

## Commands

```bash
cd apps/jobs-bot

# One-time: LinkedIn login (browser opens, log in manually, press Enter)
pnpm apply --login

# Daily apply run (LinkedIn + Wellfound, max 40 applications)
pnpm apply

# Dry run — finds + evaluates jobs but does NOT submit
pnpm apply --dry-run

# Check tracker stats
pnpm status

# Direct outreach to EU CTOs — preview drafts first
pnpm outreach --preview
pnpm outreach --company "Linear"   # single company
pnpm outreach                       # full run (max 15 messages/day)
```

---

## Setup (one-time)

```bash
# 1. Create .env
echo "ANTHROPIC_API_KEY=sk-ant-..." > apps/jobs-bot/.env

# 2. Install deps (already done)
pnpm install

# 3. Install Playwright browser (already done)
npx playwright install chromium

# 4. Install LibreOffice for docx→pdf (optional but recommended)
brew install --cask libreoffice

# 5. Login to LinkedIn
pnpm --filter jobs-bot apply --login
```

---

## File structure

```
apps/jobs-bot/
  resumes/
    variant_faang.pdf        ← USA/FAANG (metrics-heavy, no prose)
    variant_hybrid.docx      ← Europe Remote (balanced, narrative)
    variant_ats.docx         ← India/ATS portals (keyword-rich)
    variant_general.pdf      ← General fallback
    cover_letter_base.pdf    ← Base cover letter (used if reportlab unavailable)

  data/                      ← auto-created at runtime, gitignored
    applications.db          ← SQLite tracker
    session/state.json       ← LinkedIn cookies (persist between runs)
    screenshots/             ← debug screenshots per form step
    output/
      NishantChaudhary.pdf              ← active resume (renamed per run)
      NishantChaudhary_CoverLetter.pdf  ← active cover letter

  src/
    profile/
      profile.json           ← Nishant's full profile, screening answers, skills
      search-config.json     ← 36 keywords, 30 target companies, 23 job boards (research agent output)

    lib/
      browser.ts             ← Playwright setup, session save, screenshot util
      claude.ts              ← Claude API: analyzePageAndGetActions, evaluateJob, generateCoverLetter
      db.ts                  ← SQLite: insert, alreadyApplied, skip, stats
      human.ts               ← Anti-bot: bezier mouse, char-by-char typing, random delays

    agent/
      cv-generator.ts        ← pick variant → convert docx→pdf → rename to NishantChaudhary.pdf
      form-filler.ts         ← screenshot loop (max 25 steps), executes Claude's actions
      outreach-composer.ts   ← Claude writes casual LinkedIn message, Playwright sends it

    scrapers/
      linkedin.ts            ← 378 search queries (15 titles × 21 EU locations + India + USA)
      wellfound.ts           ← 11 Wellfound EU URLs (startups, all stages)
      company-researcher.ts  ← finds CTO/Eng Lead on LinkedIn per EU company

    commands/
      apply.ts               ← main orchestrator: discover → evaluate → prepare CV → fill forms
      status.ts              ← prints tracker table
      outreach.ts            ← direct outreach orchestrator
```

---

## Resume selection logic

| Market | Variant used | Why |
|--------|-------------|-----|
| India | `ats` | keyword-rich, ATS-optimised |
| Europe Remote | `hybrid` | balanced narrative + metrics |
| USA Remote / FAANG | `faang` | metrics-heavy, no prose |
| Fallback | `general` | comprehensive with projects section |

Claude's `evaluateJob` can override this. Submitted file is always named `NishantChaudhary.pdf`.

docx→pdf conversion chain: LibreOffice → macOS Pages (osascript) → python docx2pdf → fallback to general PDF.

---

## Nishant's top skills (for job matching)

**Primary:** React.js, Vite, Next.js, TypeScript, pnpm Workspaces, Turborepo, Monorepo Architecture, Custom MCP Tools, Frontend Automation, AI-driven Developer Tooling

**Also strong:** Tailwind CSS, Redux Toolkit, Zustand, GraphQL, REST APIs, AWS, Docker, CI/CD, Playwright, Storybook, Three.js, GSAP, Node.js, HLS.js, Web Workers

**Apply if:** any of the top skills match, or it's a senior frontend/React role in Europe/remote.
**Skip if:** 8+ years required, backend-only, iOS/Rust/ML-specific, junior role.

---

## Target markets

- **Europe Remote (priority)** — €3–5k/month target, EU startups/products, no coding rounds
- **India** — top Indian product companies (Razorpay, BrowserStack, CRED, Groww, Hasura etc.)
- **USA Remote** — async-first companies only (Vercel, Linear, Shopify, Netlify etc.)

---

## Anti-bot measures

All interactions go through `lib/human.ts`:
- Mouse moves via bezier curve (8–15 points, random speed)
- Typing is char-by-char with 40–120ms delay, occasional typo+backspace
- Random 300–800ms gap between fields
- Human-like scroll (100–200px steps)
- `navigator.webdriver` patched to `false`
- Persistent session cookies (looks like a returning user)
- 30–90 second pause between LinkedIn outreach messages (max 15/day)

---

## Outreach message style

Casual, developer-to-developer. Under 80 words. Opens with a specific observation about their product (not generic praise). Mentions ONE thing Nishant built. Ends with a soft ask. No em dashes, no resume bullets, no "20-min chat". Signs off "— Nishant".

Good example:
```
hey Alex, been using Linear for a while — that editor feel is something
I keep referencing when building UI at Samsung.

work on React/TS stuff, recently built a dashboard library our whole
team ended up adopting. figured I'd reach out in case you're growing
the frontend side.

— Nishant
```

---

## Known limitations / things to improve

- **Wellfound selectors** may need updating if their DOM changes — check `data/screenshots/` if scraping breaks
- **LinkedIn CAPTCHA** — if it appears, solve manually in the open browser window; bot continues automatically
- **docx→pdf** needs LibreOffice for best results: `brew install --cask libreoffice`
- **Daily limits** — LinkedIn: 40 apply / 15 outreach per day (hardcoded in `commands/apply.ts` and `commands/outreach.ts`)
- **Wellfound login** — currently scrapes without login. Some roles may be hidden behind auth. Can add Wellfound login flow if needed.
- **Indeed/Naukri/Arc.dev scrapers** — not built yet. `search-config.json` has their URLs ready.

---

## What Claude sees during form filling

Each step: full viewport screenshot → sent to `claude-haiku-4-5-20251001` with profile context + job description + step history → returns JSON like:
```json
{
  "pageType": "form",
  "isComplete": false,
  "notes": "Page 2 of 3 — work experience form",
  "actions": [
    { "type": "fill", "selector": "#jobTitle", "value": "Frontend Engineer" },
    { "type": "fill", "selector": "#company", "value": "Samsung Electronics" },
    { "type": "click", "selector": "button:has-text('Next')" }
  ]
}
```

Max 25 steps per application. Screenshots saved to `data/screenshots/` for debugging.
