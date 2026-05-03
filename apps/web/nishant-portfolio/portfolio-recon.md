# Portfolio Recon — `nishant-portfolio`

> Read-only reconnaissance pass. No files modified.  
> Working directory: `apps/web/nishant-portfolio/`  
> Produced: May 2026

---

## 1. Project Shape

| Dimension | Value |
|---|---|
| Framework | React **19.0.0** |
| Build tool | Vite **6.2.0** (`vite dev` → `localhost:5173`) |
| Language | TypeScript **~5.9.3** — strict mode on (`tsconfig.app.json`) |
| Routing | React Router **v7.14.0** — `BrowserRouter` + `Routes` |
| Styling | Tailwind CSS **v4** (via `@tailwindcss/vite` plugin) + CSS custom properties |
| Package manager | **pnpm** (workspace member of a Turborepo monorepo) |
| Package name | `three-d-portfolio-2025` (filter key for pnpm) |
| Deployment | No `vercel.json`, `netlify.toml`, or `homepage` field found. No deployment artifact visible. |

**Dev command:** `pnpm --filter three-d-portfolio-2025 dev`  
**Build command:** `tsc -b && vite build`

Notable: `index.html` references `src/main.jsx` but the actual entry is `src/main.tsx`. Vite resolves this silently — it works, but the mismatch is a papercut if you ever need to debug the entry point.

---

## 2. File Structure

```
src/
├── App.tsx                          # Root component — renders all sections in order
├── main.tsx                         # BrowserRouter + Routes entry point
├── index.css                        # All design tokens + Tailwind + utility classes
├── vite-env.d.ts                    # ImportMetaEnv (EmailJS keys)
│
├── articles/                        # Long-form blog posts
│   ├── index.ts                     # ArticleMeta[] + loadArticle() loader
│   ├── plugin-onboarding-vite-module-federation.md
│   └── one-protocol-two-surfaces.md
│
├── case-studies/                    # Project deep-dives
│   ├── index.ts                     # CaseStudyMeta[] array
│   ├── headless-dashboard-library.md
│   └── ui-component-library.md
│
├── components/
│   ├── AnimatedCounter.tsx          # Numbers strip (GSAP, 4 metrics)
│   ├── Button.tsx                   # Legacy scroll-to CTA (not used in current hero)
│   ├── ExpContent.tsx               # Appears unused — legacy
│   ├── GlowCard.tsx                 # Mouse-tracking glow card (Experience section)
│   ├── NavBar.tsx                   # Sticky nav — hash links + theme toggle
│   ├── ThemeToggle.tsx              # Light/dark toggle button
│   ├── TitleHeader.tsx              # Editorial section header (num / label / h2)
│   └── models/
│       ├── contact/                 # ContactExperience, Computer (Three.js)
│       ├── hero_models/             # HeroExperience, Room, Particles, HeroLights
│       └── tech_logos/              # TechIconCardExperience, TechStackScene
│
├── constants/
│   ├── index.ts                     # Re-exports everything
│   ├── abilities.ts                 # 4 capability blocks (WiredFor section data)
│   ├── experience.ts                # expCards[] — Samsung / Safex / DevsLane
│   ├── navigation.ts                # navLinks[] — Work / Experience / Writing / Stack / About
│   ├── personal.ts                  # personalInfo — name, email, socials, bio
│   ├── projects.ts                  # words[] for hero slider, projects[] (legacy)
│   └── skills.ts                    # techStackIcons[], counterItems[] (4 metrics)
│
├── context/
│   └── ThemeContext.tsx             # ThemeProvider — class on <html> (.dark / .light)
│
├── hooks/
│   └── usePerformanceMonitor.ts    # Appears unused — leftover hook
│
├── pages/
│   ├── ArticlePage.tsx             # /writing/:slug reader
│   └── CaseStudyPage.tsx           # /work/:slug reader
│
├── sections/                        # All home-page sections (rendered by App.tsx)
│   ├── Hero.tsx
│   ├── LogoShowcase.tsx
│   ├── FeatureCards.tsx             # "What I'm wired for" — 4 editorial blocks
│   ├── ShowcaseSection.tsx          # "Things I've shipped" — 6 case-study rows
│   ├── Experience.tsx               # Timeline with GlowCard
│   ├── TechStack.tsx                # Category-grouped stack list
│   ├── Writing.tsx                  # 3 article cards
│   ├── Testimonials.tsx             # "About" — bio + impact metrics
│   ├── Contact.tsx                  # EmailJS form + 3D model
│   └── Footer.tsx                   # Colophon + link list
│
└── types/
    └── index.ts                     # Shared TS interfaces
```

**No `content/`, `posts/`, `data/`, or MDX directory.** Markdown lives in `src/articles/` and `src/case-studies/` and is imported as raw strings via Vite's `?raw` query.

---

## 3. Design System and Tokens

Fonts are loaded in `index.html` via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1
  &family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400
  &family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
```

All tokens live in `src/index.css` as CSS custom properties:

```css
/* Light mode (:root) */
--bg-primary:    #ffffff;
--bg-secondary:  #f3f4f6;
--text-primary:  #111827;
--text-secondary: #4b5563;
--text-muted:    #6b7280;
--border-color:  #d1d5db;
--accent-primary: #3b82f6;     /* blue — used for interactive elements */
--accent-warm:   #B7411F;      /* burnt persimmon — headings, accents, links */
--accent-warm-hover: #8B2F18;
--rule:          var(--border-color);

/* Dark mode (.dark) */
--bg-primary:    #000000;
--bg-secondary:  #1c1c21;
--text-primary:  #ffffff;
--accent-primary: #4cc9f0;
--accent-warm:   #E85D2F;      /* lighter persimmon for dark bg */
--rule:          #282732;

/* Type system */
--font-display: 'Instrument Serif', Georgia, serif;
--font-body:    'Mona Sans', -apple-system, sans-serif;
--font-mono:    'JetBrains Mono', 'SF Mono', monospace;
```

**Editorial utility classes** (defined in `index.css`, used across all section components):

| Class | What it does |
|---|---|
| `.display-headline` | Instrument Serif, weight 400, tight tracking — used for all h1/h2 |
| `.display-headline em` | Italic + `--accent-warm` color |
| `.mono-label` | JetBrains Mono, 0.78rem, uppercase, 0.1em tracking |
| `.section-eyebrow` | Same as mono-label but `--accent-warm` color — "01 / Section name" |
| `.editorial-tag` | Mono pill with border — used for tech tags |
| `.impact-number` | Display serif in `--accent-warm` — used in numbers strip |
| `.ruled-top` / `.ruled-bottom` | 1px solid `--rule` borders |
| `.availability-dot` | Green pulsing dot (CSS animation) |
| `.numbers-strip` | 4-column grid with ruled borders |
| `.cap-block` | 2-column editorial grid (label + content) |
| `.case-row` | Full-width row with hover shade |
| `.stack-layout` | 2-column grouped stack list |
| `.hero-meta-strip` | Mono meta row with ruled top |

**Dark mode mechanism:** `ThemeContext` toggles a `.dark` / `.light` class on `document.documentElement`. Tailwind v4's `@custom-variant dark (&:where(.dark, .dark *))` picks this up. Default is `"light"` (localStorage key `"theme"`).

**Verdict on token fidelity:** The burnt persimmon accent (`#B7411F`) and all three fonts (Instrument Serif, JetBrains Mono, Mona Sans) are fully preserved and actively used. The background in light mode is white (#ffffff) rather than the warm cream (#FAF7F2) from the original HTML reference — this is the one divergence from the HTML design.

---

## 4. Pages and Their Content

### Route: `/` — Home (SPA)

File: `src/App.tsx` — renders all sections sequentially, wrapped in `ThemeProvider`.

Section render order:

| Section component | ID | Content |
|---|---|---|
| `NavBar` | — | Sticky nav — hash links to sections + theme toggle + "Hire me" |
| `Hero` | `#hero` | Serif headline with word slider, availability badge, 3D room model, numbers strip |
| `LogoShowcase` | — | Mono text strip: "Experience at Samsung Electronics · Safex Chemicals · DevsLane" |
| `FeatureCards` | `#wired-for` | 4 editorial blocks: Architecture / DX & AI / Design Systems / Leadership |
| `ShowcaseSection` | `#work` | 6 numbered case-study rows with metrics, tags, "Read case study" links |
| `Experience` | `#experience` | Timeline with GlowCard — 3 jobs (Samsung / Safex / DevsLane) |
| `TechStack` | `#skills` | Category-grouped mono text list (6 groups) |
| `Writing` | `#writing` | 3 article cards — 2 are `<Link>` components to real routes |
| `Testimonials` | `#about` | Editorial two-column: bio + impact metrics + "Open to" list |
| `Contact` | `#contact` | EmailJS form + 3D contact model |
| `Footer` | — | Serif CTA + dashed link list + colophon |

### Route: `/writing/:slug` — Article reader

File: `src/pages/ArticlePage.tsx`  
Lazy-loaded. Reads slug from URL params, looks up metadata in `src/articles/index.ts`, dynamically imports `.md?raw`. Renders with ReactMarkdown + rehype-highlight.

**Existing articles:**

| Slug | Status | File |
|---|---|---|
| `plugin-onboarding-vite-module-federation` | published | `src/articles/plugin-onboarding-vite-module-federation.md` |
| `one-protocol-two-surfaces` | draft | `src/articles/one-protocol-two-surfaces.md` |

### Route: `/work/:slug` — Case study reader

File: `src/pages/CaseStudyPage.tsx`  
Same pattern as ArticlePage. Metadata from `src/case-studies/index.ts`. Adds a meta grid header (Role / Period / Status / Stack) before the body.

**Existing case studies:**

| Slug | File |
|---|---|
| `headless-dashboard-library` | `src/case-studies/headless-dashboard-library.md` |
| `ui-component-library` | `src/case-studies/ui-component-library.md` |

### Writing section card data

`src/sections/Writing.tsx` — cards are hardcoded as a local `articles` array with `link` pointing to `/writing/:slug`. This array is **separate** from `src/articles/index.ts` — a writer adding a new article must update **both** files or the card won't appear and/or the page won't render.

### ShowcaseSection link status

Rows with `caseStudyLink` render "Read case study →" as a `<Link>`. Rows without it are non-clickable divs. Current state:

| Row | External link | Case study page |
|---|---|---|
| 01 TVPlus TestSuite | ✗ | ✗ |
| 02 Headless Dashboard Library | ✗ | ✓ `/work/headless-dashboard-library` |
| 03 Shared UI Library | ✓ Live Storybook | ✓ `/work/ui-component-library` |
| 04 AI-driven MCP tooling | ✗ | ✗ |
| 05 Golden Farms | ✓ Play Store | ✗ |
| 06 SAP + LMS | ✗ | ✗ |

---

## 5. Markdown / Content Handling

**Fully set up.** All libraries are installed and in production use:

| Library | Version | Role |
|---|---|---|
| `react-markdown` | ^10.1.0 | Core markdown → React renderer |
| `remark-gfm` | ^4.0.1 | GitHub Flavored Markdown (tables, strikethrough) |
| `rehype-highlight` | ^7.0.2 | Code block syntax highlighting |
| `highlight.js` | ^11.11.1 | Highlight.js base (theme: `github-dark-dimmed.css`) |

**No frontmatter parser** (`gray-matter`, `front-matter`, etc.). Frontmatter was stripped from source `.md` files before saving — metadata lives separately in the `index.ts` files for each content type.

**Loading pattern** (both ArticlePage and CaseStudyPage):

```typescript
import(`../articles/${slug}.md?raw`)
  .then((mod) => setContent(mod.default))
```

Vite's `?raw` query imports file content as a plain string. Dynamic imports with template literals work in Vite only when the path prefix is static — `../articles/` is static, `${slug}` is the variable part. This works but means all `.md` files must live in the correct directory for the import to resolve.

**Article body styles** are defined as a `<style>` block inside each page component (both `ArticlePage.tsx` and `CaseStudyPage.tsx`), scoped to `.article-body`. Styles cover: h1 (hidden for case studies), h2, h3, p, strong, em, a, ul/ol/li, blockquote, inline code, pre+code, table, hr. Dark mode overrides included.

**To add a new article:** drop a `.md` file in `src/articles/`, add an entry to `src/articles/index.ts`, and add a card entry to the `articles` array in `src/sections/Writing.tsx`.

**To add a new case study:** drop a `.md` file in `src/case-studies/`, add an entry to `src/case-studies/index.ts`, add `caseStudyLink` to the relevant row in `src/sections/ShowcaseSection.tsx`.

---

## 6. Components Inventory

| Component | File | Renders | Used in |
|---|---|---|---|
| `TitleHeader` | `components/TitleHeader.tsx` | Editorial section header: mono eyebrow + serif h2 | All 8 content sections |
| `NavBar` | `components/NavBar.tsx` | Sticky nav with hash links, theme toggle, "Hire me" CTA | App.tsx root |
| `ThemeToggle` | `components/ThemeToggle.tsx` | Light/dark toggle icon button | NavBar |
| `AnimatedCounter` | `components/AnimatedCounter.tsx` | 4-metric numbers strip with GSAP count-up animation | Hero section |
| `GlowCard` | `components/GlowCard.tsx` | Mouse-tracking card with rotating border glow | Experience section |
| `Button` | `components/Button.tsx` | Scroll-to-section animated CTA | Unused in current hero (legacy) |
| `ExpContent` | `components/ExpContent.tsx` | — | Appears unused (dead file) |
| `HeroExperience` | `components/models/hero_models/` | Three.js/Fiber 3D room scene | Hero section |
| `ContactExperience` | `components/models/contact/` | Three.js/Fiber 3D computer model | Contact section |
| `TechStackScene` | `components/models/tech_logos/` | 3D rotating tech logo cards | TechStack section (if enabled) |

**No Container, Prose wrapper, or Layout shell component exists.** Article and case study pages handle their own layout inline with `style` props and the `.article-body` CSS class.

---

## 7. SEO, Meta, and OG Handling

**Single global `<title>` and `<meta description>` in `index.html` — no per-page meta.**

```html
<title>Nishant Chaudhary — Senior Frontend Engineer</title>
<meta name="description" content="Senior Frontend Engineer building micro-frontend platforms..." />
```

- No `react-helmet`, `react-helmet-async`, or any head management library.
- No OG image. No Twitter card image. No `og:image` meta.
- No OG image generation script.
- Article and case study pages at `/writing/:slug` and `/work/:slug` share the same title and description as the home page — search engines and link previews will show "Nishant Chaudhary — Senior Frontend Engineer" for all URLs.

**This is the biggest SEO gap.** If the articles are meant to rank or be shared, per-page title/description is essential.

---

## 8. Navigation and Layout Shell

**There is no `<Layout>` component.** The SPA home page is assembled in `App.tsx` directly. Article and case study pages have their own self-contained top bar (not `NavBar`).

**NavBar** (`src/components/NavBar.tsx`):
- Rendered only on the home page (via `App.tsx`)
- Uses hash links — clicking "Work" scrolls to `#work` on the home page
- Article/case study pages have their own minimal sticky bar with a "← Writing" or "← Work" link
- To add a new nav item, edit `src/constants/navigation.ts` — the `navLinks` array

Current nav links:
```typescript
{ name: "Work",       link: "#work" },
{ name: "Experience", link: "#experience" },
{ name: "Writing",    link: "#writing" },
{ name: "Stack",      link: "#skills" },
{ name: "About",      link: "#about" },
```

**Footer** (`src/sections/Footer.tsx`):
- Only on the home page
- Links: LinkedIn, GitHub, email, phone — data from `src/constants/personal.ts`
- Article/case study pages have their own inline footer (email CTA + back link)

---

## 9. What's Deployed and What's Local

- **No deployment config found** (`vercel.json`, `netlify.toml`, `.vercel/`, `homepage` in `package.json` — none present).
- **Local dev** runs on `localhost:5173` by default (standard Vite). No custom port set in `vite.config.ts`.
- Lives inside a **pnpm Turborepo monorepo** at `apps/web/nishant-portfolio/`. Run with `pnpm --filter three-d-portfolio-2025 dev`.
- GitHub remote: `https://github.com/Nishant-Chaudhary5338/Monorepo.git` (inferred from git config — full monorepo, not just this app).

---

## 10. Anything Unusual

**1. `index.html` references `src/main.jsx`, actual file is `src/main.tsx`.**  
Vite resolves this silently on macOS (case-insensitive filesystem). Would break on Linux CI. Low risk for now; worth noting.

**2. Duplicated article data — two sources of truth.**  
`src/sections/Writing.tsx` has a hardcoded `articles[]` array for the cards. `src/articles/index.ts` has a separate `articleMeta[]` array for the page reader. Adding a new article requires editing both. They're not linked — silent mismatch is possible.

**3. NavBar uses hash links; article pages are at real routes.**  
When a user navigates to `/writing/plugin-onboarding-vite-module-federation`, the NavBar is not rendered — the article page has its own minimal bar. If a user is on an article and clicks "← Writing", they go to `/#writing` (the home page writing section). This is intentional but means there's no persistent top nav across the site.

**4. `ExpContent.tsx` and `usePerformanceMonitor.ts` appear to be dead code.**  
Neither is imported anywhere visible. Safe to remove if desired.

**5. Article body styles are duplicated.**  
Both `ArticlePage.tsx` and `CaseStudyPage.tsx` contain a `<style>` block with `.article-body` CSS. They're near-identical. If you style one, you must update the other. Extracting to a shared CSS class in `index.css` would be cleaner.

**6. No SEO/OG per-page handling.**  
This is a meaningful gap for any article that's meant to be shared. React Helmet Async is the standard fix.

**7. Three.js models load on every page visit.**  
`HeroExperience` (Room + Particles) and `ContactExperience` (Computer) are 3D models loaded at runtime. They add weight to the initial bundle and may cause mobile performance issues. No lazy-loading or `react-responsive` guard on the 3D scenes was found in the current sections.

---

## Quick Reference for the Writer

**Framework + version:** React 19 + Vite 6 + TypeScript 5.9, pnpm, Tailwind v4.

**Five files to read first, cold:**
1. `src/main.tsx` — routes, lazy page loading
2. `src/App.tsx` — section render order
3. `src/index.css` — all design tokens and editorial utilities
4. `src/articles/index.ts` — how content metadata is registered
5. `src/pages/ArticlePage.tsx` — the full article reader pattern

**Biggest unknown:** There is no deployment config. The site has never been deployed as a standalone app — it lives inside a monorepo with no Vercel/Netlify setup. Before publishing articles to a real URL, the writer should clarify: where does this deploy, and does it need a custom domain configuration?

**One-paragraph summary:**  
This is a React 19 SPA built with Vite and Tailwind v4, living as one app in a larger pnpm monorepo. The home page is a single long-scroll editorial portfolio with 10 sections, each rendered as its own component in `src/sections/`. On top of this SPA is a small routing layer (React Router v7) that handles two additional routes: `/writing/:slug` for long-form articles and `/work/:slug` for case studies. Both routes lazy-load their page components and render raw Markdown using `react-markdown` + `rehype-highlight`. Content lives in `src/articles/` and `src/case-studies/` as plain `.md` files alongside a TypeScript metadata index. The design system is entirely CSS custom properties consumed by Tailwind utility classes, with Instrument Serif for display headlines, JetBrains Mono for labels, and a burnt persimmon accent (`#B7411F`) as the visual signature. Dark/light mode is toggled by adding a class to `<html>`. There is no per-page SEO handling, no deployment configuration, and no Layout shell shared between the home page and the article/case study pages.
