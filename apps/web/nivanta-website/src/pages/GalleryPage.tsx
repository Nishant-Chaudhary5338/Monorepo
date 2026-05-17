import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import { galleryImages, GALLERY_CATEGORY_LABELS } from "../data/gallery";
import Lightbox from "../components/Lightbox";
import type { GalleryCategory } from "../types";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const CATEGORIES = Object.keys(GALLERY_CATEGORY_LABELS) as GalleryCategory[];

export default function GalleryPage(): React.JSX.Element {
  usePageMeta({
    title: "Gallery — Silvanza Resort by Nivanta Jim Corbett",
    description:
      "Explore Silvanza Resort through our curated gallery. Lifestyle experiences, Ember restaurant, Tattva pool, banquet events, and the gardens of Dhikuli, Jim Corbett.",
    canonical: "/gallery",
    schema: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "Silvanza Resort Photo Gallery",
      "description": "Photo gallery of Silvanza Resort by Nivanta — lifestyle experiences, Ember restaurant, Tattva pool, banquet events, and lush gardens in Dhikuli, Jim Corbett.",
      "url": "https://silvanzaresort.com/gallery",
      "author": { "@type": "Organization", "name": "Nivanta Hospitality LLP" },
    },
  });

  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const lightboxImages = filtered.map((img) => ({ src: img.src, alt: img.alt }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex items-end min-h-[52vh] overflow-hidden"
        style={{ background: "linear-gradient(150deg, #032105 0%, #253A11 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 70%, #B98F39 0%, transparent 60%)",
          }}
        />
        <div className="container-brand section-pad relative z-10 pb-16">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="eyebrow eyebrow-light mb-6"
          >
            Silvanza Resort
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[#FAF7F0] font-light"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            Gallery
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-[#D4B870] font-light max-w-md"
          >
            Rooms, restaurant, pools, events, and the grounds — a visual walk
            through Silvanza.
          </motion.p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-[#FAF7F0] border-b border-[#B98F39]/20 sticky top-[64px] z-40">
        <div className="container-brand">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-4 text-xs font-sans font-light tracking-widest uppercase whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeCategory === cat
                    ? "border-[#B98F39] text-[#032105]"
                    : "border-transparent text-[#5a5545] hover:text-[#032105]"
                }`}
              >
                {GALLERY_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand">
          {filtered.length === 0 ? (
            <p className="text-center text-[#5a5545] font-light py-24">
              No images in this category yet.
            </p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
                  className="break-inside-avoid cursor-pointer group relative overflow-hidden"
                  onClick={() => openLightbox(i)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      width={img.width}
                      height={img.height}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#032105]/0 group-hover:bg-[#032105]/30 transition-all duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-light tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
