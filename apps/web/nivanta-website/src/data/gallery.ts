import type { GalleryImage } from "../types";
import { GALLERY_IMAGES } from "../assets/media";

export const galleryImages: GalleryImage[] = [
  // Rooms & Suites
  { id: "r1", src: GALLERY_IMAGES.rooms[0], alt: "Apex Suite — king bedroom with private terrace at Silvanza Resort", category: "rooms", width: 1200, height: 800 },
  { id: "r2", src: GALLERY_IMAGES.rooms[1], alt: "Aura room — pool view room at Silvanza Resort Jim Corbett", category: "rooms", width: 1200, height: 800 },
  { id: "r3", src: GALLERY_IMAGES.rooms[2], alt: "Haven room — garden sit-out at Silvanza Resort", category: "rooms", width: 1200, height: 800 },
  { id: "r4", src: GALLERY_IMAGES.rooms[3], alt: "Lush room — private balcony with garden view at Silvanza", category: "rooms", width: 1200, height: 800 },
  { id: "r5", src: GALLERY_IMAGES.rooms[4], alt: "Breeze room — interior at Silvanza Resort Ramnagar", category: "rooms", width: 1200, height: 800 },
  { id: "r6", src: GALLERY_IMAGES.rooms[5], alt: "Origin room — cosy luxury at Silvanza Resort", category: "rooms", width: 1200, height: 800 },
  // Restaurant — Ember
  { id: "d1", src: GALLERY_IMAGES.restaurant[0], alt: "Ember restaurant — dining with pool view at Silvanza Resort", category: "restaurant", width: 1200, height: 800 },
  { id: "d2", src: GALLERY_IMAGES.restaurant[1], alt: "Kumaoni cuisine at Ember restaurant, Silvanza Resort", category: "restaurant", width: 1200, height: 800 },
  { id: "d3", src: GALLERY_IMAGES.restaurant[2], alt: "Bar at Ember — cocktails and fine spirits at Silvanza", category: "restaurant", width: 1200, height: 800 },
  { id: "d4", src: GALLERY_IMAGES.restaurant[3], alt: "Al fresco dining at Ember restaurant, Silvanza Jim Corbett", category: "restaurant", width: 1200, height: 800 },
  // Pool — Tattva
  { id: "p1", src: GALLERY_IMAGES.pool[0], alt: "Tattva adults pool — Silvanza Resort Jim Corbett", category: "pool", width: 1200, height: 800 },
  { id: "p2", src: GALLERY_IMAGES.pool[1], alt: "Tattva family pool with children's splash zone, Silvanza Resort", category: "pool", width: 1200, height: 800 },
  { id: "p3", src: GALLERY_IMAGES.pool[2], alt: "Poolside lounge at Silvanza Resort, Dhikuli", category: "pool", width: 1200, height: 800 },
  { id: "p4", src: GALLERY_IMAGES.pool[3], alt: "Golden hour at Tattva pool, Silvanza Resort Ramnagar", category: "pool", width: 1200, height: 800 },
  // Banquet & Events
  { id: "e1", src: GALLERY_IMAGES.events[0], alt: "Flaura lawn — wedding celebration at Silvanza Resort", category: "events", width: 1200, height: 800 },
  { id: "e2", src: GALLERY_IMAGES.events[1], alt: "Orana banquet hall — corporate event at Silvanza Resort", category: "events", width: 1200, height: 800 },
  { id: "e3", src: GALLERY_IMAGES.events[2], alt: "Destination wedding setup at Silvanza Resort Jim Corbett", category: "events", width: 1200, height: 800 },
  { id: "e4", src: GALLERY_IMAGES.events[3], alt: "Evening celebration under stars at Flaura lawn, Silvanza", category: "events", width: 1200, height: 800 },
  // Property & Gardens
  { id: "g1", src: GALLERY_IMAGES.gardens[0], alt: "Forest surroundings near Jim Corbett National Park — Silvanza Resort", category: "gardens", width: 1200, height: 800 },
  { id: "g2", src: GALLERY_IMAGES.gardens[1], alt: "Manicured gardens at Silvanza Resort, Dhikuli Ramnagar", category: "gardens", width: 1200, height: 800 },
  { id: "g3", src: GALLERY_IMAGES.gardens[2], alt: "4-acre grounds at Silvanza Resort — lawns and landscaping", category: "gardens", width: 1200, height: 800 },
  { id: "g4", src: GALLERY_IMAGES.gardens[3], alt: "Natural landscape around Silvanza Resort — Kosi Valley, Uttarakhand", category: "gardens", width: 1200, height: 800 },
];

export const GALLERY_CATEGORY_LABELS: Record<string, string> = {
  all:        "All",
  rooms:      "Rooms & Suites",
  restaurant: "Restaurant — Ember",
  pool:       "Pool — Tattva",
  events:     "Banquet & Events",
  gardens:    "Property & Gardens",
};
