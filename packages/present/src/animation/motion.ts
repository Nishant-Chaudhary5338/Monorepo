/**
 * Motion values — reactive primitives for animations (Framer Motion API)
 *
 * MotionValue is a reactive container that holds a value and notifies
 * subscribers when it changes. No React re-renders — just direct DOM updates.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { springPresets, type SpringConfig } from "./spring";
import { animationEngine } from "../core/engine";

/** Listener callback type */
type Listener<T> = (value: T) => void;

/**
 * MotionValue — reactive value container
 *
 * Unlike useState, updating a MotionValue does NOT trigger a React re-render.
 * Instead, subscribers are notified directly for efficient DOM updates.
 */
export class MotionValue<T = number> {
  private current: T;
  private listeners = new Set<Listener<T>>();
  private transformers: Array<(value: T) => T> = [];

  constructor(initialValue: T) {
    this.current = initialValue;
  }

  /** Get the current value */
  get(): T {
    return this.current;
  }

  /** Set a new value and notify listeners */
  set(value: T): void {
    // Apply transformers
    let transformed = value;
    for (const transformer of this.transformers) {
      transformed = transformer(transformed);
    }

    if (this.current === transformed) return;
    this.current = transformed;
    this.notify();
  }

  /** Subscribe to value changes */
  on(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Unsubscribe from value changes */
  off(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }

  /** Add a transformer function */
  pipe(...fns: Array<(value: T) => T>): MotionValue<T> {
    this.transformers.push(...fns);
    return this;
  }

  /** Destroy the motion value — clean up all listeners */
  destroy(): void {
    this.listeners.clear();
    this.transformers = [];
  }

  /** Notify all listeners */
  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.current);
    }
  }
}

/**
 * useMotionValue — Hook for creating a MotionValue
 *
 * The returned value is stable across renders — updates don't cause re-renders.
 */
export function useMotionValue(initialValue: number): MotionValue<number> {
  const ref = useRef<MotionValue<number> | null>(null);

  if (ref.current === null) {
    ref.current = new MotionValue(initialValue);
  }

  useEffect(() => {
    return () => {
      ref.current?.destroy();
    };
  }, []);

  return ref.current;
}

/**
 * useTransform — Create a derived MotionValue
 *
 * Maps a source MotionValue through a transform function.
 * When the source changes, the derived value updates automatically.
 */
export function useTransform(
  source: MotionValue<number>,
  transform: (value: number) => number,
): MotionValue<number> {
  const derived = useMotionValue(transform(source.get()));

  useEffect(() => {
    const unsubscribe = source.on((value) => {
      derived.set(transform(value));
    });
    return unsubscribe;
  }, [source, derived]);

  return derived;
}

/**
 * useTransform — Map-range variant
 *
 * Maps a value from an input range to an output range.
 */
export function useTransformRange(
  source: MotionValue<number>,
  inputRange: [number, number],
  outputRange: [number, number],
): MotionValue<number> {
  return useTransform(source, (value) => {
    const [inMin, inMax] = inputRange;
    const [outMin, outMax] = outputRange;
    const t = (value - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
  });
}

/**
 * useSpring — Spring-animated MotionValue
 *
 * When the source changes, the output smoothly animates to the new value
 * using spring physics.
 */
export function useSpring(
  source: MotionValue<number>,
  config: SpringConfig = springPresets.default,
): MotionValue<number> {
  const output = useMotionValue(source.get());
  const springIdRef = useRef<string | null>(null);
  const engine = animationEngine;

  useEffect(() => {
    const unsubscribe = source.on((target) => {
      // Stop previous spring
      if (springIdRef.current) {
        engine.stopSpring(springIdRef.current);
      }

      // Start new spring from current position to target
      springIdRef.current = engine.animateSpring({
        from: output.get(),
        to: target,
        config,
        onUpdate: (value) => output.set(value),
        priority: "critical",
      });
    });

    return () => {
      unsubscribe();
      if (springIdRef.current) {
        engine.stopSpring(springIdRef.current);
      }
    };
  }, [source, output, config]);

  return output;
}

/**
 * useVelocity — Track the velocity of a MotionValue
 */
export function useVelocity(source: MotionValue<number>): MotionValue<number> {
  const velocity = useMotionValue(0);
  const prevValueRef = useRef(source.get());
  const prevTimeRef = useRef(performance.now());

  useEffect(() => {
    const unsubscribe = source.on((value) => {
      const now = performance.now();
      const dt = now - prevTimeRef.current;
      if (dt > 0) {
        velocity.set((value - prevValueRef.current) / dt);
      }
      prevValueRef.current = value;
      prevTimeRef.current = now;
    });

    return unsubscribe;
  }, [source, velocity]);

  return velocity;
}