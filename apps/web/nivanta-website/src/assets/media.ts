/* ═══════════════════════════════════════════════════════
   NIVANTA RESORT — MEDIA ASSET REGISTRY
   Single source of truth for all images and videos.
   TO SWAP: replace the URL string — no structural changes needed.
   All images served locally as WebP (quality 85, max 1920 px).
═══════════════════════════════════════════════════════ */

// ── HERO VIDEO ──────────────────────────────────────────
export const HERO_VIDEO_URL = "/videos/hero.mp4";

// Hero poster: extracted frame from the property video (WebP, 1920px, quality 90)
// Preloaded in index.html <link rel="preload"> for best LCP score.
// Must match the preload URL in index.html exactly.
export const HERO_VIDEO_POSTER = "/videos/hero-poster.webp";

// ── PROPERTY IMAGES ─────────────────────────────────────
// Four overview shots from the Exteriors set (drone + ground)
export const PROPERTY_IMAGES = {
  overview1: "/images/exteriors/exterior-01-full.webp",
  overview2: "/images/exteriors/exterior-02-full.webp",
  overview3: "/images/exteriors/exterior-03-full.webp",
  overview4: "/images/exteriors/exterior-04-full.webp",
};

// ── ROOM IMAGES ──────────────────────────────────────────
// All available shots per room — index 0 is the card hero, rest shown in lightbox
export const ROOM_IMAGES = {
  apexSuites: [
    "/images/rooms/apex/apex-01-full.webp",
    "/images/rooms/apex/apex-02-full.webp",
    "/images/rooms/apex/apex-03-full.webp",
    "/images/rooms/apex/apex-04-full.webp",
    "/images/rooms/apex/apex-05-full.webp",
  ],
  aura: [
    "/images/rooms/aura/aura-01-full.webp",
    "/images/rooms/aura/aura-02-full.webp",
    "/images/rooms/aura/aura-03-full.webp",
    "/images/rooms/aura/aura-04-full.webp",
    "/images/rooms/aura/aura-05-full.webp",
  ],
  haven: [
    "/images/rooms/haven/haven-01-full.webp",
    "/images/rooms/haven/haven-02-full.webp",
    "/images/rooms/haven/haven-03-full.webp",
    "/images/rooms/haven/haven-04-full.webp",
    "/images/rooms/haven/haven-05-full.webp",
  ],
  lush: [
    "/images/rooms/lush/lush-01-full.webp",
    "/images/rooms/lush/lush-02-full.webp",
    "/images/rooms/lush/lush-03-full.webp",
    "/images/rooms/lush/lush-04-full.webp",
    "/images/rooms/lush/lush-05-full.webp",
    "/images/rooms/lush/lush-06-full.webp",
    "/images/rooms/lush/lush-07-full.webp",
    "/images/rooms/lush/lush-08-full.webp",
  ],
  breeze: [
    "/images/rooms/breeze/breeze-01-full.webp",
    "/images/rooms/breeze/breeze-02-full.webp",
    "/images/rooms/breeze/breeze-03-full.webp",
    "/images/rooms/breeze/breeze-04-full.webp",
    "/images/rooms/breeze/breeze-05-full.webp",
    "/images/rooms/breeze/breeze-06-full.webp",
  ],
  origin: [
    "/images/rooms/origin/origin-01-full.webp",
    "/images/rooms/origin/origin-02-full.webp",
    "/images/rooms/origin/origin-03-full.webp",
    "/images/rooms/origin/origin-04-full.webp",
    "/images/rooms/origin/origin-05-full.webp",
    "/images/rooms/origin/origin-06-full.webp",
    "/images/rooms/origin/origin-07-full.webp",
  ],
};

// ── AMENITY IMAGES ────────────────────────────────────────
// Thumb-size (800 px) for amenity tiles; switch to -full.webp for detail views
export const AMENITY_IMAGES = {
  ember:    "/images/amenities/restaurant/restaurant-01-thumb.webp",
  tattva:   "/images/amenities/pool/pool-01-thumb.webp",
  orana:    "/images/amenities/banquet/banquet-01-thumb.webp",
  flaura:   "/images/amenities/outdoor-dining/dining-01-thumb.webp",
  security: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp",
  parking:  "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp",
};

// ── BLOG THUMBNAILS ───────────────────────────────────────
// No blog-specific photos delivered — keeping Pexels CDN for now
const px = (id: number, w = 1200, h?: number): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}` : ""}&fm=webp`;

export const BLOG_IMAGES = {
  cuisine:      px(1640772, 800),
  wellness:     px(3822622, 800),
  birthday:     px(1729797, 800),
  corbettNight: px(210186,  800),
};

// ── GALLERY IMAGES ────────────────────────────────────────
// Thumb-size (800 px) for grid; rooms/events cross-reference real room shots
export const GALLERY_IMAGES = {
  rooms: [
    "/images/rooms/apex/apex-01-thumb.webp",
    "/images/rooms/aura/aura-01-thumb.webp",
    "/images/rooms/haven/haven-01-thumb.webp",
    "/images/rooms/lush/lush-01-thumb.webp",
    "/images/rooms/breeze/breeze-01-thumb.webp",
    "/images/rooms/origin/origin-01-thumb.webp",
  ],
  restaurant: [
    "/images/amenities/restaurant/restaurant-01-thumb.webp",
    "/images/amenities/restaurant/restaurant-02-thumb.webp",
    "/images/amenities/restaurant/restaurant-03-thumb.webp",
    "/images/amenities/restaurant/restaurant-04-thumb.webp",
  ],
  pool: [
    "/images/amenities/pool/pool-01-thumb.webp",
    "/images/amenities/pool/pool-02-thumb.webp",
    "/images/amenities/pool/pool-03-thumb.webp",
    "/images/gallery/gallery-01-thumb.webp",
  ],
  events: [
    "/images/amenities/banquet/banquet-01-thumb.webp",
    "/images/amenities/banquet/banquet-02-thumb.webp",
    "/images/amenities/banquet/banquet-03-thumb.webp",
    "/images/gallery/gallery-02-thumb.webp",
  ],
  gardens: [
    "/images/amenities/outdoor-dining/dining-01-thumb.webp",
    "/images/amenities/outdoor-dining/dining-02-thumb.webp",
    "/images/amenities/outdoor-dining/dining-03-thumb.webp",
    "/images/amenities/outdoor-dining/dining-04-thumb.webp",
  ],
};

// ── OG / SHARE IMAGE ─────────────────────────────────────
// Best aerial drone exterior shot, served at full 1920 px
// (crop to 1200×630 is handled by meta tag consumers)
export const OG_IMAGE = "/images/exteriors/exterior-01-full.webp";
