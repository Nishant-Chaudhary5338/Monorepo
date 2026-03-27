/**
 * Notes plugin — Speaker notes support
 */

import type { Plugin, PluginContext } from "../types";

/** Notes plugin options */
export interface NotesOptions {
  /** Notes per slide */
  notes: Record<number, string>;
  /** Show notes in presenter mode */
  showInPresenter: boolean;
  /** Notes styling */
  fontSize: string;
  /** Notes container element (for external rendering) */
  container?: HTMLElement | null;
  /** On notes change callback */
  onNotesChange?: (slideIndex: number, notes: string) => void;
}

const DEFAULT_OPTIONS: NotesOptions = {
  notes: {},
  showInPresenter: true,
  fontSize: "14px",
};

/**
 * Create notes plugin
 */
export function createNotesPlugin(options: Partial<NotesOptions> = {}): Plugin {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let context: PluginContext | null = null;
  let currentSlideIndex = 0;

  function getCurrentNotes(): string {
    return config.notes[currentSlideIndex] ?? "";
  }

  function setNotes(slideIndex: number, notes: string): void {
    config.notes[slideIndex] = notes;
    config.onNotesChange?.(slideIndex, notes);
  }

  function renderNotes(container: HTMLElement): void {
    const notes = getCurrentNotes();
    container.innerHTML = "";

    if (!notes) return;

    const notesElement = document.createElement("div");
    notesElement.className = "present-notes";
    notesElement.style.cssText = `
      font-size: ${config.fontSize};
      padding: 16px;
      white-space: pre-wrap;
      line-height: 1.5;
    `;
    notesElement.textContent = notes;
    container.appendChild(notesElement);
  }

  return {
    config: {
      name: "notes",
      version: "1.0.0",
      description: "Speaker notes support",
      options: config,
    },
    hooks: {
      onRegister: (ctx) => {
        context = ctx;
      },

      onUnregister: () => {
        context = null;
      },

      onSlideChange: (index) => {
        currentSlideIndex = index;

        if (config.container) {
          renderNotes(config.container);
        }
      },

      onPresenterToggle: (isPresenter) => {
        if (isPresenter && config.container) {
          renderNotes(config.container);
        }
      },
    },
  };
}