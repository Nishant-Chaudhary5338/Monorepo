import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

const stats = [
  { value: "6", label: "Room Categories" },
  { value: "18K", label: "Sq Ft Lawn" },
  { value: "500", label: "Event Capacity" },
  { value: "24/7", label: "Concierge Service" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Overview(): React.JSX.Element {
  const [ref, inView] = useInView();

  return (
    <section id="about" className="py-14 lg:py-28 bg-[#FAF8F4]">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              Welcome
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#1A1A1A] mb-6 leading-tight">
              Silvanza by Nivanta
            </h2>
            <div className="w-12 h-px bg-[#C9A84C] mb-8" />
            <p className="text-[#6B6B6B] text-lg leading-relaxed mb-6">
              Nestled at the edge of Jim Corbett National Park, Silvanza is where the untamed beauty
              of Uttarakhand meets the finest in luxury hospitality. Every detail — from the
              architecture to the cuisine — is an ode to the land it calls home.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed">
              Whether you're seeking a quiet escape, a landmark celebration, or an adventure into
              nature, Silvanza offers a world that's entirely your own. Our team is devoted — round
              the clock, every day of the year — to crafting moments you'll carry long after you
              leave.
            </p>
          </motion.div>

          {/* Image grid */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src="/images/exteriors/exterior-05-full.webp"
              alt="Resort exterior"
              loading="lazy"
              className="w-full h-56 object-cover"
            />
            <img
              src="/images/amenities/pool/pool-02-full.webp"
              alt="Pool at Silvanza"
              loading="lazy"
              className="w-full h-56 object-cover mt-8"
            />
            <img
              src="/images/amenities/restaurant/restaurant-03-full.webp"
              alt="Ember restaurant"
              loading="lazy"
              className="w-full h-56 object-cover -mt-8"
            />
            <img
              src="/images/amenities/banquet/banquet-02-full.webp"
              alt="Banquet hall"
              loading="lazy"
              className="w-full h-56 object-cover"
            />
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t border-[#E8CC7A]/40"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl lg:text-5xl text-[#C9A84C] font-semibold mb-2">
                {stat.value}
              </p>
              <p className="text-[#6B6B6B] text-sm tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
