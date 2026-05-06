/* ═══════════════════════════════════════════════════════
   SILVANZA RESORT — MEDIA ASSET REGISTRY
   Single source of truth for all images and videos.
   TO SWAP: replace the URL string — no structural changes needed.
   Real photos/video arrive next session.
   All images use WebP format for optimal performance.
═══════════════════════════════════════════════════════ */

// ── HERO VIDEO ──────────────────────────────────────────
// Place client's 30-second property video at public/videos/hero.mp4
// Then this URL (/videos/hero.mp4) works automatically with no code change.
export const HERO_VIDEO_URL = "/videos/hero.mp4";

// Hero background image — Unsplash forest (WebP, 1920×1080, fetchPriority high)
// Preloaded in index.html <link rel="preload"> for best LCP score.
// Must match the preload URL in index.html exactly so the browser uses the cached version
export const HERO_VIDEO_POSTER =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1280&h=720&fit=crop&q=80&fm=webp";

// ── HELPER: Pexels WebP URL builder ──────────────────────
// Pexels CDN supports auto-format (WebP on supporting browsers) via fm=webp
const px = (id: number, w = 1200, h?: number): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}` : ""}&fm=webp`;

// ── PROPERTY IMAGES ─────────────────────────────────────
export const PROPERTY_IMAGES = {
  overview1: px(258154,  800),
  overview2: px(261102,  800),
  overview3: px(2034335, 800),
  overview4: px(189296,  800),
};

// ── ROOM IMAGES ──────────────────────────────────────────
export const ROOM_IMAGES = {
  apexSuites: [px(1743231), px(1457842), px(2029694)],
  aura:       [px(1428348), px(271624),  px(164595)],
  haven:      [px(2034335), px(237371),  px(1838554)],
  lush:       [px(262048),  px(210265),  px(1743229)],
  breeze:     [px(271618),  px(164595),  px(1457842)],
  origin:     [px(2029697), px(271624),  px(262048)],
};

// ── AMENITY IMAGES ────────────────────────────────────────
export const AMENITY_IMAGES = {
  ember:    px(262978),
  tattva:   px(261403),
  orana:    px(1395967),
  flaura:   px(169190),
  security: px(430208),
  parking:  px(1004409),
};

// ── BLOG THUMBNAILS ───────────────────────────────────────
export const BLOG_IMAGES = {
  cuisine:      px(1640772, 800),
  wellness:     px(3822622, 800),
  birthday:     px(1729797, 800),
  corbettNight: px(210186,  800),
};

// ── GALLERY IMAGES ────────────────────────────────────────
export const GALLERY_IMAGES = {
  rooms:      [px(1743231), px(1428348), px(271624),  px(2034335), px(237371),  px(1457842)],
  restaurant: [px(262978),  px(1640772), px(941861),  px(1395967)],
  pool:       [px(261403),  px(189296),  px(2034335), px(258154)],
  events:     [px(169190),  px(1395967), px(1729797), px(210186)],
  gardens:    [px(3225531), px(167699),  px(210265),  px(430208)],
};

// ── OG / SHARE IMAGE ─────────────────────────────────────
// Replace with actual designed OG image (1200×630px) once available
export const OG_IMAGE = px(3225531, 1200, 630);
