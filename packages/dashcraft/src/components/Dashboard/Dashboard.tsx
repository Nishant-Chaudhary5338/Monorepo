import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import type { DashboardConfig, DashboardContextValue, Position, Size } from "../../types";
import { DashboardContext } from "./Dashboard.context";
import { useDashboardStore } from "../../store";

// ============================================================
// Dashboard Component (Context Provider)
// ============================================================

export interface DashboardProps extends DashboardConfig {
  /** CSS class for the container (e.g., "grid grid-cols-3 gap-4") */
  className?: string;
}

const Dashboard = React.memo(function Dashboard({
  persistenceKey,
  autoSave = false,
  autoSaveDelay = 1000,
  defaultEditMode = false,
  onLayoutChange,
  onEditModeChange,
  className,
  style,
  children,
}: DashboardProps): React.JSX.Element {
  // ==========================================================
  // Store State (fine-grained subscriptions)
  // ==========================================================

  const isEditMode = useDashboardStore((state) => state.isEditMode);
  const widgets = useDashboardStore((state) => state.widgets);

  // ==========================================================
  // Store Actions
  // ==========================================================

  const toggleEditMode = useDashboardStore((state) => state.toggleEditMode);
  const setEditMode = useDashboardStore((state) => state.setEditMode);
  const saveLayout = useDashboardStore((state) => state.saveLayout);
  const loadLayout = useDashboardStore((state) => state.loadLayout);
  const resetLayout = useDashboardStore((state) => state.resetLayout);
  const addWidget = useDashboardStore((state) => state.addWidget);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const updateWidgetPosition = useDashboardStore(
    (state) => state.updateWidgetPosition
  );
  const updateWidgetSize = useDashboardStore(
    (state) => state.updateWidgetSize
  );
  const updateWidgetSettings = useDashboardStore(
    (state) => state.updateWidgetSettings
  );
  const bringToFront = useDashboardStore((state) => state.bringToFront);
  const registerWidget = useDashboardStore((state) => state.registerWidget);
  const unregisterWidget = useDashboardStore(
    (state) => state.unregisterWidget
  );
  const getWidgetState = useDashboardStore((state) => state.getWidgetState);
  const batchUpdatePositionsAndSizes = useDashboardStore(
    (state) => state.batchUpdatePositionsAndSizes
  );

  // ==========================================================
  // Container Ref for DOM Measurement
  // ==========================================================

  const containerRef = useRef<HTMLDivElement>(null);

  // ==========================================================
  // Capture Widget Positions (Synchronous for immediate mode switch)
  // ==========================================================

  const captureWidgetPositions = useCallback((): Array<{ id: string; position: Position; size: Size }> => {
    const container = containerRef.current;
    if (!container) return [];

    // Capture positions synchronously to prevent race condition
    // This ensures positions are available immediately when entering edit mode
    const containerRect = container.getBoundingClientRect();
    const widgetElements = container.querySelectorAll("[data-widget-id]");

    // Batch DOM reads to avoid layout thrashing
    const updates: Array<{ id: string; position: Position; size: Size }> = [];

    for (let i = 0; i < widgetElements.length; i++) {
      const el = widgetElements[i] as HTMLElement;
      const id = el.dataset.widgetId;
      if (!id) continue;

      const rect = el.getBoundingClientRect();
      const position = {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
      };
      const size = {
        width: rect.width,
        height: rect.height,
      };

      // Only capture valid positions and sizes
      if ((position.x !== 0 || position.y !== 0) && size.width > 0 && size.height > 0) {
        updates.push({ id, position, size });
      }
    }

    return updates;
  }, []);

  // ==========================================================
  // Wrapped Edit Mode Actions (capture positions before switch)
  // ==========================================================

  const handleToggleEditMode = useCallback(() => {
    // Capture positions BEFORE toggling if we're currently in view mode
    // This ensures positions are available when entering edit mode
    if (!isEditMode) {
      // Capture positions and batch update atomically before mode switch
      const updates = captureWidgetPositions();
      if (updates.length > 0) {
        flushSync(() => {
          batchUpdatePositionsAndSizes(updates);
        });
      }
    }
    toggleEditMode();
  }, [isEditMode, captureWidgetPositions, batchUpdatePositionsAndSizes, toggleEditMode]);

  const handleSetEditMode = useCallback(
    (editMode: boolean) => {
      // Capture positions BEFORE switching if entering edit mode
      if (editMode && !isEditMode) {
        // Capture positions and batch update atomically before mode switch
        const updates = captureWidgetPositions();
        if (updates.length > 0) {
          flushSync(() => {
            batchUpdatePositionsAndSizes(updates);
          });
        }
      }
      setEditMode(editMode);
    },
    [isEditMode, captureWidgetPositions, batchUpdatePositionsAndSizes, setEditMode]
  );

  // ==========================================================
  // Context Value (memoized)
  // ==========================================================

  const contextValue = useMemo<DashboardContextValue>(
    () => ({
      isEditMode,
      widgets,
      toggleEditMode: handleToggleEditMode,
      setEditMode: handleSetEditMode,
      saveLayout: () => {
        if (persistenceKey) {
          saveLayout(persistenceKey);
        }
      },
      loadLayout: () => {
        if (persistenceKey) {
          loadLayout(persistenceKey);
        }
      },
      resetLayout,
      addWidget,
      removeWidget,
      updateWidgetPosition,
      updateWidgetSize,
      updateWidgetSettings,
      bringToFront,
      registerWidget,
      unregisterWidget,
      getWidgetState,
    }),
    [
      isEditMode,
      widgets,
      handleToggleEditMode,
      handleSetEditMode,
      saveLayout,
      loadLayout,
      resetLayout,
      addWidget,
      removeWidget,
      updateWidgetPosition,
      updateWidgetSize,
      updateWidgetSettings,
      bringToFront,
      registerWidget,
      unregisterWidget,
      getWidgetState,
      persistenceKey,
    ]
  );

  // ==========================================================
  // Effects
  // ==========================================================

  // Set initial edit mode
  React.useEffect(() => {
    if (defaultEditMode) {
      setEditMode(true);
    }
  }, [defaultEditMode, setEditMode]);

  // Capture widget DOM positions during stable VIEW mode rendering.
  // This ensures positions are available before entering edit mode,
  // eliminating the race condition that caused widgets to stack at {0, 0}.
  useEffect(() => {
    // Skip if in edit mode - we only capture positions in view mode
    if (isEditMode) return;

    const container = containerRef.current;
    if (!container) return;

    // Capture positions after a short delay to ensure layout is stable
    const timeoutId = setTimeout(() => {
      const updates = captureWidgetPositions();
      if (updates.length > 0) {
        batchUpdatePositionsAndSizes(updates);
      }
    }, 100); // Small delay for layout stabilization

    return () => clearTimeout(timeoutId);
  }, [isEditMode, widgets, captureWidgetPositions, batchUpdatePositionsAndSizes]);

  // Load layout on mount
  React.useEffect(() => {
    if (persistenceKey) {
      loadLayout(persistenceKey);
    }
  }, [persistenceKey, loadLayout]);

  // Auto-save
  React.useEffect(() => {
    if (!autoSave || !persistenceKey) return;

    const timeoutId = setTimeout(() => {
      saveLayout(persistenceKey);
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [widgets, autoSave, autoSaveDelay, persistenceKey, saveLayout]);

  // Notify layout change
  React.useEffect(() => {
    onLayoutChange?.(widgets);
  }, [widgets, onLayoutChange]);

  // Notify edit mode change
  React.useEffect(() => {
    onEditModeChange?.(isEditMode);
  }, [isEditMode, onEditModeChange]);

  // ==========================================================
  // DnD Handlers
  // ==========================================================

  const handleDragStart = useCallback(
    (_event: DragStartEvent) => {
      // Drag state is handled by CSS transform in DashboardCard
    },
    []
  );

  // RAF batching for smooth drag
  const rafId = useRef<number | null>(null);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!event.delta) return;

      const widget = getWidgetState(event.active.id as string);
      if (!widget) return;

      const newPosition = {
        x: widget.position.x + event.delta.x,
        y: widget.position.y + event.delta.y,
      };

      // Batch through rAF for smooth updates
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updateWidgetPosition(event.active.id as string, newPosition);
      });
    },
    [getWidgetState, updateWidgetPosition]
  );

  const handleDragCancel = useCallback(() => {
    // No-op: drag state is handled by CSS transform in DashboardCard
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // ==========================================================
  // Container Style — view mode vs edit mode
  // ==========================================================

  const containerStyle = useMemo<React.CSSProperties>(() => {
    if (!isEditMode) {
      // View mode: normal CSS flow
      return {
        ...style,
        position: "relative",
      };
    }
    // Edit mode: relative container for absolute children
    return {
      ...style,
      position: "relative",
    };
  }, [style, isEditMode]);

  // ==========================================================
  // Drag Overlay Content
  // ==========================================================

  // DragOverlay is intentionally empty — the actual widget moves via CSS transform in DashboardCard

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <DashboardContext.Provider value={contextValue}>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          ref={containerRef}
          className={className}
          style={containerStyle}
          data-dashcraft-dashboard
        >
          {children}
        </div>
        <DragOverlay dropAnimation={null} />
      </DndContext>
    </DashboardContext.Provider>
  );
});

Dashboard.displayName = "Dashboard";

export { Dashboard };