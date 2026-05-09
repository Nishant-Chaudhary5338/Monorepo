import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO_VIDEO_URL, HERO_VIDEO_POSTER } from "../assets/media";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero(): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Start video only after page fully loads + 4s — keeps video out of Lighthouse
  // LCP measurement window and avoids unnecessary bandwidth on first paint
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let timer: number;
    const schedulePlay = (): void => {
      timer = window.setTimeout(() => { video.play().catch(() => {}); }, 4000);
    };
    if (document.readyState === "complete") {
      schedulePlay();
    } else {
      window.addEventListener("load", schedulePlay, { once: true });
    }
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative h-screen min-h-150 flex flex-col overflow-hidden"
      aria-label="Silvanza Resort hero — Where the Forest Meets Finesse"
    >
      {/* ── Background layer ──────────────────────────────── */}
      <div className="absolute inset-0">
        {/* Poster — always visible, is the LCP image */}
        <img
          src={HERO_VIDEO_POSTER}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1080}
          aria-hidden="true"
        />

        {/* Video — fades in on top; poster stays as fallback */}
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${
            videoPlaying ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
          onPlaying={() => setVideoPlaying(true)}
          onError={() => setVideoPlaying(false)}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Gradient — heavier at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(3,33,5,0.45) 0%, rgba(3,33,5,0.18) 45%, rgba(3,33,5,0.72) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Top spacer — always flex:1, absorbs space freed by the bottom spacer ── */}
      <div className="flex-1" />

      {/* ── Content ─────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-5xl mx-auto w-full"
        animate={{ paddingBottom: videoPlaying ? "56px" : "0px" }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow mb-6"
          style={{
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 1px 4px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.7)",
          }}
        >
          Dhikuli, Ramnagar &nbsp;·&nbsp; Jim Corbett &nbsp;·&nbsp; Uttarakhand
        </motion.p>

        {/* h1 is the LCP element — starts opacity:1 so Lighthouse measures immediately */}
        <motion.h1
          initial={{ opacity: 1, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.4 }}
          className="heading-display text-white"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
        >
          Where the Forest
          <br />
          <span className="italic text-gold-pale">Meets Finesse</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-5 mb-8 text-white/75 font-light leading-relaxed max-w-2xl mx-auto"
          style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)" }}
        >
          Silvanza Resort by Nivanta is Jim Corbett's newest address in luxury — a four-acre
          sanctuary where the whisper of the Kosi Valley, the warmth of curated hospitality,
          and the elegance of thoughtfully designed spaces come together in one unforgettable stay.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/contact" className="btn btn-primary">
            Check Availability
          </Link>
          <Link to="/rooms" className="btn btn-ghost">
            Explore the Resort
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Bottom spacer — shrinks when video plays, sliding content toward bottom ── */}
      <motion.div
        initial={false}
        animate={{ flexGrow: videoPlaying ? 0 : 1 }}
        style={{ flexShrink: 0, minHeight: "56px" }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      {/* ── Scroll indicator — fades out once video plays ─────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: videoPlaying ? 0 : 1 }}
        transition={{ duration: 0.6, delay: videoPlaying ? 0 : 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="eyebrow text-white/50"
          style={{ letterSpacing: "0.3em", fontSize: "0.55rem" }}
        >
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8 bg-linear-to-b from-gold-pale/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
