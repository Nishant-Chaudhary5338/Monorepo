import { useMemo, useRef, type ReactElement } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { morphStore, deriveBlend } from "./morphStore";
import type { MorphData } from "./targets";

const EASE = 0.06;          // position morph speed
const COLOR_EASE = 0.04;    // colour morph speed
const REPEL_R2 = 11;        // cursor repulsion radius²
const IDLE_SPIN = 0.0011;

// Deterministic PRNG — keeps particle init pure (stable across re-renders) instead of
// Math.random(), which is impure during render. Same seed → same cloud every mount.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function MorphParticles({ data }: { data: MorphData }): ReactElement {
  const { count, states, accents } = data;
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const positions = useMemo(() => {
    const rnd = mulberry32(0x9e3779b1 ^ count);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) a[i] = (rnd() - 0.5) * 46;
    return a;
  }, [count]);

  // per-particle "tone" — how strongly it takes the accent colour vs staying near-white
  const tones = useMemo(() => {
    const rnd = mulberry32(0x85ebca77 ^ count);
    const t = new Float32Array(count);
    for (let i = 0; i < count; i++) t[i] = Math.pow(rnd(), 1.6);
    return t;
  }, [count]);

  const colors = useMemo(() => {
    const a = new Float32Array(count * 3);
    const white = new THREE.Color("#EAF1FF");
    for (let i = 0; i < count; i++) { a[i * 3] = white.r; a[i * 3 + 1] = white.g; a[i * 3 + 2] = white.b; }
    return a;
  }, [count]);

  // soft round glow sprite so points read as luminous dots, not squares
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.4, "rgba(255,255,255,0.65)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const mouseW = useMemo(() => new THREE.Vector3(999, 999, 0), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const white = useMemo(() => new THREE.Color("#EAF1FF"), []);
  const accent = useMemo(() => new THREE.Color(), []);
  const rotY = useRef(0);

  useFrame(() => {
    const pts = pointsRef.current;
    if (!pts) return;
    const s = morphStore.get();
    const { from, to, blend } = deriveBlend(s.progress, states.length - 1);
    const A = states[from];
    const B = states[to];
    accent.copy(accents[from]).lerp(accents[to], blend);

    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = pts.geometry.attributes.color as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const col = colAttr.array as Float32Array;

    // cursor → world point on z=0 plane
    if (s.pointerActive) {
      ndc.set(s.pointerX, s.pointerY);
      // cast around @types/three version skew between r3f's Camera and three@0.174
      ray.setFromCamera(ndc, camera as unknown as THREE.Camera);
      ray.ray.intersectPlane(plane, mouseW);
    } else {
      mouseW.set(999, 999, 0);
    }

    // rotation: idle drift + drag momentum
    rotY.current += morphStore.consumeRot();
    if (!s.dragging) rotY.current += IDLE_SPIN;
    pts.rotation.y = rotY.current;
    pts.rotation.x += (s.pointerY * 0.22 - pts.rotation.x) * 0.05;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      // blended morph target between the two states the scroll sits between
      const tx = A[ix] + (B[ix] - A[ix]) * blend;
      const ty = A[iy] + (B[iy] - A[iy]) * blend;
      const tz = A[iz] + (B[iz] - A[iz]) * blend;
      pos[ix] += (tx - pos[ix]) * EASE;
      pos[iy] += (ty - pos[iy]) * EASE;
      pos[iz] += (tz - pos[iz]) * EASE;

      const dx = pos[ix] - mouseW.x, dy = pos[iy] - mouseW.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < REPEL_R2) {
        const f = (REPEL_R2 - d2) / REPEL_R2 * 0.9;
        const d = Math.sqrt(d2) || 1;
        pos[ix] += dx / d * f;
        pos[iy] += dy / d * f;
      }

      // colour morph toward this section's accent, scaled by the particle's tone
      const tone = tones[i];
      const tr = white.r + (accent.r - white.r) * tone;
      const tg = white.g + (accent.g - white.g) * tone;
      const tb = white.b + (accent.b - white.b) * tone;
      col[ix] += (tr - col[ix]) * COLOR_EASE;
      col[iy] += (tg - col[iy]) * COLOR_EASE;
      col[iz] += (tb - col[iz]) * COLOR_EASE;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  // @types/three dual-version skew: r3f's JSX map type differs from three@0.174's Texture
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spriteMap = sprite as any;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={spriteMap}
        size={0.14}
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
