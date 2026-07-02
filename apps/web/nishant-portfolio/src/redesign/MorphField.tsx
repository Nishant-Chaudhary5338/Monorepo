import { useEffect, useState, type ReactElement } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphParticles } from "./MorphParticles";
import { usePerfTier } from "./usePerfTier";
import { buildTargets, refineTextStates, type MorphData } from "./targets";

// Persistent full-viewport particle field. Stays mounted behind ALL content and
// morphs continuously as sections scroll past — it never disappears.
export function MorphField(): ReactElement {
  const [data] = useState<MorphData>(() => buildTargets());

  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => {
      if (!active) return;
      refineTextStates(data);
      ScrollTrigger.refresh();
    });
    return () => { active = false; };
  }, [data]);

  const tier = usePerfTier();

  return (
    <div className="morph-field" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 50 }}
        dpr={tier.dpr}
        frameloop="always"
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <MorphParticles data={data} />
        {tier.bloom && (
          <EffectComposer multisampling={0}>
            {/* single cheap pass — CSS handles the vignette, so no postprocessing Vignette here */}
            <Bloom intensity={0.85} luminanceThreshold={0.12} luminanceSmoothing={0.5} mipmapBlur radius={0.6} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
