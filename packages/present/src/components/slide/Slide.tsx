/**
 * Slide — Single slide container with AnimatePresence
 */

import React, { type ReactNode, useMemo } from "react";
import { useDeckContext } from "../deck/Deck";
import type { SlideLayout, SlideBackground } from "../../types";

/** Slide props */
export interface SlideProps {
  /** Slide content */
  children: ReactNode;
  /** Slide layout */
  layout?: SlideLayout;
  /** Slide background */
  background?: SlideBackground;
  /** Slide title (for overview) */
  title?: string;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/** Get layout styles */
function getLayoutStyles(layout: SlideLayout): React.CSSProperties {
  switch (layout) {
    case "center":
      return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      };
    case "two-column":
    case "two-column-left":
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        alignItems: "center",
      };
    case "two-column-right":
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        alignItems: "center",
        direction: "rtl",
      };
    case "full-bleed":
      return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      };
    case "title":
      return {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      };
    case "code":
      return {
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
      };
    case "grid-2x2":
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "1rem",
      };
    case "grid-3x1":
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "1rem",
      };
    default:
      return {
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
      };
  }
}

/** Get background styles */
function getBackgroundStyles(background: SlideBackground): React.CSSProperties {
  switch (background.type) {
    case "color":
      return { backgroundColor: background.value };
    case "gradient":
      return { background: background.value };
    case "image":
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    case "video":
      return {
        position: "relative",
        overflow: "hidden",
      };
    default:
      return {};
  }
}

/** Slide component */
export const Slide = React.memo(function Slide({
  children,
  layout = "default",
  background,
  title,
  className,
  style,
}: SlideProps): ReactNode {
  const { state } = useDeckContext();

  const layoutStyles = useMemo(() => getLayoutStyles(layout), [layout]);
  const backgroundStyles = useMemo(
    () => (background ? getBackgroundStyles(background) : {}),
    [background],
  );

  const slideStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      ...layoutStyles,
      ...backgroundStyles,
      ...style,
    }),
    [layoutStyles, backgroundStyles, style],
  );

  const slideClassName = useMemo(
    () => `present-slide present-layout-${layout} ${className ?? ""}`,
    [layout, className],
  );

  return (
    <div
      className={slideClassName}
      style={slideStyle}
      data-slide-title={title}
    >
      {children}
    </div>
  );
});