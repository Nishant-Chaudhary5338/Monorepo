import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LightboxImage = {
  src: string;
  alt: string;
};

type LightboxProps = {
  images: LightboxImage[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
};

export default function Lightbox({ images, initialIndex, open, onClose }: LightboxProps): React.JSX.Element | null {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, images.length, onClose]);

  if (!open || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <button
          className="absolute top-5 right-5 text-white/80 hover:text-white text-3xl leading-none z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Image */}
        <motion.img
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={images[index].src}
          alt={images[index].alt}
          className="max-w-[90vw] max-h-[85vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Arrows (only when multiple images) */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl px-4 py-2"
              onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length); }}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl px-4 py-2"
              onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length); }}
              aria-label="Next"
            >
              ›
            </button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === index ? "bg-gold" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
