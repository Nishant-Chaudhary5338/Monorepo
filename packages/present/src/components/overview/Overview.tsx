/**
 * Overview — Thumbnail grid of all slides in the deck.
 *
 * Renders when deck state is `isOverview === true`. Each thumbnail
 * is a scaled clone rendered via CSS transform (no iframes needed).
 * Clicking a thumbnail navigates to that slide and exits overview.
 *
 * Press `o` to toggle overview mode from the Deck keyboard shortcuts.
 */

import React, { type ReactNode } from "react";
import { cn } from "../../utils/classnames";
import { useDeckContext } from "../deck/Deck";

export interface OverviewProps {
  /** Override children — defaults to slides from deck context */
  children?: ReactNode;
  /** Number of columns (auto by default) */
  columns?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Overview({ children, columns, className, style }: OverviewProps) {
  const { state, actions, slides } = useDeckContext();

  if (!state.isOverview) return null;

  const items = children ? React.Children.toArray(children) : slides;
  const colCount = columns ?? Math.ceil(Math.sqrt(items.length));

  return (
    <div
      className={cn("present-overview-panel", className)}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        background: "var(--present-overview-background, rgba(0,0,0,0.92))",
        overflow: "auto",
        padding: "2rem",
        ...style,
      }}
      onClick={(e) => {
        // Close overview if clicking the backdrop (not a thumbnail)
        if (e.target === e.currentTarget) actions.toggleOverview();
      }}
    >
      <div
        className="present-overview-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {items.map((slide, i) => (
          <button
            key={i}
            className={cn(
              "present-overview-thumb",
              i === state.current && "present-overview-thumb--active",
            )}
            onClick={() => {
              actions.goTo(i);
              actions.toggleOverview();
            }}
            style={{
              position: "relative",
              aspectRatio: "16/9",
              border: "2px solid",
              borderColor:
                i === state.current
                  ? "var(--present-accent, #6366f1)"
                  : "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              background: "var(--present-background, #000)",
              padding: 0,
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            {/* Slide number badge */}
            <span
              className="present-overview-index"
              style={{
                position: "absolute",
                top: 4,
                left: 6,
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.5)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              {i + 1}
            </span>

            {/* Scaled slide preview */}
            <div
              className="present-overview-slide-wrap"
              style={{
                position: "absolute",
                inset: 0,
                transform: "scale(0.2)",
                transformOrigin: "top left",
                width: "500%",
                height: "500%",
                pointerEvents: "none",
              }}
            >
              {slide}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
