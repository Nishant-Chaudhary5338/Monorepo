/**
 * FrameRegistry — React context that Frame components register into.
 *
 * Uses a Map stored in a ref (not state) so frame registration causes
 * no React re-renders. PreziCanvas reads the registry on navigation.
 */

import { createContext, useContext, useMemo, useRef } from "react";

export interface FrameRegistration {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  rotation?: number;
}

export interface FrameRegistryContextValue {
  register(frame: FrameRegistration): void;
  unregister(id: string): void;
  getFrame(id: string): FrameRegistration | undefined;
  getAllFrames(): FrameRegistration[];
}

export const FrameRegistryContext = createContext<FrameRegistryContextValue | null>(null);

/** Hook — throws if used outside a PreziCanvas */
export function useFrameRegistry(): FrameRegistryContextValue {
  const ctx = useContext(FrameRegistryContext);
  if (!ctx) throw new Error("useFrameRegistry must be used inside <PreziCanvas>");
  return ctx;
}

/** Hook — returns null when used outside a PreziCanvas (safe version) */
export function useFrameRegistryOptional(): FrameRegistryContextValue | null {
  return useContext(FrameRegistryContext);
}

/** Create a stable registry context value backed by a Map ref. */
export function useCreateFrameRegistry(): FrameRegistryContextValue {
  const map = useRef(new Map<string, FrameRegistration>());
  return useMemo<FrameRegistryContextValue>(
    () => ({
      register: (frame) => map.current.set(frame.id, frame),
      unregister: (id) => map.current.delete(id),
      getFrame: (id) => map.current.get(id),
      getAllFrames: () => [...map.current.values()],
    }),
    [],
  );
}
