import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

const venues = [
  {
    name: "Orana",
    type: "Banquet Hall",
    area: "4,500 sq ft",
    capacity: "500 guests",
    features: ["Pillar-free", "A/V setup", "Climate controlled", "Catering included"],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&h=500&fit=crop",
  },
  {
    name: "Flaura",
    type: "Event Lawn",
    area: "18,000 sq ft",
    capacity: "1000+ guests",
    features: ["Open-air", "Scenic backdrop", "Garden lighting", "Full event support"],
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700&h=500&fit=crop",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Events(): React.JSX.Element {
  const [ref, inView] = useInView();

  const handleContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="events" className="py-14 lg:py-28 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Celebrations & Gatherings
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4">
            Your Next Event Destination
          </h2>
          <div className="w-12 h-px bg-[#C9A84C] mx-auto mb-6" />
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Whether it's an intimate ceremony or a grand gala, Silvanza's venues set the stage for
            events that are remembered for a lifetime.
          </p>
        </motion.div>

        {/* Venue cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {venues.map((venue, i) => (
            <motion.div
              key={venue.name}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ duration: 0.8, delay: 0.15 * i }}
              className="group relative overflow-hidden"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="text-[#C9A84C] text-xs tracking-widest uppercase font-medium">
                    {venue.type}
                  </span>
                  <h3 className="font-serif text-2xl text-white mt-1">{venue.name}</h3>
                </div>
              </div>
              <div className="bg-[#2D2D2D] p-6">
                <div className="flex gap-6 mb-4 text-sm text-white/70">
                  <span>📐 {venue.area}</span>
                  <span>👥 {venue.capacity}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {venue.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs text-white/60 border border-white/20 px-3 py-1"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleContact}
            className="inline-block px-10 py-4 border border-[#C9A84C] text-[#C9A84C] text-sm font-medium tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white transition-all duration-300"
          >
            Enquire About Events
          </button>
        </motion.div>
      </div>
    </section>
  );
}
