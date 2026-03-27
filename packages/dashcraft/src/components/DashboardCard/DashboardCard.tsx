import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import type {
  WidgetConfig,
  Position,
  Size,
  ViewBreakpoints,
} from "../../types";
import { useDashboardContext } from "../Dashboard/Dashboard.context";
import { WidgetActions, DragHandleButton } from "./WidgetActions";
import { DashboardCardViewCycler } from "./DashboardCardViewCycler";
import { useResponsive } from "../../hooks/useResponsive";
import { useDraggable } from "../../hooks/useDraggable";

// ============================================================
// DashboardCard Props
// ============================================================

export interface DashboardCardProps {
  // Identity
  id: string;
  type?: string;
  title?: string;

  // Features (all optional, default true where sensible)
  draggable?: boolean;
  deletable?: boolean;
  settings?: boolean;
  viewCycler?: boolean;

  // Settings Panel
  settingsPanel?: React.ReactNode | boolean;

  // Responsive Views
  viewBreakpoints?: ViewBreakpoints;

  // Size & Position (only used in edit mode)
  defaultSize?: Size;
  defaultPosition?: Position;

  // Styling
  className?: string;
  style?: React.CSSProperties;

  // Events
  onDelete?: () => void;

  // Content
  children?: React.ReactNode;
}

// ============================================================
// DashboardCard Component
// ============================================================

export const DashboardCard = React.memo(function DashboardCard({
  id,
  type = "custom",
  title,
  draggable = true,
  deletable = true,
  settings: showSettings = true,
  viewCycler: showViewCycler = false,
  viewBreakpoints,
  defaultSize,
  defaultPosition,
  className,
  style,
  onDelete: _onDelete,
  children,
}: DashboardCardProps): React.JSX.Element | null {
  // ==========================================================
  // Context
  // ==========================================================

  const { registerWidget, unregisterWidget, isEditMode, widgets, bringToFront } =
    useDashboardContext();

  // ==========================================================
  // Widget State
  // ==========================================================

  const widgetState = widgets[id];

  // ==========================================================
  // Draggable Hook
  // ==========================================================

  const disabled = !draggable || !isEditMode;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  // ==========================================================
  // Register/Unregister Widget
  // ==========================================================

  const widgetConfig = useMemo<WidgetConfig>(
    () => {
      let config: WidgetConfig = {
        id,
        type,
        draggable,
        deletable,
        settings: showSettings,
      };
      if (title !== undefined) config = { ...config, title };
      if (defaultSize !== undefined) config = { ...config, defaultSize };
      if (defaultPosition !== undefined) config = { ...config, defaultPosition };
      return config;
    },
    [id, type, title, draggable, deletable, defaultSize, defaultPosition, showSettings]
  );

  useEffect(() => {
    registerWidget(id, widgetConfig);
    return () => unregisterWidget(id);
  }, [id, registerWidget, unregisterWidget, widgetConfig]);

  // ==========================================================
  // Visibility (IntersectionObserver) — skip rendering chart when off-screen
  // ==========================================================

  const [isVisible, setIsVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observedRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Cleanup previous observer
      observerRef.current?.disconnect();

      if (!node) return;

      // Merge with draggable ref
      setNodeRef(node);
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;

      // Set up intersection observer for performance
      if (typeof IntersectionObserver !== "undefined") {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry) setIsVisible(entry.isIntersecting);
          },
          { rootMargin: "100px" }
        );
        observerRef.current.observe(node);
      }
    },
    [setNodeRef]
  );

  // ==========================================================
  // Responsive Content
  // ==========================================================

  const { content: responsiveContent, containerRef } = useResponsive({
    ...(viewBreakpoints !== undefined && { breakpoints: viewBreakpoints }),
    initial: children,
  });

  // ==========================================================
  // View Cycler State
  // ==========================================================

  const [_viewIndex, setViewIndex] = useState(0);

  const handleViewCycle = useCallback(
    (breakpoint: number | "initial") => {
      if (!viewBreakpoints) return;

      const keys = Object.keys(viewBreakpoints)
        .map((k) => (k === "initial" ? "initial" : Number(k)))
        .filter((k) => k === "initial" || !isNaN(k as number))
        .sort((a, b) => {
          if (a === "initial") return -1;
          if (b === "initial") return 1;
          return (a as number) - (b as number);
        });

      const index = keys.indexOf(breakpoint);
      if (index !== -1) {
        setViewIndex(index);
      }
    },
    [viewBreakpoints]
  );

  // ==========================================================
  // Event Handlers
  // ==========================================================

  const handleClick = useCallback(() => {
    bringToFront(id);
  }, [id, bringToFront]);

  // ==========================================================
  // Fallback Grid Position — prevents stacking at {0, 0}
  // ==========================================================

  const fallbackPosition = useMemo<{ x: number; y: number } | null>(() => {
    if (!isEditMode) return null;

    const posX = widgetState?.position?.x ?? 0;
    const posY = widgetState?.position?.y ?? 0;

    // If position is at origin, calculate a grid-based fallback
    if (posX === 0 && posY === 0) {
      // Get all widget IDs and find this widget's index
      const allWidgetIds = Object.keys(widgets).sort();
      const index = allWidgetIds.indexOf(id);
      
      if (index >= 0) {
        // Grid layout: 3 columns, with spacing
        const columns = 3;
        const cellWidth = 320; // Approximate widget width + gap
        const cellHeight = 220; // Approximate widget height + gap
        
        const col = index % columns;
        const row = Math.floor(index / columns);
        
        return {
          x: col * cellWidth + 20,
          y: row * cellHeight + 20,
        };
      }
    }

    return null;
  }, [isEditMode, widgetState?.position?.x, widgetState?.position?.y, widgets, id]);

  // ==========================================================
  // Computed Styles — VIEW MODE vs EDIT MODE
  // ==========================================================

  const cardStyle = useMemo<React.CSSProperties>(() => {
    if (!isEditMode) {
      // VIEW MODE: Normal CSS flow, no absolute positioning
      return {
        ...style,
      };
    }

    // EDIT MODE: Absolute positioning with drag
    // Use fallback position if widget is at origin {0, 0}
    const baseX = fallbackPosition?.x ?? widgetState?.position?.x ?? 0;
    const baseY = fallbackPosition?.y ?? widgetState?.position?.y ?? 0;
    const dragX = transform?.x ?? 0;
    const dragY = transform?.y ?? 0;

    return {
      ...style,
      position: "absolute" as const,
      top: 0,
      left: 0,
      zIndex: isDragging ? 9999 : (widgetState?.zIndex ?? 0),
      width: widgetState?.size?.width ?? defaultSize?.width ?? "auto",
      height: widgetState?.size?.height ?? defaultSize?.height ?? "auto",
      transform: `translate3d(${baseX + dragX}px, ${baseY + dragY}px, 0)`,
      willChange: isDragging ? "transform" : "auto",
      opacity: isDragging ? 0.92 : 1,
      transition: isDragging ? "none" : "transform 0.2s ease, opacity 0.2s ease",
    };
  }, [
    style,
    isEditMode,
    isDragging,
    transform?.x,
    transform?.y,
    widgetState?.zIndex,
    widgetState?.size?.width,
    widgetState?.size?.height,
    widgetState?.position?.x,
    widgetState?.position?.y,
    defaultSize?.width,
    defaultSize?.height,
    fallbackPosition,
  ]);

  // ==========================================================
  // Cleanup observer on unmount
  // ==========================================================

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  // ==========================================================
  // Render
  // ==========================================================

  if (!widgetState) {
    return null;
  }

  const content = viewBreakpoints ? responsiveContent : children;

  return (
    <div
      ref={observedRef}
      className={`dashcraft-card relative p-1 ${isEditMode && draggable ? "cursor-grab active:cursor-grabbing" : ""} ${className ?? ""}`}
      style={cardStyle}
      onClick={handleClick}
      data-widget-id={id}
      data-widget-type={type}
      {...(isEditMode && draggable ? attributes : {})}
      {...(isEditMode && draggable ? listeners : {})}
    >
      {/* Widget Actions (visible in edit mode) */}
      <WidgetActions visible={isEditMode}>
        <DragHandleButton visible={draggable} />
        <DashboardCardViewCycler
          breakpoints={viewBreakpoints}
          onCycle={handleViewCycle}
          visible={showViewCycler && !!viewBreakpoints}
        />
      </WidgetActions>

      {/* Content — lightweight placeholder when off-screen */}
      <div className="dashcraft-card-content flex-1 overflow-auto p-3 pt-8">
        {isVisible ? content : <div className="w-full h-full min-h-[100px]" />}
      </div>

    </div>
  );
});

DashboardCard.displayName = "DashboardCard";