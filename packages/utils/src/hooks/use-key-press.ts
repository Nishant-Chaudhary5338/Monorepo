import { useState, useEffect } from 'react';

export function useKeyPress(targetKey: string | string[]): boolean {
  const [pressed, setPressed] = useState(false);
  const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const downHandler = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) setPressed(true);
    };
    const upHandler = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) setPressed(false);
    };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [keys.join(',')]);

  return pressed;
}
