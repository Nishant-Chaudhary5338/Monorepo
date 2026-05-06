import type { BlogPost } from "../types";
import { BLOG_IMAGES } from "../assets/media";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "journey-through-traditional-cuisine",
    title: "A Journey Through Traditional Cuisine at Silvanza",
    excerpt:
      "A love letter to the flavours of Kumaon and the dishes that make Ember more than just a restaurant — from bhatt ki dal to the Pahadi Mule at the bar.",
    date: "March 15, 2026",
    dateISO: "2026-03-15",
    image: BLOG_IMAGES.cuisine,
    imageAlt: "Traditional Kumaoni cuisine served at Ember restaurant, Silvanza Resort",
    category: "Dining",
    readTime: "6 min read",
    keywords: ["Kumaoni food Jim Corbett", "resort dining Ramnagar", "Ember restaurant Silvanza", "traditional Uttarakhand cuisine"],
    metaDescription: "Discover the flavours of Kumaon at Ember, Silvanza Resort's pool-view restaurant. From traditional bhatt ki dal to candlelit dinners with Kosi Valley views.",
  },
  {
    id: "2",
    slug: "stay-healthy-while-travelling",
    title: "How to Stay Healthy While Travelling — A Silvanza Guide",
    excerpt:
      "Our guide to keeping your wellness routine alive — even on a holiday. Hint: start with a poolside morning at Tattva and let the Corbett forest do the rest.",
    date: "April 2, 2026",
    dateISO: "2026-04-02",
    image: BLOG_IMAGES.wellness,
    imageAlt: "Morning wellness at Tattva pool, Silvanza Resort Jim Corbett",
    category: "Wellness",
    readTime: "7 min read",
    keywords: ["wellness travel India", "healthy travel tips", "luxury resort wellness Jim Corbett", "Silvanza Resort stay"],
    metaDescription: "Stay healthy while travelling at Silvanza Resort. Tips on morning walks in Corbett, fresh Kumaoni cuisine at Ember, and poolside recovery at Tattva.",
  },
  {
    id: "3",
    slug: "celebrate-birthday-silvanza-way",
    title: "Celebrate Your Birthday the Silvanza Way",
    excerpt:
      "From garden bonfires to candlelit terrace dinners — here is how Silvanza turns birthdays into memories that stay with you long after checkout.",
    date: "April 20, 2026",
    dateISO: "2026-04-20",
    image: BLOG_IMAGES.birthday,
    imageAlt: "Birthday celebration setup at Silvanza Resort, Jim Corbett",
    category: "Celebrations",
    readTime: "5 min read",
    keywords: ["birthday celebration Jim Corbett", "resort birthday package Ramnagar", "luxury birthday trip India", "special occasion resort Uttarakhand"],
    metaDescription: "Plan your birthday celebration at Silvanza Resort. Candlelit dinners at Ember, private terrace setups, and safari mornings in Jim Corbett National Park.",
  },
  {
    id: "4",
    slug: "live-music-corbett-nights-silvanza",
    title: "Live Music, Corbett Nights & the Magic of Silvanza",
    excerpt:
      "Why a resort experience in Jim Corbett is made even better with the right soundtrack — and how Silvanza's evenings create their own unforgettable music.",
    date: "May 5, 2026",
    dateISO: "2026-05-05",
    image: BLOG_IMAGES.corbettNight,
    imageAlt: "Evening at Flaura lawn under stars, Silvanza Resort Jim Corbett",
    category: "Experiences",
    readTime: "6 min read",
    keywords: ["things to do Jim Corbett night", "resort evening experience", "Corbett luxury stay", "Silvanza Resort Ramnagar"],
    metaDescription: "Discover evenings at Silvanza Resort — live music at Flaura lawn, candlelit dinners at Ember, golden hour at Tattva pool, and the sounds of the Corbett forest.",
  },
];
