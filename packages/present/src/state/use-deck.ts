/**
 * useDeck — Hook for accessing deck state and actions
 *
 * Must be used within a DeckProvider.
 */

import { useContext } from "react";
import { DeckContext, type DeckContextValue } from "./context";

export function useDeck(): DeckContextValue {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error(
      "useDeck must be used within a <DeckProvider>. " +
        "Wrap your component tree with <DeckProvider totalSlides={n}>.",
    );
  }
  return context;
}