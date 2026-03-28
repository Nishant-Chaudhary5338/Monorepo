# Presentation Plan: AI-Driven Monorepo Architecture

## Overview
A management-focused presentation built with `@repo/present` library, targeting leadership to demonstrate the business value of monorepo + Turborepo + AI-driven MCP tools.

## Visual Design
- **Theme:** Midnight (dark purple `#0f0f1a`)
- **Accents:** Purple `#7c3aed`, Cyan `#06b6d4`, Green `#22c55e`, Amber `#f59e0b`
- **Fullscreen enabled** for immersive visualization
- **Gradient backgrounds** for creative, professional feel
- **Staggered animations** for card reveals

## Slide Breakdown (10 Slides)

### Slide 1: Title
- Layout: `center`
- Content: Title + subtitle with gradient text
- Background: Deep purple gradient

### Slide 2: The Problem — Pain Points
- Layout: `grid-2x2`
- 4 cards: Scattered Codebase, Independent Teams, High Costs, Slow Delivery
- Each with icon, title, impact statement

### Slide 3: Real Cost Impact
- Layout: `default`
- Cost comparison table (Before → After → Savings)
- Animated savings percentages

### Slide 4: The Solution — Monorepo + Turborepo
- Layout: `two-column`
- Left: Architecture diagram (text-based)
- Right: Key benefits list

### Slide 5: AI-Driven Development — MCP Tools
- Layout: `grid-2x2`
- 4 category cards: Code Quality, Component Dev, Testing, Performance
- Each with tool count and time saved

### Slide 6: Frontend Task Automation
- Layout: `default`
- Automation table with % for each task
- Highlight: 70-80% automation rate

### Slide 7: Beyond Frontend — Full Stack
- Layout: `two-column`
- Left: Backend stacks (Next.js, Nuxt, Express, Node.js)
- Right: Automation capabilities

### Slide 8: Productivity & Efficiency Gains
- Layout: `grid-3x1`
- 3 big stat cards: 75% faster builds, 4x code reuse, 70% fewer bugs

### Slide 9: Creativity & Innovation
- Layout: `two-column`
- Before: Busy work list
- After: Innovation focus list

### Slide 10: Call to Action
- Layout: `center`
- ROI summary ($180K savings on $20K investment)
- Path forward steps
- Gradient CTA

## Technical Implementation

### Dependencies
- `@repo/present` — Deck, Slide, AnimatePresence, StaggerController
- `react` / `react-dom` (already present)

### Files to Create/Modify
1. `apps/web/web-app-3/docs/plan.md` — This plan
2. `apps/web/web-app-3/package.json` — Add @repo/present dependency
3. `apps/web/web-app-3/src/App.tsx` — Full presentation component
4. `apps/web/web-app-3/src/App.css` — Custom styles with gradients

### Keyboard Controls
- `→` / `Space` / `Enter` — Next slide
- `←` — Previous slide
- `F` — Toggle fullscreen
- `O` — Overview mode
- `P` — Presenter mode