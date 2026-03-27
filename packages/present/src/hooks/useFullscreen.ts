import { useCallback, useEffect, useState } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const enter = useCallback(async (element?: HTMLElement) => {
    const el = element ?? document.documentElement;
    await el.requestFullscreen();
  }, []);

  const exit = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }, []);

  const toggle = useCallback(
    async (element?: HTMLElement) => {
      if (isFullscreen) {
        await exit();
      } else {
        await enter(element);
      }
    },
    [isFullscreen, enter, exit]
  );

  return { isFullscreen, enter, exit, toggle };
}
