/**
 * Controls — Navigation controls for presentations
 */

import React, { type ReactNode, useCallback, useMemo } from "react";
import { useDeckContext } from "../deck/Deck";

/** Controls props */
export interface ControlsProps {
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show fullscreen button */
  showFullscreen?: boolean;
  /** Show overview button */
  showOverview?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/** Control button component */
const ControlButton = React.memo(function ControlButton({
  onClick,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  title: string;
}): ReactNode {
  return (
    <button
      className="present-control-button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: "none",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.3 : 1,
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s ease",
      }}
    >
      {children}
    </button>
  );
});

/** Arrow icon */
const ArrowIcon = React.memo(function ArrowIcon({ direction }: { direction: "left" | "right" }): ReactNode {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
});

/** Fullscreen icon */
const FullscreenIcon = React.memo(function FullscreenIcon(): ReactNode {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
});

/** Overview icon */
const OverviewIcon = React.memo(function OverviewIcon(): ReactNode {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
});

/** Controls component */
export const Controls = React.memo(function Controls({
  showArrows = true,
  showFullscreen = true,
  showOverview = true,
  className,
  style,
}: ControlsProps): ReactNode {
  const { state, actions } = useDeckContext();

  const isFirst = state.current === 0;
  const isLast = state.current === state.total - 1;

  const handlePrev = useCallback(() => actions.prev(), [actions]);
  const handleNext = useCallback(() => actions.next(), [actions]);
  const handleToggleOverview = useCallback(() => actions.toggleOverview(), [actions]);
  const handleToggleFullscreen = useCallback(() => actions.toggleFullscreen(), [actions]);

  const controlsStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "absolute",
      bottom: "1rem",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "8px",
      alignItems: "center",
      padding: "8px 16px",
      borderRadius: "8px",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      ...style,
    }),
    [style],
  );

  return (
    <div
      className={`present-controls ${className ?? ""}`}
      style={controlsStyle}
    >
      {showArrows && (
        <>
          <ControlButton
            onClick={handlePrev}
            disabled={isFirst}
            title="Previous slide"
          >
            <ArrowIcon direction="left" />
          </ControlButton>
          <ControlButton
            onClick={handleNext}
            disabled={isLast}
            title="Next slide"
          >
            <ArrowIcon direction="right" />
          </ControlButton>
        </>
      )}

      {showOverview && (
        <ControlButton
          onClick={handleToggleOverview}
          title="Toggle overview"
        >
          <OverviewIcon />
        </ControlButton>
      )}

      {showFullscreen && (
        <ControlButton
          onClick={handleToggleFullscreen}
          title="Toggle fullscreen"
        >
          <FullscreenIcon />
        </ControlButton>
      )}
    </div>
  );
});