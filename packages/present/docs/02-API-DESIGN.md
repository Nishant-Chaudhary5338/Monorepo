# Present — API Design

## Basic Usage

```tsx
import { Deck, Slide, Heading, Text } from "@repo/present";

function MyPresentation() {
  return (
    <Deck theme="midnight">
      <Slide layout="center">
        <Heading level={1}>Hello World</Heading>
        <Text>A beautiful presentation</Text>
      </Slide>
      <Slide layout="two-column">
        <div>Left column</div>
        <div>Right column</div>
      </Slide>
    </Deck>
  );
}
```

## Tree-Shakeable Imports

```tsx
// Only imports core engine + types (tiny bundle)
import { createDeckMachine } from "@repo/present/core";
import { useDeck } from "@repo/present/state";

// Only imports animation system
import { useMotionValue, useSpring, AnimatePresence } from "@repo/present/animation";

// Only imports gesture hooks
import { useSwipe, useDrag, usePinch } from "@repo/present/gestures";

// Only imports UI components
import { Deck, Slide, Viewport, Transitions } from "@repo/present/ui";

// Only imports themes
import { midnight, createTheme } from "@repo/present/themes";

// Only imports plugins
import { analytics, autoplay, notes } from "@repo/present/plugins";

// Full bundle (everything)
import { Deck, Slide, useMotionValue, midnight } from "@repo/present";
```

## Core API

### Deck Machine

```tsx
import { createDeckMachine } from "@repo/present/core";

const machine = createDeckMachine(10); // 10 slides
machine.send("NEXT");
machine.send("GO_TO", { index: 5 });
machine.send("TOGGLE_OVERVIEW");
```

### useDeck Hook

```tsx
import { useDeck } from "@repo/present/state";

function MyComponent() {
  const {
    // State
    current,        // number - current slide index
    fragment,       // number - current fragment index
    total,          // number - total slides
    isFullscreen,   // boolean
    isOverview,     // boolean
    isPresenter,    // boolean
    direction,      // "forward" | "backward"
    isTransitioning,// boolean
    state,          // "idle" | "presenting" | "overview" | "paused"

    // Actions
    next,           // () => void
    prev,           // () => void
    goTo,           // (index: number) => void
    nextFragment,   // () => void
    prevFragment,   // () => void
    toggleFullscreen,// () => void
    toggleOverview, // () => void
    togglePresenter,// () => void
  } = useDeck();
}
```

### Motion Values

```tsx
import { useMotionValue, useTransform, useSpring } from "@repo/present/animation";

function AnimatedComponent() {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      style={{ x: springX, opacity }}
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
    />
  );
}
```

### Spring Configuration

```tsx
import { springPresets } from "@repo/present/animation";

// Presets
springPresets.default    // { stiffness: 170, damping: 26, mass: 1 }
springPresets.gentle     // { stiffness: 120, damping: 14, mass: 1 }
springPresets.wobbly     // { stiffness: 180, damping: 12, mass: 1 }
springPresets.stiff      // { stiffness: 300, damping: 30, mass: 1 }
springPresets.slow       // { stiffness: 80, damping: 20, mass: 1 }
springPresets.molasses   // { stiffness: 280, damping: 120, mass: 1 }

// Custom spring
const spring = useSpring(value, {
  stiffness: 100,
  damping: 20,
  mass: 1,
});
```

### AnimatePresence

```tsx
import { AnimatePresence } from "@repo/present/animation";

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", ...springPresets.gentle }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```

### Gesture Hooks

```tsx
import { useSwipe, useDrag, usePinch, useGesture } from "@repo/present/gestures";

// Swipe
const { direction, velocity, isActive } = useSwipe(ref, {
  onSwipeLeft: () => goTo(current + 1),
  onSwipeRight: () => goTo(current - 1),
  threshold: 50,
  velocityThreshold: 0.3,
});

// Drag
const { x, y, isDragging } = useDrag(ref, {
  onDrag: ({ x, y }) => setPosition({ x, y }),
  constraints: { left: 0, right: 500, top: 0, bottom: 500 },
});

// Pinch
const { scale, origin } = usePinch(ref, {
  onPinch: ({ scale }) => setZoom(scale),
  minScale: 0.5,
  maxScale: 3,
});

// Unified gesture hook
useGesture(ref, {
  onSwipe: handleSwipe,
  onDrag: handleDrag,
  onPinch: handlePinch,
  onLongPress: handleLongPress,
});
```

### Scroll-Linked

```tsx
import { useScroll, useParallax, ScrollLinked } from "@repo/present/scroll";

// Scroll progress
const { progress, scrollY } = useScroll();

// Parallax
const parallaxY = useParallax(0.5); // 50% speed

// Declarative scroll-linked
<ScrollLinked
  inputRange={[0, 1]}
  outputRange={["0deg", "360deg"]}
  property="rotate"
>
  <div>Rotates as you scroll</div>
</ScrollLinked>
```

### Router

```tsx
import { useRouter } from "@repo/present/router";

const { slide, fragment, navigate } = useRouter();

// Navigate programmatically
navigate(5, 2); // slide 5, fragment 2

// URL is automatically: #slide-5/fragment-2
```

### Plugins

```tsx
import { usePlugins, analytics, autoplay, notes } from "@repo/present/plugins";

// Register plugins
const pluginManager = usePlugins([
  analytics({ trackViews: true, trackTime: true }),
  autoplay({ interval: 5000, pauseOnHover: true }),
  notes({ position: "bottom" }),
]);
```

### Themes

```tsx
import { midnight, light, monokai, nord, solarized, createTheme } from "@repo/present/themes";

// Use preset
<Deck theme={midnight}>

// Create custom
const myTheme = createTheme(midnight, {
  primary: "#ff6b6b",
  background: "#1a1a2e",
  accent: "#4ecdc4",
});

<Deck theme={myTheme}>
```

## Component Props

### Deck

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Slide components |
| `theme` | `Theme \| string` | `"midnight"` | Theme preset or custom theme |
| `plugins` | `Plugin[]` | `[]` | Plugins to register |
| `onSlideChange` | `(index: number) => void` | — | Slide change callback |
| `onStart` | `() => void` | — | Deck start callback |
| `onEnd` | `() => void` | — | Deck end callback |
| `keyboard` | `boolean \| KeyboardConfig` | `true` | Enable keyboard navigation |
| `swipe` | `boolean \| SwipeConfig` | `true` | Enable swipe navigation |
| `hash` | `boolean` | `true` | Enable hash-based routing |
| `progress` | `ProgressVariant` | `"bar"` | Progress indicator variant |
| `className` | `string` | — | Additional CSS class |

### Slide

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Slide content |
| `layout` | `SlideLayout` | `"default"` | Layout template |
| `background` | `SlideBackground` | — | Background config |
| `transition` | `TransitionConfig` | — | Enter/exit transition |
| `className` | `string` | — | Additional CSS class |
| `id` | `string` | auto | Unique slide ID |

### Appear

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Content to reveal |
| `step` | `number` | — | Fragment step index |
| `animation` | `FragmentAnimation` | `"fade"` | Animation type |
| `delay` | `number` | `0` | Delay in ms |
| `spring` | `SpringConfig` | `presets.default` | Spring physics config |