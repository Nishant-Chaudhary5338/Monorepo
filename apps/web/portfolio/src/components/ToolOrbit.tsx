import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

interface OrbTool {
  label: string;
  emoji: string;
  color: string;
  radius: number;
  speed: number;
  offset: number;
  yTilt: number;
}

const orbTools: OrbTool[] = [
  { label: "Figma",       emoji: "◈", color: "#f24e1e", radius: 2.6, speed: 0.5,  offset: 0,           yTilt: 0.1 },
  { label: "Procreate",   emoji: "✏", color: "#4cc9f0", radius: 2.6, speed: 0.5,  offset: Math.PI*2/7, yTilt: 0.1 },
  { label: "Illustrator", emoji: "◭", color: "#f5a623", radius: 2.6, speed: 0.5,  offset: Math.PI*4/7, yTilt: 0.1 },
  { label: "Photoshop",   emoji: "◫", color: "#31a8ff", radius: 2.6, speed: 0.5,  offset: Math.PI*6/7, yTilt: 0.1 },
  { label: "After Fx",    emoji: "◈", color: "#9d72ff", radius: 2.6, speed: 0.5,  offset: Math.PI*8/7, yTilt: 0.1 },
  { label: "XD",          emoji: "◉", color: "#ff2bc2", radius: 2.6, speed: 0.5,  offset: Math.PI*10/7,yTilt: 0.1 },
  { label: "InDesign",    emoji: "◧", color: "#ff3366", radius: 2.6, speed: 0.5,  offset: Math.PI*12/7,yTilt: 0.1 },
  { label: "Miro",        emoji: "⬡", color: "#fdd835", radius: 1.7, speed: -0.8, offset: 0,           yTilt: 0.6 },
  { label: "Storybook",   emoji: "◉", color: "#ff4785", radius: 1.7, speed: -0.8, offset: Math.PI,     yTilt: 0.6 },
  { label: "ProtoPie",    emoji: "◈", color: "#ec6bcd", radius: 1.7, speed: -0.8, offset: Math.PI/2,   yTilt: 0.6 },
  { label: "FigJam",      emoji: "⬡", color: "#a259ff", radius: 1.7, speed: -0.8, offset: Math.PI*3/2, yTilt: 0.6 },
];

const OrbitingLabel = ({ tool }: { tool: OrbTool }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime * tool.speed + tool.offset;
    groupRef.current.position.x = Math.cos(t) * tool.radius;
    groupRef.current.position.z = Math.sin(t) * tool.radius;
    groupRef.current.position.y = Math.sin(t * 0.5 + tool.offset) * tool.yTilt;
  });

  return (
    <group ref={groupRef}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Float speed={3} floatIntensity={0.3}>
          {/* Background pill */}
          <mesh
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            scale={hovered ? 1.15 : 1}
          >
            <planeGeometry args={[1.1, 0.42]} />
            <meshBasicMaterial
              color={tool.color}
              transparent
              opacity={hovered ? 0.22 : 0.12}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Emoji + label */}
          <Text
            fontSize={0.14}
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.01]}
            color={hovered ? "#fff" : tool.color}
          >
            {tool.emoji} {tool.label}
          </Text>
        </Float>
      </Billboard>
    </group>
  );
};

// Central glowing core
const Core = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    mesh.current.rotation.y = s.clock.elapsedTime * 0.3;
    mesh.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <Float speed={1} floatIntensity={0.5}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#9d72ff"
          emissive="#5b21b6"
          emissiveIntensity={1.2}
          roughness={0.05}
          metalness={0.9}
          wireframe
        />
      </mesh>
    </Float>
  );
};

// Orbit rings (decorative)
const RingLine = ({ radius, tilt }: { radius: number; tilt: number }) => (
  <mesh rotation={[tilt, 0, 0]}>
    <torusGeometry args={[radius, 0.008, 8, 80]} />
    <meshBasicMaterial color="#9d72ff" transparent opacity={0.15} />
  </mesh>
);

const ToolOrbit = () => (
  <Canvas
    camera={{ position: [0, 1.8, 5.5], fov: 55 }}
    gl={{ alpha: true, antialias: true }}
    style={{ background: "transparent" }}
    dpr={[1, 2]}
  >
    <ambientLight intensity={0.2} />
    <pointLight position={[3, 3, 3]} color="#9d72ff" intensity={3} />
    <pointLight position={[-3, -2, 2]} color="#f5a623" intensity={2} />

    <Core />
    <RingLine radius={2.6} tilt={0.1} />
    <RingLine radius={1.7} tilt={0.6} />

    {orbTools.map((t) => (
      <OrbitingLabel key={t.label} tool={t} />
    ))}
  </Canvas>
);

export default ToolOrbit;
