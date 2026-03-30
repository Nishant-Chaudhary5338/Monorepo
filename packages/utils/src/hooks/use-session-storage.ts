import { useState, useCallback } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
          }
        } catch (error) {
          console.error('Error saving to sessionStorage:', error);
        }
        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
