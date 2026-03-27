# Present — Development Phases

## Phase 1: Foundation & Build Config

**Goal**: Fix build system, create barrel file, update package exports

| File | Action | Description |
|---|---|---|
| `tsup.config.ts` | Update | Add 12 entry points, enable splitting |
| `package.json` | Update | Add 12 sub-path exports |
| `src/index.ts` | Create | Barrel re-export from all modules |

---

## Phase 2: Core Module

**Goal**: Pure engine — RAF loop, scheduler, math utilities

| File | Action | Description |
|---|---|---|
| `src/core/math.ts` | Create | lerp, clamp, mapRange, springSolver, velocityAt |
| `src/core/scheduler.ts` | Create | FrameScheduler class with priority-based RAF |
| `src/core/engine.ts` | Create | AnimationEngine — orchestrates RAF loop |
| `src/core/events.ts` | Refactor | Keep as-is (already solid) |
| `src/core/reducer.ts` | Refactor | Convert to XState-lite FSM states |
| `src/core/index.ts` | Create | Barrel export for core module |

---

## Phase 3: State Module

**Goal**: Finite state machine + React context + useDeck hook

| File | Action | Description |
|---|---|---|
| `src/state/deck-machine.ts` | Create | XState-lite FSM: idle/presenting/overview/paused |
| `src/state/context.tsx` | Create | DeckProvider component with React context |
| `src/state/use-deck.ts` | Create | useDeck hook — public API |
| `src/state/index.ts` | Create | Barrel export for state module |

---

## Phase 4: Animation Module

**Goal**: Spring physics, motion values, AnimatePresence, timeline, stagger

| File | Action | Description |
|---|---|---|
| `src/animation/spring.ts` | Create | SpringPhysics class, SpringValue, presets |
| `src/animation/motion.ts` | Create | MotionValue, useMotionValue, useTransform, useSpring |
| `src/animation/timeline.ts` | Create | Timeline class — sequenced animations |
| `src/animation/presence.tsx` | Create | AnimatePresence — mount/unmount with exit |
| `src/animation/stagger.ts` | Create | Stagger children orchestration |
| `src/animation/index.ts` | Create | Barrel export for animation module |

---

## Phase 5: Gestures Module

**Goal**: Swipe, drag, pinch with velocity tracking

| File | Action | Description |
|---|---|---|
| `src/gestures/recognizer.ts` | Create | Low-level gesture state machine |
| `src/gestures/use-swipe.ts` | Create | Swipe with velocity & momentum |
| `src/gestures/use-drag.ts` | Create | Drag-to-navigate with constraints |
| `src/gestures/use-pinch.ts` | Create | Pinch-to-zoom |
| `src/gestures/use-gesture.ts` | Create | Unified gesture hook |
| `src/gestures/index.ts` | Create | Barrel export for gestures module |

---

## Phase 6: Scroll Module

**Goal**: Scroll-linked animations and parallax

| File | Action | Description |
|---|---|---|
| `src/scroll/use-scroll.ts` | Create | Scroll progress tracking |
| `src/scroll/use-parallax.ts` | Create | Parallax depth effect |
| `src/scroll/scroll-linked.tsx` | Create | ScrollLinked wrapper component |
| `src/scroll/index.ts` | Create | Barrel export for scroll module |

---

## Phase 7: Router Module

**Goal**: Hash-based slide routing

| File | Action | Description |
|---|---|---|
| `src/router/hash-router.ts` | Create | Hash parsing, URL sync |
| `src/router/use-router.ts` | Create | useRouter hook |
| `src/router/index.ts` | Create | Barrel export for router module |

---

## Phase 8: Plugins Module

**Goal**: Plugin architecture with built-in plugins

| File | Action | Description |
|---|---|---|
| `src/plugins/types.ts` | Create | Plugin interface, hooks types |
| `src/plugins/manager.ts` | Create | PluginManager — lifecycle management |
| `src/plugins/built-in/analytics.ts` | Create | Analytics plugin |
| `src/plugins/built-in/autoplay.ts` | Create | Autoplay plugin |
| `src/plugins/built-in/sync.ts` | Create | WebSocket sync plugin |
| `src/plugins/built-in/notes.ts` | Create | Speaker notes plugin |
| `src/plugins/use-plugins.ts` | Create | usePlugins hook |
| `src/plugins/index.ts` | Create | Barrel export for plugins module |

---

## Phase 9: UI Components

**Goal**: All visual components

| File | Action | Description |
|---|---|---|
| `src/components/deck/Deck.tsx` | Create | Root deck component |
| `src/components/slide/Slide.tsx` | Create | Single slide with AnimatePresence |
| `src/components/viewport/Viewport.tsx` | Create | Responsive viewport with scaling |
| `src/components/transition/Transitions.tsx` | Create | Spring-based transition renderer |
| `src/components/layout/Layouts.tsx` | Create | All layout components (11 layouts) |
| `src/components/fragment/Appear.tsx` | Create | Step-by-step reveal with spring |
| `src/components/codeblock/CodeBlock.tsx` | Create | Syntax highlighted code |
| `src/components/canvas/PreziCanvas.tsx` | Create | Infinite canvas with gesture zoom |
| `src/components/overview/Overview.tsx` | Create | Grid overview with drag reorder |
| `src/components/presenter/Presenter.tsx` | Create | Presenter mode with notes |
| `src/components/progress/Progress.tsx` | Create | Bar, Circle, Fraction, Dots |
| `src/components/controls/Controls.tsx` | Create | Navigation controls |
| `src/components/typography/Heading.tsx` | Create | h1-h6 with theme styling |
| `src/components/typography/Text.tsx` | Create | Body text with variants |
| `src/components/typography/Code.tsx` | Create | Inline code |
| `src/components/typography/Quote.tsx` | Create | Block quote |
| `src/components/typography/Badge.tsx` | Create | Inline badge |
| `src/components/tilt/Tilt.tsx` | Create | 3D tilt effect on hover |
| `src/components/morph/Morph.tsx` | Create | FLIP-based morph animation |
| `src/components/parallax/ParallaxLayer.tsx` | Create | Parallax depth layer |
| `src/components/index.ts` | Create | Barrel export for all UI components |

---

## Phase 10: Themes Module

**Goal**: 5 preset themes + theme builder

| File | Action | Description |
|---|---|---|
| `src/themes/types.ts` | Create | Theme interface with tokens |
| `src/themes/presets/midnight.ts` | Create | Dark with blue accents |
| `src/themes/presets/light.ts` | Create | Clean light theme |
| `src/themes/presets/monokai.ts` | Create | Monokai color scheme |
| `src/themes/presets/nord.ts` | Create | Nord frost palette |
| `src/themes/presets/solarized.ts` | Create | Solarized dark/light |
| `src/themes/create-theme.ts` | Create | Theme builder utility |
| `src/themes/index.ts` | Create | Barrel export for themes module |

---

## Phase 11: Utils Module

**Goal**: Pure utility functions

| File | Action | Description |
|---|---|---|
| `src/utils/classnames.ts` | Create | cn() — class name merger (clsx wrapper) |
| `src/utils/dom.ts` | Create | Fullscreen helpers, slide element helpers |
| `src/utils/keyboard.ts` | Create | Keyboard shortcut mapping + useKeyboard hook |
| `src/utils/index.ts` | Create | Barrel export for utils module |

---

## Phase 12: Types Expansion

**Goal**: Split types into domain-specific modules

| File | Action | Description |
|---|---|---|
| `src/types/core.ts` | Create | DeckState, DeckActions types |
| `src/types/animation.ts` | Create | SpringConfig, MotionValue types |
| `src/types/gesture.ts` | Create | GestureState, SwipeConfig, DragConfig |
| `src/types/plugin.ts` | Create | Plugin interface, hooks |
| `src/types/index.ts` | Update | Barrel re-export all type modules |

---

## Phase 13: Styles Module

**Goal**: CSS for transitions, components, themes, animations

| File | Action | Description |
|---|---|---|
| `src/styles/present.css` | Create | Base styles — viewport, slide container, fullscreen |
| `src/styles/transitions.css` | Create | Keyframe animations for transitions |
| `src/styles/components.css` | Create | Component styles — progress, controls, code |
| `src/styles/themes/midnight.css` | Create | CSS custom properties for midnight theme |
| `src/styles/themes/light.css` | Create | CSS custom properties for light theme |
| `src/styles/themes/monokai.css` | Create | CSS custom properties for monokai theme |
| `src/styles/themes/nord.css` | Create | CSS custom properties for nord theme |
| `src/styles/themes/solarized.css` | Create | CSS custom properties for solarized theme |
| `src/styles/animations.css` | Create | Shared keyframe definitions |

---

## File Count Summary

| Phase | Files | Status |
|---|---|---|
| 1. Foundation | 3 | ❌ |
| 2. Core | 6 | ⚠️ 2/6 |
| 3. State | 4 | ❌ |
| 4. Animation | 6 | ❌ |
| 5. Gestures | 6 | ❌ |
| 6. Scroll | 4 | ❌ |
| 7. Router | 3 | ❌ |
| 8. Plugins | 8 | ❌ |
| 9. UI Components | 21 | ❌ |
| 10. Themes | 8 | ❌ |
| 11. Utils | 4 | ❌ |
| 12. Types | 5 | ⚠️ 1/5 |
| 13. Styles | 9 | ❌ |
| **Total** | **87** | **3 done (3%)** |