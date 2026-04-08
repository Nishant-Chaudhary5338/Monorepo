# Nidhi Chhimwal — Portfolio Design Direction
## "Precision & Soul" · v3

Enterprise precision meets illustrator warmth.
**Light Mode is the primary experience.** Dark Mode is a first-class alternative, not an afterthought.
Plain Mode is the default layer — striking without depending on motion.

---

## Philosophy

Most designer portfolios default dark because it feels "premium." That's the trap.
A confident light-mode portfolio stands out precisely because it's rare — and it demands
real typographic and spatial craft, not atmosphere borrowed from a dark background.

Nidhi's work spans Samsung-scale enterprise UX and personal illustration.
Light Mode expresses the rigor. Dark Mode expresses the soul. Both are complete.

**The toggle is not a gimmick — it's a design statement:** this portfolio is considered
in both registers. Hire a designer who thinks about both.

---

## Theme Architecture

```
:root                        → Light Mode tokens (default)
[data-theme="dark"]          → Dark Mode overrides
```

One CSS variable system. No duplicated components. No `dark:` class proliferation.
The toggle flips `data-theme` on `<html>`. Preference saved to `localStorage`.

Respect `prefers-color-scheme` on first visit — if user has no stored preference,
inherit from OS. After manual toggle, localStorage wins.

```js
// Theme init — runs before paint (in <head>, before JS bundle)
const stored = localStorage.getItem('theme');
const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', stored ?? system);
```

---

## Complete Token System

### Semantic Color Tokens

```css
:root {
  /* ── Backgrounds ── */
  --bg-base:          #F7F5F0;   /* warm off-white — not pure white, feels printed */
  --bg-surface:       #EFEDE8;   /* card/panel level — 1 step darker */
  --bg-sunken:        #E8E5DE;   /* input bg, code blocks */
  --bg-overlay:       rgba(247, 245, 240, 0.88); /* frosted glass nav */

  /* ── Borders ── */
  --border-subtle:    #DDD9D0;   /* hairline dividers */
  --border-default:   #C8C4BB;   /* card outlines, inputs */
  --border-strong:    #A09990;   /* focused states */

  /* ── Text ── */
  --text-primary:     #1A1814;   /* near-black, warm — not #000 */
  --text-secondary:   #4A4742;   /* body copy */
  --text-muted:       #8A8580;   /* labels, metadata, timestamps */
  --text-inverse:     #F7F5F0;   /* text on dark surfaces */

  /* ── Accent — Purple ── */
  --accent-purple:    #5B4EE8;   /* primary CTA, links, highlights */
  --accent-purple-light: #EAE8FC; /* tint bg on hover */
  --accent-purple-dark:  #3D32C4; /* pressed state */

  /* ── Accent — Gold ── */
  --accent-gold:      #B8923A;   /* stats, decorative rule, one pull word */
  --accent-gold-light:#FBF3E2;   /* tint bg */

  /* ── Accent — Rose ── */
  --accent-rose:      #C4556A;   /* illustration tag, secondary badge */
  --accent-rose-light:#FDEEF1;

  /* ── Utility ── */
  --shadow-card:      0 1px 3px rgba(26,24,20,0.07),
                      0 4px 16px rgba(26,24,20,0.05);
  --shadow-elevated:  0 8px 32px rgba(26,24,20,0.10);
  --noise-opacity:    0.03;
  --radius-card:      0px;       /* sharp — editorial print feel */
  --radius-pill:      999px;     /* tags only */
  --radius-btn:       4px;       /* buttons */
}

[data-theme="dark"] {
  /* ── Backgrounds ── */
  --bg-base:          #09090B;
  --bg-surface:       #111113;
  --bg-sunken:        #0D0D0F;
  --bg-overlay:       rgba(9, 9, 11, 0.88);

  /* ── Borders ── */
  --border-subtle:    #1E1E22;
  --border-default:   #2A2A30;
  --border-strong:    #3E3E48;

  /* ── Text ── */
  --text-primary:     #F4F3EF;
  --text-secondary:   #B8B6B0;
  --text-muted:       #6B6A72;
  --text-inverse:     #1A1814;

  /* ── Accent — Purple ── */
  --accent-purple:    #7C6AF7;
  --accent-purple-light: #1C1838;
  --accent-purple-dark:  #9A8BFF;

  /* ── Accent — Gold ── */
  --accent-gold:      #C9A96E;
  --accent-gold-light:#1E1608;

  /* ── Accent — Rose ── */
  --accent-rose:      #D4758A;
  --accent-rose-light:#200B10;

  /* ── Utility ── */
  --shadow-card:      0 1px 3px rgba(0,0,0,0.4),
                      0 4px 16px rgba(0,0,0,0.3);
  --shadow-elevated:  0 8px 32px rgba(0,0,0,0.5);
  --noise-opacity:    0.025;
}
```

### Motion Tokens

```css
:root {
  --ease-out:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast:   150ms;
  --duration-base:   280ms;
  --duration-slow:   500ms;
  --duration-theme:  400ms; /* theme transition — slightly slower, feels intentional */
}
```

### Theme Transition Rule

When toggling theme, ALL color properties transition smoothly:

```css
*, *::before, *::after {
  transition:
    background-color var(--duration-theme) var(--ease-in-out),
    border-color     var(--duration-theme) var(--ease-in-out),
    color            var(--duration-theme) var(--ease-in-out),
    box-shadow       var(--duration-theme) var(--ease-in-out);
}
```

**Exception:** Disable this transition during page load (add `.no-transition` to `<html>`,
remove after 1 frame) to prevent flash.

---

## Typography — Identical Across Themes

Font choices do not change between light and dark. Weights stay the same.
Only color tokens change.

```
Display:   Playfair Display · Italic · 900   — headlines, pull quotes
UI:        DM Sans · SemiBold · 600          — nav, labels, buttons
Body:      DM Sans · Regular · 400           — paragraphs, descriptions
Mono:      JetBrains Mono · 400             — tags, tech stack, meta, indices
```

### Type Scale (use exactly — no improvising)

```
Hero name:         clamp(7rem, 14vw, 13rem)   Playfair Italic 900
Section title:     clamp(2.8rem, 5vw, 4.8rem) Playfair Italic 900
Card title:        1.5rem                      DM Sans 600
Pull quote:        clamp(1.8rem, 3vw, 2.8rem) Playfair Italic 900
Body:              1rem / 1.75                 DM Sans 400
Label / section#:  0.72rem / ls 0.12em / UC   JetBrains Mono 400
Tag / pill:        0.7rem / ls 0.08em / UC     JetBrains Mono 400
Caption / meta:    0.75rem                     JetBrains Mono 400
```

### Rule of One Giant Thing

Every section has exactly one element at an extreme scale.
Two large things in one section = competition, not hierarchy.

---

## Light Mode — Primary Design (Detailed)

### Design Character

Light Mode is **editorial print**, not "clean app UI."
Think: Kinfolk magazine × Pentagram case study × Swiss grid.
The background is warm off-white (`#F7F5F0`), not white — it photographs like paper.
Type is near-black (`#1A1814`), not pure black — it reads like ink.

### Light Mode Hero — Exact Layout

```
Viewport: 100vw × 100svh

[ NIDHI          ]   ← Playfair Italic · clamp(7rem,14vw,13rem) · text-primary
[       CHHIMWAL ]   ← right-aligned same scale · 4rem gap below first line

Between the two name lines, left-anchored:
[ Product Designer  ·  Illustrator  ·  Researcher ]
  ↑ DM Sans 600 · 0.8rem · muted · letter-spacing 0.18em · uppercase

Bottom-left:
[ 01 — Currently designing @ Samsung Research ]
  ↑ JetBrains Mono · 0.72rem · muted

Bottom-right: project image crop · 340×420px · sharp corners ·
              border: 1px solid var(--border-default)

Bottom-center: [ ↓ Scroll ] · 0.7rem mono · muted · 60% opacity

Background:  --bg-base (#F7F5F0)
No gradients. No shapes. Name IS the visual.
```

### Light Mode Color Moments

Light Mode avoids per-section background color changes.
Depth comes from surface cards, not background shifts.

```
All sections: --bg-base
Cards/panels: --bg-surface
Sunken areas: --bg-sunken
```

One exception — the Contact section gets a full-width `--bg-surface` band (not a color).
This creates a contained "room" feeling without a color shift.

### Light Mode Accent Usage Rules

```
--accent-purple   → one CTA button, active nav item, link hover underline, one highlight word per section
--accent-gold     → stat numerals, one decorative horizontal rule (1px, 80px wide), section index numbers
--accent-rose     → illustration / personal work tags only
```

**Purple and gold never appear in the same visual cluster.**
Accent colors are signals, not decoration. If something is purple, it means something.

---

## Dark Mode — First-Class Alternative

Dark Mode is NOT inverted light mode. It has its own character.
Dark = **studio at night** — warmer, more atmospheric, more personal.

### Dark Mode Character Differences

| Element | Light Mode feel | Dark Mode feel |
|---|---|---|
| Hero | Printed editorial | Type glowing out of darkness |
| Cards | Paper surfaces, ink type | Glass surfaces, lit type |
| Dividers | Ink rules on paper | Barely-there lines |
| Gold accent | Warm ink | Amber light |
| Purple accent | Print color | Neon depth |
| Noise overlay | 0.03 opacity | 0.025 opacity |

### Dark Mode Glass Cards

In dark mode only, cards get a glass treatment:

```css
[data-theme="dark"] .card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(12px);
}
```

Light mode cards use solid `--bg-surface` — no glass. Glass on light = muddy.

---

## Theme Toggle — Component Spec

### Visual Design

The toggle lives in the top-right of the nav. It is **not** a sun/moon icon button.
It is a small **pill switch** — 48×26px — that slides between states.

```
Light state:  [  ○ ●  ]  ← pill bg: --border-default, knob: --text-primary
Dark state:   [  ● ○  ]  ← pill bg: --accent-purple, knob: --text-inverse
```

- Knob transition: `transform 250ms var(--ease-out)`
- The pill itself is the only element that doesn't use `--duration-theme` —
  it moves at `250ms` independent of the theme sweep.

No label text beside the toggle. Accessible via `aria-label="Toggle theme"` and
`role="switch"` + `aria-checked`.

### Toggle Implementation

```html
<button
  class="theme-toggle"
  role="switch"
  aria-checked="false"
  aria-label="Toggle color theme"
  onclick="toggleTheme()"
>
  <span class="toggle-knob"></span>
</button>
```

```css
.theme-toggle {
  width: 48px;
  height: 26px;
  border-radius: var(--radius-pill);
  background: var(--border-default);
  border: 1px solid var(--border-strong);
  position: relative;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}
.theme-toggle[aria-checked="true"] {
  background: var(--accent-purple);
  border-color: var(--accent-purple-dark);
}
.toggle-knob {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--text-primary);
  position: absolute;
  top: 3px; left: 3px;
  transition: transform 250ms var(--ease-out),
              background var(--duration-theme) var(--ease-in-out);
}
.theme-toggle[aria-checked="true"] .toggle-knob {
  transform: translateX(22px);
  background: var(--text-inverse);
}
```

```js
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.querySelector('.theme-toggle')
    .setAttribute('aria-checked', next === 'dark' ? 'true' : 'false');
}
```

---

## Layout System — Shared Across Both Themes

### Grid

```
Max width:     1320px
Columns:       12
Gutters:       clamp(1.5rem, 4vw, 3.5rem)
Left offset:   1 col (8.33%) — content rarely starts at edge
```

### Section Anatomy (every section, every theme)

```
[ 01 — SECTION NAME ]    ← JetBrains Mono · 0.72rem · muted · uppercase
[ Section Title      ]   ← Playfair Italic · clamp(2.8rem,5vw,4.8rem)
[ horizontal rule    ]   ← 1px · --border-subtle · full width · 2rem margin below title
[ content            ]
```

Section index numbers (`01 —`, `02 —`) are in `--accent-gold`.
Section title is `--text-primary`.

### Spacing Scale

```
--space-xs:   0.5rem
--space-sm:   1rem
--space-md:   2rem
--space-lg:   4rem
--space-xl:   8rem
--space-2xl:  14rem
```

Section vertical padding: `--space-xl` top, `--space-xl` bottom.
Between section label and title: `--space-sm`.
Between title and rule: `--space-md`.

---

## Project Cards — Both Themes

### Layout

```
┌────────────────────────────────────────────────┐
│  [ IMAGE · 4:3 ratio · sharp corners         ] │
│    1px border: --border-default                │
│                                                │
│  SAMSUNG HEALTH  ·  UX + Visual Design      →  │
│  ↑ DM Sans 600 · 1.4rem · --text-primary       │
│  ↑ JetBrains Mono · 0.72rem · --text-muted     │
│                                                │
│  Redesigning onboarding for 200M+ users        │
│  across 8 markets. 2 lines max.                │
│  ↑ DM Sans 400 · 0.9rem · --text-secondary     │
│                                                │
│  2024  ·  6 months               [ UX  ] [SYS ]│
│  ↑ mono · muted · right-aligned   ↑ pills      │
└────────────────────────────────────────────────┘
```

### Card Hover — Light Mode

```
Default:   border: 1px solid var(--border-default);  shadow: var(--shadow-card)
Hover:     border-left: 3px solid var(--accent-purple)
           image: filter brightness(1.04)
           arrow: rotate(45deg) · color: --accent-purple
           transition: all 220ms var(--ease-out)
```

### Card Hover — Dark Mode

```
Default:   border: 1px solid var(--border-subtle);  background: rgba(255,255,255,0.03)
Hover:     border-left: 3px solid var(--accent-purple)
           background: rgba(255,255,255,0.05)
           image: filter brightness(1.06)
           transition: all 220ms var(--ease-out)
```

### Grid Layout

```
Featured (first):   col-span-12 · image left 7 cols · text right 5 cols · horizontal
Row 2+:             7-col card + 4-col card (swap each row)
Mobile (<768px):    col-span-12 · vertical stack · image full width
```

---

## Hero — Both Themes

```css
/* Light */
.hero { background: var(--bg-base); }
.hero-name { color: var(--text-primary); }

/* Dark — name gets a near-imperceptible text-shadow to feel lit */
[data-theme="dark"] .hero-name {
  text-shadow: 0 0 120px rgba(124, 106, 247, 0.15);
}
```

Project image in hero:

```css
.hero-image {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);  /* sharp */
  /* Light: slight shadow grounds it */
  box-shadow: var(--shadow-elevated);
}
[data-theme="dark"] .hero-image {
  box-shadow: 0 0 0 1px var(--border-subtle),
              0 24px 48px rgba(0,0,0,0.5);
}
```

---

## Navigation

Fixed top · full width · `--bg-overlay` backdrop · `border-bottom: 1px solid var(--border-subtle)`

```
[ N — ]          [ Work   About   Process   Contact ]   [ ● ]
  ↑ mono 0.8rem    ↑ DM Sans 600 · 0.85rem · spaced      ↑ theme toggle
```

`N —` is the logo mark in `--accent-purple`. On dark mode it stays `--accent-purple`
(darker value) — it's the one element with accent color always visible.

Active nav item: `--accent-purple` · 1px underline offset 4px.
Hover: `--text-primary` · same underline · `180ms ease`.

Mobile: hamburger (3 lines → X) · full-screen overlay menu in `--bg-base`/`--bg-sunken`.

---

## About Section — Both Themes

### Layout

```
Left 5 cols:                          Right 6 cols (offset 1):
[ 02 — ABOUT ]                        [ "The best work lives
[ Section title ]                       at the edge of two
[ rule ]                                disciplines." ]
[ body copy ]                         ↑ Playfair Italic · 2.8rem · --text-primary
[ photo — 1:1 sharp corners ]         Below quote: attribution
                                      [ — Nidhi Chhimwal ]
                                        ↑ mono · 0.72rem · muted
```

Pull quote word: "two" is in `--accent-gold`. One word. That's it.

### Stats Row (below the two-col layout)

```
[ 4+ ]   [ 12+ ]   [ 200M+ ]   [ 3 ]
Years     Projects  Users        Countries

↑ Playfair Italic · 3.5rem · --accent-gold
↑ DM Sans 600 · 0.8rem · --text-muted · below numeral
```

Hairline `--border-subtle` vertical dividers between stats.

---

## Skills Section — Both Themes

Replace bento AND replace tag pills. Use a **ruled columnar list**.

```
[ 03 — SKILLS ]
[ Disciplines  ]
[ ───────────────────────────────────────── ]

UX Research                          4 years
Visual Design                        3 years
Illustration                         6 years
Design Systems                       2 years
[ ───────────────────────────────────────── ]
Prototyping & Tools
[ ───────────────────────────────────────── ]
Figma  ·  Framer  ·  Illustrator  ·  Lottie
[ ───────────────────────────────────────── ]
Currently learning
[ ───────────────────────────────────────── ]
Motion Design  ·  3D in Spline
```

Each row: name `--text-primary` DM Sans 600 left · years `--text-muted` mono right · 1px `--border-subtle` divider.
Category headers: mono 0.72rem uppercase muted.
This reads like a CV table. More Pentagram than Dribbble. Works perfectly in both themes.

---

## Process Section — Both Themes

```
[ 04 — PROCESS ]
[ How I work   ]
[ rule         ]

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 01           │  │ 02           │  │ 03           │  │ 04           │
│              │  │              │  │              │  │              │
│ Discover     │  │ Define       │  │ Design       │  │ Deliver      │
│              │  │              │  │              │  │              │
│ Research,    │  │ Synthesis,   │  │ Iteration,   │  │ Handoff,     │
│ interviews,  │  │ problem      │  │ prototyping, │  │ QA, measure  │
│ heuristics   │  │ framing      │  │ testing      │  │ outcomes     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

Step number: `--accent-gold` · mono · 1rem
Title: DM Sans 600 · 1.2rem · `--text-primary`
Body: DM Sans 400 · 0.9rem · `--text-secondary`
Card bg: `--bg-surface` · border: `--border-subtle` · padding: 2rem
Dark mode adds glass treatment.

---

## Contact Section — Both Themes

```
Full-width band: --bg-surface (both themes — it's a relative shift, not a color)

[ 05 — CONTACT ]
[ Let's make    ]     ← Playfair Italic · clamp(3rem,6vw,6rem)
[ something. ]        ← "something." in --accent-purple

Below:
[ hello@nidhichhimwal.com ]  [ LinkedIn ↗ ]  [ Resume ↗ ]
  ↑ DM Sans 600 · 1.1rem     ↑ same            ↑ same

Hover: 1px underline · offset 4px · --accent-purple · 180ms

Bottom of section:
[ © 2025 Nidhi Chhimwal ]  [ Designed & built by Nidhi ]
  ↑ mono · 0.72rem · muted                     right-aligned
```

No radial glow in either theme. The type at scale is the moment.

---

## Image Treatment — Both Themes

```
Aspect ratios:   4:3 cards  ·  16:9 featured  ·  1:1 about photo
Corners:         Sharp (border-radius: 0) — always
Border:          1px solid var(--border-default)

Light hover:     brightness(1.04) · border-color → --accent-purple · 220ms
Dark hover:      brightness(1.07) · border-color → --accent-purple · 220ms

Caption format:  Project Name  ·  Year  ·  Role
Caption style:   JetBrains Mono · 0.72rem · --text-muted · margin-top: 0.75rem
```

No border-radius. No shadows on images themselves (shadow lives on the card wrapper).

---

## Noise Texture — Both Themes

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/noise.png'); /* 200×200px tileable noise */
  opacity: var(--noise-opacity);       /* 0.03 light · 0.025 dark */
  pointer-events: none;
  z-index: 9999;
}
```

Noise prevents flat, digital-looking surfaces. Essential in light mode to avoid sterile feel.

---

## Plain Mode Default — What Runs Without JS

Everything above is CSS-only. The portfolio is complete with:
- Theme toggle (JS for toggle fn + init only)
- All layouts, typography, color
- Hover states
- All sections

### Enhanced Layer (JS / Progressive Enhancement)

Add only when `prefers-reduced-motion: no-preference`:

```
✓  Section titles: slide up 30px + fade in on scroll  (Intersection Observer)
✓  Stats count up from 0 on first scroll into view
✓  Hero image: 15% parallax on mouse move
✓  Nav: blur-in on scroll past hero
✗  Custom cursor morphs     ← removed from default
✗  Ghost cursor trail       ← removed from default
✗  Auto-scrolling reel      ← becomes static 4-image strip
✗  GSAP clip-mask reveals   ← replaced by simpler CSS transitions
```

Animation duration for all scroll reveals: `500ms var(--ease-out)` · stagger `80ms` between elements.

---

## Responsive Breakpoints

```
Mobile:   < 640px   — 1 col · hero name clamp floor · nav hamburger
Tablet:   640–1024  — 2 col · hero name mid scale · simplified stats row
Desktop:  > 1024px  — full 12-col · all features active
Wide:     > 1440px  — max-width 1320px centered · generous whitespace
```

Mobile hero: name stacks vertically, image drops below fold (or removes), all text left-aligned.

---

## What Was Removed from v1 & v2

| Removed | Reason |
|---|---|
| Per-section background color changes | Fragmented the design; tokens do this better |
| Radial purple glow in Contact | Felt like a template effect |
| Bento skills grid | Looked busy; ruled list is more confident |
| Gradient circles on cards | Placeholder energy; real images only |
| Cursor ghost trail (default) | Distracting; moved to enhanced layer |
| Custom cursor morph (default) | Moved to enhanced layer |
| Auto-scroll marquee text | Replaced by static image strip |

---

## Files & Folder Structure

```
/
├── index.html
├── styles/
│   ├── tokens.css          ← all CSS custom properties (both themes)
│   ├── typography.css      ← type scale, font imports
│   ├── layout.css          ← grid, section anatomy, spacing
│   ├── components/
│   │   ├── nav.css
│   │   ├── hero.css
│   │   ├── cards.css
│   │   ├── about.css
│   │   ├── skills.css
│   │   ├── process.css
│   │   ├── contact.css
│   │   └── toggle.css
│   └── enhanced.css        ← scroll animations, parallax (JS-gated)
├── js/
│   ├── theme.js            ← init + toggle (runs in <head>)
│   └── enhanced.js         ← Intersection Observer, parallax
└── assets/
    ├── noise.png           ← 200×200px tileable noise texture
    └── projects/           ← real project images
```

---

## Build Sequence

Build in this exact order. Don't jump ahead.

```
1. tokens.css               ← all variables first; nothing works without this
2. typography.css           ← import fonts, set scale
3. theme.js                 ← toggle works before any UI
4. nav                      ← reference point for spacing
5. hero                     ← sets the entire tone; get this right first
6. project cards            ← most complex component
7. about                    ← pull quote + stats
8. skills                   ← simplest section
9. process                  ← 4-step grid
10. contact                 ← easiest section
11. enhanced.css + .js      ← last, after everything else is pixel-perfect
```

**Before writing a single component:** Open a blank HTML file. Set `--bg-base` as body background.
Paste the hero name at `clamp(7rem, 14vw, 13rem)` in Playfair Italic. Adjust `clamp` values until
it feels right on your actual monitor. Then build.

---

## References

| Reference | What to study |
|---|---|
| **pentagram.com** | Ruled list layout, editorial confidence, type-led hierarchy |
| **frankchimero.com** | Light mode warmth, written voice integrated into layout |
| **rauno.me** | Typography-first, micro-detail, restrained accent use |
| **emmanuelgautier.com** | Dark mode ruled list, mono type as decoration |
| **robin-noguier.com** | Project card interaction (Enhanced Mode only) |
| **kinfolk.com** | Off-white warmth, image crop discipline, print-to-screen |
| **wallofportfolios.in** | Filter Light — study what makes light-mode portfolios stand out |

---

## The North Star

> Light Mode is not "the bright version." It is the primary editorial voice.
> Dark Mode is not "the cool version." It is the same portfolio in a different register.
> Plain Mode is not a fallback. It is the craft.
> The toggle is not a feature. It is a design statement.