import { useMemo } from "react";

export interface PerfTier {
  dpr: [number, number];
  bloom: boolean;
  low: boolean;
}

// Cheap device tiering — clamp dpr and drop bloom on weak/mobile/reduced-motion.
export function usePerfTier(): PerfTier {
  return useMemo<PerfTier>(() => {
    if (typeof window === "undefined") return { dpr: [1, 2], bloom: true, low: false };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 760px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    // deviceMemory is non-standard; narrow instead of using `any`
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const low = reduce || small || coarse || cores <= 4 || mem <= 4;
    // Bloom + additive points are fragment-bound — capping dpr is the single biggest win.
    return { dpr: low ? [1, 1] : [1, 1.5], bloom: !low, low };
  }, []);
}
