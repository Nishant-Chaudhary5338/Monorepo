import type { Amenity } from "../types";
import { AMENITY_IMAGES, AMENITY_GALLERY } from "../assets/media";

export const amenities: Amenity[] = [
  {
    id: "tattva",
    name: "Tattva",
    subtitle: "Soothing Poolside Experience",
    icon: "pool",
    description:
      "Tattva — meaning 'essence' — is the living heart of Silvanza's outdoor experience. Our pool area features a dedicated adults' pool alongside a family pool with a specially designed children's section — so the little ones can splash freely while parents relax nearby. The pool deck is lined with sunbeds and opens to the resort's lawns, making it the most coveted spot on the property from noon till the golden hour.",
    image: AMENITY_IMAGES.tattva,
    images: AMENITY_GALLERY.tattva,
    details: [
      "Dedicated adults' pool",
      "Family pool with children's splash zone",
      "Sunbeds & poolside lounge",
      "Poolside refreshments & service",
      "One of the finest pool facilities in the Jim Corbett belt",
    ],
  },
  {
    id: "ember",
    name: "Ember",
    subtitle: "A Multi-Cuisine Dining Experience",
    icon: "restaurant",
    description:
      "Named for the warmth that good food and good company create, Ember is Silvanza's 2,000 sq ft pool and lawn-view multi-cuisine restaurant. Our kitchen celebrates the global palate — from aromatic Indian curries and Kumaoni specialities to continental favourites, grills, and à la carte indulgences. As evening descends and the valley turns gold, sit down to a dinner that moves slowly through courses and conversation.",
    image: AMENITY_IMAGES.ember,
    images: AMENITY_GALLERY.ember,
    details: [
      "Lavish buffet breakfast daily",
      "À la carte Indian, continental & world cuisine",
      "Pool & Kosi Valley view setting",
      "Private dining on request",
      "2,000 sq ft restaurant space",
    ],
  },
  {
    id: "orana",
    name: "Orana",
    subtitle: "Grand Banquet Hall — 4,500 Sq. Ft. of Celebration",
    icon: "banquet",
    description:
      "Named from a word meaning 'welcoming sanctuary', Orana is our fully air-conditioned indoor banquet hall capable of accommodating up to 300 guests in theatre-style seating. Finished in elegant décor with premium AV infrastructure, adaptive lighting, and dedicated event support, Orana is the ideal venue for weddings, receptions, corporate conferences, product launches, and private gatherings that demand nothing short of perfection.",
    image: AMENITY_IMAGES.orana,
    images: AMENITY_GALLERY.orana,
    details: [
      "4,500 sq ft pillar-free hall",
      "Up to 300 guests (theatre-style)",
      "Fully air-conditioned",
      "Premium AV & adaptive lighting",
      "Dedicated event coordination team",
      "Customisable décor & lighting packages",
    ],
  },
  {
    id: "flaura",
    name: "Flaura",
    subtitle: "Celebration Lawn — 18,000 Sq. Ft. Under Open Skies",
    icon: "lawn",
    description:
      "Flaura is where Corbett's sky becomes part of your celebration. Our sprawling 18,000 sq ft banquet lawn — with an additional 4,000 sq ft overflow lawn — can host up to 500 guests and is surrounded by landscaping that draws from the forest aesthetics of Kumaon. Whether you are envisioning a candlelit wedding under the stars or a vibrant corporate evening event, Flaura transforms every gathering into a grand tableau.",
    image: AMENITY_IMAGES.flaura,
    images: AMENITY_GALLERY.flaura,
    details: [
      "18,000 sq ft open-air lawn",
      "4,000 sq ft additional overflow lawn",
      "Up to 500 guests",
      "Garden weddings & outdoor galas",
      "Scenic Kumaon forest backdrop",
      "Ample parking for large groups",
    ],
  },
  {
    id: "security",
    name: "Safe & Sound",
    subtitle: "Your Peace of Mind, Our Priority",
    icon: "shield",
    description:
      "Silvanza is managed and operated by Nivanta Hospitality LLP to the highest standards of guest safety and professional hospitality. The property features comprehensive security infrastructure and round-the-clock service, so you can relax knowing you are always in safe hands.",
    image: AMENITY_IMAGES.security,
    details: [
      "30+ CCTV cameras across the property",
      "24×7×365 on-site security",
      "Round-the-clock front desk & concierge",
      "Comprehensive power backup",
      "Professional Nivanta hospitality protocols",
    ],
  },
  {
    id: "parking",
    name: "Free Parking",
    subtitle: "Arrive Without a Worry",
    icon: "car",
    description:
      "Silvanza offers ample complimentary parking for all guests — including space for larger vehicles and group arrivals. Whether you arrive by car, coach, or caravan, we have the space to welcome you.",
    image: AMENITY_IMAGES.parking,
    details: [
      "Complimentary for all guests",
      "Space for large vehicles & coaches",
      "Group arrival parking",
      "24-hour monitored parking area",
    ],
  },
];
