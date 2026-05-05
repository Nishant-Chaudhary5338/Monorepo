import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Newsletter(): React.JSX.Element {
  const [ref, inView] = useInView();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="py-14 bg-[#C9A84C]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            Stay in the Loop
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-3">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/80 mb-8 text-sm">
            Seasonal offers, new experiences, and resort updates delivered monthly.
          </p>

          {submitted ? (
            <p className="text-white font-medium text-lg py-4">
              Thank you for subscribing — we'll be in touch soon!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-5 py-3 bg-white text-[#1A1A1A] text-sm placeholder-[#9A9A9A] outline-none focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-[#1A1A1A] text-white text-sm font-medium tracking-wide hover:bg-[#2D2D2D] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
