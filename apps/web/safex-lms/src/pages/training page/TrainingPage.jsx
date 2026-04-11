import React, { useState } from "react";

const CATEGORIES = ["All", "Safety", "Compliance", "Technical", "HR"];

const COURSES = [
  { id: 1, title: "Fire Safety Fundamentals", category: "Safety", duration: "45 min", progress: 100, status: "COMPLETED", score: 92, gradient: "from-orange-400 to-red-500", emoji: "🔥" },
  { id: 2, title: "Chemical Handling Procedure", category: "Compliance", duration: "60 min", progress: 100, status: "COMPLETED", score: 88, gradient: "from-blue-400 to-indigo-500", emoji: "⚗️" },
  { id: 3, title: "Emergency Response Protocol", category: "Safety", duration: "30 min", progress: 65, status: "IN PROGRESS", score: null, gradient: "from-yellow-400 to-orange-500", emoji: "🚨" },
  { id: 4, title: "ISO 45001 Awareness", category: "Compliance", duration: "90 min", progress: 100, status: "COMPLETED", score: 76, gradient: "from-green-400 to-teal-500", emoji: "📋" },
  { id: 5, title: "PPE & Hazmat Handling", category: "Technical", duration: "50 min", progress: 40, status: "IN PROGRESS", score: null, gradient: "from-purple-400 to-pink-500", emoji: "🦺" },
  { id: 6, title: "COSHH Regulations Update", category: "Compliance", duration: "40 min", progress: 0, status: "NOT STARTED", score: null, gradient: "from-slate-400 to-slate-600", emoji: "📄" },
  { id: 7, title: "Manual Handling Techniques", category: "Technical", duration: "35 min", progress: 0, status: "NOT STARTED", score: null, gradient: "from-cyan-400 to-blue-500", emoji: "🏋️" },
  { id: 8, title: "Workplace Diversity & Inclusion", category: "HR", duration: "55 min", progress: 100, status: "COMPLETED", score: 95, gradient: "from-pink-400 to-rose-500", emoji: "🤝" },
];

const STATUS_STYLES = {
  "COMPLETED": "bg-green-100 text-green-700",
  "IN PROGRESS": "bg-amber-100 text-amber-700",
  "NOT STARTED": "bg-slate-100 text-slate-500",
};

const PROGRESS_COLOR = {
  "COMPLETED": "bg-green-500",
  "IN PROGRESS": "bg-amber-400",
  "NOT STARTED": "bg-slate-200",
};

const TrainingPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? COURSES : COURSES.filter((c) => c.category === activeCategory);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Training Library</h1>
        <p className="text-slate-500 text-sm mt-0.5">{COURSES.filter(c => c.status === "COMPLETED").length} of {COURSES.length} courses completed</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-green-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({COURSES.filter((c) => c.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            {/* Thumbnail */}
            <div className={`h-28 bg-gradient-to-br ${course.gradient} flex items-center justify-center relative`}>
              <span className="text-4xl">{course.emoji}</span>
              <div className="absolute top-3 right-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[course.status]}`}>
                  {course.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-slate-800 text-sm leading-snug">{course.title}</h3>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{course.category}</span>
                <span className="text-xs text-slate-400">⏱ {course.duration}</span>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Progress</span>
                  <span className="text-xs font-semibold text-slate-700">{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${PROGRESS_COLOR[course.status]} transition-all`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {course.score && (
                <p className="text-xs text-slate-400 mt-2">Score: <span className="font-semibold text-slate-600">{course.score}%</span></p>
              )}

              <button className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                course.status === "COMPLETED"
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}>
                {course.status === "COMPLETED" ? "Review" : course.status === "IN PROGRESS" ? "Continue →" : "Start Course"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPage;
