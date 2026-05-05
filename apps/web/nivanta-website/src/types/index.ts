export type Room = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  capacity: number;
  size: number;
  image: string;
  images: string[];
  features: string[];
};

export type Amenity = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  details: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: "rooms" | "dining" | "pool" | "events" | "grounds";
};

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  slug: string;
};

export type GalleryCategory = "all" | "rooms" | "dining" | "pool" | "events" | "grounds";
