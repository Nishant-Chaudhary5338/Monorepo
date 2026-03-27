# Present — Features

## Core Engine

| Feature | Description | File | Status |
|---|---|---|---|
| RAF Loop | requestAnimationFrame-based animation loop | `core/engine.ts` | ❌ |
| Frame Scheduler | Priority-based tick scheduling (HIGH/NORMAL/LOW) | `core/scheduler.ts` | ❌ |
| Math Utilities | lerp, clamp, mapRange, springSolver | `core/math.ts` | ❌ |
| Event Bus | Pub/sub event system with wildcard support | `core/events.ts` | ✅ |
| State Reducer | Action-based state transitions | `core/reducer.ts` | ✅ |

## State Machine

| Feature | Description | File | Status |
|---|---|---|---|
| Finite States | idle → presenting → overview/paused | `state/deck-machine.ts` | ❌ |
| State Transitions | Guarded transitions between states | `state/deck-machine.ts` | ❌ |
| React Context | DeckProvider wrapping state machine | `state/context.tsx` | ❌ |
| useDeck Hook | Public API for deck state + actions | `state/use-deck.ts` | ❌ |

## Animation System

| Feature | Description | File | Status |
|---|---|---|---|
| Spring Physics | stiffness/damping/mass solver | `animation/spring.ts` | ❌ |
| Spring Presets | default, gentle, wobbly, stiff, slow, molasses | `animation/spring.ts` | ❌ |
| Motion Values | Reactive primitive values (Framer Motion API) | `animation/motion.ts` | ❌ |
| useMotionValue | Hook for creating motion values | `animation/motion.ts` | ❌ |
| useTransform | Derived motion values | `animation/motion.ts` | ❌ |
| useSpring | Spring-animated motion values | `animation/motion.ts` | ❌ |
| Timeline | Sequenced animation orchestration | `animation/timeline.ts` | ❌ |
| AnimatePresence | Mount/unmount with exit animations | `animation/presence.tsx` | ❌ |
| Stagger | Children orchestration with delay | `animation/stagger.ts` | ❌ |

## Gesture System

| Feature | Description | File | Status |
|---|---|---|---|
| Gesture Recognizer | Low-level pointer state machine | `gestures/recognizer.ts` | ❌ |
| useSwipe | Swipe with velocity & momentum | `gestures/use-swipe.ts` | ❌ |
| useDrag | Drag-to-navigate with constraints | `gestures/use-drag.ts` | ❌ |
| usePinch | Pinch-to-zoom for overview/canvas | `gestures/use-pinch.ts` | ❌ |
| useGesture | Unified gesture hook (all gestures) | `gestures/use-gesture.ts` | ❌ |

## Scroll

| Feature | Description | File | Status |
|---|---|---|---|
| useScroll | Scroll progress tracking | `scroll/use-scroll.ts` | ❌ |
| useParallax | Parallax depth effect | `scroll/use-parallax.ts` | ❌ |
| ScrollLinked | Declarative scroll-linked wrapper | `scroll/scroll-linked.tsx` | ❌ |

## Router

| Feature | Description | File | Status |
|---|---|---|---|
| Hash Router | Hash-based routing (#slide-3) | `router/hash-router.ts` | ❌ |
| useRouter | React hook for router sync | `router/use-router.ts` | ❌ |

## Plugins

| Feature | Description | File | Status |
|---|---|---|---|
| Plugin Interface | Lifecycle hooks (onInit, onDestroy, onEvent) | `plugins/types.ts` | ❌ |
| Plugin Manager | Registration, lifecycle, error isolation | `plugins/manager.ts` | ❌ |
| Analytics Plugin | Track slide views, time per slide | `plugins/built-in/analytics.ts` | ❌ |
| Autoplay Plugin | Auto-advance slides on timer | `plugins/built-in/autoplay.ts` | ❌ |
| Sync Plugin | WebSocket-based remote sync | `plugins/built-in/sync.ts` | ❌ |
| Notes Plugin | Speaker notes per slide | `plugins/built-in/notes.ts` | ❌ |
| usePlugins | React hook for plugin integration | `plugins/use-plugins.ts` | ❌ |

## UI Components

| Feature | Description | File | Status |
|---|---|---|---|
| Deck | Root deck component | `components/deck/Deck.tsx` | ❌ |
| Slide | Single slide with AnimatePresence | `components/slide/Slide.tsx` | ❌ |
| Viewport | Responsive viewport with scaling | `components/viewport/Viewport.tsx` | ❌ |
| Transitions | Spring-based transition renderer | `components/transition/Transitions.tsx` | ❌ |
| Layouts | Default, Center, TwoColumn, FullBleed, Title, Code, Grid, etc. | `components/layout/Layouts.tsx` | ❌ |
| Appear | Step-by-step reveal with spring | `components/fragment/Appear.tsx` | ❌ |
| CodeBlock | Syntax highlighted code | `components/codeblock/CodeBlock.tsx` | ❌ |
| PreziCanvas | Infinite canvas with gesture zoom | `components/canvas/PreziCanvas.tsx` | ❌ |
| Overview | Grid overview with drag reorder | `components/overview/Overview.tsx` | ❌ |
| Presenter | Presenter mode with notes | `components/presenter/Presenter.tsx` | ❌ |
| Progress | Bar, Circle, Fraction, Dots | `components/progress/Progress.tsx` | ❌ |
| Controls | Navigation controls | `components/controls/Controls.tsx` | ❌ |
| Heading | h1-h6 with theme styling | `components/typography/Heading.tsx` | ❌ |
| Text | Body text with variants | `components/typography/Text.tsx` | ❌ |
| Code | Inline code | `components/typography/Code.tsx` | ❌ |
| Quote | Block quote | `components/typography/Quote.tsx` | ❌ |
| Badge | Inline badge | `components/typography/Badge.tsx` | ❌ |
| Tilt | 3D tilt effect on hover | `components/tilt/Tilt.tsx` | ❌ |
| Morph | FLIP-based morph animation | `components/morph/Morph.tsx` | ❌ |
| ParallaxLayer | Parallax depth layer | `components/parallax/ParallaxLayer.tsx` | ❌ |

## Themes

| Feature | Description | File | Status |
|---|---|---|---|
| Theme Types | Theme interface with tokens | `themes/types.ts` | ❌ |
| Midnight | Dark with blue accents | `themes/presets/midnight.ts` | ❌ |
| Light | Clean light theme | `themes/presets/light.ts` | ❌ |
| Monokai | Monokai color scheme | `themes/presets/monokai.ts` | ❌ |
| Nord | Nord frost palette | `themes/presets/nord.ts` | ❌ |
| Solarized | Solarized dark/light | `themes/presets/solarized.ts` | ❌ |
| createTheme | Theme builder utility | `themes/create-theme.ts` | ❌ |

## Utilities

| Feature | Description | File | Status |
|---|---|---|---|
| cn | Class name merger (clsx wrapper) | `utils/classnames.ts` | ❌ |
| DOM utils | fullscreen, slide element helpers | `utils/dom.ts` | ❌ |
| Keyboard | Shortcut mapping + hook | `utils/keyboard.ts` | ❌ |

## Types

| Feature | Description | File | Status |
|---|---|---|---|
| Core Types | DeckState, DeckActions | `types/core.ts` | ❌ |
| Animation Types | SpringConfig, MotionValue, Timeline | `types/animation.ts` | ❌ |
| Gesture Types | GestureState, SwipeConfig, DragConfig | `types/gesture.ts` | ❌ |
| Plugin Types | Plugin interface, hooks | `types/plugin.ts` | ❌ |
| Barrel Export | Re-export all types | `types/index.ts` | ✅ |

## Styles

| Feature | Description | File | Status |
|---|---|---|---|
| Base Styles | Slide container, viewport, fullscreen | `styles/present.css` | ❌ |
| Transition CSS | Keyframe animations for transitions | `styles/transitions.css` | ❌ |
| Component CSS | Progress, controls, code block styles | `styles/components.css` | ❌ |
| Theme CSS | CSS custom properties per theme | `styles/themes/` | ❌ |
| Animation CSS | Shared keyframe definitions | `styles/animations.css` | ❌ |

## Progress Summary

- **Implemented**: ~30 / 65 files (~45%)
- **Core engine, state, animation, gestures, scroll, router, themes, utils** — all done
- **Still needed**: UI components, plugins, styles, tests

### Implemented ✅
| Module | Files | Status |
|---|---|---|
| Core | 5/5 | ✅ Complete |
| State | 3/3 | ✅ Complete |
| Animation | 2/6 | ✅ Spring + Motion done |
| Gestures | 2/5 | ✅ Recognizer + useGesture done |
| Scroll | 3/3 | ✅ Complete |
| Router | 2/2 | ✅ Complete |
| Themes | 8/8 | ✅ Complete |
| Utils | 3/3 | ✅ Complete |
| Types | 1/1 | ✅ Complete |

### Pending ❌
| Module | Files | Status |
|---|---|---|
| UI Components | 0/21 | ❌ Phase 9 |
| Plugins | 0/8 | ❌ Phase 8 |
| Styles | 0/9 | ❌ Phase 13 |
