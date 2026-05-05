import type { Amenity } from "../types";

export const amenities: Amenity[] = [
  {
    id: "ember",
    name: "Ember",
    subtitle: "Our Multi-Cuisine Restaurant",
    description:
      "Inspired by glocal gastronomy, Ember offers an immersive dining experience with views of the pool and manicured lawns. Every dish is a conversation between tradition and innovation.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&h=700&fit=crop",
    details: ["Multi-cuisine menu", "Pool & lawn views", "Al fresco dining", "Private dining available"],
  },
  {
    id: "tattva",
    name: "Tattva",
    subtitle: "Soothing Poolside Experience",
    description:
      "Three pools — a dedicated adult pool, a family pool, and a splash zone for children — set against a backdrop of lush greenery. The perfect retreat after a day of exploration.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&h=700&fit=crop",
    details: ["Adult pool", "Family pool", "Children's splash zone", "Poolside service"],
  },
  {
    id: "orana",
    name: "Orana",
    subtitle: "Grand Banquet Hall",
    description:
      "A 4,500 sq ft pillar-free banquet hall that transforms for weddings, corporate events, and grand celebrations. With a capacity of 500 guests, Orana is where memories are made at scale.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&h=700&fit=crop",
    details: ["4,500 sq ft", "500-person capacity", "Pillar-free design", "A/V & lighting setup"],
  },
  {
    id: "flaura",
    name: "Flaura",
    subtitle: "Sprawling Event Lawn",
    description:
      "18,000 sq ft of open-air splendour. Flaura's verdant expanse hosts garden weddings, outdoor galas, and corporate retreats under the open Uttarakhand sky.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&h=700&fit=crop",
    details: ["18,000 sq ft", "Outdoor events", "Garden weddings", "Scenic setting"],
  },
];
