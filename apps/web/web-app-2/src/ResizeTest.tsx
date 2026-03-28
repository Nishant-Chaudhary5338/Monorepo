import React, { useState } from "react";
import {
  Dashboard,
  DashboardCard,
  useDashboard,
} from "@repo/dashcraft";
import type { ResizeHandle } from "@repo/dashcraft";

// ============================================================
// Edit Mode Toggle
// ============================================================

const EditModeToggle = React.memo(function EditModeToggle(): React.JSX.Element {
  const { isEditMode, toggleEditMode } = useDashboard();
  return (
    <button
      type="button"
      onClick={toggleEditMode}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isEditMode
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {isEditMode ? "Edit Mode ON" : "Edit Mode OFF"}
    </button>
  );
});
EditModeToggle.displayName = "EditModeToggle";

// ============================================================
// Resize Test Page
// ============================================================

const resizeOptions: { label: string; handles: ResizeHandle[] }[] = [
  { label: "bottomRight (default)", handles: ["bottomRight"] },
  { label: "bottomLeft", handles: ["bottomLeft"] },
  { label: "topRight", handles: ["topRight"] },
  { label: "topLeft", handles: ["topLeft"] },
  { label: "bottom", handles: ["bottom"] },
  { label: "top", handles: ["top"] },
  { label: "left", handles: ["left"] },
  { label: "right", handles: ["right"] },
  { label: "All corners", handles: ["topLeft", "topRight", "bottomLeft", "bottomRight"] },
  { label: "All edges", handles: ["top", "bottom", "left", "right"] },
];

export default function ResizeTest(): React.JSX.Element {
  const [selectedHandles, setSelectedHandles] = useState<ResizeHandle[]>(["bottomRight"]);
  const [widgetPosition, setWidgetPosition] = useState({ x: 100, y: 100 });

  return (
    <Dashboard persistenceKey="resize-test" autoSave>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">Resize Test</h1>
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="mb-4">
            <EditModeToggle />
          </div>
          <h2 className="text-lg font-semibold mb-3">Resize Handle Options</h2>
          <div className="flex flex-wrap gap-2">
            {resizeOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelectedHandles(option.handles)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  JSON.stringify(selectedHandles) === JSON.stringify(option.handles)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Widget Position</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setWidgetPosition({ x: 50, y: 50 })}
                className="px-3 py-1.5 rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                Top-Left
              </button>
              <button
                onClick={() => setWidgetPosition({ x: 600, y: 50 })}
                className="px-3 py-1.5 rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                Top-Right
              </button>
              <button
                onClick={() => setWidgetPosition({ x: 50, y: 400 })}
                className="px-3 py-1.5 rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                Bottom-Left
              </button>
              <button
                onClick={() => setWidgetPosition({ x: 600, y: 400 })}
                className="px-3 py-1.5 rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                Bottom-Right
              </button>
              <button
                onClick={() => setWidgetPosition({ x: 350, y: 200 })}
                className="px-3 py-1.5 rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                Center
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Current handles:</strong> {selectedHandles.join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Position:</strong> x={widgetPosition.x}, y={widgetPosition.y}
            </p>
          </div>
        </div>

        {/* Widget */}
        <div className="relative w-full h-[600px] bg-white rounded-lg shadow overflow-hidden">
          <DashboardCard
            id="test-kpi"
            title="Test KPI Widget"
            draggable
            resizeHandles={selectedHandles}
            defaultSize={{ width: 300, height: 200 }}
            defaultPosition={widgetPosition}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg"
          >
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="text-4xl font-bold text-blue-600">$128,450</div>
              <div className="text-sm text-gray-500 mt-2">Total Revenue</div>
              <div className="text-xs text-green-500 mt-1">↑ 16.8% vs last month</div>
            </div>
          </DashboardCard>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click "Edit Mode" button to enable edit mode</li>
            <li>Select different resize handle options above</li>
            <li>Try resizing the widget from different directions</li>
            <li>Move the widget to different positions and test resize</li>
            <li>Verify that resize works correctly from each handle</li>
          </ol>
        </div>
      </div>
    </Dashboard>
  );
}
