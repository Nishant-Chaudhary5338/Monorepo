import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { DeckActions, DeckConfig, DeckState } from "../types";

interface DeckContextValue extends DeckState, DeckActions {
  config: DeckConfig;
}

const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeckContext(): DeckContextValue {
  const ctx = useContext(DeckContext);
  if (!ctx) {
    throw new Error("useDeckContext must be used within a <Deck> component");
  }
  return ctx;
}

interface DeckProviderProps {
  children: ReactNode;
  state: DeckState & DeckActions;
  config: DeckConfig;
  style?: CSSProperties;
}

export function DeckProvider({
  children,
  state,
  config,
  style,
}: DeckProviderProps) {
  const value = useMemo(
    () => ({ ...state, config }),
    [state, config]
  );

  return (
    <DeckContext.Provider value={value}>
      <div className="present-deck" style={style} role="presentation">
        {children}
      </div>
    </DeckContext.Provider>
  );
}
