import React from "react";

const KPI = [
  { label: "Courses Assigned", value: "12", sub: "4 mandatory", icon: "📚", color: "border-blue-200", iconBg: "bg-blue-50 text-blue-600" },
  { label: "Completed", value: "8", sub: "67% completion", icon: "✅", color: "border-green-200", iconBg: "bg-green-50 text-green-600" },
  { label: "In Progress", value: "3", sub: "2 due this week", icon: "⏳", color: "border-amber-200", iconBg: "bg-amber-50 text-amber-600" },
  { label: "Avg Quiz Score", value: "84%", sub: "+6% vs last month", icon: "🎯", color: "border-purple-200", iconBg: "bg-purple-50 text-purple-600" },
];

const RECENT_ACTIVITY = [
  { course: "Fire Safety Fundamentals", type: "Safety", score: 92, completedOn: "06 Apr 2026", status: "COMPLETED" },
  { course: "Chemical Handling Procedure", type: "Compliance", score: 88, completedOn: "04 Apr 2026", status: "COMPLETED" },
  { course: "Emergency Response Protocol", type: "Safety", score: null, completedOn: "—", status: "IN PROGRESS" },
  { course: "ISO 45001 Awareness", type: "Compliance", score: 76, completedOn: "01 Apr 2026", status: "COMPLETED" },
  { course: "PPE & Hazmat Handling", type: "Technical", score: null, completedOn: "—", status: "IN PROGRESS" },
];

const DEADLINES = [
  { course: "COSHH Regulations Update", dueDate: "10 Apr 2026", daysLeft: 3, urgent: true },
  { course: "Annual Safety Refresher", dueDate: "15 Apr 2026", daysLeft: 8, urgent: false },
  { course: "Data Protection Policy", dueDate: "20 Apr 2026", daysLeft: 13, urgent: false },
  { course: "Manual Handling Training", dueDate: "30 Apr 2026", daysLeft: 23, urgent: false },
];

const DEPT_PROGRESS = [
  { dept: "Operations", pct: 82 },
  { dept: "Maintenance", pct: 74 },
  { dept: "Quality Control", pct: 91 },
  { dept: "Logistics", pct: 67 },
  { dept: "Administration", pct: 95 },
];

const STATUS_STYLES = {
  "COMPLETED": "bg-green-100 text-green-700",
  "IN PROGRESS": "bg-amber-100 text-amber-700",
  "NOT STARTED": "bg-slate-100 text-slate-500",
};

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Good morning, Nidhi 👋</h1>
        <p className="text-slate-500 text-sm mt-0.5">Safex Learning Portal</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI.map((k) => (
          <div key={k.label} className={`bg-white rounded-xl border ${k.color} shadow-sm p-4`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">{k.label}</span>
              <span className={`w-8 h-8 rounded-lg ${k.iconBg} flex items-center justify-center text-base`}>{k.icon}</span>
            </div>
            <div className="text-3xl font-bold text-slate-800">{k.value}</div>
            <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Two column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Training Activity</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Course</th>
                <th className="text-left px-5 py-3 font-medium">Type</th>
                <th className="text-left px-5 py-3 font-medium">Score</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITY.map((row, i) => (
                <tr key={i} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-700 font-medium">{row.course}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{row.type}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-mono">{row.score ? `${row.score}%` : "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[row.status]}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Upcoming Deadlines</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {DEADLINES.map((d, i) => (
              <div key={i} className="px-5 py-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-700 font-medium leading-tight">{d.course}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.dueDate}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${d.urgent ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"}`}>
                  {d.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Progress */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Completion by Department</h2>
        <div className="space-y-3">
          {DEPT_PROGRESS.map((d) => (
            <div key={d.dept} className="flex items-center gap-4">
              <span className="text-sm text-slate-600 w-36 shrink-0">{d.dept}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700 w-10 text-right">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
