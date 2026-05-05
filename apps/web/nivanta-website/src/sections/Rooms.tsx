import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import RoomCard from "../components/RoomCard";
import { rooms } from "../data/rooms";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Rooms(): React.JSX.Element {
  const [ref, inView] = useInView();

  return (
    <section id="rooms" className="py-14 lg:py-28 bg-white">
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
            Accommodations
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#1A1A1A] mb-4">
            Our Rooms &amp; Suites
          </h2>
          <div className="w-12 h-px bg-[#C9A84C] mx-auto mb-6" />
          <p className="text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
            Six distinct categories, each designed to offer a unique lens on comfort — from the
            intimate to the extraordinary.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ duration: 0.7, delay: 0.1 * i }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </div>

        {/* Amenities note */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 p-8 bg-[#FAF8F4] border-l-2 border-[#C9A84C]"
        >
          <p className="text-[#6B6B6B] text-sm leading-relaxed">
            <span className="font-medium text-[#1A1A1A]">All rooms include:</span> Complimentary
            Wi-Fi, round-the-clock room service, free parking, power backup, in-room safe, and
            access to all resort amenities.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
