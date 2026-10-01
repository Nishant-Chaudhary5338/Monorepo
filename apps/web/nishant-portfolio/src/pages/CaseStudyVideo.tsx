import { useEffect, useRef, useState } from "react";
import type { CaseStudyVideo as VideoMeta } from "../case-studies/index";

const reducedMotion = (): boolean =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Muted loop of the real UI. Plays only while on screen, and never autoplays for reduced motion. */
const CaseStudyVideo = ({ video }: { video: VideoMeta }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [still] = useState(reducedMotion);

  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [still]);

  return (
    <figure style={{ margin: "0 0 2.5rem" }}>
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        controls={still}
        style={{ width: "100%", height: "auto", display: "block", border: "1px solid var(--border-strong)", background: "var(--surface)" }}
      />
      <figcaption style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--fg-muted)", marginTop: "0.6rem", letterSpacing: "0.04em" }}>
        {video.caption}
      </figcaption>
    </figure>
  );
};

export default CaseStudyVideo;
