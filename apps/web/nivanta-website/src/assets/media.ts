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
    "/images/rooms/aura/aura-05-full.webp",
    "/images/rooms/aura/aura-03-full.webp",
    "/images/rooms/aura/aura-04-full.webp",
    "/images/rooms/aura/aura-01-full.webp",
    "/images/rooms/aura/aura-02-full.webp",
  ],
  haven: [
    "/images/rooms/haven/haven-02-full.webp",
    "/images/rooms/haven/haven-03-full.webp",
    "/images/rooms/haven/haven-04-full.webp",
    "/images/rooms/haven/haven-05-full.webp",
    "/images/rooms/haven/haven-06-full.webp",
    "/images/rooms/haven/haven-01-full.webp",
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

// ── EVENTS / WEDDINGS IMAGES ─────────────────────────────
export const EVENT_IMAGES = {
  orana: [
    "/images/amenities/banquet/banquet-01-full.webp",
    "/images/amenities/banquet/banquet-02-full.webp",
    "/images/amenities/banquet/banquet-03-full.webp",
  ],
  flaura: [
    "/images/amenities/outdoor-dining/dining-07-full.webp",
    "/images/amenities/outdoor-dining/dining-05-full.webp",
    "/images/amenities/outdoor-dining/dining-11-full.webp",
    "/images/amenities/outdoor-dining/dining-12-full.webp",
  ],
  hero: "/images/amenities/banquet/banquet-01-full.webp",
};

// ── AMENITY IMAGES ────────────────────────────────────────
// Single hero image (card/tile use) + full gallery arrays for lightbox
export const AMENITY_IMAGES = {
  ember:    "/images/amenities/restaurant/restaurant-01-full.webp",
  tattva:   "/images/amenities/pool/pool-01-full.webp",
  orana:    "/images/amenities/banquet/banquet-01-full.webp",
  flaura:   "/images/amenities/outdoor-dining/dining-01-full.webp",
  security: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp",
  parking:  "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=1200&fm=webp",
};

// Full image sets for amenities with multiple real photos
export const AMENITY_GALLERY = {
  tattva: [
    "/images/amenities/pool/pool-01-full.webp",
    "/images/amenities/pool/pool-02-full.webp",
    "/images/amenities/pool/pool-03-full.webp",
  ],
  ember: [
    "/images/amenities/restaurant/restaurant-01-full.webp",
    "/images/amenities/restaurant/restaurant-02-full.webp",
    "/images/amenities/restaurant/restaurant-03-full.webp",
    "/images/amenities/restaurant/restaurant-04-full.webp",
    "/images/amenities/restaurant/restaurant-05-full.webp",
    "/images/amenities/restaurant/restaurant-06-full.webp",
    "/images/amenities/restaurant/restaurant-07-full.webp",
    "/images/amenities/restaurant/restaurant-08-full.webp",
    "/images/amenities/restaurant/restaurant-09-full.webp",
  ],
  orana: [
    "/images/amenities/banquet/banquet-01-full.webp",
    "/images/amenities/banquet/banquet-02-full.webp",
    "/images/amenities/banquet/banquet-03-full.webp",
  ],
  flaura: [
    "/images/amenities/outdoor-dining/dining-01-full.webp",
    "/images/amenities/outdoor-dining/dining-02-full.webp",
    "/images/amenities/outdoor-dining/dining-03-full.webp",
    "/images/amenities/outdoor-dining/dining-04-full.webp",
    "/images/amenities/outdoor-dining/dining-05-full.webp",
    "/images/amenities/outdoor-dining/dining-06-full.webp",
    "/images/amenities/outdoor-dining/dining-07-full.webp",
    "/images/amenities/outdoor-dining/dining-08-full.webp",
    "/images/amenities/outdoor-dining/dining-09-full.webp",
    "/images/amenities/outdoor-dining/dining-10-full.webp",
    "/images/amenities/outdoor-dining/dining-11-full.webp",
    "/images/amenities/outdoor-dining/dining-12-full.webp",
  ],
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
  lifestyle: [
    "/images/gallery/lifestyle/dji_20260407215406_0140_d.webp",
    "/images/gallery/lifestyle/dji_20260408174401_0223_d.webp",
    "/images/gallery/lifestyle/dsc01045.webp",
    "/images/gallery/lifestyle/dsc01048.webp",
    "/images/gallery/lifestyle/dsc01054.webp",
    "/images/gallery/lifestyle/dsc01097.webp",
    "/images/gallery/lifestyle/dsc06909.webp",
    "/images/gallery/lifestyle/dsc07070.webp",
    "/images/gallery/lifestyle/dsc07095.webp",
    "/images/gallery/lifestyle/dsc07113.webp",
    "/images/gallery/lifestyle/dsc07130.webp",
    "/images/gallery/lifestyle/dsc07197.webp",
    "/images/gallery/lifestyle/dsc07201.webp",
    "/images/gallery/lifestyle/dsc07206.webp",
    "/images/gallery/lifestyle/dsc07207.webp",
    "/images/gallery/lifestyle/dsc07211.webp",
    "/images/gallery/lifestyle/dsc07214.webp",
    "/images/gallery/lifestyle/dsc07218.webp",
    "/images/gallery/lifestyle/dsc07222.webp",
    "/images/gallery/lifestyle/dsc07234.webp",
    "/images/gallery/lifestyle/dsc07272.webp",
    "/images/gallery/lifestyle/dsc07355.webp",
    "/images/gallery/lifestyle/dsc07365.webp",
    "/images/gallery/lifestyle/dsc07450.webp",
    "/images/gallery/lifestyle/dsc07456.webp",
    "/images/gallery/lifestyle/dsc07459.webp",
    "/images/gallery/lifestyle/dsc07463.webp",
    "/images/gallery/lifestyle/dsc07484.webp",
    "/images/gallery/lifestyle/dsc07567-hdr.webp",
    "/images/gallery/lifestyle/dsc07570-hdr.webp",
    "/images/gallery/lifestyle/dsc07582-hdr.webp",
    "/images/gallery/lifestyle/dsc07585-hdr.webp",
    "/images/gallery/lifestyle/img_2916.webp",
    "/images/gallery/lifestyle/img_2920.webp",
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
