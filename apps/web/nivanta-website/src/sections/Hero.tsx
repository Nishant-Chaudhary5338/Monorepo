import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_VIDEO_URL, HERO_VIDEO_POSTER } from "../assets/media";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero(): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

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
      className="relative h-screen min-h-150 overflow-hidden"
      aria-label="Silvanza Resort hero — Where the Forest Meets Finesse"
    >
      {/* ── Background ────────────────────────────────────── */}
      <div className="absolute inset-0">
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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(3,33,5,0.45) 0%, rgba(3,33,5,0.1) 40%, rgba(3,33,5,0.85) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── BEFORE VIDEO: centered column ─────────────────── */}
      <AnimatePresence>
        {!videoPlaying && (
          <motion.div
            key="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="eyebrow mb-6"
              style={{
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 1px 4px rgba(0,0,0,0.9)",
              }}
            >
              Dhikuli, Ramnagar &nbsp;·&nbsp; Jim Corbett &nbsp;·&nbsp; Uttarakhand
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.4, ease: EASE }}
              className="heading-display text-white max-w-4xl"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
            >
              Where the Forest
              <br />
              <span className="italic text-gold-pale">Meets Finesse</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
              className="mt-6 mb-8 text-white/70 font-light leading-relaxed max-w-2xl"
              style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)" }}
            >
              Silvanza Resort by Nivanta is Jim Corbett's newest address in luxury — a
              four-acre sanctuary where the whisper of the Kosi Valley, the warmth of
              curated hospitality, and the elegance of thoughtfully designed spaces come
              together in one unforgettable stay.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/contact" className="btn btn-primary">Check Availability</Link>
              <Link to="/rooms" className="btn btn-ghost">Explore the Resort</Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
              aria-hidden="true"
            >
              <span className="eyebrow text-white/40" style={{ letterSpacing: "0.3em", fontSize: "0.55rem" }}>
                Discover
              </span>
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-px h-8 bg-linear-to-b from-gold-pale/60 to-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WHEN VIDEO PLAYS: row at bottom ───────────────── */}
      <AnimatePresence>
        {videoPlaying && (
          <motion.div
            key="bottom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute bottom-0 inset-x-0 z-10 px-8 lg:px-16 pb-12"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="eyebrow mb-4 text-center"
              style={{
                color: "rgba(255,255,255,0.85)",
                textShadow: "0 1px 4px rgba(0,0,0,0.9)",
              }}
            >
              Dhikuli, Ramnagar &nbsp;·&nbsp; Jim Corbett &nbsp;·&nbsp; Uttarakhand
            </motion.p>

            <div className="flex flex-col sm:flex-row items-end gap-8 lg:gap-14">
              {/* Left: heading */}
              <h2
                className="heading-display text-white flex-1 text-left leading-none"
                style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
              >
                Where the Forest
                <br />
                <span className="italic text-gold-pale">Meets Finesse</span>
              </h2>

              {/* Divider */}
              <div className="hidden sm:block w-px self-stretch bg-gold-pale/25 shrink-0" />

              {/* Right: description + buttons */}
              <div className="flex-1 flex flex-col gap-5 justify-end">
                <p
                  className="text-white/70 font-light leading-relaxed"
                  style={{ fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)" }}
                >
                  Silvanza Resort by Nivanta is Jim Corbett's newest address in luxury — a
                  four-acre sanctuary where the whisper of the Kosi Valley, the warmth of
                  curated hospitality, and the elegance of thoughtfully designed spaces come
                  together in one unforgettable stay.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/contact" className="btn btn-primary">Check Availability</Link>
                  <Link to="/rooms" className="btn btn-ghost">Explore the Resort</Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
