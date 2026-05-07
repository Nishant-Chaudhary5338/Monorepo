import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import { rooms, STANDARD_ROOM_AMENITIES } from "../data/rooms";
import Lightbox from "../components/Lightbox";

export default function RoomDetailPage(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const room = rooms.find((r) => r.slug === slug);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const lightboxImages = room
    ? room.images.map((src, i) => ({ src, alt: `${room.name} — view ${i + 1} at Silvanza Resort` }))
    : [];

  usePageMeta(
    room
      ? {
          title: `${room.name} — Silvanza Resort Jim Corbett`,
          description: `${room.name} at Silvanza Resort by Nivanta. ${room.tagline}. ${room.size} sq ft, ${room.bedType}, ${room.view}. Starting ${room.priceLabel}/night.`,
          canonical: `/rooms/${room.slug}`,
          schema: {
            "@context": "https://schema.org",
            "@type": "HotelRoom",
            name: room.name,
            description: room.description,
            url: `https://silvanzaresort.com/rooms/${room.slug}`,
            floorSize: { "@type": "QuantitativeValue", value: room.size, unitCode: "FTK" },
            bed: { "@type": "BedDetails", typeOfBed: room.bedType },
            occupancy: { "@type": "QuantitativeValue", maxValue: room.capacity },
            offers: {
              "@type": "Offer",
              price: room.price,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
          },
        }
      : { title: "Room Not Found — Silvanza Resort", description: "The requested room could not be found." }
  );

  if (!room) return <Navigate to="/rooms" replace />;

  const otherRooms = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-gold-cream border-b border-gold/15 pt-20"
      >
        <ol className="container-brand mx-auto px-5 py-3 flex items-center gap-2 text-xs text-muted" role="list">
          <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
          <li aria-hidden="true" className="text-gold/50">›</li>
          <li><Link to="/rooms" className="hover:text-gold transition-colors">Rooms &amp; Suites</Link></li>
          <li aria-hidden="true" className="text-gold/50">›</li>
          <li className="text-gold-dark font-medium" aria-current="page">{room.name}</li>
        </ol>
      </nav>

      {/* Main content */}
      <div className="section-pad bg-ivory">
        <div className="container-brand mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Gallery */}
            <div>
              {/* Main image — click to open lightbox */}
              <div
                className="overflow-hidden aspect-4/3 mb-3 cursor-zoom-in relative group"
                onClick={() => setLightboxOpen(true)}
                role="button"
                aria-label="Open image gallery"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
              >
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={room.images[activeImg]}
                  alt={`${room.name} — view ${activeImg + 1} at Silvanza Resort`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs tracking-[0.25em] uppercase bg-black/40 px-4 py-2">
                    View Gallery
                  </span>
                </div>
              </div>

              {/* Thumbnails — click to select + open lightbox */}
              {room.images.length > 1 && (
                <div className="flex gap-2">
                  {room.images.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => { setActiveImg(i); setLightboxOpen(true); }}
                      className={`flex-1 aspect-square overflow-hidden border-2 transition-colors ${i === activeImg ? "border-gold" : "border-transparent hover:border-gold/40"}`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${room.name} thumbnail ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width={200}
                        height={200}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Lightbox
              images={lightboxImages}
              initialIndex={activeImg}
              open={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
            />

            {/* Info */}
            <div>
              <span className="eyebrow eyebrow-dark mb-2">{room.view}</span>
              <div className="divider-gold" />
              <h1 className="font-serif text-4xl font-light text-forest-deep mb-1">{room.name}</h1>
              <p className="font-serif italic text-gold-dark mb-5">{room.tagline}</p>

              {/* Specs row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Size", value: `${room.size} sq ft` },
                  { label: "Bed", value: room.bedType },
                  { label: "Guests", value: `Up to ${room.capacity}` },
                ].map((s) => (
                  <div key={s.label} className="border border-gold/15 p-3 text-center bg-gold-cream">
                    <p className="eyebrow eyebrow-dark mb-1">{s.label}</p>
                    <p className="font-serif text-forest-deep text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-muted font-light leading-relaxed mb-6">{room.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {room.features.map((f) => (
                  <span key={f} className="text-[0.6rem] tracking-wide px-2 py-1 bg-gold-cream border border-gold/20 text-muted">{f}</span>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="border border-gold/20 p-5 bg-white mb-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-3xl text-gold-dark">{room.priceLabel}</span>
                  <span className="text-sm text-muted font-light">per night</span>
                </div>
                <p className="text-xs text-muted font-light mb-4">Best rates guaranteed when you book direct</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/contact" className="btn btn-primary flex-1 text-center">Book This Room</Link>
                  <a href="tel:+919792106111" className="btn btn-outline flex-1 text-center">📞 Call to Book</a>
                </div>
              </div>

              <p className="text-xs text-muted font-light">
                Extra bed available on request. Children under 6 stay free.{" "}
                <Link to="/contact" className="text-gold hover:underline">Contact us</Link> for group & corporate rates.
              </p>
            </div>
          </div>

          {/* Standard amenities */}
          <div className="mt-16 pt-12 border-t border-gold/15">
            <h2 className="font-serif text-2xl font-light text-forest-deep mb-6">Standard Room Inclusions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {STANDARD_ROOM_AMENITIES.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-gold text-xs" aria-hidden="true">✓</span>
                  <span className="font-light">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Other rooms */}
      <section className="section-pad section-gold-cream" aria-labelledby="other-rooms-heading">
        <div className="container-brand mx-auto">
          <h2 id="other-rooms-heading" className="font-serif text-2xl font-light text-forest-deep mb-8">Other Rooms You May Like</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {otherRooms.map((r) => (
              <article key={r.id} className="group bg-white border border-gold/15 overflow-hidden">
                <Link to={`/rooms/${r.slug}`} className="block">
                  <div className="overflow-hidden aspect-4/3">
                    <img
                      src={r.image}
                      alt={`${r.name} at Silvanza Resort`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width={400}
                      height={300}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-medium text-forest-deep mb-1">{r.name}</h3>
                    <p className="text-xs text-muted font-light mb-3">{r.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-gold-dark text-sm">{r.priceLabel}<span className="text-xs text-muted font-light">/night</span></span>
                      <span className="text-xs text-gold tracking-widest">View →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
