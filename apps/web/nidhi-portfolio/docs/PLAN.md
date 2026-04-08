# Nidhi Portfolio — Master Lift Plan
## Multi-Week, Multi-Session Roadmap

---

## WHO DOES WHAT

| Symbol | Means |
|--------|-------|
| 🤖 Claude | I write code, content, prompts, copy |
| 👤 Nishant | You gather, deploy, upload, run prompts |
| 🎨 Nidhi | She reviews, approves, provides opinions |
| ✅ Done | Completed |
| 🔴 Blocker | Can't proceed without this |

---

## MASTER ASSET CHECKLIST
> Complete this BEFORE any coding session. Most of Stage 1 is Nishant's job.

### From App Stores
- [ ] 👤 Search "Golden Farms" on Play Store → screenshot ALL listing images (5–8 screens)
- [ ] 👤 Search "Golden Farms" on Apple App Store → screenshot ALL listing images
- [ ] 👤 Find the screen inside the app where Nidhi's name appears → screenshot it
- [ ] 👤 Save all as: `golden-farms-playstore-1.png`, `golden-farms-appstore-1.png`, etc.

### Safex Live Websites
- [ ] 👤 Collect all 5–6 Safex group website URLs (safexchemicals.com, golden farms, etc.)
- [ ] 👤 Screenshot homepage + 1 interior page of each
- [ ] 👤 Save as: `safex-site-1.png`, `safex-site-2.png`, etc.

### Safex Calendar
- [ ] 👤 Share the live calendar link
- [ ] 👤 Screenshot the calendar UI (desktop + mobile)

### Samsung Storybook
- [ ] 👤 Deploy Storybook to Netlify (free, takes 10 min — see instructions below)
- [ ] 👤 Share the live Netlify URL with me

### Nidhi's Resume
- [ ] 👤 Locate `Nidhi-resume2026.pdf` or any version of her resume
- [ ] 👤 Add it to `apps/web/nidhi-portfolio/public/Nidhi-resume2026.pdf`

### Nidhi's Input (she must answer these)
- [ ] 🎨 What 3 words would she use to describe her design style?
- [ ] 🎨 What is one project she is most proud of and why?
- [ ] 🎨 Any real quote from a manager/colleague she remembers?
- [ ] 🎨 Does she have ANY photos — mural visit, tarot cards physical, any work event?

### 0D. Branding + Packaging Work (NEW — HIGH VALUE)
> Nidhi has branding kits, logos, brand guidelines, and packaging design for freelance clients — all in Illustrator/AI files + PDFs. This is a major portfolio differentiator.

**Nidhi/Nishant: gather these now**
- [x] ✅ Nidhi confirmed she has ALL branding assets (logos, brand kits, packaging, guidelines)
- [x] ✅ Will share 2–3 clients after getting their consent — coming soon
- [ ] 👤🎨 Export each brand kit to PNG: logo variants, color palette, typography specimen, 1–2 application mockups
- [ ] 👤🎨 Export packaging design as flat PNG + ideally a photo of the physical print
- [ ] 👤🎨 Save all to: `public/images/branding/[client-name]/`
- [ ] 👤🎨 Share the list with me — I'll decide the best presentation format once I see what's there

**Options we'll choose from (deferred until assets are in):**
- A dedicated "Brand & Identity" visual gallery section on the homepage
- Branding integrated into relevant project case studies (e.g. Safex brand → Golden Farms case study)
- Standalone Behance projects per major brand identity
- A mix: top 2–3 get their own Behance post, rest go in a gallery grid on the portfolio

**Why this matters for senior roles:**
Brand identity + packaging depth tells hiring teams she can operate at the full spectrum of design — not just screens. This is rare and commands premium positioning.

---

## NETLIFY STORYBOOK DEPLOY (Nishant does this)
```bash
# In the Storybook project folder:
npm run build-storybook
# This creates a /storybook-static folder

# Then either:
# Option A - Netlify CLI
npx netlify deploy --dir storybook-static --prod

# Option B - Netlify UI (easiest)
# Go to netlify.com → "Add new site" → "Deploy manually"
# Drag and drop the storybook-static folder
# Get the URL → share with me
```

---

## STAGE OVERVIEW

| Stage | Name | Owner | Sessions | Status |
|-------|------|-------|----------|--------|
| 0 | Asset Assembly | 👤 Nishant + 🎨 Nidhi | Pre-work | 🔴 Still pending |
| 1 | Portfolio Foundation | 🤖 Claude | Session 1–2 | ✅ Complete (2026-04-07) |
| 1b | Section Rebuilds (About/Skills/Process/Contact) | 🤖 Claude | Next session | 🟡 In progress |
| 2 | Case Study Pages | 🤖 Claude | Session 3–4 | Pending |
| 3 | Image Generation | 👤 Nishant runs prompts | Between sessions | Pending |
| 4 | Image Integration | 🤖 Claude | Session 5 | Pending |
| 5 | Testimonials + Polish | 🤖 Claude | Session 6 | Pending |
| 6 | Behance Content | 🤖 Claude writes, 👤 uploads | Session 7 | Pending |
| 7 | Resume | 🤖 Claude builds | Session 8 | Pending |
| 8 | Final Polish + SEO | 🤖 Claude | Session 9 | Pending |

---

## STAGE 0 — ASSET ASSEMBLY
> Nishant does this. No coding happens until core assets are ready.

### 0A. Immediate (do today)
1. 👤 Get all Golden Farms app store screenshots → add to `apps/web/nidhi-portfolio/public/images/golden-farms/`
2. 👤 Deploy Storybook to Netlify → get URL
3. 👤 Find + add Nidhi's resume PDF to `public/`

### 0B. This Week
4. 👤 Screenshot all Safex websites → `public/images/safex-sites/`
5. 👤 Screenshot Safex Calendar → `public/images/safex-calendar/`
6. 👤 Answer project-specific questions (see Stage 2 prep below)

### 0C. Nidhi's Homework
7. 🎨 Write 3–5 sentences about herself in her own words (for bio authenticity)
8. 🎨 Pick her top 3 favorite design decisions she ever made across any project
9. 🎨 Find any photo of herself at a desk, event, or with the mural (for About section)

---

## STAGE 1 — PORTFOLIO FOUNDATION ✅ COMPLETE (2026-04-07)

### Session 1 tasks — DONE
- [x] 🤖 Set up React Router in `main.tsx` + `App.tsx`
- [x] 🤖 Rewrite `constants/index.ts` — 8 real projects with full CaseStudy type + data
- [x] 🤖 Update `Work.tsx` — Link to `/work/:id`, live badges, sharp-corner card spec
- [x] 🤖 Update `Hero.tsx` — editorial layout, no 3D, resume CTA, asymmetric Playfair name
- [x] 🤖 Rebuild `Navbar.tsx` — pill toggle, "N —" logo mark
- [x] 🤖 Build `src/pages/CaseStudy.tsx` — full 5-section template

### Also completed (design direction v3 implementation)
- [x] 🤖 `index.css` — full token rewrite (light-mode-first, [data-theme="dark"], motion tokens, backward-compat aliases)
- [x] 🤖 `index.html` — theme init script in <head>, JetBrains Mono font
- [x] 🤖 `ThemeContext.tsx` — data-theme attribute (not html class)

### Still needed (Stage 1b — next session)
- [ ] 🤖 Rebuild `About.tsx` — pull quote right, stats row (new tokens), remove old glass card approach
- [ ] 🤖 Rebuild `Skills.tsx` — ruled columnar list (per v3 spec)
- [ ] 🤖 Rebuild `Process.tsx` — borderless grid, simpler process-step cards
- [ ] 🤖 Rebuild `Contact.tsx` — remove radial glow, use --bg-surface band
- [ ] 🤖 Build `src/sections/Testimonials.tsx`

### Files touched in Stage 1
```
src/main.tsx                    ← BrowserRouter ✅
src/App.tsx                     ← Routes with / and /work/:id ✅
src/constants/index.ts          ← Full rewrite, 8 projects + CaseStudy type ✅
src/sections/Work.tsx           ← Links + badges + new card spec ✅
src/sections/Hero.tsx           ← Editorial redesign, no 3D ✅
src/components/Navbar.tsx       ← Pill toggle, new logo ✅
src/pages/CaseStudy.tsx         ← NEW — full template ✅
src/index.css                   ← Full token rewrite ✅
src/context/ThemeContext.tsx     ← data-theme ✅
index.html                      ← Theme init script + JetBrains Mono ✅
```

---

## STAGE 2 — CASE STUDY CONTENT
> 🤖 Claude writes all content. But first, Nishant answers these questions per project.

### 2A. Nishant answers these BEFORE Session 3

**Golden Farms:**
```
1. What were the 3 biggest UX problems in the original B2B ordering flow?
2. What did the onboarding look like? (steps, screens)
3. Was there a permit/document upload flow? What did it require?
4. What did the home/dashboard screen show?
5. Was there a bulk ordering feature? How did it work?
6. What analytics does Google Analytics show? (page visits, drop-off, etc.)
7. Any specific feedback from B2B customers Nidhi remembers?
```

**TVPlus Test Suite:**
```
1. Who were the users? (QA engineers, content ops, mixed?)
2. What was the test authoring flow? (how did they create a test case?)
3. What did the scheduling interface look like?
4. What widgets were on the drag-drop dashboard? (list all of them)
5. What did the chatbot do? (search, Q&A, run tests?)
6. What was the admin portal for? (user management, permissions?)
7. What was the biggest UX challenge — what was broken before Nidhi redesigned it?
```

**Safex LMS:**
```
1. What did the homepage/dashboard show after login?
2. How were courses structured? (chapters, videos, quizzes?)
3. What did the quiz interface look like?
4. What was the editorial board section? (news feed? articles? who posted?)
5. What did the profile section contain?
6. Who were the users — all employees or specific roles?
```

**Samsung Design System:**
```
1. How many components in the Storybook?
2. What were the core token categories? (colors, spacing, typography, etc.)
3. Was there a dark mode?
4. Which products adopted the design system?
5. What was the biggest design decision Nidhi made in the system?
```

### Session 3–4 tasks (after Nishant answers above)
- [ ] 🤖 Write full case study narrative for Golden Farms (problem → research → define → design → deliver)
- [ ] 🤖 Write full case study for TVPlus
- [ ] 🤖 Write full case study for Safex LMS + Admin
- [ ] 🤖 Write full case study for Samsung Design System
- [ ] 🤖 Populate all content into `constants/index.ts` case study fields
- [ ] 🤖 Render content in CaseStudy page template

---

## STAGE 3 — IMAGE GENERATION
> 👤 Nishant runs these prompts in Midjourney or DALL-E 3. Happens between coding sessions.

### 3A. Real images (no generation needed)
- Golden Farms: App Store screenshots ← already collected in Stage 0
- Safex sites: Screenshots ← already collected in Stage 0
- Samsung Storybook: Netlify URL ← no image needed, it's a live link

### 3B. Midjourney/DALL-E prompts (Nishant runs these)

> **How to use:** Go to Midjourney discord or midjourney.com, paste prompt, download best result, share back

**TVPlus Dashboard (run this prompt):**
```
Enterprise SaaS dashboard, dark purple and navy theme, drag-and-drop widget 
grid layout, real-time test status cards showing pass/fail counts, streaming 
content thumbnails, progress bars, sidebar navigation with icon labels, 
Samsung internal tool aesthetic, desktop browser mockup, clean modern UI, 
professional --ar 16:9 --v 6 --style raw
```

**TVPlus Test Authoring Screen:**
```
Enterprise test case editor UI, dark theme, form-based interface with 
step builder, dropdown selectors for test parameters, code snippet area, 
save and schedule buttons, left sidebar with test library tree, 
Samsung QA tool aesthetic, desktop UI mockup --ar 16:9 --v 6
```

**Safex Admin Portal — Dashboard:**
```
B2B admin portal dashboard, light theme with green and orange accents, 
data tables showing order management, Indian market context, inventory 
management with state-wise filtering, customer verification queue with 
status badges, analytics charts, professional enterprise design, 
desktop browser mockup --ar 16:9 --v 6
```

**Safex Admin Portal — Customer Verification:**
```
Document verification workflow UI, admin portal, permit approval interface, 
customer onboarding steps with document upload status, approval/reject actions, 
clean form-based design, professional B2B software aesthetic, 
desktop browser --ar 16:9 --v 6
```

**Safex LMS — Course Dashboard:**
```
Internal corporate LMS homepage, light and warm theme, video course cards 
with progress bars, quiz completion badges, policy document library, 
upcoming events sidebar, welcome banner with employee name, 
modern HR software aesthetic, desktop browser mockup --ar 16:9 --v 6
```

**Safex LMS — Video Player:**
```
Corporate LMS video player screen, training video playing with course 
chapter sidebar, progress tracker, note-taking panel, quiz prompt overlay, 
professional enterprise learning platform design, desktop browser --ar 16:9 --v 6
```

**Samsung Design System — Token Overview:**
```
Figma design system overview screenshot, color token palette organized 
by semantic naming, spacing scale visualization, typography specimens, 
component state variations, dark theme with purple accent, 
professional design tooling aesthetic --ar 16:9 --v 6
```

**UX Research Artifacts (for multiple projects):**
```
UX research affinity mapping, sticky notes clustered on digital whiteboard, 
Miro-style interface, color-coded insight groups, user quotes visible, 
professional research synthesis aesthetic --ar 16:9 --v 6
```

```
UX persona card design, clean infographic layout, user archetype for 
B2B business professional in India, goals and frustrations sections, 
behavioral insights, professional design research document --ar 4:3 --v 6
```

**Process/Wireframe artifact:**
```
Hand-drawn wireframe sketches on paper, mobile app screens, UX flows 
and annotations, flat lay photography on wooden desk, warm natural light, 
professional designer workspace aesthetic --ar 3:2 --v 6
```

### 3C. After running prompts
- [ ] 👤 Save all images to `apps/web/nidhi-portfolio/public/images/case-studies/tvplus/`
- [ ] 👤 Save all images to `public/images/case-studies/safex-lms/`
- [ ] 👤 Save all images to `public/images/case-studies/samsung-ds/`
- [ ] 👤 Share back with me so I can integrate in Session 5

---

## STAGE 4 — IMAGE INTEGRATION
> 🤖 Claude does this. Tell me "start Stage 4" when all images are in the public folder.

### Session 5 tasks
- [ ] 🤖 Update case study image paths in `constants/index.ts`
- [ ] 🤖 Add hero cover images to Work section cards
- [ ] 🤖 Add process images, final screens to each case study page
- [ ] 🤖 Add App Store badge + link to Golden Farms case study
- [ ] 🤖 Add "View Live Storybook →" link to Samsung DS case study

---

## STAGE 5 — TESTIMONIALS + VISUAL POLISH
> 🤖 Claude does this in Session 6.

### Session 6 tasks
- [ ] 🤖 Build Testimonials component with 3 cards
- [ ] 🤖 Add scroll animations to case study pages
- [ ] 🤖 Add "Back to portfolio" navigation on case study pages
- [ ] 🤖 Mobile responsiveness pass on all new pages
- [ ] 🤖 Fix any spacing/layout issues Nidhi has flagged

### Nishant/Nidhi review before Session 6
- [ ] 👤 🎨 Review all case study content — flag anything factually wrong
- [ ] 🎨 Approve testimonial wording (or provide real quotes)
- [ ] 🎨 Flag any sections that feel inaccurate to her actual process

---

## STAGE 6 — BEHANCE CONTENT
> 🤖 Claude writes all copy. 👤 Nishant uploads to Behance.

### Projects to publish (in order)
1. **Golden Farms** — with real App Store screenshots as the hero
2. **TVPlus Test Suite** — with generated screens, "screens recreated for confidentiality" note
3. **Samsung Design System** — Storybook link as the centerpiece
4. **Healing Urja Tarot Deck** — visual craft anchor
5. **Brand Identity Collection** — showcase of 2–3 strongest branding/packaging projects (once assets are shared)
6. **Additional standalone brand projects** — each strong identity gets its own post

### Session 7 tasks
- [ ] 🤖 Write full Behance copy for all 4 projects (ready to paste)
- [ ] 🤖 Write Behance profile bio + tagline
- [ ] 🤖 Specify exact image placement order for each project
- [ ] 🤖 Write project tags for SEO on Behance

### Nishant uploads to Behance
```
For each project:
1. Go to behance.net → Create new project
2. Title: [as specified]
3. Cover: Upload the generated cover image (1400×1050)
4. Add text + images in the order I specify
5. Add tags I provide
6. Set to Published
7. Copy the project URL → update in constants/index.ts
```

---

## STAGE 7 — RESUME
> 🤖 Claude builds as HTML. 👤 Nishant/Nidhi print to PDF.

### Session 8 tasks
- [ ] 🤖 Build `public/resume.html` — styled, 1-page, print-ready
- [ ] 🤖 ATS-friendly version as plain text (copy-paste into job applications)
- [ ] 👤 Open resume.html in Chrome → Print → Save as PDF → Save as `public/Nidhi-resume.pdf`

### Resume structure
```
NIDHI CHHIMWAL
Senior UI/UX Designer · Illustrator
Gurugram, India | nidhi.doodles@gmail.com | behance.net/... | portfolio URL

SUMMARY
[3 lines - research + systems + visual craft]

EXPERIENCE
Samsung Electronics — Senior Associate UI/UX Design (Dec 2023–Present)
• Designed TVPlus Test Suite UX used by Samsung's global content ops teams
• Defined design system adopted across 3 internal products (Figma + Storybook)
• Led end-to-end UX for intranet portal and LMS for Samsung Research Centre

Safex Chemicals — UI/UX Designer (Jun 2022–Dec 2023)
• Designed Golden Farms — live B2B e-commerce app, 15K+ active users (Play Store + App Store)
• Led UX for Admin Portal, LMS, and SAP Web Interface across Safex group
• Shipped 3 brand websites with full visual identity and UX overhaul

Liberty Shoes — Graphic Visualizer (Apr 2021–Mar 2022)
• Led campaign design driving 25% engagement lift across digital platforms

Mediamix — Graphic Designer (Mar–Jul 2020)

SKILLS
Design: Figma · Design Systems · Prototyping · User Research · Brand Identity · Packaging Design · Accessibility (WCAG 2.1)
Tools: Procreate · Illustrator · After Effects · Photoshop · InDesign · Miro · Storybook · ProtoPie

EDUCATION
B.Des — Doon University, Dehradun (2015–2019)
Advanced Certification in Persuasive UX Strategy — IIT Delhi
Human-Centered Design — University of Toronto
```

---

## STAGE 8 — FINAL POLISH + SEO
> 🤖 Claude does this in Session 9.

### Session 9 tasks
- [ ] 🤖 Add Open Graph meta tags (title, description, image) — critical for LinkedIn sharing
- [ ] 🤖 Add favicon if missing
- [ ] 🤖 Full mobile QA pass at 375px (iPhone SE)
- [ ] 🤖 Check all links work (Behance, App Store, Storybook, Resume download)
- [ ] 🤖 Performance check — lazy load images, check bundle size
- [ ] 🤖 Add `sitemap.xml` and `robots.txt` to public folder

---

## PROJECTS IN CONSTANTS (final list)

```ts
// Priority order in Work section:
1. golden-farms       ← HERO/FEATURED — live app, real users
2. tvplus             ← Samsung enterprise, global scale
3. samsung-ds         ← Design system, live Storybook
4. safex-lms          ← Enterprise LMS + admin portal
5. tarot              ← Visual craft — REAL resources available (card scans/photos)
6. liberty            ← Campaign design — REAL resources available (creative files)
7. alma               ← Editorial illustration — REAL resources available
8. mural              ← Public art, Govt. of India — REAL photo available
9. branding           ← Brand identities + packaging — Illustrator/AI files + PDFs exist (TBD how many)
```

### Freelance Resource Assembly (Nishant/Nidhi collects these)
- [ ] 👤🎨 Tarot deck: scan or photograph 5–8 cards + the physical box/packaging
- [ ] 👤🎨 ALMA Magazine: export or photograph 3–5 editorial illustration spreads
- [ ] 👤🎨 Liberty Shoes: find any saved campaign creatives, social posts, or GIF files
- [ ] 👤🎨 Mural: find the photo of the Namami Gange mural in Dehradun (even a phone photo is perfect)
- [ ] 👤🎨 Add all to `apps/web/nidhi-portfolio/public/images/freelance/`

---

## NOTES ON SAMSUNG CONFIDENTIALITY

**Safe to show:**
- UX process artifacts (wireframes, flows, personas) — these are design methodology, not IP
- Reconstructed/generated UI screens labelled *"screens recreated to protect confidentiality"*
- The Storybook deployed to Netlify with dummy/placeholder data only — no real Samsung data
- General project description: problem, approach, outcome (no internal service names or business metrics)

**Never show:**
- Real screenshots of internal Samsung dashboards with actual data
- Any internal tool names beyond what's publicly known about TVPlus
- Internal user counts, incident data, or business metrics from Samsung systems

**Standard disclaimer to add to Samsung case studies:**
> *"Screens have been recreated to protect confidential information. All metrics and outcomes are referenced with permission."*

---

## SESSION START PROTOCOL
> At the beginning of each session, tell me:
> 1. Which stage we're starting
> 2. What assets are now ready in the public folder
> 3. Any feedback/corrections from Nidhi on previous work
> 4. Anything Nishant remembered about a project that should update the content

---

## QUESTIONS STILL OPEN (answer when ready)

**For Nishant:**
- [ ] What is the exact Play Store / App Store URL for Golden Farms?
- [ ] What were the 3 biggest problems Golden Farms B2B users had with ordering?
- [ ] How many components are in the Samsung Storybook?
- [ ] What did the TVPlus chatbot do exactly (search tests? answer questions? run automations?)
- [ ] For the Safex Admin Portal — what Indian states were managed? What was the permit flow?

**For Nidhi — Freelance Resources:**
- [ ] Tarot deck: do the physical cards exist? Can she photograph them? Or does she have the Procreate/Illustrator files?
- [ ] ALMA Magazine: does she have the digital illustration files, or a physical copy of the magazine?
- [ ] Liberty Shoes: does she have the campaign creative files saved anywhere (Illustrator, GIFs, PNGs)?
- [ ] Mural: is there a photo on her phone from when she painted it?
- [ ] Any other freelance work not listed (packaging, logos, brand identities)?

**For Nidhi — General:**
- [ ] Does she have ANY physical photos — mural, tarot cards, sketches — even on her phone?
- [ ] What does she want her About bio to say in her own words?
- [ ] Is she comfortable with reconstructed Samsung screens saying "recreated for confidentiality"?
- [ ] Any real testimonial quotes she remembers hearing from managers or clients?
