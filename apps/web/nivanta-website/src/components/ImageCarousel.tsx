import { useState, useCallback, useEffect, useRef } from "react";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  onLightbox?: (idx: number) => void;
  onIndexChange?: (idx: number) => void;
};

export default function ImageCarousel({ images, alt, className = "", onLightbox, onIndexChange }: Props): React.JSX.Element {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const shimmerTimer = useRef<number | null>(null);
  const [showShimmer, setShowShimmer] = useState(false);
  const total = images.length;

  useEffect(() => () => { if (shimmerTimer.current) clearTimeout(shimmerTimer.current); }, []);

  const go = useCallback((newIdx: number) => {
    setVisible(false);
    setShowShimmer(false);
    shimmerTimer.current = window.setTimeout(() => setShowShimmer(true), 80);
    setTimeout(() => {
      setIdx(newIdx);
      setVisible(true);
      if (shimmerTimer.current) { clearTimeout(shimmerTimer.current); shimmerTimer.current = null; }
      setShowShimmer(false);
    }, 180);
    onIndexChange?.(newIdx);
  }, [onIndexChange]);

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    go((idx - 1 + total) % total);
  }, [idx, total, go]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    go((idx + 1) % total);
  }, [idx, total, go]);

  return (
    <div className={`relative overflow-hidden group ${className}`}>

      {/* ── Shimmer sweep while transitioning ── */}
      {showShimmer && (
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 35%, rgba(212,184,112,0.15) 50%, transparent 65%)",
              backgroundSize: "200% 100%",
              animation: "shimmer-sweep 1.1s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* ── Image — fades between slides ── */}
      <img
        key={idx}
        src={images[idx]}
        alt={`${alt} — photo ${idx + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        loading="lazy"
      />

      {/* ── Hover scrim ── */}
      <div className="absolute inset-0 bg-forest-deep/0 group-hover:bg-forest-deep/20 transition-colors duration-300 z-20 pointer-events-none" />

      {/* ── Prev / Next ── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-30 text-lg leading-none"
            aria-label="Previous photo"
          >‹</button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-30 text-lg leading-none"
            aria-label="Next photo"
          >›</button>
        </>
      )}

      {/* ── Lightbox button ── */}
      {onLightbox && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLightbox(idx); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-30"
          aria-label="View all photos"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
      )}

      {/* ── Dot indicators ── */}
      {total > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-30">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(i); }}
              className={`block rounded-full transition-all duration-300 ${
                i === idx ? "w-5 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
