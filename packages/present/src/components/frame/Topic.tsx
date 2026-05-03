/**
 * Topic — A parent frame that auto-lays out child <Subtopic> components.
 *
 * Two layout modes:
 *   "planet" — subtopics orbit the topic center at a computed radius (like Prezi planets)
 *   "page"   — subtopics sit in a horizontal or vertical row beside the topic
 *
 * The Topic itself is a Frame (you can put a TopicCover inside it).
 * The path through a topic typically goes: topic ID → subtopic IDs.
 *
 * Usage:
 *   <Topic id="chapter1" x={3000} y={0} width={1920} height={1080} layout="planet">
 *     <TopicCover><h1>Chapter 1</h1></TopicCover>
 *     <Subtopic id="ch1-a" title="Point A"><p>...</p></Subtopic>
 *     <Subtopic id="ch1-b" title="Point B"><p>...</p></Subtopic>
 *   </Topic>
 */

import React, { Children, isValidElement, useMemo, type ReactNode } from "react";
import { Frame } from "./Frame";
import { Subtopic, SubtopicPositionContext, type SubtopicPositionContextValue } from "./Subtopic";
import { computePlanetLayout, computePageLayout } from "../../core/camera";
import { cn } from "../../utils/classnames";

export type TopicLayout = "planet" | "page-horizontal" | "page-vertical";

export interface TopicProps {
  /** Frame ID for the topic itself */
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  /** Layout of subtopics around the topic */
  layout?: TopicLayout;
  /** For planet layout: orbit radius in canvas px (auto-computed if omitted) */
  orbitRadius?: number;
  /** For page layout: subtopic frame size */
  subtopicWidth?: number;
  subtopicHeight?: number;
  /** Gap between subtopics in page layout */
  gap?: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface TopicCoverProps {
  children: ReactNode;
  className?: string;
}

/** Decorative cover element shown inside a Topic frame */
export function TopicCover({ children, className }: TopicCoverProps) {
  return (
    <div className={cn("present-topic-cover", className)} style={{ width: "100%", height: "100%" }}>
      {children}
    </div>
  );
}

export function Topic({
  id,
  x,
  y,
  width = 1920,
  height = 1080,
  label,
  layout = "planet",
  orbitRadius,
  subtopicWidth = 960,
  subtopicHeight = 540,
  gap = 120,
  children,
  className,
  style,
}: TopicProps) {
  // Separate TopicCover children from Subtopic children
  const childArray = Children.toArray(children);
  const coverChildren  = childArray.filter((c) => isValidElement(c) && c.type === TopicCover);
  const subtopicChildren = childArray.filter((c) => isValidElement(c) && c.type === Subtopic);
  const otherChildren  = childArray.filter((c) => !isValidElement(c) || (c.type !== TopicCover && c.type !== Subtopic));

  const topicCenterX = x + width / 2;
  const topicCenterY = y + height / 2;
  const count = subtopicChildren.length;

  // Compute subtopic positions relative to topic center
  const offsets = useMemo(() => {
    if (layout === "planet") {
      const radius = orbitRadius ?? Math.max(width, height) * 0.85;
      return computePlanetLayout(count, radius);
    }
    if (layout === "page-vertical") {
      return computePageLayout(count, subtopicWidth, subtopicHeight, gap, "vertical").map((o) => ({
        dx: o.dx + width / 2 + subtopicWidth / 2 + gap,
        dy: o.dy,
      }));
    }
    // page-horizontal: subtopics below the topic
    return computePageLayout(count, subtopicWidth, subtopicHeight, gap, "horizontal").map((o) => ({
      dx: o.dx,
      dy: o.dy + height / 2 + subtopicHeight / 2 + gap,
    }));
  }, [layout, count, width, height, orbitRadius, subtopicWidth, subtopicHeight, gap]);

  // Build positioned subtopic nodes
  const positionedSubtopics = subtopicChildren.map((child, i) => {
    if (!isValidElement(child)) return child;
    const off = offsets[i] ?? { dx: 0, dy: 0 };
    const pos: SubtopicPositionContextValue = {
      x: topicCenterX + off.dx - subtopicWidth / 2,
      y: topicCenterY + off.dy - subtopicHeight / 2,
      width: subtopicWidth,
      height: subtopicHeight,
    };
    return (
      <SubtopicPositionContext.Provider key={child.key ?? i} value={pos}>
        {child}
      </SubtopicPositionContext.Provider>
    );
  });

  return (
    <>
      {/* The topic frame itself */}
      <Frame
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        label={label}
        shape="rounded"
        className={cn("present-topic", className)}
        style={style}
      >
        {coverChildren}
        {otherChildren}
      </Frame>

      {/* Subtopics rendered as sibling frames on the canvas */}
      {positionedSubtopics}
    </>
  );
}
