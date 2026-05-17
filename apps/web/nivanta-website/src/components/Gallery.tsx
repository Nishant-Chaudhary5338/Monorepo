import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage, GalleryCategory } from "../types";
import Lightbox from "./Lightbox";

type GalleryProps = {
  images: GalleryImage[];
};

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: "all",        label: "All" },
  { value: "lifestyle",  label: "Lifestyle & Experiences" },
  { value: "restaurant", label: "Restaurant — Ember" },
  { value: "pool",       label: "Pool — Tattva" },
  { value: "events",     label: "Banquet & Events" },
  { value: "gardens",    label: "Property & Gardens" },
];

export default function Gallery({ images }: GalleryProps): React.JSX.Element {
  const [active, setActive] = useState<GalleryCategory>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = active === "all" ? images : images.filter((img) => img.category === active);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={`px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 border ${
              active === cat.value
                ? "bg-[#C9A84C] border-[#C9A84C] text-white"
                : "border-[#C9A84C]/50 text-[#6B6B6B] hover:border-[#C9A84C] hover:text-[#C9A84C]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden cursor-pointer group aspect-square"
              onClick={() => openLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-400 flex items-center justify-center">
                <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ⊕
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox
        images={filtered.map((img) => ({ src: img.src, alt: img.alt }))}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
