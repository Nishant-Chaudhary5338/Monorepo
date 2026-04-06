import { useState } from "react";
import {
  Dashboard,
  KPIWidget,
  RechartsWidget,
  useDashboard,
} from "@repo/dashcraft";

// Edit Mode Toggle Button
const EditModeToggle = () => {
  const { isEditMode, toggleEditMode } = useDashboard();
  return (
    <button
      onClick={toggleEditMode}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isEditMode
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {isEditMode ? "✏️ Edit Mode" : "⚙️ Edit Dashboard"}
    </button>
  );
};

// Sample data
const lineChartData = [
  { name: "Jan", revenue: 4000, profit: 2400 },
  { name: "Feb", revenue: 3000, profit: 1398 },
  { name: "Mar", revenue: 2000, profit: 9800 },
  { name: "Apr", revenue: 2780, profit: 3908 },
  { name: "May", revenue: 1890, profit: 4800 },
  { name: "Jun", revenue: 2390, profit: 3800 },
];

const pieChartData = [
  { name: "Direct", value: 400 },
  { name: "Referral", value: 300 },
  { name: "Social", value: 200 },
  { name: "Organic", value: 100 },
];

export default function DashCraftTest(): React.JSX.Element {
  const [activeWidgets, setActiveWidgets] = useState({
    revenue: true,
    users: true,
    conversion: true,
    growth: true,
  });

  const deleteWidget = (id: string) => {
    setActiveWidgets(prev => ({
      ...prev,
      [id]: false
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard persistenceKey="demo-dashboard" autoSave>
        {/* Header - NOW INSIDE Dashboard Provider! */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Portfolio Overview</p>
            </div>
            <EditModeToggle />
          </div>
        </header>

        <main className="p-6">
          {/* KPIs Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {activeWidgets.revenue && (
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
                onDelete={() => deleteWidget('revenue')}
                className="bg-white rounded-lg shadow-sm"
              />
            )}
            {activeWidgets.users && (
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
                onDelete={() => deleteWidget('users')}
                className="bg-white rounded-lg shadow-sm"
              />
            )}
            {activeWidgets.conversion && (
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
                onDelete={() => deleteWidget('conversion')}
                className="bg-white rounded-lg shadow-sm"
              />
            )}
            {activeWidgets.growth && (
              <KPIWidget
                id="kpi-growth"
                title="Growth"
                label="Growth"
                value={16.8}
                previousValue={12.5}
                format="percentage"
                decimals={1}
                draggable
                deletable
                onDelete={() => deleteWidget('growth')}
                className="bg-white rounded-lg shadow-sm"
              />
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-4">
            <RechartsWidget
              id="chart-revenue"
              title="Revenue Trend"
              chartType="line"
              data={lineChartData}
              series={[
                { dataKey: "revenue", name: "Revenue", color: "#3b82f6" },
                { dataKey: "profit", name: "Profit", color: "#22c55e" },
              ]}
              xAxisKey="name"
              draggable
              resizeHandles={["right", "bottomRight", "bottom"]}
              className="bg-white rounded-lg shadow-sm"
            />
            <RechartsWidget
              id="chart-traffic"
              title="Traffic Sources"
              chartType="pie"
              data={pieChartData}
              series={[{ dataKey: "value", name: "Value", color: "#3b82f6" }]}
              xAxisKey="name"
              draggable
              resizeHandles={["left", "bottomLeft", "bottom"]}
              className="bg-white rounded-lg shadow-sm"
            />
          </div>
        </main>
      </Dashboard>
    </div>
  );
}