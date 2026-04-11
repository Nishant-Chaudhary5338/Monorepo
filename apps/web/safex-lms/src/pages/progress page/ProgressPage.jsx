import React from "react";

const COURSES = [
  { name: "Fire Safety Fundamentals", category: "Safety", score: 92, progress: 100, status: "COMPLETED", completedOn: "06 Apr 2026" },
  { name: "Chemical Handling Procedure", category: "Compliance", score: 88, progress: 100, status: "COMPLETED", completedOn: "04 Apr 2026" },
  { name: "ISO 45001 Awareness", category: "Compliance", score: 76, progress: 100, status: "COMPLETED", completedOn: "01 Apr 2026" },
  { name: "Workplace Diversity & Inclusion", category: "HR", score: 95, progress: 100, status: "COMPLETED", completedOn: "28 Mar 2026" },
  { name: "Emergency Response Protocol", category: "Safety", score: null, progress: 65, status: "IN PROGRESS", completedOn: null },
  { name: "PPE & Hazmat Handling", category: "Technical", score: null, progress: 40, status: "IN PROGRESS", completedOn: null },
  { name: "COSHH Regulations Update", category: "Compliance", score: null, progress: 0, status: "NOT STARTED", completedOn: null },
  { name: "Manual Handling Techniques", category: "Technical", score: null, progress: 0, status: "NOT STARTED", completedOn: null },
  { name: "Data Protection Policy", category: "Compliance", score: null, progress: 0, status: "NOT STARTED", completedOn: null },
];

const STATUS_STYLES = {
  "COMPLETED": { badge: "bg-green-100 text-green-700", bar: "bg-green-500" },
  "IN PROGRESS": { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-400" },
  "NOT STARTED": { badge: "bg-slate-100 text-slate-500", bar: "bg-slate-200" },
};

const SCORE_COLOR = (score) => {
  if (!score) return "text-slate-400";
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-amber-600";
  return "text-rose-600";
};

const completed = COURSES.filter((c) => c.status === "COMPLETED").length;
const inProgress = COURSES.filter((c) => c.status === "IN PROGRESS").length;
const notStarted = COURSES.filter((c) => c.status === "NOT STARTED").length;
const avgScore = Math.round(
  COURSES.filter((c) => c.score).reduce((sum, c) => sum + c.score, 0) /
  COURSES.filter((c) => c.score).length
);
const overallPct = Math.round(
  COURSES.reduce((sum, c) => sum + c.progress, 0) / COURSES.length
);

const ProgressPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Progress</h1>
        <p className="text-slate-500 text-sm mt-0.5">Training completion overview — April 2026</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Completed</div>
          <div className="text-3xl font-bold text-slate-800">{completed}</div>
          <div className="text-xs text-slate-400 mt-1">of {COURSES.length} courses</div>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">In Progress</div>
          <div className="text-3xl font-bold text-slate-800">{inProgress}</div>
          <div className="text-xs text-slate-400 mt-1">active courses</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Not Started</div>
          <div className="text-3xl font-bold text-slate-800">{notStarted}</div>
          <div className="text-xs text-slate-400 mt-1">pending courses</div>
        </div>
        <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Avg Score</div>
          <div className="text-3xl font-bold text-slate-800">{avgScore}%</div>
          <div className="text-xs text-slate-400 mt-1">across completed</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-slate-800">Overall Completion</h2>
          <span className="text-2xl font-bold text-green-600">{overallPct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">{completed} completed · {inProgress} in progress · {notStarted} not started</p>
      </div>

      {/* Course list */}
      <div className="space-y-3">
        {COURSES.map((course, i) => {
          const styles = STATUS_STYLES[course.status];
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-green-300 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-800 text-sm">{course.name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{course.category}</span>
                  </div>
                  {course.completedOn && (
                    <p className="text-xs text-slate-400 mt-0.5">Completed {course.completedOn}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {course.score && (
                    <span className={`text-sm font-bold ${SCORE_COLOR(course.score)}`}>{course.score}%</span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}>
                    {course.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${styles.bar} transition-all`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 w-8 text-right">{course.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressPage;
