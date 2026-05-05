import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import TestimonialCard from "../components/TestimonialCard";
import { testimonials } from "../data/testimonials";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Testimonials(): React.JSX.Element {
  const [ref, inView] = useInView();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % testimonials.length;
        scrollTo(next);
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="py-14 lg:py-28 bg-[#1A1A1A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            What Guests Say
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4">
            Moments Remembered
          </h2>
          <div className="w-12 h-px bg-[#C9A84C] mx-auto" />
        </motion.div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ scrollbarWidth: "none" }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="snap-start">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex gap-3 justify-center mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-0.5 transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-[#C9A84C]" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
