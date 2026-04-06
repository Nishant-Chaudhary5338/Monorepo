import { useTheme } from "../../../context/ThemeContext";

// ✅ FIX: Reduced from 6 lights to 3 lights with optimized intensities
const HeroLights = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 1.5 : 2.5}
        color={isDark ? "white" : "#fff5e6"}
        castShadow
      />
      
      {/* Ambient fill light */}
      <ambientLight
        intensity={isDark ? 0.4 : 0.8}
        color={isDark ? "#1a1a40" : "#f0f4ff"}
      />
      
      {/* Accent spotlight */}
      <spotLight
        position={[2, 5, 6]}
        angle={0.25}
        penumbra={0.5}
        intensity={isDark ? 2 : 1.5}
        color={isDark ? "#4cc9f0" : "#60a5fa"}
      />
    </>
  );
};

export default HeroLights;
