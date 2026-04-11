import { useState } from "react";
import {
  Dashboard,
  KPIWidget,
  RechartsWidget,
  useDashboard,
} from "@repo/dashcraft";

// ── Corner Action Buttons ──────────────────────────────────────────────────

const TopRightControls = () => {
  const { isEditMode, toggleEditMode } = useDashboard();
  return (
    <div style={{ position: "fixed", top: "12px", right: "16px", zIndex: 1000 }}>
      <button
        onClick={toggleEditMode}
        style={{
          background: isEditMode
            ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
            : "linear-gradient(135deg, #1e293b, #334155)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "8px",
          padding: "7px 14px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {isEditMode ? "✏️ Editing" : "⚙️ Edit Layout"}
      </button>
    </div>
  );
};

const TopLeftBadge = () => (
  <div
    style={{
      position: "fixed",
      top: "12px",
      left: "16px",
      zIndex: 1000,
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      border: "1px solid rgba(99,102,241,0.4)",
      borderRadius: "8px",
      padding: "7px 12px",
      display: "flex",
      alignItems: "center",
      gap: "7px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    }}
  >
    <span style={{ fontSize: "14px" }}>📊</span>
    <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em" }}>
      AnalyticsPro
    </span>
  </div>
);

const BottomLeftStatus = () => {
  const [refreshed, setRefreshed] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: "14px", left: "16px", zIndex: 1000 }}>
      <button
        onClick={() => {
          setRefreshed(true);
          setTimeout(() => setRefreshed(false), 1500);
        }}
        style={{
          background: "linear-gradient(135deg, #064e3b, #065f46)",
          color: refreshed ? "#6ee7b7" : "#a7f3d0",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "8px",
          padding: "7px 12px",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {refreshed ? "✅ Refreshed" : "🔄 Refresh Data"}
      </button>
    </div>
  );
};

const BottomRightExport = () => (
  <div style={{ position: "fixed", bottom: "14px", right: "16px", zIndex: 1000 }}>
    <button
      style={{
        background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
        color: "#bfdbfe",
        border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: "8px",
        padding: "7px 12px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      📤 Export
    </button>
  </div>
);

// ── Chart Data ─────────────────────────────────────────────────────────────

const revenueData = [
  { name: "Jan", revenue: 42000, profit: 18000 },
  { name: "Feb", revenue: 38000, profit: 15000 },
  { name: "Mar", revenue: 51000, profit: 22000 },
  { name: "Apr", revenue: 47000, profit: 19000 },
  { name: "May", revenue: 58000, profit: 27000 },
  { name: "Jun", revenue: 63000, profit: 31000 },
  { name: "Jul", revenue: 71000, profit: 35000 },
];

const userGrowthData = [
  { name: "Jan", users: 1200, sessions: 3400 },
  { name: "Feb", users: 1800, sessions: 4200 },
  { name: "Mar", users: 2400, sessions: 5800 },
  { name: "Apr", users: 3100, sessions: 7100 },
  { name: "May", users: 3800, sessions: 8900 },
  { name: "Jun", users: 4300, sessions: 10200 },
  { name: "Jul", users: 4832, sessions: 11600 },
];

const channelData = [
  { name: "Organic", value: 38 },
  { name: "Direct", value: 27 },
  { name: "Social", value: 19 },
  { name: "Referral", value: 10 },
  { name: "Email", value: 6 },
];

const regionData = [
  { name: "North", sales: 42000 },
  { name: "South", sales: 31000 },
  { name: "East", sales: 58000 },
  { name: "West", sales: 47000 },
  { name: "Central", sales: 25000 },
];

const performanceData = [
  { subject: "Sales", A: 88 },
  { subject: "Marketing", A: 72 },
  { subject: "Support", A: 91 },
  { subject: "DevOps", A: 83 },
  { subject: "Design", A: 79 },
];

// ── Dashboard ─────────────────────────────────────────────────────────────

export default function DashCraftTest(): React.JSX.Element {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Dashboard persistenceKey="demo-dashboard-v2" autoSave>
        {/* 4 Corner Floating Buttons */}
        <TopLeftBadge />
        <TopRightControls />
        <BottomLeftStatus />
        <BottomRightExport />

        {/* Header */}
        <header
          style={{
            background: "rgba(13,17,23,0.95)",
            borderBottom: "1px solid rgba(99,102,241,0.25)",
            padding: "12px 0",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "0.02em",
            }}
          >
            Business Intelligence Dashboard
          </h1>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "10px",
              color: "#475569",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Real-time portfolio overview — July 2025
          </p>
        </header>

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            padding: "10px 12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflow: "hidden",
          }}
        >
          {/* ── KPI Row ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <KPIWidget
              id="kpi-revenue"
              title="Total Revenue"
              label="Total Revenue"
              value={128450}
              previousValue={110000}
              format="currency"
              currency="USD"
              decimals={0}
              draggable
              deletable
              className="bg-white rounded-lg shadow-sm"
            />
            <KPIWidget
              id="kpi-users"
              title="Active Users"
              label="Active Users"
              value={4832}
              previousValue={4200}
              format="number"
              decimals={0}
              draggable
              deletable
              className="bg-white rounded-lg shadow-sm"
            />
            <KPIWidget
              id="kpi-conversion"
              title="Conversion Rate"
              label="Conversion Rate"
              value={3.2}
              previousValue={2.8}
              format="percentage"
              decimals={1}
              draggable
              deletable
              className="bg-white rounded-lg shadow-sm"
            />
            <KPIWidget
              id="kpi-growth"
              title="MoM Growth"
              label="MoM Growth"
              value={16.8}
              previousValue={12.5}
              format="percentage"
              decimals={1}
              draggable
              deletable
              className="bg-white rounded-lg shadow-sm"
            />
            <KPIWidget
              id="kpi-orders"
              title="Total Orders"
              label="Total Orders"
              value={9241}
              previousValue={7980}
              format="number"
              decimals={0}
              draggable
              deletable
              className="bg-white rounded-lg shadow-sm"
            />
            <KPIWidget
              id="kpi-arpu"
              title="Avg Rev / User"
              label="Avg Rev / User"
              value={26.6}
              previousValue={22.1}
              format="currency"
              currency="USD"
              decimals={2}
              draggable
              deletable
              className="bg-white rounded-lg shadow-sm"
            />
          </div>

          {/* ── Charts Grid ── */}
          {/* Row 1: Area (large) | Line | Pie */}
          {/* Row 2: Area (cont) | Bar  | Radar */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "8px",
            }}
          >
            {/* Revenue Area Chart — spans both rows */}
            <div style={{ gridRow: "1 / 3", minHeight: 0 }}>
              <RechartsWidget
                id="chart-revenue"
                title="Revenue vs Profit"
                chartType="area"
                data={revenueData}
                series={[
                  { dataKey: "revenue", name: "Revenue", color: "#6366f1" },
                  { dataKey: "profit", name: "Profit", color: "#22d3ee" },
                ]}
                xAxisKey="name"
                draggable
                chartHeight="100%"
                className="bg-white rounded-lg shadow-sm"
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
              />
            </div>

            {/* User Growth Line */}
            <RechartsWidget
              id="chart-users"
              title="User Growth"
              chartType="line"
              data={userGrowthData}
              series={[
                { dataKey: "users", name: "Users", color: "#10b981" },
                { dataKey: "sessions", name: "Sessions", color: "#f59e0b" },
              ]}
              xAxisKey="name"
              draggable
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            />

            {/* Traffic Pie */}
            <RechartsWidget
              id="chart-traffic"
              title="Traffic Sources"
              chartType="pie"
              data={channelData}
              series={[{ dataKey: "value", name: "Share %", color: "#6366f1" }]}
              xAxisKey="name"
              draggable
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            />

            {/* Regional Sales Bar */}
            <RechartsWidget
              id="chart-region"
              title="Sales by Region"
              chartType="bar"
              data={regionData}
              series={[{ dataKey: "sales", name: "Sales ($)", color: "#8b5cf6" }]}
              xAxisKey="name"
              draggable
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            />

            {/* Performance Radar */}
            <RechartsWidget
              id="chart-radar"
              title="Team Performance"
              chartType="radar"
              data={performanceData}
              series={[{ dataKey: "A", name: "Score", color: "#f43f5e" }]}
              xAxisKey="subject"
              draggable
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            />
          </div>
        </main>
      </Dashboard>
    </div>
  );
}
