import { useEffect, useRef, useState } from 'react';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  isLowPerformance: boolean;
}

// ✅ FIX: Performance monitoring hook to detect low FPS
export const usePerformanceMonitor = (threshold: number = 30): PerformanceStats => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    frameTime: 16.67,
    isLowPerformance: false,
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime.current;

      if (delta >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / delta);
        const frameTime = delta / frameCount.current;
        
        setStats({
          fps,
          frameTime,
          isLowPerformance: fps < threshold,
        });

        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId.current = requestAnimationFrame(measureFPS);
    };

    animationFrameId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [threshold]);

  return stats;
};

// ✅ FIX: Debounce hook for scroll events
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ✅ FIX: Throttle hook for animation frames
export const useThrottle = (callback: () => void, delay: number) => {
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastRun.current >= delay) {
        callback();
        lastRun.current = Date.now();
      }
    }, delay);

    return () => clearInterval(interval);
  }, [callback, delay]);
};