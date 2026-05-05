import { motion } from "framer-motion";

export default function Hero(): React.JSX.Element {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop"
          alt="Silvanza Resort aerial view"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#E8CC7A] text-sm tracking-[0.35em] uppercase mb-6 font-medium"
        >
          Jim Corbett, Uttarakhand
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white leading-tight mb-4"
        >
          Luxury &amp; Nature,
          <br />
          <span className="italic text-[#E8CC7A]">in perfect harmony.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/80 text-sm sm:text-base lg:text-lg mt-5 mb-8 max-w-sm sm:max-w-md lg:max-w-xl mx-auto leading-relaxed"
        >
          A signature experience crafted especially for you at Silvanza Resort by Nivanta.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => handleScroll("#rooms")}
            className="px-8 py-4 bg-[#C9A84C] text-white text-sm font-medium tracking-widest uppercase hover:bg-[#A07830] transition-colors duration-300"
          >
            Explore Rooms
          </button>
          <button
            onClick={() => handleScroll("#contact")}
            className="px-8 py-4 border border-white text-white text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-[#1A1A1A] transition-all duration-300"
          >
            Get in Touch
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => handleScroll("#about")}
      >
        <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
