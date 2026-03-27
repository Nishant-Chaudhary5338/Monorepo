/**
 * AnimatePresence — Mount/unmount animation orchestration
 *
 * Handles exit animations before unmounting children.
 * Similar to Framer Motion's AnimatePresence component.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { animationEngine, type SpringConfig } from "../core";
import { springPresets } from "./spring";

/** Presence state for a child element */
interface PresenceChild {
  key: string;
  element: ReactNode;
  isPresent: boolean;
  isExiting: boolean;
}

/** Animation config for enter/exit */
export interface PresenceAnimationConfig {
  /** Initial opacity */
  initial?: { opacity?: number; x?: number; y?: number; scale?: number };
  /** Animate to */
  animate?: { opacity?: number; x?: number; y?: number; scale?: number };
  /** Exit animation */
  exit?: { opacity?: number; x?: number; y?: number; scale?: number };
  /** Spring config for animations */
  transition?: SpringConfig;
  /** Exit transition (falls back to transition) */
  exitTransition?: SpringConfig;
  /** Enter transition (falls back to transition) */
  enterTransition?: SpringConfig;
}

/** AnimatePresence props */
export interface AnimatePresenceProps {
  children: ReactNode;
  /** Animation configuration */
  animation?: PresenceAnimationConfig;
  /** Mode for handling multiple children */
  mode?: "sync" | "wait" | "popLayout";
  /** Callback when enter animation completes */
  onEnterComplete?: (key: string) => void;
  /** Callback when exit animation completes */
  onExitComplete?: (key: string) => void;
}

/** Context for presence animations */
interface PresenceContextValue {
  isPresent: boolean;
  isExiting: boolean;
  onExitComplete?: () => void;
}

const PresenceContext = createContext<PresenceContextValue>({
  isPresent: true,
  isExiting: false,
});

/** Hook to access presence context */
export function usePresence(): PresenceContextValue {
  return useContext(PresenceContext);
}

/** Hook for custom exit animations */
export function useAnimateExit(
  onExit: () => Promise<void> | void,
  deps: unknown[] = [],
): { isExiting: boolean; triggerExit: () => Promise<void> } {
  const [isExiting, setIsExiting] = useState(false);

  const triggerExit = useCallback(async () => {
    setIsExiting(true);
    await onExit();
    setIsExiting(false);
  }, deps);

  return { isExiting, triggerExit };
}

/** Generate a stable key for a child */
function getChildKey(child: ReactNode, index: number): string {
  if (React.isValidElement(child) && child.key != null) {
    return String(child.key);
  }
  return `presence_${index}`;
}

/** AnimatePresence component */
export function AnimatePresence({
  children,
  animation,
  mode = "wait",
  onEnterComplete,
  onExitComplete,
}: AnimatePresenceProps): ReactNode {
  const [presenceChildren, setPresenceChildren] = useState<PresenceChild[]>([]);
  const exitingKeys = useRef<Set<string>>(new Set());
  const prevChildrenRef = useRef<Map<string, ReactNode>>(new Map());

  // Get current child keys
  const currentChildren = React.Children.toArray(children);
  const currentKeys = new Set(
    currentChildren.map((child, i) => getChildKey(child, i)),
  );

  // Handle children changes
  useEffect(() => {
    const prevKeys = new Set(prevChildrenRef.current.keys());

    // Find new children (enter)
    const enteringKeys = new Set<string>();
    currentChildren.forEach((child, i) => {
      const key = getChildKey(child, i);
      if (!prevKeys.has(key)) {
        enteringKeys.add(key);
      }
    });

    // Find removed children (exit)
    const exitingKeysSet = new Set<string>();
    prevKeys.forEach((key) => {
      if (!currentKeys.has(key) && !exitingKeys.current.has(key)) {
        exitingKeysSet.add(key);
        exitingKeys.current.add(key);
      }
    });

    // Update presence children
    setPresenceChildren((prev) => {
      const next: PresenceChild[] = [];

      // Keep existing children that are still present or exiting
      for (const child of prev) {
        if (currentKeys.has(child.key)) {
          // Child is still present
          next.push({ ...child, isPresent: true, isExiting: false });
        } else if (exitingKeysSet.has(child.key)) {
          // Child is now exiting
          next.push({ ...child, isPresent: false, isExiting: true });
        } else if (child.isExiting) {
          // Keep exiting children until animation completes
          next.push(child);
        }
      }

      // Add new children
      currentChildren.forEach((child, i) => {
        const key = getChildKey(child, i);
        if (!next.some((c) => c.key === key)) {
          next.push({
            key,
            element: child,
            isPresent: true,
            isExiting: false,
          });
        }
      });

      return next;
    });

    // Update prev children ref
    prevChildrenRef.current = new Map(
      currentChildren.map((child, i) => [getChildKey(child, i), child]),
    );
  }, [children]);

  // Handle exit complete
  const handleExitComplete = useCallback(
    (key: string) => {
      exitingKeys.current.delete(key);
      setPresenceChildren((prev) => prev.filter((c) => c.key !== key));
      onExitComplete?.(key);
    },
    [onExitComplete],
  );

  // Handle enter complete
  const handleEnterComplete = useCallback(
    (key: string) => {
      onEnterComplete?.(key);
    },
    [onEnterComplete],
  );

  return (
    <>
      {presenceChildren.map((child) => (
        <PresenceContext.Provider
          key={child.key}
          value={{
            isPresent: child.isPresent,
            isExiting: child.isExiting,
            onExitComplete: () => handleExitComplete(child.key),
          }}
        >
          <PresenceChildWrapper
            isPresent={child.isPresent}
            isExiting={child.isExiting}
            animation={animation}
            onEnterComplete={() => handleEnterComplete(child.key)}
            onExitComplete={() => handleExitComplete(child.key)}
          >
            {child.element}
          </PresenceChildWrapper>
        </PresenceContext.Provider>
      ))}
    </>
  );
}

/** Wrapper for individual presence children */
interface PresenceChildWrapperProps {
  children: ReactNode;
  isPresent: boolean;
  isExiting: boolean;
  animation?: PresenceAnimationConfig;
  onEnterComplete: () => void;
  onExitComplete: () => void;
}

function PresenceChildWrapper({
  children,
  isPresent,
  isExiting,
  animation,
  onEnterComplete,
  onExitComplete,
}: PresenceChildWrapperProps): ReactNode {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasEntered = useRef(false);

  // Handle enter animation
  useEffect(() => {
    if (!isPresent || hasEntered.current) return;
    hasEntered.current = true;

    const element = elementRef.current;
    if (!element || !animation) return;

    const { initial, animate, enterTransition, transition } = animation;
    const config = enterTransition ?? transition ?? springPresets.default;

    // Apply initial styles
    if (initial) {
      if (initial.opacity !== undefined) element.style.opacity = String(initial.opacity);
      if (initial.x !== undefined) element.style.transform = `translateX(${initial.x}px)`;
      if (initial.y !== undefined) element.style.transform = `translateY(${initial.y}px)`;
      if (initial.scale !== undefined) element.style.transform = `scale(${initial.scale})`;
    }

    // Animate to target
    if (animate) {
      const springs: string[] = [];

      if (animate.opacity !== undefined) {
        const id = animationEngine.animateSpring({
          from: initial?.opacity ?? 1,
          to: animate.opacity,
          config,
          onUpdate: (v) => {
            element.style.opacity = String(v);
          },
          onComplete: () => {
            onEnterComplete();
          },
        });
        springs.push(id);
      }

      // Handle transforms
      const transforms: string[] = [];
      if (animate.x !== undefined) {
        const id = animationEngine.animateSpring({
          from: initial?.x ?? 0,
          to: animate.x,
          config,
          onUpdate: (v) => {
            transforms.push(`translateX(${v}px)`);
            element.style.transform = transforms.join(" ");
          },
        });
        springs.push(id);
      }

      if (animate.y !== undefined) {
        const id = animationEngine.animateSpring({
          from: initial?.y ?? 0,
          to: animate.y,
          config,
          onUpdate: (v) => {
            transforms.push(`translateY(${v}px)`);
            element.style.transform = transforms.join(" ");
          },
        });
        springs.push(id);
      }

      if (animate.scale !== undefined) {
        const id = animationEngine.animateSpring({
          from: initial?.scale ?? 1,
          to: animate.scale,
          config,
          onUpdate: (v) => {
            transforms.push(`scale(${v})`);
            element.style.transform = transforms.join(" ");
          },
        });
        springs.push(id);
      }

      if (springs.length === 0) {
        onEnterComplete();
      }
    } else {
      onEnterComplete();
    }
  }, [isPresent, animation]);

  // Handle exit animation
  useEffect(() => {
    if (!isExiting) return;

    const element = elementRef.current;
    if (!element || !animation?.exit) {
      onExitComplete();
      return;
    }

    const { exit, exitTransition, transition, animate } = animation;
    const config = exitTransition ?? transition ?? springPresets.default;
    let completedCount = 0;
    let totalCount = 0;

    const checkComplete = () => {
      completedCount++;
      if (completedCount >= totalCount) {
        onExitComplete();
      }
    };

    if (exit.opacity !== undefined) {
      totalCount++;
      animationEngine.animateSpring({
        from: animate?.opacity ?? parseFloat(element.style.opacity || "1"),
        to: exit.opacity,
        config,
        onUpdate: (v) => {
          element.style.opacity = String(v);
        },
        onComplete: checkComplete,
      });
    }

    if (exit.x !== undefined) {
      totalCount++;
      animationEngine.animateSpring({
        from: animate?.x ?? 0,
        to: exit.x,
        config,
        onUpdate: (v) => {
          element.style.transform = `translateX(${v}px)`;
        },
        onComplete: checkComplete,
      });
    }

    if (exit.y !== undefined) {
      totalCount++;
      animationEngine.animateSpring({
        from: animate?.y ?? 0,
        to: exit.y,
        config,
        onUpdate: (v) => {
          element.style.transform = `translateY(${v}px)`;
        },
        onComplete: checkComplete,
      });
    }

    if (exit.scale !== undefined) {
      totalCount++;
      animationEngine.animateSpring({
        from: animate?.scale ?? 1,
        to: exit.scale,
        config,
        onUpdate: (v) => {
          element.style.transform = `scale(${v})`;
        },
        onComplete: checkComplete,
      });
    }

    if (totalCount === 0) {
      onExitComplete();
    }
  }, [isExiting, animation]);

  return <div ref={elementRef}>{children}</div>;
}