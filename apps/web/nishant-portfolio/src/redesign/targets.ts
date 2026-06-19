import * as THREE from "three";

// One particle cloud, many shapes. Every section maps to a target form + accent hue;
// the cloud morphs (position + colour) between them as you scroll.

export interface MorphData {
  count: number;
  states: Float32Array[];
  accents: THREE.Color[];
  labels: string[];
}

const FONT = '800 200px "Bricolage Grotesque", system-ui, sans-serif';

function sampleText(text: string, scale: number): number[] {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx) return [];
  c.width = 1200; c.height = 340;
  ctx.fillStyle = "#fff";
  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, c.width / 2, c.height / 2);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  const pts: number[] = [];
  const step = 5;
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      if (d[(y * c.width + x) * 4 + 3] > 128) {
        pts.push((x - c.width / 2) * scale, -(y - c.height / 2) * scale, (Math.random() - 0.5) * 1.6);
      }
    }
  }
  return pts;
}

function fit(src: number[], count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const n = Math.max(1, Math.floor(src.length / 3));
  for (let i = 0; i < count; i++) {
    const j = (i % n) * 3;
    out[i * 3] = src[j]; out[i * 3 + 1] = src[j + 1]; out[i * 3 + 2] = src[j + 2];
  }
  return out;
}

function fromGeometry(geo: THREE.BufferGeometry, count: number, jitter = 0): Float32Array {
  const pos = geo.attributes.position.array as ArrayLike<number>;
  const n = pos.length / 3;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const j = Math.floor(Math.random() * n) * 3;
    out[i * 3] = pos[j] + (Math.random() - 0.5) * jitter;
    out[i * 3 + 1] = pos[j + 1] + (Math.random() - 0.5) * jitter;
    out[i * 3 + 2] = pos[j + 2] + (Math.random() - 0.5) * jitter;
  }
  geo.dispose();
  return out;
}

function sphere(count: number, R = 10): Float32Array {
  const out = new Float32Array(count * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = g * i;
    out[i * 3] = Math.cos(th) * r * R;
    out[i * 3 + 1] = y * R;
    out[i * 3 + 2] = Math.sin(th) * r * R;
  }
  return out;
}

function helix(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const turns = 5, R = 6.5, H = 24;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const a = t * Math.PI * 2 * turns;
    const r = R * (0.55 + 0.45 * Math.sin(t * Math.PI));
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = (t - 0.5) * H;
    out[i * 3 + 2] = Math.sin(a) * r;
  }
  return out;
}

const TEXT_STATE_INDEXES = [0, 5, 6] as const;

export function buildTargets(): MorphData {
  const name = sampleText("NISHANT", 0.046);
  const count = Math.max(1, Math.floor(name.length / 3));

  const states: Float32Array[] = [
    fit(name, count),                                                  // 0 hero — identity
    fromGeometry(new THREE.TorusKnotGeometry(8, 2.4, 220, 32, 2, 3), count, 0.4), // 1 work — systems
    helix(count),                                                       // 2 experience — timeline
    fromGeometry(new THREE.IcosahedronGeometry(10, 4), count),          // 3 stack — structure
    sphere(count),                                                      // 4 about — settled
    fit(sampleText("WRITING", 0.05), count),                            // 5 writing
    fit(sampleText("HELLO", 0.072), count),                             // 6 contact
  ];

  const accents = [
    new THREE.Color("#6EA8FF"), // blue
    new THREE.Color("#FFB23E"), // amber
    new THREE.Color("#FF5C8A"), // rose
    new THREE.Color("#36E0C8"), // teal
    new THREE.Color("#FF7A4D"), // coral
    new THREE.Color("#B488FF"), // violet
    new THREE.Color("#C6FF5A"), // lime
  ];

  const labels = ["identity", "systems", "timeline", "stack", "the person", "thoughts", "say hello"];

  return { count, states, accents, labels };
}

// Re-sample the text-based states once the webfont is ready so glyphs are crisp.
export function refineTextStates(data: MorphData): void {
  const words = ["NISHANT", "WRITING", "HELLO"];
  const scales = [0.046, 0.05, 0.072];
  TEXT_STATE_INDEXES.forEach((stateIdx, k) => {
    const refined = fit(sampleText(words[k], scales[k]), data.count);
    data.states[stateIdx].set(refined);
  });
}
