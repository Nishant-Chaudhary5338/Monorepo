// ═══ ROOM ═══
export type Room = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  priceLabel: string;
  capacity: number;
  size: number;
  view: string;
  bedType: string;
  image: string;
  images: string[];
  features: string[];
  description: string;
};

// ═══ AMENITY ═══
export type Amenity = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  images?: string[];
  details: string[];
  icon?: string;
};

// ═══ TESTIMONIAL ═══
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

// ═══ GALLERY ═══
export type GalleryCategory = 'all' | 'rooms' | 'restaurant' | 'pool' | 'events' | 'gardens';

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, 'all'>;
  width: number;
  height: number;
};

// ═══ BLOG ═══
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  image: string;
  imageAlt: string;
  category: string;
  readTime: string;
  keywords: string[];
  metaDescription: string;
};

// ═══ NEWS UPDATE ═══
export type NewsUpdate = {
  id: string;
  date: string;
  dateISO: string;
  headline: string;
  body: string;
};

// ═══ BOOKING FORM ═══
export type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  checkin: string;
  checkout: string;
  adults: number;
  children: number;
  roomType: string;
};

// ═══ CONTACT FORM ═══
export type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  enquiryType: 'stay' | 'events' | 'corporate' | 'general';
  checkin?: string;
  checkout?: string;
  message: string;
};

// ═══ PAGE META ═══
export type PageMeta = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
};

// ═══ STAT ═══
export type Stat = {
  value: string;
  label: string;
  icon: string;
};
