import { useCallback, useEffect, useState } from "react";

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      if (startTime) {
        setElapsed(Date.now() - startTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running, startTime]);

  const start = useCallback(() => {
    setStartTime(Date.now() - elapsed);
    setRunning(true);
  }, [elapsed]);

  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setElapsed(0);
    setStartTime(null);
    setRunning(false);
  }, []);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  return {
    elapsed,
    elapsedFormatted: formatTime(elapsed),
    running,
    start,
    stop,
    reset,
    formatTime,
  };
}
