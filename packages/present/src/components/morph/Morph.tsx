/**
 * Morph — Shared-element FLIP transition via Framer Motion layoutId.
 *
 * Wrap the same `id` on elements across two slides and they will smoothly
 * transition between their positions, sizes, and styles when the slide changes.
 *
 * Requires framer-motion peer dep (already listed in peerDependencies).
 *
 * Usage:
 *   <Morph id="hero-img"><img src="thumb.jpg" /></Morph>
 *   // ... on next slide ...
 *   <Morph id="hero-img"><img src="thumb.jpg" style={{ width: '100%' }} /></Morph>
 */

import React, { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/classnames";

export interface MorphProps {
  /** Shared id — must match across slides to trigger the FLIP morph */
  id: string;
  children: ReactNode;
  spring?: { stiffness?: number; damping?: number };
  className?: string;
  style?: React.CSSProperties;
}

export function Morph({ id, children, spring, className, style }: MorphProps) {
  return (
    <motion.div
      layoutId={id}
      className={cn("present-morph", className)}
      style={style}
      transition={{
        type: "spring",
        stiffness: spring?.stiffness ?? 200,
        damping: spring?.damping ?? 28,
      }}
    >
      {children}
    </motion.div>
  );
}
