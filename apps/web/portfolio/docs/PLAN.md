# Nidhi Chhimwal — Portfolio Plan
*Executive 3D portfolio for a Senior UI/UX Designer targeting senior roles*

---

## Resume Data Extracted

**Personal**
- Name: Nidhi Chhimwal
- Title: Senior UI/UX Designer & Illustrator
- Location: Gurugram, India
- Email: nidhichhimwal1997@gmail.com
- Phone: 8168580423
- Behance: https://www.behance.net/nidhichhim6d3d
- Education: Bachelor of Design (2015–2019) — Doon University, Dehradun

**Experience (most recent first)**
1. **Samsung Electronics** — Senior Associate / UI/UX Designer (Dec 2023–Present, Gurugram)
   - UI/UX design for internal products (intuitive user experiences)
   - Conduct user research and usability testing
   - Graphic design for internal communications
   - Collaborate cross-functional teams to align design strategies

2. **Safex Chemicals India Ltd.** — UI/UX Designer (Jun 2022–Dec 2023, Delhi)
   - Designed & launched websites for new brands
   - Developed KIWI (Kisan Window) — iOS & Android app for farmers
   - Created motion graphics for brand intros and product launches
   - Collaborated with teams for project execution

3. **ALMA Magazine** — Freelance Illustrator (Jan 2022–Dec 2022, Remote)
   - Illustrations and cartoon characters for magazine articles

4. **Liberty Shoes Pvt. Ltd.** — Graphic Visualizer (Apr 2021–Mar 2022, Delhi)
   - Illustrations, GIFs, banners, graphic designs per brand guidelines
   - Managed marketing campaigns
   - High-quality designs under deadlines

5. **Mediamix** — Graphic Designer (Mar 2020–Jul 2020, Gurgaon)
   - Social media posts for multiple brands
   - Adobe tools: Illustrator, Procreate, Photoshop, InDesign

6. **Healing Urja** — Freelance Illustrator (Sep 2019–Apr 2020)
   - Designed complete Tarot card deck (78 cards) using Illustrator & Procreate

7. **Prasuma India** — Freelance Packaging (May–Aug 2019)
   - Packaging, labels, brand kit

8. **FarmOrigin AgroScience** — Internship (Feb–Apr 2019)
   - UI/UX for branding, packaging, marketing materials

9. **AIESEC** — Internship (Jul–Aug 2018)
   - Event branding: "Global Village" — logo, visual identity, guidelines

10. **Namami Gange (Govt. Project)** — Awareness Volunteer
    - Wall mural in Dehradun for river preservation

**Skills**
- UX: Creative Design Thinking, Design Strategy, Story Boarding, User Journeys, User Experience, User Research, Information Architecture, User Interface Design, Design Wireframing, High Fidelity Prototyping
- Visual/Creative: 2D Animation, Motion Graphics, Graphic Design, Typography, Sketching/Doodling, Illustration, Branding, Editorials, Packaging Design
- Tools: Figma, Adobe XD, Procreate, Photoshop, Illustrator, InDesign, After Effects

**Certifications**
- Human-Centered Design for Inclusive Innovation — University of Toronto
- Get Started with Figma — Coursera
- Mixed Media Animation in Procreate — Domestika

---

## Design Decisions

### Color Palette (luxury dark + creative)
- `--bg-0`: #05040C (deep dark, near-black with purple tint)
- `--bg-1`: #0A091A (surface)
- `--bg-2`: #110F22 (elevated surface)
- `--purple`: #9D72FF (primary creative accent)
- `--gold`: #F5A623 (executive/senior highlight)
- `--rose`: #FF6B9D (feminine creative accent)
- `--text-1`: #FFFFFF
- `--text-2`: #C4B8F0 (lavender tinted)
- `--text-3`: #7B6FAC (muted)

### Typography
- **Headings**: Playfair Display (serif) — editorial, premium, luxury
- **Body**: DM Sans — clean, modern, readable

### Unique Design Elements vs Nishant's Portfolio
- Centered hero layout (not side-by-side)
- Serif headings (editorial feel vs Nishant's all-sans)
- Purple/gold palette (vs Nishant's blue/dark)
- Custom cursor (dot + ring)
- Process section (new — not in Nishant's portfolio)
- Skill tags grouped by category with color coding (vs 3D model icons)
- No reliance on external image assets — all CSS gradients for project cards

---

## File Structure

```
apps/web/portfolio/
├── docs/
│   └── PLAN.md           ← this file
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css             ← comprehensive design system
    ├── vite-env.d.ts
    ├── constants/
    │   └── index.ts          ← all data (personal, experience, skills, work, process)
    ├── components/
    │   ├── Navbar.tsx         ← fixed transparent→frosted-glass on scroll
    │   ├── AnimatedCounter.tsx ← GSAP count-up on scroll
    │   ├── CustomCursor.tsx   ← dot + ring cursor
    │   └── FloatingScene.tsx  ← Three.js 3D hero background
    └── sections/
        ├── Hero.tsx           ← full-screen hero with 3D + animated roles
        ├── About.tsx          ← stats counters + bio
        ├── Skills.tsx         ← categorized skill tags
        ├── Experience.tsx     ← timeline layout
        ├── Process.tsx        ← 4-step UX process cards
        ├── Work.tsx           ← project showcase (gradient cards)
        ├── Contact.tsx        ← contact CTA + links
        └── Footer.tsx
```

---

## Section Details

### Hero (FloatingScene — Three.js)
**3D Scene elements:**
- `Stars` (drei) — 3000 particle starfield
- Large wireframe `Torus` (radius 3, tube 0.025) — purple, tilted 45°, slow Y rotation
- Medium wireframe `Torus` (radius 2, tube 0.04) — gold, tilted -60°, slow X rotation
- `Float`-wrapped `Octahedron` — metallic purple, floating in center
- `Float`-wrapped `TorusKnot` — small, rose accent, off-center
- Mouse parallax: group moves slightly with mouse position

**Text content overlay:**
- Animated "Available for Senior Roles" badge
- "Nidhi Chhimwal" in Playfair Display (huge, white)
- Animated role slider: "Senior UI/UX Designer" | "Illustrator & Visual Artist" | "Experience Strategist"
- Tagline: "4+ years crafting experiences that bridge user needs and business goals"
- CTA buttons: "View My Work" (primary) + "Say Hello" (outline)
- Scroll indicator with animated line

### About (Stats + Bio)
**Stats:**
- 4+ Years of Experience
- 3 Major Companies (Samsung, Safex, Liberty)
- 15K+ Users Impacted (via KIWI app)
- 20+ Tools Mastered

**Bio:** Personal statement about her multi-disciplinary approach

### Skills
**Three categories:**
1. UX Design (purple tags) — 10 skills
2. Visual & Creative (gold tags) — 9 skills
3. Design Tools (rose tags) — 7 tools

### Experience
**4 main roles shown:**
1. Samsung Electronics — current, large card
2. Safex Chemicals — KIWI app
3. Liberty Shoes
4. Creative Freelance (combined: ALMA, Healing Urja, Prasuma)

### Process (UX Methodology)
1. **Discover** — User research, interviews, market analysis
2. **Define** — User journeys, information architecture, strategy
3. **Design** — Wireframes → Hi-fi prototypes
4. **Deliver** — Usability testing, iteration, handoff

### Work (Case Studies)
6 projects with gradient visual cards:
1. KIWI — Kisan Window App (purple gradient)
2. Samsung Internal Design System (gold gradient)
3. Tarot Card Deck Illustration — Healing Urja (rose/purple gradient)
4. ALMA Magazine Illustrations (teal gradient)
5. Liberty Shoes Brand Campaigns (orange gradient)
6. Namami Gange Wall Mural (green gradient)

### Contact
- Large headline: "Let's Create Something Remarkable"
- Email link
- Behance link
- LinkedIn implied

---

## Implementation Status

- [x] package.json
- [x] vite.config.ts
- [x] tsconfig.json / tsconfig.app.json / tsconfig.node.json
- [x] index.html
- [x] src/index.css (design system)
- [x] src/vite-env.d.ts
- [x] src/constants/index.ts
- [x] src/components/CustomCursor.tsx
- [x] src/components/Navbar.tsx
- [x] src/components/AnimatedCounter.tsx
- [x] src/components/FloatingScene.tsx
- [x] src/sections/Hero.tsx
- [x] src/sections/About.tsx
- [x] src/sections/Skills.tsx
- [x] src/sections/Experience.tsx
- [x] src/sections/Process.tsx
- [x] src/sections/Work.tsx
- [x] src/sections/Contact.tsx
- [x] src/sections/Footer.tsx
- [x] src/App.tsx
- [x] src/main.tsx
- [x] pnpm install — all deps resolved
- [x] pnpm build — ✓ built successfully
- [x] pnpm dev — running on http://localhost:5180

## Known Issues / Future TODOs
- Build warning: chunk > 500kB (Three.js is heavy — add dynamic import for FloatingScene if needed)
- @types/node must be ^24.12.0 to avoid Vite plugin type conflicts in monorepo
- Behance link is live — update with actual case study URLs when ready
- Can add real project screenshots/images to public/ and update Work.tsx card visuals
- Consider adding `<Suspense>` + lazy loading for FloatingScene on mobile for perf

---

## Dev Commands
```bash
cd apps/web/portfolio
pnpm install
pnpm dev     # runs on http://localhost:5180
```
