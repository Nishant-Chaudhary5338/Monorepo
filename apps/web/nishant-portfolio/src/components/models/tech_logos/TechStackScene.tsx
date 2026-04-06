import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { TechStackIcon } from '../../../types';

// ✅ FIX: Individual model component that loads its own GLTF
const TechModel = ({ model }: { model: TechStackIcon }) => {
  const scene = useGLTF(model.modelPath);
  
  // ✅ FIX: Memoize the cloned scene to avoid re-processing
  const clonedScene = useMemo(() => {
    const clone = scene.scene.clone();
    
    // Apply special material for Interactive Developer
    if (model.name === "Interactive Developer") {
      clone.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          if (child.name === "Object_5") {
            (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ 
              color: "white" 
            });
          }
        }
      });
    }
    
    return clone;
  }, [scene, model.name]);

  return (
    <Float speed={5.5} rotationIntensity={0.5} floatIntensity={0.9}>
      <group scale={model.scale} rotation={model.rotation}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
};

// ✅ FIX: Preload all models at module level for better performance
useGLTF.preload("/models/react_logo-transformed.glb");
useGLTF.preload("/models/python-transformed.glb");
useGLTF.preload("/models/node-transformed.glb");
useGLTF.preload("/models/three.js-transformed.glb");
useGLTF.preload("/models/git-svg-transformed.glb");

// ✅ FIX: Single Canvas component that renders ALL tech icons
const TechStackScene = ({ models }: { models: TechStackIcon[] }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]} // ✅ FIX: Limit pixel ratio for performance
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
      
      <Suspense fallback={null}>
        <Environment preset="city" />
        
        {/* ✅ FIX: Render all models in a grid within single Canvas */}
        {models.map((model, index) => (
          <group 
            key={model.name} 
            position={[
              (index % 3 - 1) * 3, // x: -3, 0, 3
              Math.floor(index / 3) * 3 - 1.5, // y: -1.5, 1.5
              0
            ]}
          >
            <TechModel model={model} />
          </group>
        ))}
      </Suspense>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default TechStackScene;