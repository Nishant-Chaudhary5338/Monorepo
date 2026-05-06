import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { amenities } from "../data/amenities";

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

export default function AmenitiesPage(): React.JSX.Element {
  usePageMeta({
    title: "Our Amenities — Silvanza Resort Jim Corbett",
    description:
      "Discover Silvanza Resort's amenities: Tattva pools, Ember restaurant, Orana 4500 sq ft banquet hall, Flaura 18000 sq ft lawn, free parking and 24x7 security.",
    canonical: "/amenities",
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
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 40%, #B98F39 0%, transparent 65%)",
          }}
        />
        <div className="container-brand section-pad relative z-10 pb-20">
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
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            A Lifestyle, Not a List
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-[#D4B870] font-light max-w-lg"
          >
            Every amenity at Silvanza exists to deepen your experience — not to
            fill a brochure.
          </motion.p>
        </div>
      </section>

      {/* Amenities — alternating layout */}
      {amenities.map((amenity, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={amenity.id}
            className={`section-pad ${i % 2 === 0 ? "bg-[#FAF7F0]" : "bg-[#F5EDD4]"}`}
          >
            <div className="container-brand">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  isEven ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                {/* Image side */}
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.7, delay: isEven ? 0 : 0.1 }}
                  className="relative"
                >
                  <div
                    className="aspect-[4/3] w-full overflow-hidden"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #032105 0%, #253A11 100%)"
                          : i === 1
                          ? "linear-gradient(135deg, #1A1A17 0%, #032105 100%)"
                          : i === 2
                          ? "linear-gradient(135deg, #253A11 0%, #B98F39 100%)"
                          : i === 3
                          ? "linear-gradient(135deg, #032105 0%, #253A11 100%)"
                          : "linear-gradient(135deg, #1A1A17 0%, #253A11 100%)",
                    }}
                  >
                    {amenity.image && (
                      <img
                        src={amenity.image}
                        alt={`${amenity.name} — ${amenity.subtitle} at Silvanza Resort`}
                        loading="lazy"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div
                    className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#B98F39]"
                    style={{ pointerEvents: "none" }}
                  />
                </motion.div>

                {/* Text side */}
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.7, delay: isEven ? 0.1 : 0 }}
                >
                  <span className="eyebrow eyebrow-dark mb-5">{amenity.icon} {amenity.subtitle}</span>
                  <h2 className="heading-section mb-5">{amenity.name}</h2>
                  <div className="divider-gold" />
                  <p className="text-[#5a5545] font-light leading-relaxed mb-8">
                    {amenity.description}
                  </p>
                  <ul className="space-y-3">
                    {amenity.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-[#5a5545] font-light">
                        <span className="text-[#B98F39] mt-1 shrink-0">—</span>
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
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="eyebrow eyebrow-light mb-5">Every Room, Every Night</span>
            <h2
              className="font-serif text-[#FAF7F0] font-light"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
            >
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
                className="flex items-start gap-3 border border-[#B98F39]/20 p-5"
              >
                <span className="text-[#B98F39] shrink-0 mt-0.5">✓</span>
                <p className="text-[#D4B870] font-light text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section-pad bg-[#F5EDD4] text-center">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark mb-5">Reserve Your Stay</span>
            <h2 className="heading-section mb-4">
              Experience Silvanza First-Hand
            </h2>
            <p className="text-[#5a5545] font-light max-w-md mx-auto mb-10">
              Amenities are best experienced — not just read about. We look
              forward to welcoming you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn btn-primary">
                Book a Stay
              </Link>
              <Link to="/rooms" className="btn btn-outline">
                View Rooms
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
