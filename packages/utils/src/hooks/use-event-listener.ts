import { useEffect, useRef } from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined | null,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element?: React.RefObject<HTMLElement> | null,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element?.current ?? window;
    if (!targetElement?.addEventListener) return;

    const eventListener: typeof handler = (event) => savedHandler.current(event);
    targetElement.addEventListener(eventName, eventListener, options);
    return () => targetElement.removeEventListener(eventName, eventListener, options);
  }, [eventName, element, options]);
}
