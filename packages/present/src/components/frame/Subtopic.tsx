/**
 * Subtopic — A child frame inside a Topic. Used for orbital or linear layout.
 *
 * Subtopics do NOT declare canvas coordinates themselves — their parent
 * Topic component computes and injects the position via context.
 */

import React, { createContext, useContext, type ReactNode } from "react";
import { Frame } from "./Frame";

/** Context injected by Topic to pass computed position to each Subtopic */
export interface SubtopicPositionContextValue {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SubtopicPositionContext = createContext<SubtopicPositionContextValue | null>(null);

export interface SubtopicProps {
  /** Unique ID used in <PreziCanvas path> */
  id: string;
  /** Title label */
  title?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Subtopic({ id, title, children, className, style }: SubtopicProps) {
  const pos = useContext(SubtopicPositionContext);
  if (!pos) {
    console.warn(`<Subtopic id="${id}"> must be placed inside a <Topic>.`);
    return null;
  }

  return (
    <Frame
      id={id}
      x={pos.x}
      y={pos.y}
      width={pos.width}
      height={pos.height}
      label={title}
      shape="rounded"
      className={className}
      style={style}
    >
      {children}
    </Frame>
  );
}
