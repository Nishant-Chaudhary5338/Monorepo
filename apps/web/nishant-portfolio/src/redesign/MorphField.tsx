import { useEffect, useState, type ReactElement } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
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
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <MorphParticles data={data} />
        {tier.bloom && (
          <EffectComposer>
            <Bloom intensity={1.15} luminanceThreshold={0.04} luminanceSmoothing={0.42} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
