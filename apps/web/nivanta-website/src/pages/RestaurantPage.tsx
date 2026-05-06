import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const menuHighlights = [
  {
    title: "Buffet Breakfast",
    description:
      "Start every day with a lavish spread — fresh-baked breads, hot dishes, cereals, fruit, eggs to order, and the finest Kumaoni morning staples.",
    icon: "☀",
  },
  {
    title: "À La Carte Dining",
    description:
      "A full menu celebrating Indian, Kumaoni, and continental traditions. From slow-cooked bhatt ki dal to perfectly grilled continental mains.",
    icon: "🍽",
  },
  {
    title: "Pool & Lawn View",
    description:
      "Every table at Ember is positioned to frame either the Tattva pool or the Kosi Valley — dining here is always a visual experience.",
    icon: "🌿",
  },
  {
    title: "Bar & Beverages",
    description:
      "A curated selection of spirits, cocktails, mocktails, and wines. Ask for the Pahadi Mule — an Ember signature inspired by the mountain evening.",
    icon: "🥃",
  },
  {
    title: "Private Dining",
    description:
      "Intimate dinners arranged on request — candlelit terrace setups, poolside tables, or a private corner of the restaurant for special occasions.",
    icon: "✦",
  },
];

const menus = [
  { title: "Main Course Menu", note: "Available at the restaurant" },
  { title: "Bar Book", note: "Cocktails, spirits & wines" },
  { title: "Breakfast Menu", note: "Daily buffet & à la carte" },
  { title: "Wine List", note: "Available on request" },
];

const hours = [
  { meal: "Breakfast", time: "7:00 AM — 10:30 AM" },
  { meal: "Lunch", time: "12:30 PM — 3:30 PM" },
  { meal: "Evening Snacks", time: "4:30 PM — 6:30 PM" },
  { meal: "Dinner", time: "7:30 PM — 10:30 PM" },
  { meal: "Bar", time: "12:00 PM — 11:00 PM" },
];

export default function RestaurantPage(): React.JSX.Element {
  usePageMeta({
    title: "Ember Restaurant — Silvanza Resort Jim Corbett",
    description:
      "Ember is Silvanza Resort's 2000 sq ft pool-view multi-cuisine restaurant. Buffet breakfast, à la carte dining, bar with cocktails and wines. Jim Corbett, Ramnagar.",
    canonical: "/restaurant",
  });

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex items-end min-h-[70vh] overflow-hidden"
        style={{ background: "linear-gradient(150deg, #1A1A17 0%, #032105 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 60%, #B98F39 0%, transparent 60%)",
          }}
        />
        <div className="container-brand section-pad relative z-10 pb-20">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="eyebrow eyebrow-light mb-6"
          >
            Ember — Silvanza's Restaurant
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[#FAF7F0] font-light"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Where Every Meal<br />Tells a Story
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-[#D4B870] font-light max-w-lg"
          >
            2,000 sq ft of warm light and extraordinary cuisine — overlooking
            the Tattva pool and the Kosi Valley beyond.
          </motion.p>
        </div>
      </section>

      {/* Body */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <span className="eyebrow eyebrow-dark mb-5">The Story of Ember</span>
              <h2 className="heading-section mb-5">
                Named for Warmth
              </h2>
              <div className="divider-gold" />
              <p className="text-[#5a5545] font-light leading-relaxed mb-5">
                Ember takes its name from what fire does best — it creates warmth
                without noise, draws people together without asking, and makes
                the air feel alive. That is what we want every meal here to feel
                like.
              </p>
              <p className="text-[#5a5545] font-light leading-relaxed mb-5">
                Spanning 2,000 sq ft, the restaurant is positioned to frame both
                the Tattva pool and, beyond the resort's edge, the Kosi Valley
                turning gold as the evening comes in. It is a dining room that
                earns its place in your memory.
              </p>
              <p className="text-[#5a5545] font-light leading-relaxed">
                Our kitchen celebrates the global palate without apology — from
                aromatic Indian curries and authentic Kumaoni specialities to
                continental favourites, grills, and seasonal specials. As evening
                descends, dinner moves through its courses with the unhurried
                grace of a good conversation.
              </p>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div
                className="aspect-[4/3] w-full"
                style={{ background: "linear-gradient(135deg, #1A1A17 0%, #032105 100%)" }}
              />
              <div
                className="absolute -bottom-6 -left-6 w-48 h-32 bg-[#F5EDD4] border border-[#B98F39]/40 flex items-center justify-center"
              >
                <div className="text-center">
                  <p className="font-serif text-[#032105]" style={{ fontSize: "2rem" }}>
                    2,000
                  </p>
                  <p className="text-xs tracking-widest uppercase text-[#5a5545] font-light">
                    sq ft of dining
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="section-pad bg-[#F5EDD4]">
        <div className="container-brand">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="eyebrow eyebrow-dark mb-5">At Your Table</span>
            <h2 className="heading-section">Menu Highlights</h2>
            <div className="divider-gold mx-auto" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuHighlights.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-[#FAF7F0] p-8 border-t-2 border-[#B98F39]"
              >
                <span className="text-2xl mb-4 block">{item.icon}</span>
                <h3
                  className="font-serif text-[#032105] mb-3"
                  style={{ fontSize: "1.2rem" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#5a5545] font-light leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menus Available */}
      <section className="section-dark section-pad">
        <div className="container-brand">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
              <span className="eyebrow eyebrow-light mb-5">Our Menus</span>
              <h2
                className="font-serif text-[#FAF7F0] font-light mb-5"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
              >
                Menus Available
              </h2>
              <div className="divider-gold" />
              <div className="space-y-4 mt-2">
                {menus.map((menu) => (
                  <div
                    key={menu.title}
                    className="flex items-center justify-between border-b border-[#B98F39]/20 pb-4"
                  >
                    <div>
                      <h3 className="font-serif text-[#FAF7F0] font-light" style={{ fontSize: "1.1rem" }}>
                        {menu.title}
                      </h3>
                      <p className="text-xs text-[#D4B870] font-light mt-1 tracking-wide">
                        {menu.note}
                      </p>
                    </div>
                    <span className="text-[#B98F39]">→</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }}>
              <span className="eyebrow eyebrow-light mb-5">Opening Hours</span>
              <h2
                className="font-serif text-[#FAF7F0] font-light mb-5"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
              >
                Daily Schedule
              </h2>
              <div className="divider-gold" />
              <div className="space-y-4 mt-2">
                {hours.map((item) => (
                  <div
                    key={item.meal}
                    className="flex items-center justify-between border-b border-[#B98F39]/20 pb-4"
                  >
                    <p className="text-[#D4B870] font-light text-sm">{item.meal}</p>
                    <p className="text-[#FAF7F0] font-light text-sm font-mono">
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand">
          <motion.blockquote
            {...fadeUp}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="block text-[#B98F39] mb-6" style={{ fontSize: "3.5rem", lineHeight: 1 }}>
              "
            </span>
            <p
              className="font-serif text-[#032105] font-light italic leading-relaxed"
              style={{ fontSize: "clamp(1.2rem, 2vw, 1.55rem)" }}
            >
              Every dish is a small act of love.
            </p>
            <div className="divider-gold mx-auto mt-8" />
            <p className="text-xs tracking-widest uppercase text-[#5a5545] font-light mt-3">
              Ember, Silvanza Resort
            </p>
          </motion.blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="section-gold-cream section-pad text-center">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <h2 className="heading-section mb-4">
              Reserve a Table or Enquire About Private Dining
            </h2>
            <p className="text-[#5a5545] font-light max-w-md mx-auto mb-10">
              Our team is happy to arrange a private dining experience, special
              occasion setup, or a simple dinner reservation.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Make an Enquiry
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
