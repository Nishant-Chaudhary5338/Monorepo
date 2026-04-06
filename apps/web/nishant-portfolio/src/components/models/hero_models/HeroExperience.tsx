import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Suspense, useState, useEffect, useRef } from "react";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";
import { useTheme } from "../../../context/ThemeContext";

// ✅ FIX: Lazy loading wrapper with Intersection Observer
const LazyCanvas = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
          camera={{ position: [0, 0, 15], fov: 45 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{ antialias: false }}
        >
          {children}
        </Canvas>
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: isDark
            ? 'linear-gradient(135deg, #1a1a40 0%, #0d0d1a 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#4cc9f0' : '#3b82f6',
          fontSize: '1.2rem'
        }}>
          Loading 3D Scene...
        </div>
      )}
    </div>
  );
};

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <LazyCanvas>
      {/* deep blue ambient */}
      <ambientLight
        intensity={0.2}
        color={isDark ? "#1a1a40" : "#f0f4ff"}
      />
      {/* Configure OrbitControls to disable panning and control zoom based on device type */}
      <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      <Suspense fallback={null}>
        <HeroLights />
        <Particles count={100} />
        <group
          scale={isMobile ? 0.7 : 1}
          position={[0, -3.5, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>
      </Suspense>
    </LazyCanvas>
  );
};

export default HeroExperience;