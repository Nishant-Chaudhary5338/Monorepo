import { useEffect, useRef, useState, type RefObject } from "react";

const BACK_TOP_AFTER = 30;
const MIN_LEFT_FROM = 5;
const MIN_LEFT_UNTIL = 95;
// Matches the sticky top bar: a heading counts as "current" once it crosses this line.
const HEADING_LINE_PX = 120;

interface ContentScroll {
  barRef: RefObject<HTMLDivElement | null>;
  minutesRef: RefObject<HTMLDivElement | null>;
  activeId: string;
  showBackTop: boolean;
}

/**
 * Reading progress and active heading for long-form pages. Progress is written
 * straight to the DOM from a rAF-throttled scroll handler so scrolling never
 * triggers a React render; only crossing a threshold (active heading, back-to-top)
 * does.
 */
export function useContentScroll(ready: boolean, totalMinutes: number): ContentScroll {
  const barRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let frame = 0;

    const paint = (): void => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${progress}%`;
      const chip = minutesRef.current;
      if (chip) {
        chip.textContent = `${Math.max(1, Math.round(totalMinutes * (1 - progress / 100)))} min left`;
        chip.style.opacity = progress > MIN_LEFT_FROM && progress < MIN_LEFT_UNTIL ? "1" : "0";
      }
      setShowBackTop(progress > BACK_TOP_AFTER);
    };

    const onScroll = (): void => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ready, totalMinutes]);

  useEffect(() => {
    if (!ready) return;
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".article-body h2, .article-body h3"),
    );
    // The current heading is the last one above the reading line. The observer
    // signals line crossings during normal scrolling; `scrollend` covers jumps
    // (anchor links, back-to-top) that skip the band entirely.
    const update = (): void => {
      let current = "";
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > HEADING_LINE_PX) break;
        current = heading.id;
      }
      setActiveId(current);
    };
    const observer = new IntersectionObserver(update, {
      rootMargin: `-${HEADING_LINE_PX}px 0px -70% 0px`,
    });
    headings.forEach((heading) => observer.observe(heading));
    window.addEventListener("scrollend", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scrollend", update);
    };
  }, [ready]);

  return { barRef, minutesRef, activeId, showBackTop };
}
