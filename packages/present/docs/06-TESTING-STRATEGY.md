# Present — Testing Strategy

## Testing Philosophy

- **Unit tests** for all pure functions (math, state machine, event bus)
- **Integration tests** for components (render, interaction, animation)
- **Hook tests** for custom hooks (useDeck, useMotionValue, useSwipe)
- **Edge cases** always tested (null, undefined, empty, boundary values)

## Test Tools

- **Vitest** — test runner
- **@testing-library/react** — component testing
- **@testing-library/jest-dom** — DOM matchers
- **vitest.setup.ts** — global test setup

## Module Test Plan

### Phase 2: Core Module

| File | Tests |
|---|---|
| `core/math.test.ts` | lerp, clamp, mapRange, springSolver — edge cases, precision |
| `core/scheduler.test.ts` | Frame scheduling, priority ordering, cancel, delta time |
| `core/engine.test.ts` | Animation start/stop, spring convergence, motion value updates |
| `core/events.test.ts` | on/off/emit, wildcard listeners, plugin integration, destroy |
| `core/reducer.test.ts` | All actions, boundary conditions, state transitions |

### Phase 3: State Module

| File | Tests |
|---|---|
| `state/deck-machine.test.ts` | All state transitions, guards, invalid transitions |
| `state/context.test.tsx` | Provider renders, children receive context |
| `state/use-deck.test.ts` | Hook returns correct state, actions dispatch correctly |

### Phase 4: Animation Module

| File | Tests |
|---|---|
| `animation/spring.test.ts` | Spring convergence, presets, custom config, edge cases |
| `animation/motion.test.ts` | MotionValue get/set, useTransform derived values |
| `animation/timeline.test.ts` | Sequential/parallel, seek, reverse, labels |
| `animation/presence.test.tsx` | Mount/unmount timing, exit complete callback |
| `animation/stagger.test.ts` | Stagger delay calculation, from modes |

### Phase 5: Gestures Module

| File | Tests |
|---|---|
| `gestures/recognizer.test.ts` | State transitions, velocity calculation |
| `gestures/use-swipe.test.ts` | Swipe detection, direction, velocity threshold |
| `gestures/use-drag.test.ts` | Drag constraints, position tracking |
| `gestures/use-pinch.test.ts` | Scale calculation, origin point |
| `gestures/use-gesture.test.ts` | Gesture dispatching, conflict resolution |

### Phase 7: Router Module

| File | Tests |
|---|---|
| `router/hash-router.test.ts` | Hash parsing, building, change listeners |
| `router/use-router.test.ts` | URL sync, navigation, fragment support |

### Phase 8: Plugins Module

| File | Tests |
|---|---|
| `plugins/manager.test.ts` | Register/unregister, lifecycle, error isolation |
| `plugins/built-in/analytics.test.ts` | Event tracking, time measurement |
| `plugins/built-in/autoplay.test.ts` | Timer, pause/resume, loop |

### Phase 10: Themes Module

| File | Tests |
|---|---|
| `themes/create-theme.test.ts` | Deep merge, validation, defaults |

### Phase 11: Utils Module

| File | Tests |
|---|---|
| `utils/classnames.test.ts` | Class merging, conditions, arrays |
| `utils/dom.test.ts` | Fullscreen helpers |
| `utils/keyboard.test.ts` | Shortcut mapping, modifier keys |

## Test Coverage Targets

| Module | Target |
|---|---|
| core/ | > 90% |
| state/ | > 85% |
| animation/ | > 85% |
| gestures/ | > 80% |
| router/ | > 80% |
| plugins/ | > 80% |
| ui/ | > 70% |
| themes/ | > 90% |
| utils/ | > 95% |
| **Overall** | **> 80%** |

## Test Patterns

### Pure Function Test
```ts
import { describe, it, expect } from "vitest";
import { lerp, clamp, mapRange } from "./math";

describe("math", () => {
  it("lerp interpolates correctly", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it("clamp restricts to bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
```

### Hook Test
```ts
import { renderHook, act } from "@testing-library/react";
import { useDeck } from "./use-deck";

describe("useDeck", () => {
  it("starts at slide 0", () => {
    const { result } = renderHook(() => useDeck());
    expect(result.current.current).toBe(0);
  });

  it("navigates to next slide", () => {
    const { result } = renderHook(() => useDeck());
    act(() => result.current.next());
    expect(result.current.current).toBe(1);
  });
});
```

### Component Test
```tsx
import { render, screen } from "@testing-library/react";
import { Deck } from "./Deck";

describe("Deck", () => {
  it("renders children", () => {
    render(
      <Deck>
        <Slide>Slide 1</Slide>
        <Slide>Slide 2</Slide>
      </Deck>
    );
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
  });
});