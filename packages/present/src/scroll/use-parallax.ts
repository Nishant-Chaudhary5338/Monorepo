/**
 * useParallax — Parallax depth effect hook
 *
 * Creates a parallax effect by mapping scroll progress to a transform offset.
 * Different layers move at different speeds based on their "speed" factor.
 */

import { useEffect, useRef, useState } from "react";
import { useScroll } from "./use-scroll";

/** Configuration for useParallax */
export interface ParallaxConfig {
  /** Speed factor: 0 = stationary, 0.5 = half speed, 1 = full speed, 2 = double speed */
  speed?: number;
  /** Target element to track scroll on */
  target?: React.RefObject<HTMLElement | null>;
  /** Output range in pixels (default: [-100, 100]) */
  range?: [number, number];
  /** Enabled state */
  enabled?: boolean;
}

/**
 * useParallax — Get a parallax transform offset based on scroll
 *
 * @param speed — Speed factor (default: 0.5)
 * @param config — Additional configuration
 * @returns Transform offset in pixels
 */
export function useParallax(
  speed = 0.5,
  config: Omit<ParallaxConfig, "speed"> = {},
): number {
  const { target, range = [-100, 100], enabled = true } = config;
  const { progress } = useScroll({ target, enabled });
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Map progress (0-1) through speed factor to output range
    const rawOffset = (progress - 0.5) * 2; // -1 to 1
    const scaledOffset = rawOffset * speed;
    const mappedOffset = range[0] + (scaledOffset + 1) * 0.5 * (range[1] - range[0]);
    setOffset(mappedOffset);
  }, [progress, speed, range]);

  return offset;
}