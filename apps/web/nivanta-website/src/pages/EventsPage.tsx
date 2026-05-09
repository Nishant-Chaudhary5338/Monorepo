import { useState } from "react";
import { motion } from "framer-motion";
import GoldIcon from "../components/GoldIcon";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import Lightbox from "../components/Lightbox";
import { EVENT_IMAGES } from "../assets/media";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const venues = [
  {
    id: "orana",
    name: "Orana",
    subtitle: "Grand Banquet Hall",
    area: "4,500 sq ft",
    guests: "300",
    type: "Indoor · AC",
    images: EVENT_IMAGES.orana,
    features: [
      "4,500 sq ft pillar-free hall",
      "Up to 300 guests in theatre-style",
      "Fully air-conditioned",
      "Premium AV system & adaptive lighting",
      "Dedicated event coordination team",
      "Customisable décor packages",
    ],
    description:
      "Named from a word meaning 'welcoming sanctuary', Orana is our fully air-conditioned grand banquet hall. Finished in elegant décor with premium AV infrastructure, it is the ideal venue for weddings, receptions, corporate conferences, and private gatherings that demand nothing short of perfection.",
  },
  {
    id: "flaura",
    name: "Flaura",
    subtitle: "Celebration Lawn",
    area: "18,000 sq ft",
    guests: "500",
    type: "Open Air",
    images: EVENT_IMAGES.flaura,
    features: [
      "18,000 sq ft open-air lawn",
      "4,000 sq ft additional overflow lawn",
      "Up to 500 guests",
      "Scenic Kumaon forest backdrop",
      "Garden weddings & outdoor galas",
      "Ample parking for large groups",
    ],
    description:
      "Flaura is where Corbett's sky becomes part of your celebration. Our sprawling 18,000 sq ft banquet lawn — with an additional 4,000 sq ft overflow — can host up to 500 guests surrounded by landscaping drawn from the forest aesthetics of Kumaon. Whether candlelit wedding or vibrant corporate evening, Flaura transforms every gathering into a grand tableau.",
  },
];

const eventTypes = [
  { title: "Destination Weddings & Receptions", icon: "ring" },
  { title: "Engagement & Mehendi Ceremonies", icon: "flower" },
  { title: "Anniversary & Milestone Celebrations", icon: "champagne" },
  { title: "Birthday Bashes & Private Parties", icon: "cake" },
  { title: "Corporate Offsites & Team Retreats", icon: "building" },
  { title: "Conferences & Product Launches", icon: "mic" },
  { title: "Family Reunions & Group Getaways", icon: "people" },
];

const whyChoose = [
  "Two versatile venues totalling 22,500+ sq ft of event space",
  "Dedicated in-house event coordination team from planning to execution",
  "Customisable catering by Ember — from grand buffets to plated dinners",
  "Premium AV infrastructure, adaptive lighting, and sound systems",
  "50-room inventory for accommodation of guests on site",
  "Jim Corbett's iconic forest setting — a backdrop no banquet hall can replicate",
  "Flexible décor and theming packages curated to your vision",
  "Ample parking for large groups and convoy arrivals",
];

const allGalleryImages = [
  ...EVENT_IMAGES.orana,
  ...EVENT_IMAGES.flaura,
].map((src, i) => ({ src, alt: `Silvanza events — view ${i + 1}` }));

export default function EventsPage(): React.JSX.Element {
  usePageMeta({
    title: "Events & Weddings — Silvanza Resort Jim Corbett",
    description:
      "Host your dream wedding or event at Silvanza Resort — 22,500 sq ft of stunning indoor and outdoor event space in Jim Corbett. Orana banquet hall and Flaura celebration lawn.",
    canonical: "/events",
    schema: {
      "@context": "https://schema.org",
      "@type": "EventVenue",
      "@id": "https://silvanzaresort.com/events#venue",
      "name": "Silvanza Resort — Events & Weddings",
      "description": "22,500+ sq ft of premium event space in Jim Corbett. Orana: 4,500 sq ft fully air-conditioned banquet hall for 300 guests. Flaura: 18,000 sq ft open-air celebration lawn for 500 guests. Ideal for destination weddings, receptions, corporate events, and private celebrations.",
      "url": "https://silvanzaresort.com/events",
      "telephone": "+919792106111",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Village Dhikuli",
        "addressLocality": "Ramnagar",
        "addressRegion": "Uttarakhand",
        "postalCode": "244715",
        "addressCountry": "IN"
      },
      "maximumAttendeeCapacity": 500,
      "amenityFeature": [
        { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "AV System", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Outdoor Lawn", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Catering by Ember", "value": true },
        { "@type": "LocationFeatureSpecification", "name": "Free Parking", "value": true }
      ],
      "containedInPlace": { "@id": "https://silvanzaresort.com/#hotel" }
    },
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [venueActiveImg, setVenueActiveImg] = useState<Record<string, number>>({
    orana: 0,
    flaura: 0,
  });

  const openLightbox = (idx: number): void => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative flex items-end min-h-[75vh] overflow-hidden">
        <img
          src={EVENT_IMAGES.hero}
          alt="Orana banquet hall at Silvanza Resort"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(3,33,5,0.35) 0%, rgba(3,33,5,0.55) 50%, rgba(3,33,5,0.88) 100%)",
          }}
        />
        <div className="relative z-10 container-brand section-pad pb-20 w-full">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-6"
            style={{ color: "rgba(212,184,112,0.9)", letterSpacing: "0.35em" }}
          >
            Events by Nivanta
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-white font-light"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
          >
            Because Every Celebration<br />
            Deserves a Perfect Canvas
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 font-light max-w-xl"
            style={{ color: "rgba(212,184,112,0.85)" }}
          >
            At Silvanza Resort by Nivanta, events are not just occasions — they
            are experiences that outlast the evening and become stories told for years.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/contact" className="btn btn-primary">Enquire About Your Event</Link>
            <a href="tel:+919792106111" className="btn btn-ghost">📞 Call Us Directly</a>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ──────────────────────────────────────── */}
      <section className="section-pad bg-ivory">
        <div className="container-brand max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark mb-5">Your Next Event Destination</span>
            <h2 className="heading-section mb-5">Corbett as Your Backdrop</h2>
            <div className="divider-gold mx-auto mb-6" />
            <p className="text-muted font-light leading-relaxed">
              Set against the natural splendour of Jim Corbett's foothills and the elegant
              architecture of Silvanza, our resort is one of the most sought-after destination
              wedding and events venues in the Ramnagar belt. Whether your vision is an intimate
              gathering of fifty or a grand celebration of five hundred, Silvanza has the space,
              the infrastructure, and the team to bring it to life flawlessly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Venue Cards ────────────────────────────────── */}
      {venues.map((venue, i) => {
        const isEven = i % 2 === 0;
        const activeIdx = venueActiveImg[venue.id] ?? 0;
        const lightboxOffset = i === 0 ? 0 : EVENT_IMAGES.orana.length;

        return (
          <section
            key={venue.id}
            className={`section-pad ${isEven ? "bg-gold-cream" : "section-dark"}`}
          >
            <div className="container-brand">
              <div className={`grid lg:grid-cols-2 gap-14 items-start ${!isEven ? "lg:[&>*:first-child]:order-2" : ""}`}>

                {/* Image panel */}
                <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
                  {/* Main image */}
                  <div
                    className="aspect-4/3 overflow-hidden cursor-zoom-in relative group mb-3"
                    onClick={() => openLightbox(lightboxOffset + activeIdx)}
                    role="button"
                    aria-label="Open image gallery"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(lightboxOffset + activeIdx)}
                  >
                    <motion.img
                      key={activeIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      src={venue.images[activeIdx]}
                      alt={`${venue.name} — ${venue.subtitle}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs tracking-[0.25em] uppercase bg-black/40 px-4 py-2">
                        View Gallery
                      </span>
                    </div>
                  </div>
                  {/* Thumbnails */}
                  {venue.images.length > 1 && (
                    <div className="flex gap-2">
                      {venue.images.map((src, idx) => (
                        <button
                          key={src}
                          onClick={() => setVenueActiveImg((prev) => ({ ...prev, [venue.id]: idx }))}
                          className={`flex-1 aspect-square overflow-hidden border-2 transition-colors ${idx === activeIdx ? "border-gold" : "border-transparent hover:border-gold/40"}`}
                          aria-label={`View ${venue.name} image ${idx + 1}`}
                        >
                          <img
                            src={src}
                            alt={`${venue.name} thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Text */}
                <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }}>
                  <span className={`eyebrow mb-5 ${isEven ? "eyebrow-dark" : "eyebrow-light"}`}>
                    {venue.type} · {venue.area}
                  </span>
                  <h2
                    className={`font-serif font-light mb-2 ${isEven ? "text-forest-deep" : "text-ivory"}`}
                    style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                  >
                    {venue.name}
                  </h2>
                  <p className={`font-light mb-5 text-lg ${isEven ? "text-muted" : "text-gold-pale"}`}>
                    {venue.subtitle}
                  </p>
                  <div className="divider-gold" />
                  <p className={`font-light leading-relaxed mb-8 ${isEven ? "text-muted" : "text-gold-pale"}`}>
                    {venue.description}
                  </p>
                  {/* Stats row */}
                  <div className="flex gap-4 mb-8">
                    {[{ label: "Area", value: venue.area }, { label: "Guests", value: `Up to ${venue.guests}` }].map((s) => (
                      <div
                        key={s.label}
                        className={`flex-1 border p-4 text-center ${isEven ? "border-gold/30 bg-white" : "border-gold/30 bg-white/5"}`}
                      >
                        <p className={`font-serif text-xl mb-1 ${isEven ? "text-forest-deep" : "text-ivory"}`}>{s.value}</p>
                        <p className={`text-xs uppercase tracking-widest font-light ${isEven ? "text-muted" : "text-gold-pale"}`}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <ul className="space-y-3">
                    {venue.features.map((feat) => (
                      <li
                        key={feat}
                        className={`flex items-start gap-3 font-light text-sm ${isEven ? "text-muted" : "text-gold-pale"}`}
                      >
                        <span className="text-gold shrink-0 mt-0.5">—</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Event Types Grid ───────────────────────────── */}
      <section className="section-pad bg-ivory">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-14">
            <span className="eyebrow eyebrow-dark mb-5">What We Host</span>
            <h2 className="heading-section">Every Occasion, Perfectly Hosted</h2>
            <div className="divider-gold mx-auto" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventTypes.map((type, i) => (
              <motion.div
                key={type.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="border border-gold/25 p-6 hover:border-gold hover:bg-gold-cream transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-3"><GoldIcon name={type.icon} size={28} className="text-gold" /></div>
                <h3 className="font-serif text-forest-deep text-sm leading-snug">{type.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose ─────────────────────────────────── */}
      <section className="section-dark section-pad">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <span className="eyebrow eyebrow-light mb-5">The Silvanza Difference</span>
              <h2
                className="font-serif text-ivory font-light"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
              >
                Why Choose Silvanza<br />for Your Event
              </h2>
              <div className="divider-gold" />
              <p className="text-gold-pale font-light leading-relaxed mt-4">
                From concept to celebration, our dedicated events team ensures
                every detail is curated to your vision.
              </p>
            </motion.div>
            <motion.ul {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="space-y-5">
              {whyChoose.map((point, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="font-serif text-gold shrink-0" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-gold-pale font-light leading-relaxed">{point}</p>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="section-gold-cream section-pad text-center">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark mb-5">Let's Begin</span>
            <h2 className="heading-section mb-4">Start Planning Your Celebration</h2>
            <p className="text-muted font-light max-w-md mx-auto mb-10">
              Share your vision with our events team — we'll take care of the rest.
              We typically respond within 2 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn btn-primary">Enquire About Your Event</Link>
              <a href="tel:+919792106111" className="btn btn-outline">📞 +91 979 210 6111</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={allGalleryImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
