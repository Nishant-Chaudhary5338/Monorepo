import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

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
  {
    title: "Destination Weddings",
    description:
      "Exchange vows against the backdrop of Kumaon's forests and open Corbett skies.",
  },
  {
    title: "Engagement & Mehendi",
    description:
      "Intimate and joyful celebrations set in Silvanza's garden spaces.",
  },
  {
    title: "Anniversary Celebrations",
    description:
      "Private dinners, garden setups, and curated experiences for milestones.",
  },
  {
    title: "Birthday Parties",
    description:
      "Candlelit terraces, bonfire evenings, or a full lawn takeover — your birthday, your rules.",
  },
  {
    title: "Corporate Offsites",
    description:
      "Away from the boardroom. Reconnect teams with Corbett as your backdrop.",
  },
  {
    title: "Conferences",
    description:
      "Orana's premium AV and pillar-free layout for focused corporate gatherings.",
  },
  {
    title: "Family Reunions",
    description:
      "Space, warmth, and Silvanza's hospitality for your whole family.",
  },
];

const whyChoose = [
  "Two versatile venues totalling 22,500+ sq ft of event space",
  "Dedicated in-house event coordination team from planning to execution",
  "Customisable catering by Ember — from grand buffets to plated dinners",
  "Premium AV infrastructure, adaptive lighting, and sound systems",
  "50-room inventory for accommodation of guests on site",
  "Jim Corbett's iconic forest setting — a backdrop no banquet hall can replicate",
  "Flexible décor and theming packages curated to your vision",
];

export default function EventsPage(): React.JSX.Element {
  usePageMeta({
    title: "Events & Weddings — Silvanza Resort Jim Corbett",
    description:
      "Silvanza Resort offers 22500 sq ft of event space in Jim Corbett. Orana 4500 sq ft banquet hall and Flaura 18000 sq ft lawn for weddings, corporate events, celebrations.",
    canonical: "/events",
  });

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex items-end min-h-[70vh] overflow-hidden"
        style={{ background: "linear-gradient(150deg, #032105 0%, #253A11 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 60% 30%, #B98F39 0%, transparent 55%)",
          }}
        />
        <div className="container-brand section-pad relative z-10 pb-20">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="eyebrow eyebrow-light mb-6"
          >
            Events & Weddings
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[#FAF7F0] font-light"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
          >
            Because Every Celebration<br />
            Deserves a Perfect Canvas
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-[#D4B870] font-light max-w-xl"
          >
            22,500 sq ft of curated event space in the heart of Jim Corbett —
            from intimate ceremonies to grand corporate gatherings.
          </motion.p>
        </div>
      </section>

      {/* Intro */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark mb-5">The Setting</span>
            <h2 className="heading-section mb-5">
              Corbett as Your Backdrop
            </h2>
            <div className="divider-gold mx-auto" />
            <p className="text-[#5a5545] font-light leading-relaxed">
              At Silvanza, we believe that the setting of a celebration is as
              important as the celebration itself. Our two signature venues —
              Orana and Flaura — sit within 4 acres of landscaped grounds on the
              edge of Jim Corbett National Park. Whether you're planning an
              intimate evening or a 500-guest wedding under open skies, Silvanza
              provides the stage. Your story fills it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Venue Cards */}
      {venues.map((venue, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={venue.id}
            className={`section-pad ${isEven ? "bg-[#F5EDD4]" : "bg-[#032105]"}`}
          >
            <div className="container-brand">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  isEven ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                {/* Visual card */}
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.7 }}
                  className="relative"
                >
                  <div
                    className="aspect-[4/3] w-full flex items-center justify-center"
                    style={{
                      background: isEven
                        ? "linear-gradient(135deg, #253A11 0%, #032105 100%)"
                        : "linear-gradient(135deg, #B98F39 0%, #725B29 100%)",
                    }}
                  >
                    <div className="text-center text-white/20">
                      <p
                        className="font-serif"
                        style={{ fontSize: "5rem", lineHeight: 1 }}
                      >
                        {venue.name}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`absolute -bottom-4 ${
                      isEven ? "-right-4" : "-left-4"
                    } flex gap-4`}
                  >
                    <div
                      className={`px-6 py-4 text-center ${
                        isEven ? "bg-[#FAF7F0]" : "bg-[#F5EDD4]"
                      }`}
                      style={{ border: "1px solid #B98F39" }}
                    >
                      <p
                        className="font-serif text-[#032105]"
                        style={{ fontSize: "1.4rem" }}
                      >
                        {venue.area}
                      </p>
                      <p className="text-xs uppercase tracking-widest text-[#5a5545] font-light mt-1">
                        Area
                      </p>
                    </div>
                    <div
                      className={`px-6 py-4 text-center ${
                        isEven ? "bg-[#FAF7F0]" : "bg-[#F5EDD4]"
                      }`}
                      style={{ border: "1px solid #B98F39" }}
                    >
                      <p
                        className="font-serif text-[#032105]"
                        style={{ fontSize: "1.4rem" }}
                      >
                        {venue.guests}
                      </p>
                      <p className="text-xs uppercase tracking-widest text-[#5a5545] font-light mt-1">
                        Guests
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <span
                    className={`eyebrow mb-5 ${
                      isEven ? "eyebrow-dark" : "eyebrow-light"
                    }`}
                  >
                    {venue.type} · {venue.area}
                  </span>
                  <h2
                    className={`font-serif font-light mb-2 ${
                      isEven ? "text-[#032105]" : "text-[#FAF7F0]"
                    }`}
                    style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                  >
                    {venue.name}
                  </h2>
                  <p
                    className={`font-light mb-5 text-lg ${
                      isEven ? "text-[#5a5545]" : "text-[#D4B870]"
                    }`}
                  >
                    {venue.subtitle}
                  </p>
                  <div className="divider-gold" />
                  <p
                    className={`font-light leading-relaxed mb-8 ${
                      isEven ? "text-[#5a5545]" : "text-[#D4B870]"
                    }`}
                  >
                    {venue.description}
                  </p>
                  <ul className="space-y-3">
                    {venue.features.map((feat) => (
                      <li
                        key={feat}
                        className={`flex items-start gap-3 font-light text-sm ${
                          isEven ? "text-[#5a5545]" : "text-[#D4B870]"
                        }`}
                      >
                        <span className="text-[#B98F39] shrink-0 mt-0.5">—</span>
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

      {/* Event Types Grid */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="eyebrow eyebrow-dark mb-5">What We Host</span>
            <h2 className="heading-section">Events & Occasions</h2>
            <div className="divider-gold mx-auto" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((type, i) => (
              <motion.div
                key={type.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="border border-[#B98F39]/30 p-7 hover:border-[#B98F39] transition-colors duration-300"
              >
                <h3
                  className="font-serif text-[#032105] mb-3"
                  style={{ fontSize: "1.1rem" }}
                >
                  {type.title}
                </h3>
                <p className="text-sm text-[#5a5545] font-light leading-relaxed">
                  {type.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section-dark section-pad">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <span className="eyebrow eyebrow-light mb-5">The Silvanza Difference</span>
              <h2
                className="font-serif text-[#FAF7F0] font-light"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
              >
                Why Choose Silvanza for Your Event
              </h2>
              <div className="divider-gold" />
            </motion.div>
            <motion.ul
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-5"
            >
              {whyChoose.map((point, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="font-serif text-[#B98F39] shrink-0"
                    style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[#D4B870] font-light leading-relaxed">
                    {point}
                  </p>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-gold-cream section-pad text-center">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark mb-5">Let's Begin</span>
            <h2 className="heading-section mb-4">
              Start Planning Your Celebration
            </h2>
            <p className="text-[#5a5545] font-light max-w-md mx-auto mb-10">
              Share your vision with our events team. We will take care of the rest.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Send an Enquiry
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
