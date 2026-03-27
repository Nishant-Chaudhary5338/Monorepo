// State module — Finite state machine + React context
export {
  createDeckMachineState,
  sendEvent,
  canTransition,
  availableEvents,
} from "./deck-machine";
export type { DeckStatus, DeckMachineEvent, DeckMachineState } from "./deck-machine";
export { DeckContext, DeckProvider } from "./context";
export type { DeckContextValue, DeckProviderProps } from "./context";
export { useDeck } from "./use-deck";
