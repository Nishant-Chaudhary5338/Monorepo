import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import { rooms, STANDARD_ROOM_AMENITIES } from "../data/rooms";

export default function RoomsPage(): React.JSX.Element {
  usePageMeta({
    title: "Rooms & Suites — Silvanza Resort by Nivanta Jim Corbett",
    description:
      "50 rooms across 6 categories from ₹10,000/night. Apex Suites (700 sq ft, 2 king beds), Aura (pool view), Haven, Lush, Breeze, Origin. Jim Corbett, Ramnagar, Uttarakhand.",
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
              <motion.article
                key={room.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="group bg-white border border-gold/15 overflow-hidden"
              >
                <Link to={`/rooms/${room.slug}`} className="block">
                  <div className="overflow-hidden aspect-[4/3]">
                    <img
                      src={room.image}
                      alt={`${room.name} at Silvanza Resort — ${room.view}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width={600}
                      height={450}
                    />
                  </div>
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
            ))}
          </div>
        </div>
      </section>

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
            📞 +91 979 210 6111
          </a>
        </div>
      </div>
    </>
  );
}
