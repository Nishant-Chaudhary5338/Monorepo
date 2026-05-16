import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const team = [
  { name: "Mukesh Kr. Pandey", role: "Resort Manager" },
  { name: "Vinod Pathak", role: "Front Office Manager" },
  { name: "Rekha Dubey", role: "Manager, Reservations" },
  { name: "Avinaash Niraala", role: "VP, Marketing & Sales" },
  { name: "Atul Rai", role: "Manager, Housekeeping" },
];

const pillars = [
  {
    word: "Nature",
    description:
      "Rooted in Dhikuli's Sal forests and the Kosi Valley, every space at Silvanza is shaped by the landscape around it.",
  },
  {
    word: "Luxury",
    description:
      "50 rooms across 6 meticulously designed categories — every detail calibrated to feel considered, never incidental.",
  },
  {
    word: "Warmth",
    description:
      "Care is not a department at Silvanza — it is a culture practised by every member of the Nivanta team.",
  },
  {
    word: "Elegance",
    description:
      "A language of understated refinement expressed through finishes, art, and the unhurried rhythm of life here.",
  },
  {
    word: "Memory",
    description:
      "The highest compliment a guest can pay us is not a five-star review — it is returning. We build for that.",
  },
];

export default function AboutPage(): React.JSX.Element {
  usePageMeta({
    title: "About Silvanza Resort — Nivanta Hospitality LLP",
    description:
      "Discover the story behind Silvanza Resort by Nivanta — Jim Corbett's newest luxury address in Dhikuli, Ramnagar. 50 rooms, 4 acres, and a philosophy rooted in care.",
    canonical: "/about",
  });

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex items-end min-h-[72vh] overflow-hidden"
        style={{ background: "linear-gradient(160deg, #032105 60%, #253A11 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B98F39' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container-brand section-pad relative z-10 pb-20">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="eyebrow eyebrow-light mb-6"
          >
            Nivanta Hospitality LLP
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[#FAF7F0] font-light leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)" }}
          >
            Set Between Forest and Sky —<br />
            This is Silvanza
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-[#D4B870] font-light max-w-xl"
            style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)" }}
          >
            Crafted for travellers who believe where you stay matters as much as
            where you go — Silvanza is Jim Corbett's newest address in luxury and
            care.
          </motion.p>
        </div>
      </section>

      {/* Section 1 — The Property */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <span className="eyebrow eyebrow-dark mb-5">The Property</span>
              <h2 className="heading-section mb-5">
                Four Acres in the Heart of Dhikuli
              </h2>
              <div className="divider-gold" />
              <p className="text-[#5a5545] font-light leading-relaxed mb-5">
                Silvanza Resort sits on 4 acres of curated grounds in Dhikuli,
                Ramnagar — at the gateway to Jim Corbett National Park. Opened
                February 2026, it is operated by Nivanta Hospitality LLP as the
                group's flagship property.
              </p>
              <p className="text-[#5a5545] font-light leading-relaxed mb-8">
                The resort houses 50 rooms across six categories: Apex Suites,
                Aura, Haven, Lush, Breeze, and Origin — each with its own
                character and view. Guests gather at Ember, our pool-view
                restaurant; Tattva, our dual-pool complex; Orana, our 4,500 sq
                ft banquet hall; and Flaura, our 18,000 sq ft celebration lawn.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  ["50", "Rooms & Suites"],
                  ["6", "Room Categories"],
                  ["4 Acres", "Of Grounds"],
                  ["Feb 2026", "Opened"],
                ].map(([val, label]) => (
                  <div key={label} className="border-l-2 border-[#B98F39] pl-4">
                    <p
                      className="font-serif text-[#032105]"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
                    >
                      {val}
                    </p>
                    <p className="text-xs font-light tracking-widest uppercase text-[#5a5545] mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/images/about/about-team-full.webp"
                  alt="Silvanza Resort full team"
                  className="aspect-[4/5] w-full object-cover object-top"
                  loading="lazy"
                />
                <div className="space-y-4">
                  <img
                    src="/images/about/about-chefs-full.webp"
                    alt="Ember restaurant chef team"
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                  <img
                    src="/images/about/about-staff-full.webp"
                    alt="Silvanza hospitality team"
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 — The Philosophy */}
      <section className="section-dark section-pad">
        <div className="container-brand">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              {...fadeUp}
              transition={{ duration: 0.6 }}
              className="eyebrow eyebrow-light mb-6"
            >
              The Philosophy
            </motion.span>
            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-[#FAF7F0] font-light mb-6"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            >
              Silvanza — Where the Forest Dances
            </motion.h2>
            <div className="divider-gold mx-auto" />
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#D4B870] font-light leading-relaxed mb-6"
            >
              The name Silvanza is drawn from two words:{" "}
              <em className="text-[#F5EDD4] not-italic">Silva</em>, Latin for
              forest, and{" "}
              <em className="text-[#F5EDD4] not-italic">Anza</em>, meaning the
              dance of nature. Together they describe exactly what this place is
              — a space where the forest breathes into every room and every
              experience.
            </motion.p>
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-[#D4B870] font-light leading-relaxed"
            >
              Founded by Mr. Amit Trivedi under Nivanta Hospitality LLP,
              Silvanza was built on a single conviction: that the measure of a
              great hotel is never its marble or its square footage — it is
              whether guests feel genuinely cared for. Care at Silvanza is not a
              policy. It is the culture.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Section 3 — Founder Quote */}
      <section className="section-pad bg-[#F5EDD4]">
        <div className="container-brand">
          <motion.blockquote
            {...fadeUp}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="block text-[#B98F39] mb-8" style={{ fontSize: "4rem", lineHeight: 1 }}>
              "
            </span>
            <p
              className="font-serif text-[#032105] font-light italic leading-relaxed mb-10"
              style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)" }}
            >
              I have stayed in extraordinary places around the world, and the
              common thread in every memorable experience was never the marble
              floor or the size of the pool — it was the feeling that someone
              truly cared. That is what I wanted to build with Nivanta. A place
              where care is not a policy, but a culture.
            </p>
            <footer>
              <div className="divider-gold mx-auto mb-4" />
              <p className="font-sans font-light tracking-widest uppercase text-xs text-[#725B29]">
                Mr. Amit Trivedi
              </p>
              <p className="font-sans font-light text-xs text-[#5a5545] mt-1 tracking-wider">
                Founder, Nivanta Hospitality LLP
              </p>
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-pad bg-ivory">
        <div className="container-brand">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="eyebrow eyebrow-dark mb-5">The People</span>
            <h2 className="heading-section">Our Leadership Team</h2>
            <div className="divider-gold mx-auto" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="text-center"
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "#F5EDD4", border: "1px solid #B98F39" }}
                >
                  <span
                    className="font-serif text-[#032105]"
                    style={{ fontSize: "1.5rem" }}
                  >
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3
                  className="font-serif text-[#032105] font-normal mb-1"
                  style={{ fontSize: "1.05rem" }}
                >
                  {member.name}
                </h3>
                <p className="text-xs font-light tracking-widest uppercase text-[#5a5545]">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="section-dark section-pad">
        <div className="container-brand">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="eyebrow eyebrow-light mb-5">What We Stand For</span>
            <h2
              className="font-serif text-[#FAF7F0] font-light"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
            >
              Five Words. One Promise.
            </h2>
            <div className="divider-gold mx-auto" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.word}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-[#B98F39]/30 p-8 text-center hover:border-[#B98F39] transition-colors duration-300"
              >
                <h3
                  className="font-serif text-[#B98F39] font-light mb-4"
                  style={{ fontSize: "1.4rem" }}
                >
                  {pillar.word}
                </h3>
                <p className="text-xs text-[#D4B870] font-light leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-[#FAF7F0] text-center">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark mb-5">Begin Here</span>
            <h2 className="heading-section mb-4">Plan Your Visit to Silvanza</h2>
            <p className="text-[#5a5545] font-light max-w-lg mx-auto mb-10">
              Our reservations team is ready to help you find the perfect room,
              experience, or celebration at Silvanza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about#team" className="btn btn-outline">
                Meet Our Team
              </Link>
              <Link to="/contact" className="btn btn-primary">
                Plan Your Visit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
