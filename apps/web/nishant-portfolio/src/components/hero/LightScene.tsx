import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CL = {
  INDIGO:  0x4A4CE0,
  CYAN:    0x0878A8,
  ORANGE:  0xB84800,
  VIOLET:  0x7C6FCD,
};

type LightCardProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  w: number; h: number; color: number;
  freq: number; phase: number; opacityMult: number;
};

export function LightCard({ position, rotation, w, h, color, freq, phase, opacityMult }: LightCardProps) {
  const ref = useRef<THREE.Group>(null);
  const initPos = useMemo(() => new THREE.Vector3(...position), []);
  const panelGeo  = useMemo(() => new THREE.PlaneGeometry(w, h), [w, h]);
  const borderGeo = useMemo(() => new THREE.EdgesGeometry(panelGeo), [panelGeo]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = initPos.y + Math.sin(t * freq + phase) * 0.22;
      ref.current.position.x = initPos.x + Math.cos(t * freq * 0.6 + phase) * 0.14;
    }
  });

  return (
    <group ref={ref} position={[initPos.x, initPos.y, initPos.z]} rotation={rotation}>
      {/* frosted glass fill */}
      <mesh geometry={panelGeo}>
        <meshBasicMaterial color={0xF4F1FF} transparent opacity={0.28 * opacityMult} side={THREE.DoubleSide} />
      </mesh>
      {/* color tint overlay */}
      <mesh geometry={panelGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.06 * opacityMult} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* colored border */}
      <lineSegments geometry={borderGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.72 * opacityMult} />
      </lineSegments>
      {/* top glass rim highlight */}
      <mesh position={[0, h * 0.485, 0.003]}>
        <planeGeometry args={[w * 0.98, 0.007]} />
        <meshBasicMaterial color={0xFFFFFF} transparent opacity={opacityMult} />
      </mesh>
      {/* header strip */}
      <mesh position={[0, h * 0.42, 0.004]}>
        <planeGeometry args={[w * 0.96, 0.052]} />
        <meshBasicMaterial color={color} transparent opacity={0.14 * opacityMult} />
      </mesh>
      {/* subtle inner glow */}
      <mesh geometry={panelGeo}>
        <meshBasicMaterial color={0xFFFFFF} transparent opacity={0.10 * opacityMult} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function LightParticles({ count = 200, spread = 12 }: { count?: number; spread?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * spread;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(Math.random() * 2 - 1);
      arr[i * 3]     = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count, spread]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={CL.INDIGO} size={0.022} transparent opacity={0.28} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

type LightSceneRootProps = {
  layers?: { count: number; rMin: number; rMax: number; yRange: number; zBase: number; opacity: number }[];
  parallaxStrength?: number;
};

export function LightSceneRoot({
  layers = [
    { count: 5, rMin: 5.5, rMax: 9,   yRange: 4.5, zBase: -3,  opacity: 0.55 },
    { count: 4, rMin: 3,   rMax: 5,   yRange: 3.5, zBase: 0.5, opacity: 0.88 },
  ],
  parallaxStrength = 0.10,
}: LightSceneRootProps) {
  const rootRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  const cards = useMemo(() => {
    const palette = [CL.INDIGO, CL.CYAN, CL.INDIGO, CL.ORANGE, CL.VIOLET];
    const all: (LightCardProps & { key: number })[] = [];
    let idx = 0;
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++, idx++) {
        const w = 1.1 + Math.random() * 0.9;
        const h = 0.65 + Math.random() * 0.5;
        const r = layer.rMin + Math.random() * (layer.rMax - layer.rMin);
        const theta = (i / layer.count) * Math.PI * 2 + Math.random() * 0.9;
        const y = (Math.random() - 0.5) * layer.yRange;
        const x = Math.cos(theta) * r;
        const z = layer.zBase + Math.sin(theta) * r * 0.4 + (Math.random() - 0.5) * 2;
        all.push({
          key: idx,
          position: [x, y, z],
          rotation: [-Math.atan2(y, 9) * 0.025, -Math.atan2(x, 9) * 0.35, (Math.random() - 0.5) * 0.07],
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
    targetRot.current.y = pointer.x * parallaxStrength;
    targetRot.current.x = -pointer.y * parallaxStrength * 0.7;
    if (rootRef.current) {
      rootRef.current.rotation.y += (targetRot.current.y - rootRef.current.rotation.y) * 0.022 + 0.0002;
      rootRef.current.rotation.x += (targetRot.current.x - rootRef.current.rotation.x) * 0.022;
    }
  });

  return (
    <group ref={rootRef}>
      {cards.map(({ key, ...props }) => <LightCard key={key} {...props} />)}
      <LightParticles />
    </group>
  );
}
