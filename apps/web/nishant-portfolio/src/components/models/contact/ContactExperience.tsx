import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";

import Computer from "./Computer";

// ✅ FIX: Lazy loading wrapper with Intersection Observer
const LazyCanvas = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {isVisible ? (
        <Canvas 
          shadows 
          camera={{ position: [0, 3, 7], fov: 45 }}
          dpr={[1, 1.5]} // ✅ FIX: Limit pixel ratio
          performance={{ min: 0.5 }} // ✅ FIX: Allow performance scaling
          gl={{ antialias: false }} // ✅ FIX: Disable antialiasing for performance
        >
          {children}
        </Canvas>
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(135deg, #1a1a40 0%, #0d0d1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4cc9f0',
          fontSize: '1.2rem'
        }}>
          Loading 3D Scene...
        </div>
      )}
    </div>
  );
};

const ContactExperience = () => {
  return (
    <LazyCanvas>
      <ambientLight intensity={0.5} color="#fff4e6" />

      <directionalLight position={[5, 5, 3]} intensity={2.5} color="#ffd9b3" />

      <directionalLight
        position={[5, 9, 1]}
        castShadow
        intensity={2.5}
        color="#ffd9b3"
      />

      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      <group scale={[1, 1, 1]}>
        <mesh
          receiveShadow
          position={[0, -1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#a46b2d" />
        </mesh>
      </group>

      <Suspense fallback={null}>
        <group scale={0.03} position={[0, -1.49, -2]} castShadow>
          <Computer />
        </group>
      </Suspense>
    </LazyCanvas>
  );
};

export { ContactExperience };
export default ContactExperience;
