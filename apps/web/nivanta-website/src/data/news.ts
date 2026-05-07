import type { NewsUpdate, Stat } from "../types";

export const newsUpdates: NewsUpdate[] = [
  {
    id: "1",
    date: "Jan 25, 2026",
    dateISO: "2026-01-25",
    headline: "Silvanza Resort Opens Its Doors",
    body: "Nivanta Hospitality LLP proudly debuts its flagship property — Silvanza Resort — in Dhikuli, Ramnagar. We opened our doors on 25th January 2026, welcoming our first guests to Jim Corbett's newest luxury address.",
  },
  {
    id: "2",
    date: "Feb 1, 2026",
    dateISO: "2026-02-01",
    headline: "Fully Operational & Accepting Bookings",
    body: "Silvanza Resort by Nivanta is fully operational and accepting bookings for stays, events, and weddings through our website and all major OTA platforms. Best rates guaranteed when you book direct.",
  },
  {
    id: "3",
    date: "May 2026",
    dateISO: "2026-05-01",
    headline: "Ember Restaurant — Now Serving Daily",
    body: "Our multi-cuisine restaurant Ember is now serving à la carte dinners, lavish buffet breakfasts, and poolside refreshments daily. Bar menus and special dining experiences available on request.",
  },
];

export const stats: Stat[] = [
  { value: "4", label: "Acres of Lush Resort Grounds", icon: "🌿" },
  { value: "50", label: "Rooms Across Six Categories", icon: "🏨" },
  { value: "22,500", label: "Sq. Ft. of Event & Banquet Space", icon: "🎪" },
  { value: "24×7×365", label: "Dedicated Hospitality Service", icon: "✦" },
];
