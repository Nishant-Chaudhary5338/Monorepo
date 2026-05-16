import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { amenities } from "../data/amenities";
import GoldIcon from "../components/GoldIcon";
import Lightbox from "../components/Lightbox";
import ImageCarousel from "../components/ImageCarousel";
import type { Amenity } from "../types";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const standardInclusions = [
  "Complimentary high-speed Wi-Fi throughout the resort",
  "Daily buffet breakfast at Ember restaurant",
  "Access to Tattva adults' and family pools",
  "24×7 front desk and concierge service",
  "30+ CCTV security coverage across the property",
  "Comprehensive power backup",
  "Complimentary parking for all guests",
  "In-room tea and coffee making facility",
  "Daily housekeeping and evening turndown service",
  "Room service from Ember kitchen",
  "Air-conditioning and blackout curtains in all rooms",
];

// ── Icon helpers ───────────────────────────────────────────
function ChevLeft(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevRight(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function GridIcon(): React.JSX.Element {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

// ── Carousel component ────────────────────────────────────
type CarouselProps = {
  amenity: Amenity;
  bgGradient: string;
  onOpenLightbox: (images: { src: string; alt: string }[], idx: number) => void;
};

function AmenityCarousel({ amenity, bgGradient, onOpenLightbox }: CarouselProps): React.JSX.Element {
  const [idx, setIdx] = useState(0);
  const gallery = (amenity.images && amenity.images.length > 0)
    ? amenity.images
    : [amenity.image].filter(Boolean) as string[];
  const total = gallery.length;

  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  }, [total]);

  const open = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenLightbox(
      gallery.map((src, i) => ({ src, alt: `${amenity.name} — view ${i + 1} at Silvanza Resort` })),
      idx
    );
  }, [gallery, amenity.name, idx, onOpenLightbox]);

  return (
    <div className="relative">
      <ImageCarousel
        images={gallery}
        alt={amenity.name}
        className="aspect-4/3 w-full"
        onLightbox={(i) => onOpenLightbox(gallery.map((src, j) => ({ src, alt: `${amenity.name} — view ${j + 1}` })), i)}
      />

      {/* Decorative corner — outside overflow container so it's visible */}
      <div
        className="absolute -bottom-4 -right-4 w-24 h-24 border border-gold"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function AmenitiesPage(): React.JSX.Element {
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null);

  const openLightbox = useCallback((images: { src: string; alt: string }[], index: number) => {
    setLightbox({ images, index });
  }, []);

  const bgGradients = [
    "linear-gradient(135deg, #032105 0%, #253A11 100%)",
    "linear-gradient(135deg, #1A1A17 0%, #032105 100%)",
    "linear-gradient(135deg, #253A11 0%, #B98F39 100%)",
    "linear-gradient(135deg, #032105 0%, #253A11 100%)",
    "linear-gradient(135deg, #1A1A17 0%, #253A11 100%)",
    "linear-gradient(135deg, #1A1A17 0%, #253A11 100%)",
  ];

  usePageMeta({
    title: "Our Amenities — Silvanza Resort Jim Corbett",
    description:
      "Discover Silvanza Resort's amenities: Tattva pools, Ember restaurant, Orana 4500 sq ft banquet hall, Flaura 18000 sq ft lawn, free parking and 24x7 security.",
    canonical: "/amenities",
    schema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://silvanzaresort.com/" },
        { "@type": "ListItem", "position": 2, "name": "Amenities", "item": "https://silvanzaresort.com/amenities" }
      ]
    },
  });

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex items-end min-h-[60vh] overflow-hidden"
        style={{ background: "linear-gradient(160deg, #032105 55%, #253A11 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(ellipse at 70% 40%, #B98F39 0%, transparent 65%)" }}
        />
        <div className="container-brand section-pad relative z-10 pb-20">
          <motion.span {...fadeUp} transition={{ duration: 0.6 }} className="eyebrow eyebrow-light mb-6">
            Silvanza Resort
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-ivory font-light"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            A Lifestyle, Not a List
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-gold-pale font-light max-w-lg"
          >
            Every amenity at Silvanza exists to deepen your experience — not to fill a brochure.
          </motion.p>
        </div>
      </section>

      {/* Amenities — alternating layout */}
      {amenities.map((amenity, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={amenity.id}
            className={`section-pad ${i % 2 === 0 ? "bg-ivory" : "bg-gold-cream"}`}
          >
            <div className="container-brand">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  isEven ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                {/* Image carousel */}
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.7, delay: isEven ? 0 : 0.1 }}
                >
                  <AmenityCarousel
                    amenity={amenity}
                    bgGradient={bgGradients[i] ?? bgGradients[0]}
                    onOpenLightbox={openLightbox}
                  />
                </motion.div>

                {/* Text side */}
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.7, delay: isEven ? 0.1 : 0 }}
                >
                  <span className="eyebrow eyebrow-dark mb-5 flex items-center gap-2">
                    {amenity.icon && <GoldIcon name={amenity.icon} size={14} className="text-gold inline-block" />}
                    {amenity.subtitle}
                  </span>
                  <h2 className="heading-section mb-5">{amenity.name}</h2>
                  <div className="divider-gold" />
                  <p className="text-muted font-light leading-relaxed mb-8">
                    {amenity.description}
                  </p>
                  <ul className="space-y-3">
                    {amenity.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-muted font-light">
                        <span className="text-gold mt-1 shrink-0">—</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Standard Inclusions */}
      <section className="section-dark section-pad">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-14">
            <span className="eyebrow eyebrow-light mb-5">Every Room, Every Night</span>
            <h2 className="font-serif text-ivory font-light" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
              Standard Inclusions
            </h2>
            <div className="divider-gold mx-auto" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {standardInclusions.map((item, i) => (
              <motion.div
                key={item}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex items-start gap-3 border border-gold/20 p-5"
              >
                <span className="text-gold shrink-0 mt-0.5">✓</span>
                <p className="text-gold-pale font-light text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section-pad bg-gold-cream text-center">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark mb-5">Reserve Your Stay</span>
            <h2 className="heading-section mb-4">Experience Silvanza First-Hand</h2>
            <p className="text-muted font-light max-w-md mx-auto mb-10">
              Amenities are best experienced — not just read about. We look forward to welcoming you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">Book a Stay</Link>
              <Link to="/rooms" className="btn btn-outline">View Rooms</Link>
            </div>
          </motion.div>
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
    </>
  );
}
