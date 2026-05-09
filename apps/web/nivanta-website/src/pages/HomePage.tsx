import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import { useInView } from "../hooks/useInView";
import Hero from "../sections/Hero";
import GoldIcon from "../components/GoldIcon";
import { rooms } from "../data/rooms";
import { amenities } from "../data/amenities";
import { testimonials } from "../data/testimonials";
import { blogPosts } from "../data/blog";
import { newsUpdates, stats } from "../data/news";
import { PROPERTY_IMAGES } from "../assets/media";

// ── lazy section components ──────────────────────────────
const BookingWidget = lazy(() => import("../sections/BookingWidget"));

// ── animation helpers ────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
} as const;

const stagger = (i: number) => ({ ...fadeUp, transition: { duration: 0.55, delay: i * 0.1 } });

// ── Inline section components ────────────────────────────

// ── Luxury SVG icons for stats strip ────────────────────
const STAT_ICONS = [
  // Leaf / nature — Acres
  <svg key="acres" viewBox="0 0 32 32" fill="none" className="w-8 h-8 mx-auto" aria-hidden="true">
    <path d="M16 28 C16 28 4 22 4 12 C4 6 10 2 16 2 C22 2 28 6 28 12 C28 22 16 28 16 28Z" stroke="#D4B870" strokeWidth="1.5" fill="none"/>
    <path d="M16 28 L16 14" stroke="#B98F39" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 20 C13 18 10 16 10 12" stroke="#A69045" strokeWidth="1" strokeLinecap="round" fill="none"/>
    <path d="M16 20 C19 18 22 16 22 12" stroke="#A69045" strokeWidth="1" strokeLinecap="round" fill="none"/>
  </svg>,
  // Key — Rooms
  <svg key="rooms" viewBox="0 0 32 32" fill="none" className="w-8 h-8 mx-auto" aria-hidden="true">
    <circle cx="11" cy="13" r="7" stroke="#D4B870" strokeWidth="1.5" fill="none"/>
    <circle cx="11" cy="13" r="3" stroke="#B98F39" strokeWidth="1" fill="none"/>
    <path d="M17 17 L28 28" stroke="#D4B870" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M24 24 L24 28 L28 28" stroke="#A69045" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // Arch / event hall — Sq Ft
  <svg key="sqft" viewBox="0 0 32 32" fill="none" className="w-8 h-8 mx-auto" aria-hidden="true">
    <path d="M4 28 L4 16 Q4 4 16 4 Q28 4 28 16 L28 28" stroke="#D4B870" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M4 28 L28 28" stroke="#B98F39" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 28 L10 18 Q10 12 16 12 Q22 12 22 18 L22 28" stroke="#A69045" strokeWidth="1" strokeLinecap="round" fill="none"/>
  </svg>,
  // Crescent + star — 24x7 service
  <svg key="service" viewBox="0 0 32 32" fill="none" className="w-8 h-8 mx-auto" aria-hidden="true">
    <circle cx="16" cy="16" r="12" stroke="#D4B870" strokeWidth="1.5" fill="none"/>
    <path d="M16 8 L16 16 L22 16" stroke="#B98F39" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="1.5" fill="#B98F39"/>
    <path d="M16 4 L16 6" stroke="#A69045" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M16 26 L16 28" stroke="#A69045" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M4 16 L6 16" stroke="#A69045" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M26 16 L28 16" stroke="#A69045" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>,
];

function StatsStrip(): React.JSX.Element {
  return (
    <section className="bg-forest-deep py-12" aria-label="Resort highlights">
      <div className="container-brand mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...stagger(i)} className="text-center">
              <div className="mb-3">{STAT_ICONS[i]}</div>
              <p className="font-serif text-4xl font-light text-gold mb-1">{s.value}</p>
              <p className="eyebrow eyebrow-light" style={{ letterSpacing: "0.18em", fontSize: "0.58rem" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WelcomeSection(): React.JSX.Element {
  const [ref, inView] = useInView();
  return (
    <section id="about" className="section-pad bg-ivory" aria-labelledby="welcome-heading">
      <div className="container-brand mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div ref={ref} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <span className="eyebrow eyebrow-dark">Welcome to Silvanza by Nivanta</span>
            <div className="divider-gold" />
            <h2 id="welcome-heading" className="heading-section mb-5">
              A Sanctuary Born from<br />Forest and Intention
            </h2>
            <p className="text-muted font-light leading-relaxed mb-4" style={{ fontSize: "0.95rem" }}>
              Silvanza — drawn from the Latin words <em className="font-serif italic text-gold-dark">Silva</em> (forest) and{" "}
              <em className="font-serif italic text-gold-dark">Anza</em> (dance of nature) — is not simply a resort. It is a
              living, breathing expression of what luxury can feel like when it is rooted in nature and guided by heart.
            </p>
            <p className="text-muted font-light leading-relaxed mb-4" style={{ fontSize: "0.95rem" }}>
              Spread across four lush acres in Dhikuli, on the cusp of Jim Corbett National Park, Silvanza Resort by Nivanta
              is the debut property of Nivanta Hospitality LLP — a brand built on the belief that every guest deserves a stay
              that leaves a mark, not just a memory.
            </p>
            <p className="text-muted font-light leading-relaxed mb-8" style={{ fontSize: "0.95rem" }}>
              Here, 50 beautifully appointed rooms across six distinctive categories open out to lawns, gardens, and the
              serene backdrop of the Kosi Valley.
            </p>
            {/* Pull quote */}
            <blockquote className="border-l-2 border-gold pl-5 mb-8">
              <p className="font-serif italic text-gold-dark text-lg leading-relaxed">
                "Luxury is not excess — it is comfort delivered with intention."
              </p>
              <cite className="text-xs text-muted not-italic tracking-wide mt-2 block">
                — Mr. Amit Trivedi, Founder, Nivanta Hospitality LLP
              </cite>
            </blockquote>
            <Link to="/about" className="btn btn-outline">Discover More About Us</Link>
          </motion.div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-3">
            {Object.values(PROPERTY_IMAGES).map((src, i) => (
              <motion.div
                key={src}
                {...stagger(i)}
                className="overflow-hidden aspect-square"
              >
                <img
                  src={src}
                  alt={`Silvanza Resort property — ${["lush grounds", "scenic lawns", "resort gardens", "natural surroundings"][i]}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  width={400}
                  height={400}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoomsPreview(): React.JSX.Element {
  return (
    <section id="rooms" className="section-pad bg-white" aria-labelledby="rooms-heading">
      <div className="container-brand mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <span className="eyebrow eyebrow-dark">Luxury Abode</span>
          <div className="divider-gold mx-auto" />
          <h2 id="rooms-heading" className="heading-section">Fifty Rooms. Six Stories. One Standard of Excellence.</h2>
          <p className="text-muted font-light max-w-2xl mx-auto mt-4" style={{ fontSize: "0.95rem" }}>
            Every room at Silvanza has been designed to be your personal retreat — a space that balances warmth with elegance, comfort with aesthetics.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {rooms.map((room, i) => (
            <motion.article key={room.id} {...stagger(i)} className="group overflow-hidden border border-gold/15">
              <Link to={`/rooms/${room.slug}`} className="block">
                <div className="overflow-hidden aspect-[4/3]">
                  <img
                    src={room.image}
                    alt={`${room.name} — ${room.view} at Silvanza Resort Jim Corbett`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    width={600}
                    height={450}
                  />
                </div>
                <div className="p-5">
                  <span className="eyebrow eyebrow-dark mb-1">{room.view}</span>
                  <h3 className="font-serif text-xl font-medium text-forest-deep mt-1 mb-1">{room.name}</h3>
                  <p className="text-xs text-muted font-light italic mb-3">{room.tagline}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features.slice(0, 4).map((f) => (
                      <span key={f} className="text-[0.6rem] tracking-wide px-2 py-0.5 border border-gold/25 text-muted">{f}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-gold-dark">
                      {room.priceLabel} <span className="text-xs text-muted font-light">/ night</span>
                    </p>
                    <span className="text-xs text-gold tracking-widest uppercase">View Room →</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link to="/rooms" className="btn btn-dark">View All Rooms & Check Availability</Link>
        </div>
      </div>
    </section>
  );
}

function AmenitiesPreview(): React.JSX.Element {
  const featured = amenities.slice(0, 4);
  return (
    <section id="amenities" className="section-pad section-gold-cream" aria-labelledby="amenities-heading">
      <div className="container-brand mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <span className="eyebrow eyebrow-dark">Our Amenities</span>
          <div className="divider-gold mx-auto" />
          <h2 id="amenities-heading" className="heading-section">A Lifestyle, Not a List</h2>
          <p className="text-muted font-light max-w-xl mx-auto mt-4" style={{ fontSize: "0.95rem" }}>
            At Silvanza, amenities are not a list — they are a lifestyle. Every facility has been curated to ensure your only task is to enjoy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {featured.map((a, i) => (
            <motion.div key={a.id} {...stagger(i)} className="flex gap-5 bg-white border border-gold/15 p-6 group hover:shadow-sm transition-shadow">
              <div className="shrink-0 flex items-center justify-center w-10 h-10"><GoldIcon name={a.icon ?? "star"} size={28} /></div>
              <div>
                <p className="eyebrow eyebrow-dark mb-1">{a.subtitle}</p>
                <h3 className="font-serif text-xl font-medium text-forest-deep mb-2">{a.name}</h3>
                <p className="text-sm text-muted font-light leading-relaxed">{a.description.slice(0, 140)}…</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/amenities" className="btn btn-outline">See Full Amenities List</Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection(): React.JSX.Element {
  return (
    <section id="testimonials" className="section-pad section-dark" aria-labelledby="testimonials-heading">
      <div className="container-brand mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <span className="eyebrow eyebrow-light">Testimonials</span>
          <div className="divider-gold mx-auto" />
          <h2 id="testimonials-heading" className="font-serif text-3xl font-light text-ivory">What Our Guests Are Saying</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {testimonials.map((t, i) => (
            <motion.blockquote key={t.id} {...stagger(i)} className="border border-gold/20 p-6 bg-forest-mid/30">
              <div className="text-gold text-2xl font-serif mb-3" aria-hidden="true">"</div>
              <p className="text-ivory/80 font-light text-sm leading-relaxed mb-5 italic font-serif">{t.quote}</p>
              <footer>
                <p className="text-gold text-sm font-medium">{t.name}</p>
                <p className="text-ivory/45 text-xs tracking-wide mt-0.5">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* Live Reviews placeholder */}
        {/* LIVE REVIEWS EMBED: Once TripAdvisor / Google Business listing is live, paste widget code here */}
        <div className="text-center">
          <a
            href="https://www.tripadvisor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-xs"
          >
            View Reviews on TripAdvisor
          </a>
        </div>
      </div>
    </section>
  );
}

function BlogPreview(): React.JSX.Element {
  return (
    <section id="blog" className="section-pad bg-ivory" aria-labelledby="blog-heading">
      <div className="container-brand mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <span className="eyebrow eyebrow-dark">Readers' Den</span>
          <div className="divider-gold mx-auto" />
          <h2 id="blog-heading" className="heading-section">Stories from Silvanza &amp; Beyond</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {blogPosts.map((post, i) => (
            <motion.article key={post.id} {...stagger(i)} className="group">
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="overflow-hidden aspect-[4/3] mb-4">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                </div>
                <span className="eyebrow eyebrow-dark mb-2">{post.category} · {post.readTime}</span>
                <h3 className="font-serif text-lg font-medium text-forest-deep mb-2 group-hover:text-gold transition-colors leading-tight">{post.title}</h3>
                <p className="text-xs text-muted font-light leading-relaxed mb-3">{post.excerpt}</p>
                <span className="text-xs text-gold tracking-widest uppercase group-hover:underline">Read More →</span>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog" className="btn btn-outline">Read All Blog Posts</Link>
        </div>
      </div>
    </section>
  );
}

function NewsSection(): React.JSX.Element {
  return (
    <section className="section-pad section-gold-cream" aria-labelledby="news-heading">
      <div className="container-brand mx-auto">
        <motion.div {...fadeUp} className="mb-10">
          <span className="eyebrow eyebrow-dark">News &amp; Events</span>
          <div className="divider-gold" />
          <h2 id="news-heading" className="heading-section">What's New at Silvanza</h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {newsUpdates.map((n, i) => (
            <motion.div key={n.id} {...stagger(i)} className="bg-white border border-gold/15 p-6">
              <time dateTime={n.dateISO} className="eyebrow eyebrow-dark mb-3 block">{n.date}</time>
              <h3 className="font-serif text-lg font-medium text-forest-deep mb-2">{n.headline}</h3>
              <p className="text-sm text-muted font-light leading-relaxed">{n.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection(): React.JSX.Element {
  const distances = [
    { place: "Dhikala Zone, Jim Corbett National Park", dist: "~5 km" },
    { place: "Ramnagar Town", dist: "~8 km" },
    { place: "Corbett Waterfall", dist: "~20 km" },
    { place: "Nainital", dist: "~65 km" },
    { place: "Delhi (New Delhi)", dist: "~290 km" },
    { place: "Pantnagar Airport (nearest)", dist: "~75 km" },
    { place: "Ramnagar Railway Station", dist: "~8 km" },
  ];

  const getHere = [
    { mode: "By Road", icon: "car", detail: "Well-connected via NH 9 from Delhi. Taxis and cabs readily available from Delhi, Dehradun, and Nainital." },
    { mode: "By Train", icon: "train", detail: "Ramnagar Railway Station is the nearest railhead with direct trains from Delhi (Kathgodam Express, Corbett Link Express)." },
    { mode: "By Air", icon: "plane", detail: "Pantnagar Airport (~75 km). Indira Gandhi International Airport, Delhi (~290 km) with onward road transfer." },
  ];

  return (
    <section id="location" className="section-pad section-dark" aria-labelledby="location-heading">
      <div className="container-brand mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <motion.div {...fadeUp}>
            <span className="eyebrow eyebrow-light">Locate Us</span>
            <div className="divider-gold" />
            <h2 id="location-heading" className="font-serif text-3xl font-light text-ivory mb-2">
              At the Gateway to Jim Corbett's Wild Heart
            </h2>
            <p className="text-ivory/55 font-light text-sm leading-relaxed mb-6">
              Village – Dhikuli, Ramnagar, Uttarakhand 244715, India
            </p>

            {/* Distances */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8">
              {distances.map((d) => (
                <li key={d.place} className="flex justify-between items-baseline gap-2 py-1.5 border-b border-white/8">
                  <span className="text-ivory/60 text-xs font-light">{d.place}</span>
                  <span className="text-gold text-xs font-medium flex-shrink-0">{d.dist}</span>
                </li>
              ))}
            </ul>

            {/* Getting here */}
            <div className="space-y-4">
              {getHere.map((g) => (
                <div key={g.mode} className="flex gap-4">
                  <GoldIcon name={g.icon} size={20} className="text-gold shrink-0" />
                  <div>
                    <p className="text-gold text-sm font-medium mb-0.5">{g.mode}</p>
                    <p className="text-ivory/50 text-xs font-light leading-relaxed">{g.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-ivory/40 text-xs font-light italic mt-5">
              Airport and railway pickup can be arranged on request — contact our concierge.
            </p>
          </motion.div>

          {/* Google Maps embed */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-col gap-4">
            <div className="flex-1 min-h-72 overflow-hidden border border-gold/20">
              <iframe
                src="https://maps.google.com/maps?q=Dhikuli,Ramnagar,Uttarakhand&t=&z=14&ie=UTF8&iwloc=&output=embed"
                title="Silvanza Resort location — Dhikuli, Ramnagar, Uttarakhand"
                width="100%"
                height="100%"
                className="w-full h-72 grayscale-30 contrast-[1.05]"
                style={{ border: 0, minHeight: "18rem" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Google Maps showing Silvanza Resort location in Dhikuli, Ramnagar"
              />
            </div>

            {/* Quick contact */}
            <div className="grid grid-cols-3 gap-3">
              {["+91 979 210 6111", "+91 979 210 7111", "+91 979 210 9111"].map((ph) => (
                <a
                  key={ph}
                  href={`tel:${ph.replace(/\s/g, "")}`}
                  className="flex flex-col items-center gap-1 p-3 border border-gold/20 text-center hover:border-gold transition-colors group"
                >
                  <span className="text-lg" aria-hidden="true">📞</span>
                  <span className="text-gold-light text-xs font-light group-hover:text-gold transition-colors">{ph}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection(): React.JSX.Element {
  return (
    <section className="py-16 bg-gold" aria-label="Newsletter subscription">
      <div className="container-brand mx-auto px-5 text-center">
        <motion.div {...fadeUp}>
          <h2 className="font-serif text-3xl font-light text-forest-deep mb-2">Stay in the Loop</h2>
          <p className="text-forest-deep/70 text-sm font-light mb-6 max-w-sm mx-auto leading-relaxed">
            Subscribe to the Silvanza Newsletter — curated stories, seasonal offers, and exclusive announcements every month.
          </p>
          <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              fetch("/", { method: "POST", body: data }).catch(() => null);
              form.reset();
            }}
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="input-brand flex-1 border-forest-deep/20"
              aria-label="Email address for newsletter"
            />
            <button type="submit" className="btn btn-dark flex-shrink-0">Subscribe</button>
          </form>
          <p className="text-forest-deep/50 text-xs mt-3">No spam. Just good things from Silvanza.</p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Main HomePage ─────────────────────────────────────────
export default function HomePage(): React.JSX.Element {
  usePageMeta({
    title: "Silvanza Resort by Nivanta — Luxury Resort Jim Corbett, Uttarakhand",
    description:
      "Silvanza Resort by Nivanta — Jim Corbett's newest luxury address. 50 rooms, pool, Ember restaurant, Orana banquet hall & Flaura lawn. Dhikuli, Ramnagar. Book from ₹10,000/night.",
    canonical: "/",
  });

  return (
    <>
      <Hero />
      <StatsStrip />
      <WelcomeSection />
      <Suspense fallback={<div className="h-64 skeleton-pulse" />}>
        <BookingWidget />
      </Suspense>
      <RoomsPreview />
      <AmenitiesPreview />
      <TestimonialsSection />
      <BlogPreview />
      <NewsSection />
      <LocationSection />
      <NewsletterSection />
    </>
  );
}
