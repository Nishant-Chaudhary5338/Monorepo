import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HERO_VIDEO_URL, HERO_VIDEO_POSTER } from "../assets/media";

export default function Hero(): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section
      className="relative h-screen min-h-150 flex items-center justify-center overflow-hidden"
      aria-label="Silvanza Resort hero — Where the Forest Meets Finesse"
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={HERO_VIDEO_POSTER}
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        {/* Forest-deep gradient overlay — brand spec */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(3,33,5,0.55) 0%, rgba(3,33,5,0.3) 55%, rgba(3,33,5,0.72) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow eyebrow-light mb-6"
        >
          Dhikuli, Ramnagar &nbsp;·&nbsp; Jim Corbett &nbsp;·&nbsp; Uttarakhand
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.4 }}
          className="heading-display text-white"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
        >
          Where the Forest
          <br />
          <span className="italic text-gold-pale">Meets Finesse</span>
        </motion.h1>

        {/* Sub-headline */}
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

        {/* CTAs */}
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
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="eyebrow text-white/50" style={{ letterSpacing: "0.3em", fontSize: "0.55rem" }}>
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-gold-pale/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
