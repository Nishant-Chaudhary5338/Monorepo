import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { LightSceneRoot } from './hero/LightScene';

const C = {
  INDIGO: 0x6366F1, CYAN: 0x22D3EE, ORANGE: 0xF97316,
  FG: 0xF8F9FF, BG: 0x07080F, PANEL: 0x0F1018,
};

/* ── Minimal ambient card: panel + border + slow scan line ──────────────── */
type AmbientCardProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  w: number; h: number; color: number;
  freq: number; phase: number; opacityMult: number;
};

function AmbientCard({ position, rotation, w, h, color, freq, phase, opacityMult }: AmbientCardProps) {
  const ref = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const initPos = useMemo(() => new THREE.Vector3(...position), []);  // stable per card
  const panelGeo = useMemo(() => new THREE.PlaneGeometry(w, h), [w, h]);
  const borderGeo = useMemo(() => new THREE.EdgesGeometry(panelGeo), [panelGeo]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = initPos.y + Math.sin(t * freq + phase) * 0.28;
      ref.current.position.x = initPos.x + Math.cos(t * freq * 0.6 + phase) * 0.18;
    }
    if (scanRef.current) {
      const sp = ((t * 0.28 + phase) % 2) - 1;
      scanRef.current.position.y = sp * (h * 0.46);
      (scanRef.current.material as THREE.MeshBasicMaterial).opacity = (0.3 - Math.abs(sp) * 0.25) * opacityMult;
    }
  });

  return (
    <group ref={ref} position={[initPos.x, initPos.y, initPos.z]} rotation={rotation}>
      <mesh geometry={panelGeo}>
        <meshBasicMaterial color={C.PANEL} transparent opacity={0.55 * opacityMult} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={borderGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.88 * opacityMult} />
      </lineSegments>
      <mesh geometry={panelGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.04 * opacityMult} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* header strip */}
      <mesh position={[0, h * 0.43, 0.005]}>
        <planeGeometry args={[w * 0.96, 0.055]} />
        <meshBasicMaterial color={color} transparent opacity={0.18 * opacityMult} />
      </mesh>
      {/* scan line */}
      <mesh ref={scanRef} position={[0, 0, 0.006]}>
        <planeGeometry args={[w * 0.94, 0.011]} />
        <meshBasicMaterial color={C.CYAN} transparent opacity={0.3 * opacityMult} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Sparse particle field ───────────────────────────────────────────────── */
function AmbientParticles() {
  const positions = useMemo(() => {
    const arr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const r = 7 + Math.random() * 14;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(Math.random() * 2 - 1);
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.65;
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={C.FG} size={0.028} transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ── Scene root with very slow cursor parallax ──────────────────────────── */
type CardData = AmbientCardProps & { key: number };

function SceneRoot() {
  const rootRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  const cards = useMemo<CardData[]>(() => {
    const palette = [C.INDIGO, C.CYAN, C.INDIGO, C.ORANGE, C.CYAN];
    const layers = [
      { count: 6, rMin: 7,   rMax: 12, yRange: 5.5, zBase: -3,  opacity: 0.22 },
      { count: 5, rMin: 4.5, rMax: 7,  yRange: 4.0, zBase:  1,  opacity: 0.32 },
    ];
    const all: CardData[] = [];
    let idx = 0;
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++, idx++) {
        const w = 1.1 + Math.random() * 0.9;
        const h = 0.65 + Math.random() * 0.5;
        const r = layer.rMin + Math.random() * (layer.rMax - layer.rMin);
        const theta = (i / layer.count) * Math.PI * 2 + Math.random() * 0.9;
        const y = (Math.random() - 0.5) * layer.yRange;
        const x = Math.cos(theta) * r;
        const z = layer.zBase + Math.sin(theta) * r * 0.4 + (Math.random() - 0.5) * 3;
        const rotY = -Math.atan2(x, 9) * 0.35;
        const rotX = y * 0.025;
        all.push({
          key: idx,
          position: [x, y, z] as [number, number, number],
          rotation: [rotX, rotY, (Math.random() - 0.5) * 0.07] as [number, number, number],
          w, h,
          color: palette[idx % palette.length],
          freq: 0.07 + Math.random() * 0.10,
          phase: Math.random() * Math.PI * 2,
          opacityMult: layer.opacity,
        });
      }
    });
    return all;
  }, []);

  useFrame(({ pointer }) => {
    targetRot.current.y = pointer.x * 0.10;
    targetRot.current.x = -pointer.y * 0.07;
    if (rootRef.current) {
      rootRef.current.rotation.y += (targetRot.current.y - rootRef.current.rotation.y) * 0.018 + 0.0002;
      rootRef.current.rotation.x += (targetRot.current.x - rootRef.current.rotation.x) * 0.018;
    }
  });

  return (
    <group ref={rootRef}>
      {cards.map(({ key, ...props }) => <AmbientCard key={key} {...props} />)}
      <AmbientParticles />
    </group>
  );
}

/* ── Canvas export ───────────────────────────────────────────────────────── */
export default function SiteBackground() {
  const { theme } = useTheme();

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  if (theme === 'light') {
    return (
      <Canvas
        camera={{ position: [0, 0.5, 10], fov: 55, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'default' }}
        dpr={1}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.55 }}
      >
        <fog attach="fog" args={[0xFAF7F2, 10, 48]} />
        <LightSceneRoot
          layers={[
            { count: 4, rMin: 7, rMax: 12, yRange: 5, zBase: -3,  opacity: 0.22 },
            { count: 4, rMin: 4, rMax: 7,  yRange: 4, zBase: 1,   opacity: 0.32 },
          ]}
          parallaxStrength={0.06}
        />
      </Canvas>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0.5, 10], fov: 55, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'default' }}
      dpr={1}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.7 }}
    >
      <fog attach="fog" args={[C.BG, 8, 45]} />
      <SceneRoot />
    </Canvas>
  );
}
