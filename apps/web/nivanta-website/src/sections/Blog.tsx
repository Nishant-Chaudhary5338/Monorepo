import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";
import { blogPosts } from "../data/blog";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Blog(): React.JSX.Element {
  const [ref, inView] = useInView();

  return (
    <section className="py-14 lg:py-28 bg-[#FAF8F4]">
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
            News &amp; Stories
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-[#1A1A1A] mb-4">
            From the Resort
          </h2>
          <div className="w-12 h-px bg-[#C9A84C] mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ duration: 0.7, delay: 0.1 * i }}
              className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="overflow-hidden h-52">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <p className="text-[#C9A84C] text-xs tracking-wide mb-3">{post.date}</p>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-3 leading-snug group-hover:text-[#C9A84C] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed mb-5">{post.excerpt}</p>
                <button className="text-sm font-medium text-[#C9A84C] hover:text-[#A07830] transition-colors tracking-wide flex items-center gap-2">
                  Read More
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
