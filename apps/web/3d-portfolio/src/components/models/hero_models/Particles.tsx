import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
}

const Particles = ({ count = 100 }: ParticlesProps) => {
  const mesh = useRef<THREE.Points>(null);

  // ✅ FIX: Memoize particle data - only create once
  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd: number[] = [];
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 10 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd.push(0.005 + Math.random() * 0.001);
    }
    
    return { positions: pos, speeds: spd };
  }, [count]);

  // ✅ FIX: Throttled frame update - only update every 2nd frame
  const frameCount = useRef(0);
  
  useFrame(() => {
    if (!mesh.current) return;
    
    // ✅ FIX: Throttle to every 2nd frame (30 FPS instead of 60 FPS for particles)
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;
    
    const positionAttribute = (mesh.current.geometry as THREE.BufferGeometry).attributes.position;
    const posArray = positionAttribute.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      let y = posArray[i * 3 + 1];
      y -= speeds[i];
      if (y < -2) y = Math.random() * 10 + 5;
      posArray[i * 3 + 1] = y;
    }
    
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
};

export default Particles;