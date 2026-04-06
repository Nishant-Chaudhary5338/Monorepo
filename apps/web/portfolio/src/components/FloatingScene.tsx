import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial, Environment, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

// ─── Mouse parallax group ─────────────────────────────────
const MouseParallax = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });
  const lerped = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    lerped.current.x += (mouse.current.x - lerped.current.x) * 0.035;
    lerped.current.y += (mouse.current.y - lerped.current.y) * 0.035;
    group.current.rotation.y = lerped.current.x * 0.18;
    group.current.rotation.x = lerped.current.y * 0.1;
  });

  return <group ref={group}>{children}</group>;
};

// ─── Central morphing blob (MeshDistortMaterial) ─────────
const MorphingBlob = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={mesh} position={[0.3, 0.2, 0]}>
        <sphereGeometry args={[0.85, 128, 128]} />
        <MeshDistortMaterial
          color="#9d72ff"
          emissive="#5b21b6"
          emissiveIntensity={0.5}
          roughness={0.05}
          metalness={0.85}
          distort={0.38}
          speed={2.5}
        />
      </mesh>
    </Float>
  );
};

// ─── Gold satellite sphere ────────────────────────────────
const GoldSatellite = () => (
  <Float speed={2} rotationIntensity={0} floatIntensity={2}>
    <Sphere args={[0.22, 32, 32]} position={[2.4, -0.8, -0.5]}>
      <meshStandardMaterial
        color="#f5a623"
        emissive="#b87a10"
        emissiveIntensity={0.6}
        roughness={0} metalness={1}
      />
    </Sphere>
  </Float>
);

// ─── Rose satellite ───────────────────────────────────────
const RoseSatellite = () => (
  <Float speed={1.5} rotationIntensity={0} floatIntensity={1.5}>
    <Sphere args={[0.14, 32, 32]} position={[-2.2, 1.2, -1]}>
      <meshStandardMaterial
        color="#ff6b9d"
        emissive="#8b0040"
        emissiveIntensity={0.5}
        roughness={0} metalness={1}
      />
    </Sphere>
  </Float>
);

// ─── Large outer ring (purple wireframe) ─────────────────
const PurpleRing = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { mesh.current.rotation.z += dt * 0.06; });
  return (
    <mesh ref={mesh} rotation={[Math.PI / 4, 0, 0]}>
      <torusGeometry args={[3.0, 0.022, 16, 120]} />
      <meshBasicMaterial color="#9d72ff" transparent opacity={0.5} />
    </mesh>
  );
};

// ─── Medium ring (gold) ───────────────────────────────────
const GoldRing = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { mesh.current.rotation.x += dt * 0.04; });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 3.5, Math.PI / 5, 0]}>
      <torusGeometry args={[1.9, 0.032, 16, 100]} />
      <meshBasicMaterial color="#f5a623" transparent opacity={0.38} />
    </mesh>
  );
};

// ─── Small rose ring ──────────────────────────────────────
const RoseRing = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { mesh.current.rotation.y += dt * 0.1; mesh.current.rotation.z += dt * 0.03; });
  return (
    <mesh ref={mesh} position={[1.2, -0.5, -1.5]} rotation={[0.4, 0.5, 0.3]}>
      <torusGeometry args={[0.85, 0.018, 12, 80]} />
      <meshBasicMaterial color="#ff6b9d" transparent opacity={0.4} />
    </mesh>
  );
};

// ─── Floating torus knot ──────────────────────────────────
const AccentKnot = () => (
  <Float speed={0.8} rotationIntensity={1.2} floatIntensity={1.5}>
    <mesh position={[-2.2, 1.5, -2]}>
      <torusKnotGeometry args={[0.28, 0.09, 80, 8, 2, 3]} />
      <meshStandardMaterial
        color="#ff6b9d" emissive="#8b0040" emissiveIntensity={0.4}
        roughness={0.05} metalness={0.8}
      />
    </mesh>
  </Float>
);

// ─── Particle cloud ───────────────────────────────────────
const ParticleCloud = () => {
  const pts = useRef<THREE.Points>(null!);
  const count = 350;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  useFrame((s) => { pts.current.rotation.y = s.clock.elapsedTime * 0.008; });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c4b8f0" size={0.025} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
};

// ─── Camera init ──────────────────────────────────────────
const CameraSetup = () => {
  const { camera } = useThree();
  useEffect(() => {
    (camera as THREE.PerspectiveCamera).fov = 60;
    camera.position.set(0, 0, 8.5);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
};

// ─── Scene ────────────────────────────────────────────────
const SceneContent = () => (
  <>
    <CameraSetup />
    <ambientLight intensity={0.12} />
    <pointLight position={[4, 4, 4]} color="#9d72ff" intensity={4} />
    <pointLight position={[-4, -3, 2]} color="#f5a623" intensity={2.5} />
    <pointLight position={[0, 2, 5]} color="#ffffff" intensity={0.6} />
    <Environment preset="night" />

    <Stars radius={90} depth={60} count={2800} factor={3} saturation={0} fade speed={0.25} />

    <MouseParallax>
      <MorphingBlob />
      <GoldSatellite />
      <RoseSatellite />
      <PurpleRing />
      <GoldRing />
      <RoseRing />
      <AccentKnot />
      <ParticleCloud />
    </MouseParallax>
  </>
);

// ─── Exported Canvas ──────────────────────────────────────
const FloatingScene = () => (
  <Canvas
    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    style={{ background: "transparent" }}
    dpr={[1, 2]}
  >
    <Suspense fallback={null}>
      <SceneContent />
    </Suspense>
  </Canvas>
);

export default FloatingScene;
