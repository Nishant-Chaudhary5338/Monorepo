import React, { useState } from "react";

const DEPT_COLORS = {
  "Operations": "bg-blue-100 text-blue-700",
  "Maintenance": "bg-purple-100 text-purple-700",
  "Quality Control": "bg-green-100 text-green-700",
  "Logistics": "bg-orange-100 text-orange-700",
  "Administration": "bg-pink-100 text-pink-700",
};

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-600", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-red-500", "bg-indigo-500",
  "bg-yellow-500", "bg-cyan-500", "bg-rose-500", "bg-slate-500",
];

const EMPLOYEES = [
  { id: "SFX-1001", name: "Arjun Mehta", dept: "Operations", role: "Plant Operator", completion: 92, status: "ACTIVE", initials: "AM" },
  { id: "SFX-1002", name: "Priya Sharma", dept: "Quality Control", role: "QC Analyst", completion: 100, status: "ACTIVE", initials: "PS" },
  { id: "SFX-1003", name: "Rohan Singh", dept: "Maintenance", role: "Maintenance Technician", completion: 74, status: "ACTIVE", initials: "RS" },
  { id: "SFX-1004", name: "Divya Verma", dept: "Administration", role: "HR Coordinator", completion: 95, status: "ACTIVE", initials: "DV" },
  { id: "SFX-1005", name: "Nishant Chaudhary", dept: "Operations", role: "Senior Engineer", completion: 88, status: "ACTIVE", initials: "NC" },
  { id: "SFX-1006", name: "Anika Patel", dept: "Logistics", role: "Logistics Coordinator", completion: 67, status: "IN PROGRESS", initials: "AP" },
  { id: "SFX-1007", name: "Mohit Kumar", dept: "Maintenance", role: "Electrical Technician", completion: 56, status: "IN PROGRESS", initials: "MK" },
  { id: "SFX-1008", name: "Sneha Joshi", dept: "Quality Control", role: "Lab Analyst", completion: 91, status: "ACTIVE", initials: "SJ" },
  { id: "SFX-1009", name: "Vikram Rao", dept: "Operations", role: "Control Room Operator", completion: 83, status: "ACTIVE", initials: "VR" },
  { id: "SFX-1010", name: "Kavita Nair", dept: "Administration", role: "Safety Officer", completion: 100, status: "ACTIVE", initials: "KN" },
  { id: "SFX-1011", name: "Deepak Tiwari", dept: "Logistics", role: "Warehouse Supervisor", completion: 44, status: "OVERDUE", initials: "DT" },
  { id: "SFX-1012", name: "Ritu Gupta", dept: "Operations", role: "Process Engineer", completion: 79, status: "ACTIVE", initials: "RG" },
];

const STATUS_STYLES = {
  "ACTIVE": "bg-green-100 text-green-700",
  "IN PROGRESS": "bg-amber-100 text-amber-700",
  "OVERDUE": "bg-rose-100 text-rose-700",
};

const DEPTS = ["All", "Operations", "Maintenance", "Quality Control", "Logistics", "Administration"];

const EmployeesPage = () => {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");

  const filtered = EMPLOYEES.filter((e) => {
    const matchDept = dept === "All" || e.dept === dept;
    const matchSearch = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Employee Directory</h1>
        <p className="text-slate-500 text-sm mt-0.5">{EMPLOYEES.length} employees · {EMPLOYEES.filter(e => e.status === "ACTIVE").length} fully compliant</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search name, ID, role…"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {DEPTS.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                dept === d ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Employee</th>
                <th className="text-left px-5 py-3 font-medium">ID</th>
                <th className="text-left px-5 py-3 font-medium">Department</th>
                <th className="text-left px-5 py-3 font-medium">Role</th>
                <th className="text-left px-5 py-3 font-medium">Completion</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => (
                <tr key={emp.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {emp.initials}
                      </div>
                      <span className="font-medium text-slate-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-500 text-xs">{emp.id}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEPT_COLORS[emp.dept] || "bg-slate-100 text-slate-600"}`}>
                      {emp.dept}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{emp.role}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-24 bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-full rounded-full ${emp.completion >= 90 ? "bg-green-500" : emp.completion >= 60 ? "bg-amber-400" : "bg-rose-400"}`}
                          style={{ width: `${emp.completion}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 w-8">{emp.completion}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[emp.status]}`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {EMPLOYEES.length} employees
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
