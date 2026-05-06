import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { blogPosts } from "../data/blog";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function BlogPage(): React.JSX.Element {
  usePageMeta({
    title: "Blog — Silvanza Resort Stories",
    description:
      "Stories from Silvanza Resort by Nivanta — Kumaoni cuisine, wellness travel, birthday celebrations, and Corbett nights. Jim Corbett, Uttarakhand.",
    canonical: "/blog",
  });

  return (
    <>
      {/* Hero */}
      <section
        className="section-dark relative flex items-end min-h-[52vh] overflow-hidden"
        style={{ background: "linear-gradient(150deg, #032105 0%, #253A11 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 65% 40%, #B98F39 0%, transparent 60%)",
          }}
        />
        <div className="container-brand section-pad relative z-10 pb-16">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="eyebrow eyebrow-light mb-6"
          >
            Readers' Den
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[#FAF7F0] font-light"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
          >
            Stories from<br />Silvanza &amp; Beyond
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-[#D4B870] font-light max-w-md"
          >
            Cuisine, wellness, celebrations, and the sounds of the Corbett
            forest — told from inside Silvanza.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-pad bg-[#FAF7F0]">
        <div className="container-brand">
          <div className="grid sm:grid-cols-2 gap-8">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-[#B98F39]"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[16/9] mb-6">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      loading="lazy"
                      width={800}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#B98F39] text-[#032105] text-xs font-light tracking-widest uppercase px-3 py-1">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-3">
                    <time
                      dateTime={post.dateISO}
                      className="text-xs font-light tracking-widest uppercase text-[#5a5545]"
                    >
                      {post.date}
                    </time>
                    <span className="text-[#B98F39]">·</span>
                    <span className="text-xs font-light tracking-widest uppercase text-[#5a5545]">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-serif text-[#032105] font-light mb-3 group-hover:text-[#B98F39] transition-colors duration-300"
                    style={{ fontSize: "clamp(1.2rem, 2vw, 1.5rem)" }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-[#5a5545] font-light leading-relaxed text-sm mb-5">
                    {post.excerpt}
                  </p>

                  {/* CTA */}
                  <span className="text-xs font-light tracking-widest uppercase text-[#B98F39] group-hover:text-[#032105] transition-colors duration-300">
                    Read More →
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="section-gold-cream section-pad text-center">
        <div className="container-brand">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <h2 className="heading-section mb-4">
              Experience What You've Read About
            </h2>
            <p className="text-[#5a5545] font-light max-w-md mx-auto mb-8">
              Every story in this blog is drawn from real moments at Silvanza.
              Come live yours.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Plan a Stay
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
