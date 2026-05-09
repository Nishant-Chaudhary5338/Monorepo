import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import { rooms, STANDARD_ROOM_AMENITIES } from "../data/rooms";
import Lightbox from "../components/Lightbox";
import type { Room } from "../types";

// ── Icon SVGs ─────────────────────────────────────────────
function ChevronLeft(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function GridIcon(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

// ── Per-card carousel image strip ─────────────────────────
type RoomCardProps = {
  room: Room;
  cardIdx: number;
  onOpenLightbox: (roomId: string, imgIdx: number) => void;
};

function RoomCard({ room, cardIdx, onOpenLightbox }: RoomCardProps): React.JSX.Element {
  const [imgIdx, setImgIdx] = useState(0);
  const total = room.images.length;

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % total);
  }, [total]);

  const openGallery = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenLightbox(room.id, imgIdx);
  }, [room.id, imgIdx, onOpenLightbox]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: cardIdx * 0.08 }}
      className="group bg-white border border-gold/15 overflow-hidden"
    >
      {/* ── Image area with carousel controls ── */}
      <div className="overflow-hidden aspect-4/3 relative">
        {/* Main image */}
        <img
          src={room.images[imgIdx]}
          alt={`${room.name} at Silvanza Resort — view ${imgIdx + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          loading="lazy"
          width={600}
          height={450}
        />

        {/* Dark scrim on hover for better control visibility */}
        <div className="absolute inset-0 bg-forest-deep/0 group-hover:bg-forest-deep/20 transition-colors duration-300" />

        {/* Prev arrow */}
        {total > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/75 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Next arrow */}
        {total > 1 && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/75 z-10"
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
        )}

        {/* Gallery button + counter — bottom-right */}
        <button
          onClick={openGallery}
          className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-[0.6rem] tracking-widest uppercase px-2.5 py-1.5 transition-colors duration-200 z-10 opacity-0 group-hover:opacity-100"
          aria-label={`View all ${total} photos of ${room.name}`}
        >
          <GridIcon />
          <span>{imgIdx + 1} / {total}</span>
        </button>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {room.images.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-200 ${
                  i === imgIdx ? "w-4 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Card content ── */}
      <Link to={`/rooms/${room.slug}`} className="block">
        <div className="p-6">
          <span className="eyebrow eyebrow-dark mb-1">{room.view}</span>
          <h2 className="font-serif text-2xl font-medium text-forest-deep mt-1">{room.name}</h2>
          <p className="text-xs text-gold-dark italic font-serif mb-3">{room.tagline}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.features.map((f) => (
              <span key={f} className="text-[0.58rem] tracking-wide px-2 py-0.5 bg-gold-cream text-muted border border-gold/15">{f}</span>
            ))}
          </div>

          <p className="text-sm text-muted font-light leading-relaxed mb-5 line-clamp-3">{room.description}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gold/15">
            <div>
              <p className="font-serif text-xl text-gold-dark font-medium">{room.priceLabel}</p>
              <p className="text-[0.6rem] text-muted tracking-wide">per night</p>
            </div>
            <span className="btn btn-dark text-[0.6rem]">View Room</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function RoomsPage(): React.JSX.Element {
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null);

  const openLightbox = useCallback((roomId: string, imgIdx: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    setLightbox({
      images: room.images.map((src, i) => ({
        src,
        alt: `${room.name} — image ${i + 1} at Silvanza Resort`,
      })),
      index: imgIdx,
    });
  }, []);

  usePageMeta({
    title: "Rooms & Suites — Silvanza Resort by Nivanta Jim Corbett",
    description:
      "50 rooms across 6 categories from ₹10,000/night. Apex Suites (500 sq ft, 2 king beds), Aura (pool view), Haven, Lush, Breeze, Origin. Jim Corbett, Ramnagar, Uttarakhand.",
    canonical: "/rooms",
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Silvanza Resort Room Types",
      "itemListElement": rooms.map((r, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "HotelRoom",
          "name": r.name,
          "description": r.description,
          "url": `https://silvanzaresort.com/rooms/${r.slug}`,
          "floorSize": { "@type": "QuantitativeValue", "value": r.size, "unitCode": "FTK" },
          "bed": { "@type": "BedDetails", "typeOfBed": r.bedType },
          "occupancy": { "@type": "QuantitativeValue", "maxValue": r.capacity },
          "priceRange": `From ${r.priceLabel} per night`,
        },
      })),
    },
  });

  return (
    <>
      {/* Page hero */}
      <div className="section-dark pt-32 pb-16 section-pad" style={{ paddingTop: "8rem" }}>
        <div className="container-brand mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-light mb-4">Luxury Abode</span>
            <div className="divider-gold" />
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-ivory leading-tight">
              Fifty Rooms.<br />Six Stories.
            </h1>
            <p className="text-ivory/55 font-light mt-4 max-w-xl leading-relaxed">
              Every room at Silvanza has been designed to be your personal retreat — a space that balances warmth with elegance.
              All rooms include a private balcony or terrace, air conditioning, HD Smart TV, Wi-Fi, and premium amenities.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Rooms grid */}
      <section className="section-pad bg-ivory" aria-label="All room types">
        <div className="container-brand mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {rooms.map((room, i) => (
              <RoomCard key={room.id} room={room} cardIdx={i} onOpenLightbox={openLightbox} />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          open={lightbox !== null}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* Standard amenities */}
      <section className="section-pad section-gold-cream" aria-labelledby="standard-amenities-heading">
        <div className="container-brand mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="eyebrow eyebrow-dark">All Rooms Include</span>
            <div className="divider-gold mx-auto" />
            <h2 id="standard-amenities-heading" className="heading-section mb-8">Standard Inclusions Across Every Room</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STANDARD_ROOM_AMENITIES.map((a) => (
                <div key={a} className="flex items-center gap-2 text-left bg-white border border-gold/15 p-3">
                  <span className="text-gold text-sm" aria-hidden="true">✓</span>
                  <span className="text-xs text-muted font-light">{a}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted font-light italic mt-5">Extra bed available on request · All rooms have private balcony or terrace</p>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <div className="section-dark py-14 text-center">
        <p className="eyebrow eyebrow-light mb-3">Ready to Book?</p>
        <h2 className="font-serif text-2xl font-light text-ivory mb-6">Best rates guaranteed when you book direct</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/contact" className="btn btn-primary">Check Availability</Link>
          <a href="tel:+919792106111" className="btn btn-ghost">
            +91 979 210 6111
          </a>
        </div>
      </div>
    </>
  );
}
