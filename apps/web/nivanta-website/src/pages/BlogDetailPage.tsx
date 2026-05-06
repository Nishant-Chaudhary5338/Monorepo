import { lazy, Suspense, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
import { blogPosts } from "../data/blog";

const contentMap: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  "journey-through-traditional-cuisine": lazy(
    () => import("../content/BlogCuisine")
  ),
  "stay-healthy-while-travelling": lazy(
    () => import("../content/BlogWellness")
  ),
  "celebrate-birthday-silvanza-way": lazy(
    () => import("../content/BlogBirthday")
  ),
  "live-music-corbett-nights-silvanza": lazy(
    () => import("../content/BlogCorbettNights")
  ),
};

function PostNotFound(): React.JSX.Element {
  usePageMeta({
    title: "Post Not Found — Silvanza Resort Blog",
    description: "This blog post could not be found.",
  });
  return (
    <section className="section-dark section-pad flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="font-serif text-[#D4B870]" style={{ fontSize: "1.2rem" }}>
          Post not found.
        </p>
        <Link to="/blog" className="btn btn-ghost mt-8">
          Back to Blog
        </Link>
      </div>
    </section>
  );
}

export default function BlogDetailPage(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  const relatedPosts = useMemo(
    () => blogPosts.filter((p) => p.slug !== slug).slice(0, 2),
    [slug]
  );

  const articleSchema = useMemo(() => {
    if (!post) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      datePublished: post.dateISO,
      image: post.image,
      author: {
        "@type": "Organization",
        name: "Silvanza Resort by Nivanta",
      },
      publisher: {
        "@type": "Organization",
        name: "Silvanza Resort by Nivanta",
        logo: {
          "@type": "ImageObject",
          url: "https://silvanzaresort.com/logo.png",
        },
      },
      description: post.metaDescription,
    };
  }, [post]);

  usePageMeta({
    title: post
      ? post.title
      : "Post Not Found — Silvanza Resort Blog",
    description: post ? post.metaDescription : "This blog post could not be found.",
    canonical: slug ? `/blog/${slug}` : "/blog",
    schema: articleSchema,
  });

  if (!post) return <PostNotFound />;

  const ContentComponent = slug ? contentMap[slug] : undefined;

  return (
    <>
      {/* Full-width Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: "55vh" }}>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(150deg, #032105 0%, #1A1A17 100%)" }}
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.imageAlt}
              width={1440}
              height={800}
              className="w-full h-full object-cover opacity-40"
            />
          )}
        </div>
        <div className="relative z-10 container-brand section-pad flex flex-col justify-end min-h-[55vh] pb-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
            <Link
              to="/"
              className="text-[#D4B870] hover:text-[#FAF7F0] text-xs font-light tracking-widest uppercase transition-colors"
            >
              Home
            </Link>
            <span className="text-[#B98F39] text-xs">›</span>
            <Link
              to="/blog"
              className="text-[#D4B870] hover:text-[#FAF7F0] text-xs font-light tracking-widest uppercase transition-colors"
            >
              Blog
            </Link>
            <span className="text-[#B98F39] text-xs">›</span>
            <span className="text-[#FAF7F0] text-xs font-light tracking-widest uppercase truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          <span className="bg-[#B98F39] text-[#032105] text-xs font-light tracking-widest uppercase px-3 py-1 mb-6 self-start">
            {post.category}
          </span>
          <h1
            className="font-serif text-[#FAF7F0] font-light max-w-3xl"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}
          >
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-5">
            <time
              dateTime={post.dateISO}
              className="text-xs font-light tracking-widest uppercase text-[#D4B870]"
            >
              {post.date}
            </time>
            <span className="text-[#B98F39]">·</span>
            <span className="text-xs font-light tracking-widest uppercase text-[#D4B870]">
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="section-pad bg-[#FAF7F0]">
        <div className="max-w-3xl mx-auto px-4">
          <Suspense
            fallback={
              <div className="space-y-4 py-10">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="h-4 skeleton-pulse rounded"
                    style={{ width: `${70 + (n % 3) * 10}%` }}
                  />
                ))}
              </div>
            }
          >
            {ContentComponent ? (
              <div className="blog-content">
                <ContentComponent />
              </div>
            ) : (
              <p className="text-[#5a5545] font-light">
                Content coming soon.
              </p>
            )}
          </Suspense>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-pad bg-[#F5EDD4]">
          <div className="container-brand">
            <h2
              className="font-serif text-[#032105] font-light mb-10"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
            >
              You Might Also Enjoy
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden aspect-[16/9] mb-5">
                    <img
                      src={related.image}
                      alt={related.imageAlt}
                      loading="lazy"
                      width={800}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#B98F39] text-[#032105] text-xs font-light tracking-widest uppercase px-3 py-1">
                        {related.category}
                      </span>
                    </div>
                  </div>
                  <h3
                    className="font-serif text-[#032105] font-light group-hover:text-[#B98F39] transition-colors duration-300"
                    style={{ fontSize: "1.15rem" }}
                  >
                    {related.title}
                  </h3>
                  <p className="text-[#5a5545] font-light text-sm mt-2 leading-relaxed">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link to="/blog" className="btn btn-outline">
                All Stories
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
