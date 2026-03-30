import { useState, useEffect, useRef, useCallback } from 'react';

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number
): T {
  const lastRun = useRef(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= interval) {
        lastRun.current = now;
        callbackRef.current(...args);
      }
    }) as T,
    [interval]
  );
}
