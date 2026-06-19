// External, render-free store the morph particle system reads inside useFrame.
// Updated by scroll/pointer handlers — never triggers React re-renders.

export interface MorphSnapshot {
  index: number;        // rounded active target (a11y / reduced-motion + back-compat)
  progress: number;     // continuous scroll position across states (0 .. states-1)
  pointerX: number;     // normalized device coords [-1, 1]
  pointerY: number;
  pointerActive: boolean;
  dragging: boolean;
  rotAccum: number;     // pending rotation delta from drag, consumed by the renderer
}

export interface MorphBlend {
  from: number;
  to: number;
  blend: number;        // 0 = fully `from`, 1 = fully `to`
}

const state: MorphSnapshot = {
  index: 0,
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  pointerActive: false,
  dragging: false,
  rotAccum: 0,
};

export const morphStore = {
  get: (): MorphSnapshot => state,
  setIndex: (i: number): void => { state.index = i; state.progress = i; },
  setProgress: (p: number): void => { state.progress = p; state.index = Math.round(p); },
  setPointer: (x: number, y: number, active: boolean): void => {
    state.pointerX = x; state.pointerY = y; state.pointerActive = active;
  },
  setDragging: (d: boolean): void => { state.dragging = d; },
  addRot: (delta: number): void => { state.rotAccum += delta; },
  consumeRot: (): number => { const r = state.rotAccum; state.rotAccum = 0; return r; },
};

// Split a continuous progress value into the two states to blend and the mix factor.
export function deriveBlend(progress: number, maxIndex: number): MorphBlend {
  const clamped = Math.max(0, Math.min(maxIndex, progress));
  const from = Math.min(maxIndex, Math.floor(clamped));
  const to = Math.min(maxIndex, from + 1);
  return { from, to, blend: clamped - from };
}
