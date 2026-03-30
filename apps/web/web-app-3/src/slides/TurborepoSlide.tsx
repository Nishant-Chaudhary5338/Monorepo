import { useState, useEffect } from "react";
import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

interface Task {
  id: string;
  label: string;
  duration: number; // in seconds
  cached?: boolean;
}

const tasks: Task[] = [
  { id: "app1", label: "web-app-1", duration: 120 },
  { id: "app2", label: "web-app-2", duration: 120 },
  { id: "app3", label: "web-app-3", duration: 120 },
  { id: "pkgs", label: "packages", duration: 60 },
];

export function TurborepoSlide() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [sequentialProgress, setSequentialProgress] = useState<number[]>([0, 0, 0, 0]);
  const [parallelProgress, setParallelProgress] = useState<number[]>([0, 0, 0, 0]);
  const [showCache, setShowCache] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      startAnimation();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const startAnimation = () => {
    // Sequential animation - one after another
    let seqIndex = 0;
    const seqInterval = setInterval(() => {
      if (seqIndex < 4) {
        animateBar(setSequentialProgress, seqIndex, 1000);
        seqIndex++;
      } else {
        clearInterval(seqInterval);
      }
    }, 1100);

    // Parallel animation - all at once
    setTimeout(() => {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          animateBar(setParallelProgress, i, 800);
        }, i * 100);
      }
    }, 500);

    // Show cache indicator
    setTimeout(() => setShowCache(true), 2000);
  };

  const animateBar = (
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    index: number,
    duration: number
  ) => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setter((prev) => {
        const next = [...prev];
        next[index] = progress;
        return next;
      });
      if (progress < 100) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <Slide layout="center" title="Turborepo">
      <div className="bg-gradient-green flex h-full w-full flex-col items-center justify-center p-10">
        <SlideHeader
          title="How"
          highlight="Turborepo"
          highlightColor="green"
          subtitle="Parallel builds with smart caching"
        />

        {/* Main Comparison */}
        <div className="mt-8 flex w-full max-w-5xl gap-8">
          {/* Sequential */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">❌</span>
              <h3 className="text-lg font-bold text-red-600">Sequential (Before)</h3>
            </div>

            <div className="rounded-xl border border-red-300 bg-red-50 p-5">
              {tasks.map((task, i) => (
                <div key={task.id} className="mb-3 flex items-center gap-3">
                  <span className="w-24 text-right text-xs font-medium text-gray-600">
                    {task.label}
                  </span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-red-200">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-100"
                      style={{ width: `${sequentialProgress[i]}%` }}
                    />
                    {sequentialProgress[i] > 0 && sequentialProgress[i] < 100 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {Math.round(sequentialProgress[i])}%
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="w-10 text-right text-xs font-bold text-red-600">
                    2m
                  </span>
                </div>
              ))}

              <div className="mt-4 flex items-center justify-center gap-2 border-t border-red-200 pt-4">
                <span className="text-3xl font-extrabold text-red-600">7 min</span>
                <span className="text-sm text-gray-500">total</span>
              </div>
            </div>
          </div>

          {/* VS Arrow */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
              <span className="text-2xl font-bold text-gray-400">VS</span>
            </div>
            <div className="mt-4 animate-pulse">
              <span className="text-4xl">⚡</span>
            </div>
          </div>

          {/* Parallel */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">✅</span>
              <h3 className="text-lg font-bold text-green-600">Parallel (After)</h3>
            </div>

            <div className="rounded-xl border border-green-300 bg-green-50 p-5">
              {tasks.map((task, i) => (
                <div key={task.id} className="mb-3 flex items-center gap-3">
                  <span className="w-24 text-right text-xs font-medium text-gray-600">
                    {task.label}
                  </span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-green-200">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-100"
                      style={{ width: `${parallelProgress[i]}%` }}
                    />
                    {parallelProgress[i] > 0 && parallelProgress[i] < 100 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {Math.round(parallelProgress[i])}%
                        </span>
                      </div>
                    )}
                    {parallelProgress[i] === 100 && showCache && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <span className="animate-pulse text-xs">⚡</span>
                      </div>
                    )}
                  </div>
                  <span className="w-10 text-right text-xs font-bold text-green-600">
                    {i === 3 ? "1m" : "2m"}
                  </span>
                </div>
              ))}

              <div className="mt-4 flex items-center justify-center gap-2 border-t border-green-200 pt-4">
                <span className="text-3xl font-extrabold text-green-600">2 min</span>
                <span className="text-sm text-gray-500">total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Turborepo Metrics - Right Side */}
        <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-4">
          <div
            className={`flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 transition-all duration-500 ${
              showCache ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <span className="text-2xl">💾</span>
            <div>
              <p className="text-sm font-bold text-amber-700">Smart Caching</p>
              <p className="text-[10px] text-gray-500">Build once, reuse everywhere</p>
            </div>
            <span className="animate-pulse text-xl">⚡</span>
          </div>

          <div
            className={`flex items-center gap-3 rounded-xl border border-cyan-300 bg-cyan-50 px-5 py-3 transition-all duration-500 ${
              showCache ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-sm font-bold text-cyan-700">90% Cache Hits</p>
              <p className="text-[10px] text-gray-500">Most builds are instant</p>
            </div>
          </div>

          <div
            className={`flex flex-col items-center rounded-xl border border-green-300 bg-green-50 px-6 py-4 transition-all duration-500 ${
              showCache ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="text-3xl font-extrabold text-green-600">75%</span>
            <span className="text-xs text-gray-500">Faster Builds</span>
          </div>

          <div
            className={`flex flex-col items-center rounded-xl border border-purple-300 bg-purple-50 px-6 py-4 transition-all duration-500 ${
              showCache ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <span className="text-3xl font-extrabold text-purple-600">30</span>
            <span className="text-xs text-gray-500">Parallel Tasks</span>
          </div>

          <div
            className={`flex flex-col items-center rounded-xl border border-amber-300 bg-amber-50 px-6 py-4 transition-all duration-500 ${
              showCache ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <span className="text-3xl font-extrabold text-amber-600">3.5×</span>
            <span className="text-xs text-gray-500">Speed Boost</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}