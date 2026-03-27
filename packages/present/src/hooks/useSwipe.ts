import { useCallback, useEffect, useState } from "react";

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipe(options: UseSwipeOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  } = options;

  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const onTouchStart = useCallback((e: TouchEvent) => {
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!startPos) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startPos.x;
      const dy = endY - startPos.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold) onSwipeRight?.();
        else if (dx < -threshold) onSwipeLeft?.();
      } else {
        if (dy > threshold) onSwipeDown?.();
        else if (dy < -threshold) onSwipeUp?.();
      }

      setStartPos(null);
    },
    [startPos, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]
  );

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd]);
}
