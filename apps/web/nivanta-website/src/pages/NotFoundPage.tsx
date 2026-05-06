import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NotFoundPage(): React.JSX.Element {
  usePageMeta({
    title: "Page Not Found — Silvanza Resort",
    description: "This page could not be found. Return to Silvanza Resort.",
  });

  return (
    <section
      className="section-dark relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(150deg, #032105 0%, #1A1A17 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, #B98F39 0%, transparent 65%)",
        }}
      />
      <div className="container-brand text-center relative z-10 py-24 px-5">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-gold font-light"
          style={{ fontSize: "clamp(6rem, 15vw, 12rem)", lineHeight: 1 }}
        >
          404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif text-ivory font-light mt-4 mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)" }}
        >
          The page you're looking for has wandered off<br />
          into the Corbett forest.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <Link to="/" className="btn btn-primary">Back to Home</Link>
          <Link to="/contact" className="btn btn-ghost">Contact Us</Link>
        </motion.div>
      </div>
    </section>
  );
}
