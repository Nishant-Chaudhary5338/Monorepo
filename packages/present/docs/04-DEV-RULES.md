# Present — Development Rules

## TypeScript Rules (STRICT)

### Compiler Options
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": true,
  "noUncheckedIndexedAccess": true,
  "noFallthroughCasesInSwitch": true
}
```

### Coding Standards
- **NO `any`** — Use `unknown` + type guards
- **Explicit return types** on all exported functions
- **Discriminated unions** for state types, event types
- **Branded types** for IDs (SlideId, DeckId)
- **Readonly** where possible (immutable state)
- **const assertions** for literal types
- **Type predicates** for type narrowing
- **No type assertions** (`as`) unless absolutely necessary

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Types: `camelCase.types.ts` or in `types/`
- Tests: `*.test.ts` or `*.test.tsx`
- Styles: `camelCase.css` or `kebab-case.css`

---

## React Rules

### Component Rules
- **React.memo** on ALL components
- **forwardRef** for components that accept refs
- **displayName** on all forwardRef components
- **No inline functions** in JSX (useCallback)
- **No inline objects** in JSX (useMemo)
- **Destructure props** in function signature
- **Default props** via destructuring defaults

### Hooks Rules
- **useMemo** for computed values
- **useCallback** for all event handlers
- **useRef** for DOM refs and previous values
- **useEffect** cleanup functions always
- **Custom hooks** for reusable logic
- **No conditional hooks**

### Performance
- **Lazy loading** for heavy components (CodeBlock, Canvas)
- **Suspense** boundaries for async components
- **React.startTransition** for non-urgent updates (overview toggle)

---

## Animation Rules

### Spring Physics
- **Always use springs** for interactive animations
- **Use timing** only for non-interactive (fade-in on mount)
- **Preset springs** for common cases, custom for fine-tuning
- **No CSS transitions** for state-driven animations

### Motion Values
- **MotionValue** for any value that animates
- **useTransform** for derived values (never compute in render)
- **useSpring** for spring-animated values

### Frame Budget
- **16ms per frame** — never block the main thread
- **Batch DOM writes** — use RAF for style updates
- **will-change** only on actively animating elements
- **Remove will-change** after animation completes

---

## Architecture Rules (SOLID)

### Single Responsibility
- One module, one job
- Extract complex animation logic to animation/ module
- Extract complex state logic to state/ module
- UI components are pure presentation

### Open/Closed
- Extend via props, not modification
- Use composition over inheritance
- Render props or children for customization
- Plugins extend core without modifying it

### Liskov Substitution
- Components work with any valid props
- No prop type narrowing in components
- Slide works with any layout

### Interface Segregation
- Small, focused interfaces
- Optional props for non-essential features
- Discriminated unions for variants

### Dependency Independence
- Hooks abstract implementations
- State machine is the single source of truth
- Components depend on context, not concrete state
- core/ has zero React dependencies

---

## DRY Rules

### Code Reuse
- Shared types in `types/`
- Shared utilities in `utils/`
- Shared animation variants in animation module
- Shared hooks in their respective modules
- NO duplicate logic across modules

### Barrel Exports
- Each module folder has `index.ts`
- Re-export types and components
- Clear public API surface

---

## Performance Rules (CRITICAL)

This is an animation-heavy library. Every optimization matters.

### Mandatory Optimizations
| Technique | Where | Why |
|---|---|---|
| React.memo | All components | Prevent unnecessary re-renders |
| useMemo | Computed values | Cache expensive calculations |
| useCallback | All handlers | Stable references for memo |
| RAF | Animation loops | Sync with browser repaint |
| CSS transforms | Position/size/rotation | GPU acceleration |
| will-change | Active animations | Browser optimization hint |
| useRef | DOM refs, prev values | Avoid re-renders |
| Debounce | Resize events (150ms) | Reduce update frequency |
| Throttle | Gesture events (16ms) | 60fps smooth updates |

### Animation Performance Patterns
```tsx
// ✅ Good: CSS transform for position
<div style={{ transform: `translate(${x}px, ${y}px)` }}>...</div>

// ❌ Bad: Left/top causes layout reflow
<div style={{ left: x, top: y }}>...</div>
```

```tsx
// ✅ Good: Memoized component with stable callback
const Slide = React.memo(function Slide({ index, onTransitionEnd }: Props) {
  const handleEnd = useCallback(() => {
    onTransitionEnd(index);
  }, [index, onTransitionEnd]);

  return <div onTransitionEnd={handleEnd}>...</div>;
});

// ❌ Bad: New function every render
function Slide({ index, onTransitionEnd }: Props) {
  return <div onTransitionEnd={() => onTransitionEnd(index)}>...</div>;
}
```

```tsx
// ✅ Good: Throttled gesture handler
const handleDrag = useThrottledCallback((position) => {
  motionValue.set(position);
}, 16); // 60fps

// ❌ Bad: Unthrottled updates on every pixel
const handleDrag = (position) => {
  motionValue.set(position); // Fires hundreds of times per second
};
```

---

## CSS Rules

### Class Naming
- BEM-like: `.present-slide`, `.present-slide--active`, `.present-slide__content`
- Namespace: All classes prefixed with `present-`
- No utility classes — use CSS custom properties for theming

### Theming
- CSS custom properties for all theme tokens
- `--present-color-primary`, `--present-color-background`, etc.
- Each theme preset overrides these variables

### Animations
- CSS keyframes for simple, non-interactive animations
- Spring physics for interactive animations (JS-driven)
- `will-change: transform` on animated elements
- `transform: translateZ(0)` for GPU layer promotion

---

## Naming Conventions

### Variables
- `isPresenting` — boolean
- `slideIndex` — number indices
- `handleNext` — event handlers
- `useDeck` — hooks
- `DeckRoot` — components

### Files
- `Deck.tsx` — component
- `use-deck.ts` — hook
- `deck-machine.ts` — state machine
- `spring.ts` — utility
- `deck.test.tsx` — test

### Constants
- `DEFAULT_SPRING` — defaults
- `SPRING_PRESETS` — presets
- `KEYBOARD_SHORTCUTS` — mappings

---

## Git Rules

### Commits
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`
- One feature per commit
- Meaningful commit messages

### Branches
- `feat/feature-name` for features
- `fix/bug-name` for fixes
- `docs/update-name` for docs
- `perf/optimization-name` for performance improvements