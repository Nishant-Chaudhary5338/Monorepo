import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { LightSceneRoot } from './LightScene';

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  INDIGO: 0x6366F1, CYAN: 0x22D3EE, ORANGE: 0xF97316,
  VIOLET: 0x8B5CF6, FG: 0xF8F9FF,   BG: 0x07080F, PANEL: 0x0F1018,
};

type Variant = 'chart' | 'bars' | 'stats' | 'code';

/* ── Imperative line (avoids JSX <line> element conflict) ─────────────────── */
function TLine({ positions, color, opacity = 1 }: { positions: Float32Array; color: number; opacity?: number }) {
  const obj = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  }, [positions, color, opacity]);
  return <primitive object={obj} />;
}

/* ── Card UI variants (separate components to satisfy hooks rules) ─────────── */
function ChartCardUI({ w, h }: { w: number; h: number }) {
  const curve = useMemo(() => {
    const n = 16; const arr: number[] = [];
    for (let i = 0; i <= n; i++) {
      arr.push(
        -w * 0.38 + (i / n) * w * 0.76,
        -h * 0.15 + Math.sin(i * 0.7) * h * 0.10 + Math.cos(i * 0.4) * h * 0.05,
        0,
      );
    }
    return new Float32Array(arr);
  }, [w, h]);
  const baseline = useMemo(() => new Float32Array([-w * 0.38, -h * 0.30, 0, w * 0.38, -h * 0.30, 0]), [w, h]);
  return (
    <group position={[0, 0, 0.01]}>
      <TLine positions={curve} color={C.CYAN} opacity={0.9} />
      <TLine positions={baseline} color={0x2A2D42} opacity={0.7} />
    </group>
  );
}

function BarsCardUI({ w, h, color }: { w: number; h: number; color: number }) {
  const bars = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    x: -w * 0.32 + (i / 6) * w * 0.6,
    bh: 0.06 + Math.random() * h * 0.32,
    c: i % 2 === 0 ? color : C.CYAN,
  })), [w, h, color]);
  return (
    <group position={[0, 0, 0.01]}>
      {bars.map((b, i) => (
        <mesh key={i} position={[b.x, -h * 0.25 + b.bh / 2, 0]}>
          <planeGeometry args={[w * 0.06, b.bh]} />
          <meshBasicMaterial color={b.c} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function StatsCardUI({ w, h, color }: { w: number; h: number; color: number }) {
  const rows = useMemo(() => Array.from({ length: 3 }).map((_, i) => ({
    y: h * 0.18 - i * h * 0.20,
    fill: 0.3 + Math.random() * 0.5,
  })), [h]);
  return (
    <group position={[0, 0, 0.01]}>
      {rows.map((r, i) => (
        <group key={i}>
          <mesh position={[-w * 0.36, r.y, 0]}>
            <planeGeometry args={[w * 0.05, 0.025]} />
            <meshBasicMaterial color={C.FG} transparent opacity={0.6} />
          </mesh>
          <mesh position={[-w * 0.05 + (w * 0.5 * r.fill) / 2, r.y, 0]}>
            <planeGeometry args={[w * 0.5 * r.fill, 0.04]} />
            <meshBasicMaterial color={color} transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CodeCardUI({ w, h, color }: { w: number; h: number; color: number }) {
  const lines = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    y: h * 0.25 - i * h * 0.10,
    lw: w * (0.35 + Math.random() * 0.4),
    c: i % 3 === 0 ? color : i % 3 === 1 ? C.CYAN : C.FG,
  })), [w, h, color]);
  return (
    <group position={[0, 0, 0.01]}>
      {lines.map((l, i) => (
        <mesh key={i} position={[-w * 0.4 + l.lw / 2, l.y, 0]}>
          <planeGeometry args={[l.lw, 0.018]} />
          <meshBasicMaterial color={l.c} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function CardUI({ w, h, color, variant }: { w: number; h: number; color: number; variant: Variant }) {
  if (variant === 'chart') return <ChartCardUI w={w} h={h} />;
  if (variant === 'bars') return <BarsCardUI w={w} h={h} color={color} />;
  if (variant === 'stats') return <StatsCardUI w={w} h={h} color={color} />;
  return <CodeCardUI w={w} h={h} color={color} />;
}

/* ── Floating holographic card ───────────────────────────────────────────── */
type CardProps = {
  position: [number, number, number]; lookAt: [number, number, number]; rotationZ: number;
  scale: number; w: number; h: number; color: number; variant: Variant;
  freq: number; phase: number; depthFactor: number; opacityMult: number;
};

function FloatingCard({ position, lookAt, rotationZ, scale, w, h, color, variant, freq, phase, depthFactor, opacityMult }: CardProps) {
  const ref = useRef<THREE.Group>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  // Pre-compute initial transform from lookAt + z-roll
  const [initPos, initRot] = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(...position);
    obj.lookAt(...lookAt);
    obj.rotateZ(rotationZ);
    return [obj.position.clone(), [obj.rotation.x, obj.rotation.y, obj.rotation.z] as [number, number, number]];
  }, []); // stable per card — intentional empty deps

  const panelGeo = useMemo(() => new THREE.PlaneGeometry(w, h), [w, h]);
  const borderGeo = useMemo(() => new THREE.EdgesGeometry(panelGeo), [panelGeo]);
  const tickGeo = useMemo(() => {
    const len = 0.08;
    const pts: number[] = [];
    ([[-w / 2, h / 2, 1, -1], [w / 2, h / 2, -1, -1], [-w / 2, -h / 2, 1, 1], [w / 2, -h / 2, -1, 1]] as [number, number, number, number][]).forEach(([px, py, sx, sy]) => {
      pts.push(px, py, 0.005, px + sx * len, py, 0.005, px, py, 0.005, px, py + sy * len, 0.005);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, [w, h]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = initPos.x + Math.cos(t * freq * 0.7 + phase) * depthFactor * 0.6;
      ref.current.position.y = initPos.y + Math.sin(t * freq + phase) * depthFactor;
    }
    if (scanRef.current) {
      const sp = ((t * 0.5 + phase) % 2) - 1;
      scanRef.current.position.y = sp * (h * 0.5);
      (scanRef.current.material as THREE.MeshBasicMaterial).opacity = (0.5 - Math.abs(sp) * 0.4) * opacityMult;
    }
  });

  return (
    <group ref={ref} position={[initPos.x, initPos.y, initPos.z]} rotation={initRot} scale={scale}>
      <mesh geometry={panelGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.06 * opacityMult} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[w * 0.98, h * 0.98]} />
        <meshBasicMaterial color={C.PANEL} transparent opacity={0.85 * opacityMult} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={borderGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.95 * opacityMult} />
      </lineSegments>
      <lineSegments geometry={tickGeo}>
        <lineBasicMaterial color={C.CYAN} transparent opacity={opacityMult} />
      </lineSegments>
      <mesh position={[0, h * 0.42, 0.011]}>
        <planeGeometry args={[w * 0.96, 0.07]} />
        <meshBasicMaterial color={color} transparent opacity={0.22 * opacityMult} />
      </mesh>
      <mesh position={[-w * 0.42, h * 0.42, 0.012]}>
        <circleGeometry args={[0.022, 12]} />
        <meshBasicMaterial color={C.CYAN} />
      </mesh>
      <mesh ref={scanRef} position={[0, 0, 0.013]}>
        <planeGeometry args={[w * 0.95, 0.015]} />
        <meshBasicMaterial color={C.CYAN} transparent opacity={0.5 * opacityMult} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <CardUI w={w} h={h} color={color} variant={variant} />
    </group>
  );
}

/* ── Central wireframe gem ───────────────────────────────────────────────── */
function Core() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(0.35, 1), []);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(icoGeo), [icoGeo]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const s = 1 + Math.sin(t * 1.6) * 0.18;
    coreRef.current?.scale.set(s, s, s);
    wireRef.current?.scale.set(s, s, s);
    if (haloRef.current) (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(t * 1.6) * 0.08;
    if (groupRef.current) { groupRef.current.rotation.y = t * 0.3; groupRef.current.rotation.x = t * 0.15; }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef} geometry={icoGeo}>
        <meshBasicMaterial color={C.INDIGO} transparent opacity={0.8} />
      </mesh>
      <lineSegments ref={wireRef} geometry={edgesGeo}>
        <lineBasicMaterial color={C.CYAN} transparent opacity={1} />
      </lineSegments>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color={C.INDIGO} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Data beam with traveling pulse ─────────────────────────────────────── */
function Beam({ to, color }: { to: [number, number, number]; color: number }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(Math.random());
  const speed = useMemo(() => 0.5 + Math.random() * 0.5, []);
  const staticLine = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, ...to]), 3));
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 }));
  }, [to, color]);

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * 0.5 * speed) % 1;
    if (pulseRef.current) pulseRef.current.position.set(to[0] * tRef.current, to[1] * tRef.current, to[2] * tRef.current);
  });

  return (
    <group>
      <primitive object={staticLine} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ── Background particle field ───────────────────────────────────────────── */
function ParticleField() {
  const positions = useMemo(() => {
    const arr = new Float32Array(380 * 3);
    for (let i = 0; i < 380; i++) {
      const r = 4 + Math.random() * 6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={C.FG} size={0.022} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ── Scene root with cursor parallax ────────────────────────────────────── */
type CardData = CardProps & { key: number; isFront: boolean };

function SceneRoot() {
  const rootRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  const cards = useMemo<CardData[]>(() => {
    const palette = [C.INDIGO, C.CYAN, C.INDIGO, C.ORANGE, C.CYAN, C.VIOLET, C.INDIGO];
    const variants: Variant[] = ['chart', 'bars', 'stats', 'code', 'stats', 'chart'];
    const layers = [
      { count: 6, rMin: 5,   rMax: 7,   yRange: 4,   zPush: -4,  scale: 0.8,  opacity: 0.5  },
      { count: 7, rMin: 3,   rMax: 4.5, yRange: 3.5, zPush: 0,   scale: 1.0,  opacity: 0.85 },
      { count: 4, rMin: 2,   rMax: 2.8, yRange: 2.5, zPush: 2.5, scale: 1.25, opacity: 1.0  },
    ];
    const all: CardData[] = [];
    let idx = 0;
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++, idx++) {
        const w = (1.0 + Math.random() * 0.7) * layer.scale;
        const h = (0.65 + Math.random() * 0.5) * layer.scale;
        const r = layer.rMin + Math.random() * (layer.rMax - layer.rMin);
        const theta = (i / layer.count) * Math.PI * 2 + Math.random() * 0.6;
        const pos: [number, number, number] = [
          Math.cos(theta) * r,
          (Math.random() - 0.5) * layer.yRange,
          Math.sin(theta) * r * 0.85 + layer.zPush,
        ];
        all.push({
          key: idx, position: pos,
          lookAt: [0, pos[1] * 0.5, 0] as [number, number, number],
          rotationZ: (Math.random() - 0.5) * 0.15,
          scale: layer.scale, w, h,
          color: palette[idx % palette.length],
          variant: variants[idx % variants.length],
          freq: 0.25 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          depthFactor: layer.zPush > 0 ? 0.5 : layer.zPush < 0 ? 0.2 : 0.35,
          opacityMult: layer.opacity,
          isFront: layer.zPush > 0,
        });
      }
    });
    return all;
  }, []);

  useFrame(({ pointer }) => {
    targetRot.current.y = pointer.x * 0.25;
    targetRot.current.x = -pointer.y * 0.15;
    if (rootRef.current) {
      rootRef.current.rotation.y += (targetRot.current.y - rootRef.current.rotation.y) * 0.04 + 0.001;
      rootRef.current.rotation.x += (targetRot.current.x - rootRef.current.rotation.x) * 0.04;
    }
  });

  const frontCards = cards.filter((c) => c.isFront);

  return (
    <group ref={rootRef}>
      <Core />
      {cards.map(({ key, isFront: _f, ...props }) => <FloatingCard key={key} {...props} />)}
      {frontCards.map((c, i) => (
        <Beam key={`b${i}`} to={c.position} color={i % 2 === 0 ? C.CYAN : C.INDIGO} />
      ))}
      <ParticleField />
    </group>
  );
}

/* ── Canvas export ───────────────────────────────────────────────────────── */
export default function FloatingModulesScene() {
  const { theme } = useTheme();

  if (theme === 'light') {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse at 70% 40%, rgba(74,76,224,0.12), transparent 65%)',
        }} />
      );
    }
    return (
      <Canvas
        camera={{ position: [0, 0.3, 9], fov: 50, near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'default' }}
        dpr={1}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <fog attach="fog" args={[0xFAF7F2, 8, 42]} />
        <LightSceneRoot />
      </Canvas>
    );
  }

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.18), transparent 70%)',
      }} />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0.3, 8.5], fov: 48, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.85 }}
    >
      <fog attach="fog" args={[C.BG, 4, 30]} />
      <SceneRoot />
    </Canvas>
  );
}
