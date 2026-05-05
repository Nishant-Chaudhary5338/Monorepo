import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import Gallery from "../components/Gallery";
import { galleryImages } from "../data/gallery";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function GallerySection(): React.JSX.Element {
  const [ref, inView] = useInView();

  return (
    <section id="gallery" className="py-14 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            Visual Tour
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#1A1A1A] mb-4">
            Tour Our Spaces
          </h2>
          <div className="w-12 h-px bg-[#C9A84C] mx-auto mb-6" />
          <p className="text-[#6B6B6B] max-w-md mx-auto">
            Browse through our rooms, dining spaces, pools, event venues, and the natural
            landscapes that surround Silvanza.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Gallery images={galleryImages} />
        </motion.div>
      </div>
    </section>
  );
}
