import { useEffect, useState } from "react";

interface ReadingProgress {
  progress: number;
  activeId: string;
}

// The heading whose top has scrolled past the navbar is the one being read.
const HEADING_OFFSET_PX = 120;

export function useReadingProgress(): ReadingProgress {
  const [state, setState] = useState<ReadingProgress>({ progress: 0, activeId: "" });

  useEffect(() => {
    const onScroll = (): void => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      let activeId = "";
      document.querySelectorAll<HTMLElement>(".prose-body h2, .prose-body h3").forEach((el) => {
        if (el.getBoundingClientRect().top < HEADING_OFFSET_PX) activeId = el.id;
      });
      setState((prev) => ({ progress, activeId: activeId || prev.activeId }));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}
