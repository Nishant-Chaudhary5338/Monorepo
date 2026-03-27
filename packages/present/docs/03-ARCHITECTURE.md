# Present — Architecture

## Module Dependency Graph

```
src/index.ts (barrel)
├── core/        (no dependencies — pure engine)
│   ├── engine.ts
│   ├── scheduler.ts
│   ├── math.ts
│   ├── events.ts
│   └── reducer.ts
├── state/       (depends on: core)
│   ├── deck-machine.ts
│   ├── context.tsx
│   └── use-deck.ts
├── animation/   (depends on: core)
│   ├── spring.ts
│   ├── motion.ts
│   ├── timeline.ts
│   ├── presence.tsx
│   └── stagger.ts
├── gestures/    (depends on: core, animation)
│   ├── recognizer.ts
│   ├── use-swipe.ts
│   ├── use-drag.ts
│   ├── use-pinch.ts
│   └── use-gesture.ts
├── scroll/      (depends on: animation)
│   ├── use-scroll.ts
│   ├── use-parallax.ts
│   └── scroll-linked.tsx
├── router/      (depends on: state)
│   ├── hash-router.ts
│   └── use-router.ts
├── plugins/     (depends on: state, core)
│   ├── types.ts
│   ├── manager.ts
│   ├── built-in/
│   │   ├── analytics.ts
│   │   ├── autoplay.ts
│   │   ├── sync.ts
│   │   └── notes.ts
│   └── use-plugins.ts
├── ui/          (depends on: state, animation, gestures, themes)
│   ├── Deck.tsx
│   ├── Slide.tsx
│   ├── Viewport.tsx
│   ├── Transitions.tsx
│   ├── Layouts.tsx
│   ├── Appear.tsx
│   ├── CodeBlock.tsx
│   ├── PreziCanvas.tsx
│   ├── Overview.tsx
│   ├── Presenter.tsx
│   ├── Progress.tsx
│   ├── Controls.tsx
│   ├── typography/
│   ├── Tilt.tsx
│   ├── Morph.tsx
│   └── ParallaxLayer.tsx
├── themes/      (depends on: types)
│   ├── types.ts
│   ├── presets/
│   └── create-theme.ts
├── utils/       (no dependencies)
│   ├── classnames.ts
│   ├── dom.ts
│   └── keyboard.ts
├── types/       (no dependencies)
│   ├── core.ts
│   ├── animation.ts
│   ├── gesture.ts
│   ├── plugin.ts
│   └── index.ts
└── styles/      (no dependencies — pure CSS)
    ├── present.css
    ├── transitions.css
    ├── components.css
    ├── themes/
    └── animations.css
```

## Data Flow

```
User Input (keyboard/swipe/click)
    ↓
Deck Machine (state transitions)
    ↓
Event Bus (emit events)
    ↓
Plugins (onEvent handlers)
    ↓
React Context (state updates)
    ↓
Components (re-render with new state)
    ↓
Animation Engine (spring/timing animations)
    ↓
Frame Scheduler (RAF loop)
    ↓
DOM Updates (GPU-accelerated transforms)
```

## State Machine States

```
┌─────────────────────────────────────────┐
│                 idle                     │
│  (initial state, waiting to start)       │
└──────────────┬──────────────────────────┘
               │ START
               ▼
┌─────────────────────────────────────────┐
│              presenting                  │
│  (active slide, accepting input)         │
│                                          │
│  NEXT/PREV → stay in presenting          │
│  TOGGLE_OVERVIEW → overview              │
│  TOGGLE_PRESENTER → paused               │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    ▼                      ▼
┌──────────┐        ┌──────────┐
│ overview │        │  paused  │
│ (grid)   │        │(presenter│
│          │        │  mode)   │
└────┬─────┘        └────┬─────┘
     │ TOGGLE            │ TOGGLE
     │ OVERVIEW          │ PRESENTER
     ▼                    ▼
┌─────────────────────────────────────────┐
│              presenting                  │
└─────────────────────────────────────────┘
```

## Build Architecture

### 12 Entry Points (tsup)

Each module is a separate entry point for tree-shaking:

```
tsup.config.ts entry points:
├── src/index.ts              → dist/index.js (full bundle)
├── src/core/index.ts         → dist/core.js
├── src/state/index.ts        → dist/state.js
├── src/animation/index.ts    → dist/animation.js
├── src/gestures/index.ts     → dist/gestures.js
├── src/scroll/index.ts       → dist/scroll.js
├── src/router/index.ts       → dist/router.js
├── src/plugins/index.ts      → dist/plugins.js
├── src/ui/index.ts           → dist/ui.js
├── src/themes/index.ts       → dist/themes.js
├── src/utils/index.ts        → dist/utils.js
├── src/types/index.ts        → dist/types.js
└── src/styles/present.css    → dist/styles.css
```

### Package.json Exports Map

```json
{
  ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
  "./core": { "import": "./dist/core.js", "types": "./dist/core.d.ts" },
  "./state": { "import": "./dist/state.js", "types": "./dist/state.d.ts" },
  "./animation": { "import": "./dist/animation.js", "types": "./dist/animation.d.ts" },
  "./gestures": { "import": "./dist/gestures.js", "types": "./dist/gestures.d.ts" },
  "./scroll": { "import": "./dist/scroll.js", "types": "./dist/scroll.d.ts" },
  "./router": { "import": "./dist/router.js", "types": "./dist/router.d.ts" },
  "./plugins": { "import": "./dist/plugins.js", "types": "./dist/plugins.d.ts" },
  "./ui": { "import": "./dist/ui.js", "types": "./dist/ui.d.ts" },
  "./themes": { "import": "./dist/themes.js", "types": "./dist/themes.d.ts" },
  "./utils": { "import": "./dist/utils.js", "types": "./dist/utils.d.ts" },
  "./types": { "import": "./dist/types.js", "types": "./dist/types.d.ts" },
  "./styles": "./dist/styles.css"
}
```

## Animation Pipeline

```
1. User action (swipe, click, keyboard)
2. Deck machine state update
3. Components detect state change
4. Animation target computed (target value, spring config)
5. AnimationEngine registers animation
6. FrameScheduler ticks at 60fps
7. Spring solver computes next frame
8. MotionValue updates
9. Components re-render with new motion values
10. CSS transforms applied (GPU-accelerated)
```

## Plugin Lifecycle

```
1. Plugin registered via DeckProvider plugins prop
2. PluginManager.register(plugin)
3. plugin.onInit(deck) called with deck state+actions
4. Deck emits events via Event Bus
5. PluginManager routes events to plugin.onEvent()
6. Plugin can call deck actions (next, prev, goTo)
7. PluginManager.unregister() or Deck unmounts
8. plugin.onDestroy() called for cleanup