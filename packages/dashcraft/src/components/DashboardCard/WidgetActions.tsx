import React from "react";
import { GripVertical } from "lucide-react";

// ============================================================
// Action Button Position
// ============================================================

export type ActionButtonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

// ============================================================
// WidgetActionButton Props
// ============================================================

export interface WidgetActionButtonProps {
  /** Button position in the widget */
  position: ActionButtonPosition;
  /** Icon to display */
  icon: React.ReactNode;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Tooltip text */
  tooltip?: string;
  /** Additional className */
  className?: string;
  /** Whether button is visible */
  visible?: boolean;
  /** Additional props to spread onto the button element (e.g., drag attributes/listeners) */
  [key: string]: unknown;
}

// ============================================================
// Position Styles Map
// ============================================================

const positionStyles: Record<ActionButtonPosition, string> = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-2 right-2",
};

// ============================================================
// WidgetActionButton Component
// ============================================================

export const WidgetActionButton = React.memo(function WidgetActionButton({
  position,
  icon,
  onClick,
  tooltip,
  className = "",
  visible = true,
  ...rest
}: WidgetActionButtonProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className={`widget-action-btn absolute ${positionStyles[position]} 
        flex items-center justify-center 
        w-6 h-6 rounded-md
        bg-white/80 dark:bg-gray-800/80
        border border-gray-200/50 dark:border-gray-700/50
        text-gray-500 dark:text-gray-400
        hover:text-gray-700 dark:hover:text-gray-200
        hover:bg-white dark:hover:bg-gray-800
        hover:border-gray-300 dark:hover:border-gray-600
        shadow-sm hover:shadow-md
        transition-all duration-200 ease-in-out
        opacity-60 hover:opacity-100
        cursor-pointer
        pointer-events-auto
        ${className}`}
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip}
      {...rest}
    >
      {icon}
    </button>
  );
});

WidgetActionButton.displayName = "WidgetActionButton";

// ============================================================
// WidgetActions Props
// ============================================================

export interface WidgetActionsProps {
  /** Whether actions should be visible */
  visible?: boolean;
  /** Children action buttons */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

// ============================================================
// WidgetActions Component
// ============================================================

export const WidgetActions = React.memo(function WidgetActions({
  visible = true,
  children,
  className = "",
}: WidgetActionsProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`widget-actions absolute inset-1 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
});

WidgetActions.displayName = "WidgetActions";

// ============================================================
// DragHandleButton (Pre-built drag handle)
// ============================================================

export interface DragHandleButtonProps {
  /** Whether button is visible */
  visible?: boolean;
  /** Additional className */
  className?: string;
  /** Drag attributes from useDraggable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragAttributes?: Record<string, any> | undefined;
  /** Drag listeners from useDraggable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragListeners?: Record<string, any> | undefined;
}

export const DragHandleButton = React.memo(function DragHandleButton({
  visible = true,
  className = "",
  dragAttributes,
  dragListeners,
}: DragHandleButtonProps): React.JSX.Element {
  return (
    <WidgetActionButton
      position="top-left"
      icon={<GripVertical size={14} />}
      tooltip="Drag to move"
      visible={visible}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      {...(dragAttributes ?? {})}
      {...(dragListeners ?? {})}
    />
  );
});

DragHandleButton.displayName = "DragHandleButton";
