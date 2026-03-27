# Present — Project Overview

## Vision

**Present** is a production-grade React presentation library that delivers Prezi-like web presentations with world-class animation, gesture navigation, and beautiful themes. Think Framer Motion meets Slidev.

## Current Status: ~40% Complete

**Implemented modules (Phases 2-7, 10-11):**

### Core Engine ✅
- `src/core/math.ts` — lerp, clamp, mapRange, springSolver, VelocityTracker
- `src/core/scheduler.ts` — Priority-based FrameScheduler (CRITICAL/HIGH/NORMAL/LOW)
- `src/core/engine.ts` — AnimationEngine with spring presets
- `src/core/events.ts` — Event bus (existing)
- `src/core/reducer.ts` — State reducer (existing)

### State Machine ✅
- `src/state/deck-machine.ts` — Finite state machine (idle/presenting/overview/paused)
- `src/state/context.tsx` — DeckProvider with React context
- `src/state/use-deck.ts` — useDeck hook

### Animation System ✅
- `src/animation/spring.ts` — Spring physics solver with 6 presets
- `src/animation/motion.ts` — MotionValue, useMotionValue, useTransform, useSpring, useVelocity

### Gesture System ✅
- `src/gestures/recognizer.ts` — Low-level GestureRecognizer (swipe/drag/pinch/longpress)
- `src/gestures/use-gesture.ts` — Unified useGesture hook

### Scroll-Linked ✅
- `src/scroll/use-scroll.ts` — Scroll progress tracking
- `src/scroll/use-parallax.ts` — Parallax depth effect
- `src/scroll/scroll-linked.tsx` — ScrollLinked component

### Router ✅
- `src/router/hash-router.ts` — Hash-based routing (#slide-3/fragment-2)
- `src/router/use-router.ts` — useRouter hook

### Themes ✅
- `src/themes/types.ts` — Theme interface with tokens
- `src/themes/create-theme.ts` — Theme builder + toCssVars
- `src/themes/presets/` — midnight, light, monokai, nord, solarized

### Utilities ✅
- `src/utils/classnames.ts` — cn() class merger
- `src/utils/dom.ts` — Fullscreen helpers
- `src/utils/keyboard.ts` — Keyboard shortcuts + useKeyboard

### Types ✅
- `src/types/index.ts` — Comprehensive type definitions

**Still needed:**
- UI Components (Deck, Slide, Viewport, etc.) — Phase 9
- Plugins (analytics, autoplay, sync, notes) — Phase 8
- Styles (CSS for transitions, components, themes) — Phase 13

## Key Innovations

| Innovation | Description | Status |
|---|---|---|
| **12 tree-shakeable entry points** | Import only what you use (`@repo/present/ui`, `@repo/present/animation`, etc.) | ❌ |
| **Spring physics engine** | Real stiffness/damping/mass, not CSS timing functions | ❌ |
| **AnimatePresence** | Mount/unmount with enter/exit animation orchestration | ❌ |
| **Gesture system** | Swipe, drag, pinch, rotate, long-press with velocity tracking | ❌ |
| **State machine** | Finite state machine for deck states (idle, presenting, overview, paused) | ⚠️ Partial |
| **Plugin architecture** | Analytics, autoplay, sync, notes as opt-in plugins | ❌ |
| **5 built-in themes** | Midnight, light, monokai, nord, solarized | ❌ |
| **Motion values** | Reactive motion values (Framer Motion API) | ❌ |
| **Scroll-linked** | Parallax and scroll-driven animations | ❌ |
| **URL routing** | Hash-based slide URLs for sharing | ❌ |
| **Frame scheduler** | Priority-based RAF scheduling for 60fps | ❌ |

## Architecture Principles

1. **Tree-shaking first** — 12 separate entry points, not a monolith
2. **Spring physics** — Real physics, not CSS easing curves
3. **State machine** — Finite states, not useState spaghetti
4. **Plugin extensibility** — Core is minimal, plugins add features
5. **Zero-config themes** — Beautiful out of the box, customizable on demand
6. **60fps always** — RAF scheduler, GPU-accelerated transforms, debounced handlers

## Module Map

```
packages/present/
├── core/       ← Pure engine (RAF loop, scheduler, math)
├── state/      ← XState-lite FSM + React context
├── animation/  ← Spring, timeline, motion values, AnimatePresence
├── gestures/   ← Swipe, drag, pinch, rotate, long-press
├── scroll/     ← Scroll-linked animations, parallax
├── router/     ← Hash-based slide routing
├── plugins/    ← Analytics, autoplay, sync, notes
├── ui/         ← Deck, Slide, Viewport, Transitions, etc.
├── themes/     ← 5 preset themes + theme builder
├── utils/      ← classnames, dom, keyboard
├── types/      ← All type definitions
└── styles/     ← CSS for transitions, components, themes
```

## Dependencies

- **Peer**: react ^18 || ^19, react-dom ^18 || ^19
- **Runtime**: clsx (class merging)
- **Dev**: tsup, typescript, @types/react, @types/react-dom
- **Optional peer**: xstate (if using full state machine), @xstate/react

## Entry Points (Planned)

1. `@repo/present` — Full bundle (everything)
2. `@repo/present/core` — Pure engine
3. `@repo/present/state` — State machine + context
4. `@repo/present/animation` — Animation system
5. `@repo/present/gestures` — Gesture hooks
6. `@repo/present/scroll` — Scroll-linked animations
7. `@repo/present/router` — URL routing
8. `@repo/present/plugins` — Plugin system
9. `@repo/present/ui` — UI components
10. `@repo/present/themes` — Theme presets
11. `@repo/present/utils` — Utilities
12. `@repo/present/types` — Type definitions