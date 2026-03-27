import { useCallback, useEffect, useState } from "react";
import type { DeckActions, DeckState, DeckConfig } from "../types";

export function useDeck(config: DeckConfig): DeckState & DeckActions {
  const { slides, keyboard = true } = config;
  const totalSlides = slides.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOverview, setIsOverview] = useState(false);
  const [isPresenterMode, setIsPresenterMode] = useState(
    config.presenterMode ?? false
  );

  const next = useCallback(() => {
    setCurrentSlide((i) => Math.min(i + 1, totalSlides - 1));
  }, [totalSlides]);

  const prev = useCallback(() => {
    setCurrentSlide((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
    },
    [totalSlides]
  );

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const toggleOverview = useCallback(() => {
    setIsOverview((v) => !v);
  }, []);

  const togglePresenterMode = useCallback(() => {
    setIsPresenterMode((v) => !v);
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!keyboard) return;

    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(totalSlides - 1);
          break;
        case "f":
        case "F":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case "o":
        case "O":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleOverview();
          }
          break;
        case "p":
        case "P":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            togglePresenterMode();
          }
          break;
        case "Escape":
          e.preventDefault();
          if (isOverview) setIsOverview(false);
          if (isFullscreen) toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    keyboard,
    next,
    prev,
    goTo,
    totalSlides,
    toggleFullscreen,
    toggleOverview,
    togglePresenterMode,
    isOverview,
    isFullscreen,
  ]);

  return {
    currentSlide,
    totalSlides,
    isFullscreen,
    isOverview,
    isPresenterMode,
    next,
    prev,
    goTo,
    toggleFullscreen,
    toggleOverview,
    togglePresenterMode,
  };
}
