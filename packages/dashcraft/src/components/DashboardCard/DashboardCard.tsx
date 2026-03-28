import React, { useEffect, useMemo, useCallback, useState, useRef } from "react";
import type {
  WidgetConfig,
  Position,
  Size,
  ViewBreakpoints,
} from "../../types";
import type { ResizeHandle } from "../../hooks/useResize";
import { useDashboardContext } from "../Dashboard/Dashboard.context";
import { WidgetActions, DragHandleButton, ResizeHandleButton } from "./WidgetActions";
import { DashboardCardViewCycler } from "./DashboardCardViewCycler";
import { useResponsive } from "../../hooks/useResponsive";
import { useDraggable } from "../../hooks/useDraggable";
import { useResize } from "../../hooks/useResize";
import { useDashboardStore } from "../../store";

// ============================================================
// Edit Mode Transition Tracker (Module-level for performance)
// ============================================================

// Set to track widget IDs that have rendered in edit mode before
// Using Set with string IDs instead of WeakMap with object references
// because widgetState objects are recreated on every store update
const editModeRenderTracker = new Set<string>();

// Track widgets that are currently transitioning to edit mode
// This prevents CSS transition during the mode switch
const transitioningToEditMode = new Set<string>();

// Ref to store captured positions for widgets entering edit mode
// This ensures widgets maintain their visual position when switching modes
// Using a module-level Map that persists across renders
const capturedPositionsRef = new Map<string, { x: number; y: number; width: number; height: number }>();

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

  // Resize handles to show (default: ["bottomRight"])
  resizeHandles?: ResizeHandle[];

  // Auto-detect resize directions based on widget position (default: false)
  autoResizeDirections?: boolean;

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
  resizeHandles = ["bottomRight"],
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

  const { updateWidgetSize: storeUpdateWidgetSize } = useDashboardStore();

  const disabled = !draggable || !isEditMode;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  // ==========================================================
  // Resize Hook
  // ==========================================================

  const currentSize = widgetState?.size ?? defaultSize ?? { width: 300, height: 200 };

  const currentPosition = widgetState?.position ?? defaultPosition ?? { x: 0, y: 0 };
  
  const { getHandleProps, size: resizeSize, isResizing } = useResize({
    initialSize: typeof currentSize.width === "number" && typeof currentSize.height === "number"
      ? currentSize as Size
      : { width: 300, height: 200 },
    minSize: { width: 150, height: 100 },
    disabled: !isEditMode || !draggable,
    onResizeStart: () => {
      // Bring widget to front when resize starts
      bringToFront(id);
    },
    onResize: (event) => {
      // Update both size and position during resize for real-time feedback
      const { updateWidgetPosition, updateWidgetSize, widgets } = useDashboardStore.getState();
      updateWidgetSize(id, event.size);
      // Read current position from store (not stale render-time value) to support left/top resizing
      const currentPos = widgets[id]?.position ?? { x: 0, y: 0 };
      updateWidgetPosition(id, {
        x: currentPos.x + event.positionDelta.x,
        y: currentPos.y + event.positionDelta.y,
      });
    },
    onResizeEnd: (newSize) => {
      storeUpdateWidgetSize(id, newSize);
    },
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
  // Track Edit Mode Transition (skip transition when entering edit mode)
  // ==========================================================

  const isFirstEditRender = useRef(false);
  const prevIsEditModeRef = useRef(isEditMode);

  // Capture position synchronously when entering edit mode
  // This must happen BEFORE the style calculation to prevent visual jump
  const isEnteringEditMode = isEditMode && !prevIsEditModeRef.current;
  
  if (isEnteringEditMode && containerRef.current) {
    // Check if the widget already has a saved position in the store (from loadLayout)
    const hasSavedPosition = widgetState && (widgetState.position.x !== 0 || widgetState.position.y !== 0);

    // Mark this widget as transitioning to edit mode
    // This will prevent CSS transition during the mode switch
    if (!editModeRenderTracker.has(id)) {
      isFirstEditRender.current = true;
      editModeRenderTracker.add(id);
      transitioningToEditMode.add(id);
    }

    if (hasSavedPosition) {
      // Widget has saved position from persistence — use it directly, skip DOM capture
      // Just remove from transitioning set after a frame to allow transitions
      requestAnimationFrame(() => {
        transitioningToEditMode.delete(id);
      });
    } else {
      // No saved position — capture the widget's current DOM position
      // This ensures the widget stays in place when switching to absolute positioning
      const widgetElement = containerRef.current;
      const container = widgetElement.closest('[data-dashcraft-dashboard]');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const widgetRect = widgetElement.getBoundingClientRect();
        
        const capturedPos = {
          x: widgetRect.left - containerRect.left,
          y: widgetRect.top - containerRect.top,
          width: widgetRect.width,
          height: widgetRect.height,
        };
        
        // Store the captured position for immediate use (CSS only)
        capturedPositionsRef.set(id, capturedPos);
        
        // Update the store in the background for persistence
        // This is fire-and-forget - the captured position will be used immediately
        requestAnimationFrame(() => {
          const { updateWidgetPosition, updateWidgetSize } = useDashboardStore.getState();
          updateWidgetPosition(id, { x: capturedPos.x, y: capturedPos.y });
          updateWidgetSize(id, { width: capturedPos.width, height: capturedPos.height });
          
          // Remove from transitioning set after a frame to allow transition on subsequent interactions
          transitioningToEditMode.delete(id);
          
          // Remove captured position after store is updated
          // This ensures subsequent renders use the store position (which gets updated on drag)
          capturedPositionsRef.delete(id);
        });
      }
    }
  }
  
  // Update prevIsEditModeRef for next render
  prevIsEditModeRef.current = isEditMode;
  
  // Reset when leaving edit mode
  useEffect(() => {
    if (!isEditMode) {
      isFirstEditRender.current = false;
      editModeRenderTracker.delete(id);
      transitioningToEditMode.delete(id);
      capturedPositionsRef.delete(id);
    }
  }, [isEditMode, id]);

  // ==========================================================
  // Computed Styles — VIEW MODE vs EDIT MODE
  // ==========================================================

  const cardStyle = useMemo<React.CSSProperties>(() => {
    const storePosition = widgetState?.position ?? { x: 0, y: 0 };
    const storeSize = widgetState?.size ?? defaultSize ?? { width: "auto", height: "auto" };

    if (!isEditMode) {
      // VIEW MODE: Only use absolute positioning if widget has a saved (non-default) position
      // If position is {0, 0} (no saved layout), use CSS flow so widgets don't stack
      const hasSavedPosition = storePosition.x !== 0 || storePosition.y !== 0;
      if (hasSavedPosition) {
        return {
          ...style,
          position: "absolute" as const,
          top: 0,
          left: 0,
          width: storeSize.width,
          height: storeSize.height,
          transform: `translate3d(${storePosition.x}px, ${storePosition.y}px, 0)`,
          zIndex: widgetState?.zIndex ?? 0,
          transition: "transform 0.2s ease",
        };
      }
      // No saved position — use CSS flow
      return {
        ...style,
      };
    }

    // EDIT MODE: Absolute positioning with drag
    // Priority: captured position > fallback position > store position
    const capturedPos = capturedPositionsRef.get(id);
    
    // Use captured position if available (ensures widget stays in place when entering edit mode)
    const baseX = capturedPos?.x ?? fallbackPosition?.x ?? storePosition.x;
    const baseY = capturedPos?.y ?? fallbackPosition?.y ?? storePosition.y;
    
    // Use resize hook's size during resize for real-time visual feedback
    // Otherwise use store size or captured position size
    let width: number | string;
    let height: number | string;
    if (isResizing) {
      width = resizeSize.width;
      height = resizeSize.height;
    } else {
      width = capturedPos?.width ?? storeSize.width;
      height = capturedPos?.height ?? storeSize.height;
    }
    
    const dragX = transform?.x ?? 0;
    const dragY = transform?.y ?? 0;

    // Skip transition when:
    // 1. First render in edit mode (prevent visual jump)
    // 2. Currently transitioning to edit mode (prevent mode switch glitch)
    // 3. Currently dragging (for smooth drag)
    // 4. Currently resizing (for smooth resize)
    const isTransitioningToEdit = transitioningToEditMode.has(id);
    const shouldTransition = !isFirstEditRender.current && !isTransitioningToEdit && !isDragging && !isResizing;

    return {
      ...style,
      position: "absolute" as const,
      top: 0,
      left: 0,
      zIndex: isDragging || isResizing ? 9999 : (widgetState?.zIndex ?? 0),
      width: width,
      height: height,
      transform: `translate3d(${baseX + dragX}px, ${baseY + dragY}px, 0)`,
      willChange: isDragging || isResizing ? "transform, width, height" : "auto",
      opacity: isDragging ? 0.92 : 1,
      transition: shouldTransition ? "transform 0.2s ease, opacity 0.2s ease" : "none",
    };
  }, [
    style,
    isEditMode,
    isDragging,
    isResizing,
    resizeSize.width,
    resizeSize.height,
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
    id,
  ]);

  // ==========================================================
  // Resize Handle Position Mapping
  // ==========================================================

  const getResizeHandlePosition = useCallback((handle: ResizeHandle): "top-left" | "top-right" | "bottom-left" | "bottom-right" => {
    const positionMap: Record<ResizeHandle, "top-left" | "top-right" | "bottom-left" | "bottom-right"> = {
      top: "top-left",
      right: "top-right",
      bottom: "bottom-right",
      left: "bottom-left",
      topRight: "top-right",
      bottomRight: "bottom-right",
      bottomLeft: "bottom-left",
      topLeft: "top-left",
    };
    return positionMap[handle];
  }, []);

  // ==========================================================
  // Auto-detect resize directions based on widget position
  // ==========================================================

  const effectiveResizeHandles = useMemo<ResizeHandle[]>(() => {
    // If explicit resizeHandles is provided and not default, use it
    if (resizeHandles && resizeHandles.length > 0 && !(resizeHandles.length === 1 && resizeHandles[0] === "bottomRight")) {
      return resizeHandles;
    }

    // If autoResizeDirections is enabled, detect based on position
    if (widgetState?.position) {
      const { x, y } = widgetState.position;
      const widgetWidth = typeof widgetState.size?.width === "number" ? widgetState.size.width : 300;
      const widgetHeight = typeof widgetState.size?.height === "number" ? widgetState.size.height : 200;

      // Get container dimensions (default to typical viewport if not available)
      const containerWidth = containerRef.current?.clientWidth ?? 1200;
      const containerHeight = containerRef.current?.clientHeight ?? 800;

      // Calculate widget center position
      const centerX = x + widgetWidth / 2;
      const centerY = y + widgetHeight / 2;

      // Determine which quadrant the widget is in
      const isLeft = centerX < containerWidth / 2;
      const isRight = centerX >= containerWidth / 2;
      const isTop = centerY < containerHeight / 2;
      const isBottom = centerY >= containerHeight / 2;

      // Return appropriate resize handles based on position
      if (isTop && isLeft) {
        return ["bottomRight", "bottom", "right"];
      } else if (isTop && isRight) {
        return ["bottomLeft", "bottom", "left"];
      } else if (isBottom && isLeft) {
        return ["topRight", "top", "right"];
      } else if (isBottom && isRight) {
        return ["topLeft", "top", "left"];
      }
    }

    // Default fallback
    return ["bottomRight"];
  }, [resizeHandles, widgetState?.position, widgetState?.size, containerRef]);

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
      className={`dashcraft-card relative p-1 ${className ?? ""}`}
      style={cardStyle}
      onClick={handleClick}
      data-widget-id={id}
      data-widget-type={type}
    >
      {/* Widget Actions (visible in edit mode) */}
      <WidgetActions visible={isEditMode}>
        <DragHandleButton
          visible={draggable}
          dragAttributes={isEditMode && draggable ? attributes : undefined}
          dragListeners={isEditMode && draggable ? listeners : undefined}
        />
        <DashboardCardViewCycler
          breakpoints={viewBreakpoints}
          onCycle={handleViewCycle}
          visible={showViewCycler && !!viewBreakpoints}
        />
      </WidgetActions>

      {/* Content — lightweight placeholder when off-screen */}
      <div className="dashcraft-card-content flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden p-3 pt-8">
        <div className="flex-1 min-h-0 min-w-0 w-full h-full">
          {isVisible ? content : <div className="w-full h-full min-h-[100px]" />}
        </div>
      </div>

      {/* Resize Handles — visible in edit mode */}
      {isEditMode && draggable && effectiveResizeHandles.map((handle) => {
        const handleProps = getHandleProps(handle);
        return (
          <ResizeHandleButton
            key={handle}
            visible={true}
            position={getResizeHandlePosition(handle)}
            onMouseDown={handleProps.onMouseDown}
            onTouchStart={handleProps.onTouchStart}
            style={handleProps.style}
          />
        );
      })}

    </div>
  );
});

DashboardCard.displayName = "DashboardCard";