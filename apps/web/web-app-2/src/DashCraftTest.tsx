import React, { useState, useCallback } from "react";
import {
  Dashboard,
  useDashboard,
  RechartsWidget,
  KPIWidget,
  NivoWidget,
} from "@repo/dashcraft";
import type { WidgetSettings } from "@repo/dashcraft";

// ============================================================
// Edit Mode Toggle
// ============================================================

const EditModeToggle = React.memo(function EditModeToggle(): React.JSX.Element {
  const { isEditMode, toggleEditMode } = useDashboard();
  return (
    <button
      type="button"
      onClick={toggleEditMode}
      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
        isEditMode
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {isEditMode ? "⚙ Edit Mode ON" : "⚙ Edit Mode OFF"}
    </button>
  );
});
EditModeToggle.displayName = "EditModeToggle";

const ResetLayoutButton = React.memo(function ResetLayoutButton(): React.JSX.Element {
  const { resetLayout } = useDashboard();
  return (
    <button
      type="button"
      onClick={resetLayout}
      className="w-full px-4 py-2 rounded-lg font-medium transition-colors text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
    >
      ↺ Reset Layout
    </button>
  );
});
ResetLayoutButton.displayName = "ResetLayoutButton";

// ============================================================
// Settings Change Log — shows live callback output
// ============================================================

interface LogEntry {
  widgetId: string;
  settings: WidgetSettings;
  ts: number;
}

interface SettingsLogProps {
  entries: LogEntry[];
}

const SettingsLog = React.memo(function SettingsLog({ entries }: SettingsLogProps): React.JSX.Element {
  if (entries.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic">
        No changes yet. Click a ⚙ icon to configure a widget.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {entries.map((entry) => (
        <div key={entry.ts} className="bg-gray-50 rounded-md p-2 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-semibold text-gray-700">{entry.widgetId}</span>
            <span className="text-gray-400">
              {new Date(entry.ts).toLocaleTimeString()}
            </span>
          </div>
          <div className="space-y-0.5">
            {Object.entries(entry.settings)
              .filter(([k]) => k !== "customFields")
              .filter(([, v]) => v !== undefined && v !== "" && v !== false)
              .map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="text-blue-600 font-mono">{k}:</span>
                  <span className="text-gray-600 truncate font-mono">
                    {typeof v === "object" ? JSON.stringify(v) : String(v)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
});
SettingsLog.displayName = "SettingsLog";

// ============================================================
// Feature Callout — quick guide in the sidebar
// ============================================================

const FeatureCallout = React.memo(function FeatureCallout(): React.JSX.Element {
  const { isEditMode } = useDashboard();
  return (
    <div className={`rounded-lg p-3 text-xs space-y-1.5 transition-colors ${
      isEditMode ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
    }`}>
      <p className="font-semibold text-gray-700">Widget Settings Panel</p>
      <ul className="space-y-1 text-gray-500">
        <li>🎨 <strong>Theme</strong> — Light / Dark / Custom</li>
        <li>🔆 <strong>Highlight</strong> — Colored border + picker</li>
        <li>👁 <strong>Opacity</strong> — Transparency slider</li>
        <li>🌐 <strong>Endpoint</strong> — API URL + HTTP method</li>
        <li>📋 <strong>Headers</strong> — Key-value editor</li>
        <li>⏱ <strong>Polling</strong> — Presets + custom interval</li>
        <li>⚡ <strong>Behavior</strong> — Cache, focus refresh, timeout</li>
        <li>📝 <strong>Notes</strong> — Per-widget description</li>
      </ul>
      {!isEditMode && (
        <p className="text-blue-600 font-medium mt-2">
          Enable Edit Mode to see ⚙ icons, or use{" "}
          <code className="bg-blue-100 px-1 rounded">settingsVisibility="always"</code>
          {" "}to always show them.
        </p>
      )}
    </div>
  );
});
FeatureCallout.displayName = "FeatureCallout";

// ============================================================
// Sample Data
// ============================================================

const barLineData = [
  { name: "Jan", sales: 4000, revenue: 2400, profit: 1800 },
  { name: "Feb", sales: 3000, revenue: 1398, profit: 1200 },
  { name: "Mar", sales: 2000, revenue: 9800, profit: 4200 },
  { name: "Apr", sales: 2780, revenue: 3908, profit: 2100 },
  { name: "May", sales: 1890, revenue: 4800, profit: 2500 },
  { name: "Jun", sales: 2390, revenue: 3800, profit: 2300 },
];

const pieData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
  { name: "Other", value: 100 },
];

const radarData = [
  { subject: "Math",    A: 120, B: 110 },
  { subject: "English", A: 98,  B: 130 },
  { subject: "Physics", A: 86,  B: 130 },
  { subject: "History", A: 99,  B: 100 },
  { subject: "Art",     A: 85,  B: 90  },
  { subject: "Coding",  A: 65,  B: 85  },
];

const heatmapData = [
  {
    id: "Monday",
    data: [
      { x: "9am", y: 10 }, { x: "10am", y: 25 }, { x: "11am", y: 40 },
      { x: "12pm", y: 55 }, { x: "1pm", y: 30 }, { x: "2pm", y: 20 },
    ],
  },
  {
    id: "Tuesday",
    data: [
      { x: "9am", y: 15 }, { x: "10am", y: 30 }, { x: "11am", y: 45 },
      { x: "12pm", y: 60 }, { x: "1pm", y: 35 }, { x: "2pm", y: 25 },
    ],
  },
  {
    id: "Wednesday",
    data: [
      { x: "9am", y: 20 }, { x: "10am", y: 35 }, { x: "11am", y: 50 },
      { x: "12pm", y: 70 }, { x: "1pm", y: 40 }, { x: "2pm", y: 30 },
    ],
  },
];

const treemapData = [
  {
    id: "root",
    value: 9500,
    children: [
      { id: "React",   value: 3500 },
      { id: "Vue",     value: 2200 },
      { id: "Angular", value: 1800 },
      { id: "Svelte",  value: 1200 },
      { id: "Solid",   value: 800  },
    ],
  },
];

const sunburstData = [
  {
    id: "root",
    value: 9000,
    children: [
      {
        id: "Frontend", value: 4000, children: [
          { id: "React", value: 2500 },
          { id: "Vue",   value: 1500 },
        ],
      },
      {
        id: "Backend", value: 3000, children: [
          { id: "Node",   value: 1800 },
          { id: "Python", value: 1200 },
        ],
      },
    ],
  },
];

// ============================================================
// Tabs
// ============================================================

type Tab = "recharts" | "nivo" | "kpi";

// ============================================================
// Tab Content — settingsVisibility="always" so gear is always visible
// ============================================================

interface TabProps {
  onSettingsChange: (id: string, settings: WidgetSettings) => void;
}

function RechartsTab({ onSettingsChange }: TabProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4">
      <RechartsWidget
        id="rc-bar"
        title="Sales by Month"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("rc-bar", s)}
        chartType="bar"
        data={barLineData}
        series={[
          { dataKey: "sales",   name: "Sales",   color: "#3b82f6" },
          { dataKey: "revenue", name: "Revenue", color: "#22c55e" },
        ]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-line"
        title="Revenue Trend"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("rc-line", s)}
        chartType="line"
        data={barLineData}
        series={[
          { dataKey: "revenue", name: "Revenue", color: "#3b82f6" },
          { dataKey: "profit",  name: "Profit",  color: "#f97316" },
        ]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-area"
        title="Sales Area"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("rc-area", s)}
        chartType="area"
        data={barLineData}
        series={[{ dataKey: "sales", name: "Sales", color: "#8b5cf6" }]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-pie"
        title="Device Distribution"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("rc-pie", s)}
        chartType="pie"
        data={pieData}
        series={[{ dataKey: "value", name: "Value", color: "#3b82f6" }]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-radar"
        title="Skills Radar"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("rc-radar", s)}
        chartType="radar"
        data={radarData}
        series={[
          { dataKey: "A", name: "Student A", color: "#3b82f6" },
          { dataKey: "B", name: "Student B", color: "#ef4444" },
        ]}
        xAxisKey="subject"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-radial"
        title="Radial Bar"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("rc-radial", s)}
        chartType="radialBar"
        data={pieData}
        series={[{ dataKey: "value", name: "Value", color: "#22c55e" }]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
    </div>
  );
}

function NivoTab({ onSettingsChange }: TabProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4">
      <NivoWidget
        id="nv-heatmap"
        title="Activity Heatmap"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("nv-heatmap", s)}
        chartType="heatmap"
        data={heatmapData}
        className="bg-white rounded-md shadow-2xl"
      />
      <NivoWidget
        id="nv-treemap"
        title="Framework Popularity"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("nv-treemap", s)}
        chartType="treemap"
        data={treemapData}
        className="bg-white rounded-md shadow-2xl"
      />
      <NivoWidget
        id="nv-sunburst"
        title="Tech Stack"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("nv-sunburst", s)}
        chartType="sunburst"
        data={sunburstData}
        className="bg-white rounded-md shadow-2xl"
      />
    </div>
  );
}

function KPITab({ onSettingsChange }: TabProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-4">
      <KPIWidget
        id="kpi-rev"
        title="Total Revenue"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("kpi-rev", s)}
        value={128450}
        label="Total Revenue"
        previousValue={110000}
        format="currency"
        currency="USD"
        decimals={0}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-users"
        title="Active Users"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("kpi-users", s)}
        value={4832}
        label="Active Users"
        previousValue={4200}
        format="number"
        decimals={0}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-conv"
        title="Conversion"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("kpi-conv", s)}
        value={3.2}
        label="Conversion Rate"
        previousValue={2.8}
        format="percentage"
        decimals={1}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-churn"
        title="Churn"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("kpi-churn", s)}
        value={1.8}
        label="Churn Rate"
        previousValue={2.5}
        format="percentage"
        decimals={1}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-status"
        title="Status"
        draggable
        settingsVisibility="always"
        onSettingsChange={(s) => onSettingsChange("kpi-status", s)}
        value="Healthy"
        label="System Status"
        format="text"
        valueColor="#22c55e"
        className="bg-white rounded-md shadow-2xl"
      />
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function DashCraftTest(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("recharts");
  const [settingsLog, setSettingsLog] = useState<LogEntry[]>([]);

  const handleSettingsChange = useCallback((widgetId: string, settings: WidgetSettings) => {
    setSettingsLog((prev) => [
      { widgetId, settings, ts: Date.now() },
      ...prev.slice(0, 9), // keep latest 10
    ]);
  }, []);

  const tabProps: TabProps = { onSettingsChange: handleSettingsChange };

  const content: Record<Tab, React.JSX.Element> = {
    recharts: <RechartsTab {...tabProps} />,
    nivo: <NivoTab {...tabProps} />,
    kpi: <KPITab {...tabProps} />,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Dashboard persistenceKey="dashcraft-grid-test" autoSave>
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg z-50 flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="p-5 border-b border-gray-200 shrink-0">
            <h1 className="text-xl font-bold text-gray-900">DashCraft</h1>
            <p className="text-xs text-gray-500 mt-0.5">Widget Settings Demo</p>
          </div>

          {/* Navigation */}
          <nav className="px-4 pt-4 shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Chart Library
            </p>
            <div className="space-y-1">
              {(["recharts", "nivo", "kpi"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === t
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {t === "recharts" ? "📊 Recharts" : t === "nivo" ? "🎨 Nivo" : "📈 KPI"}
                </button>
              ))}
            </div>
          </nav>

          {/* Feature callout */}
          <div className="px-4 pt-4 shrink-0">
            <FeatureCallout />
          </div>

          {/* Settings change log */}
          <div className="px-4 pt-4 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                onSettingsChange log
              </p>
              {settingsLog.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSettingsLog([])}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  clear
                </button>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <SettingsLog entries={settingsLog} />
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-200 shrink-0 space-y-2">
            <EditModeToggle />
            <ResetLayoutButton />
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-72 p-6">
          {content[tab]}

          <footer className="mt-8 text-center text-xs text-gray-400">
            Click any <strong>⚙</strong> icon to open the settings panel.{" "}
            Opacity and highlight changes are applied in real time.
          </footer>
        </main>
      </Dashboard>
    </div>
  );
}
