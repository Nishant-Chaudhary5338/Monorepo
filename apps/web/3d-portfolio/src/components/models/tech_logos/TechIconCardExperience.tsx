import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { TechIconCardExperienceProps } from '../../../types';

const TechIconCardExperience = ({ model }: TechIconCardExperienceProps) => {
  const scene = useGLTF(model.modelPath);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ FIX: Lazy loading - only render when visible
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

  useEffect(() => {
    if (model.name === "Interactive Developer") {
      scene.scene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          if (child.name === "Object_5") {
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: "white" });
          }
        }
      });
    }
  }, [scene, model.name]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {isVisible ? (
        <Canvas
          dpr={[1, 1.5]} // ✅ FIX: Limit pixel ratio
          gl={{ antialias: false }} // ✅ FIX: Disable antialiasing
          performance={{ min: 0.5 }} // ✅ FIX: Allow performance scaling
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <spotLight
            position={[10, 15, 10]}
            angle={0.3}
            penumbra={1}
            intensity={2}
          />
          <Environment preset="city" />

          <Float speed={5.5} rotationIntensity={0.5} floatIntensity={0.9}>
            <group scale={model.scale} rotation={model.rotation}>
              <primitive object={scene.scene} />
            </group>
          </Float>

          <OrbitControls enableZoom={false} />
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
          fontSize: '0.8rem'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default TechIconCardExperience;