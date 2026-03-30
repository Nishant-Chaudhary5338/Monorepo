import { useState, useEffect, useRef, type RefObject } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] {
  const { freezeOnceVisible = false, ...observerOptions } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (freezeOnceVisible && entry.isIntersecting) {
        observer.unobserve(element);
      }
    }, observerOptions);

    observer.observe(element);
    return () => observer.disconnect();
  }, [freezeOnceVisible, JSON.stringify(observerOptions)]);

  return [ref, isIntersecting];
}
