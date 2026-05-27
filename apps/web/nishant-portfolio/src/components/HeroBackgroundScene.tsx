import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleLayer({ count, size, color, r1, r2, spin }: {
  count: number; size: number; color: number; r1: number; r2: number; spin: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = r1 + Math.random() * (r2 - r1);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, r1, r2]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * spin;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 1.5) * 0.15;
      ref.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshBasicMaterial color={0x6366F1} transparent opacity={0.4} />
    </mesh>
  );
}

function Ring() {
  const line = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      arr.push(Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(arr), 3));
    const mat = new THREE.LineBasicMaterial({ color: 0x22D3EE, transparent: true, opacity: 0.25 });
    const l = new THREE.Line(geo, mat);
    l.rotation.set(Math.PI / 4, 0, 0);
    return l;
  }, []);
  return <primitive object={line} />;
}

export default function HeroBackgroundScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 38 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: 0.55,
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <fog attach="fog" args={[0x07080F, 8, 24]} />
      <ParticleLayer count={600} size={0.022} color={0x6366F1} r1={2}   r2={7}   spin={0.025} />
      <ParticleLayer count={400} size={0.030} color={0x22D3EE} r1={1.5} r2={5}   spin={-0.018} />
      <ParticleLayer count={220} size={0.045} color={0xF8F9FF} r1={1}   r2={3.5} spin={0.04} />
      <Sun />
      <Ring />
    </Canvas>
  );
}
