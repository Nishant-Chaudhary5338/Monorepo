import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import PageSkeleton from "./components/PageSkeleton";

// Lazy-loaded pages — each loads on demand (code splitting)
const HomePage       = lazy(() => import("./pages/HomePage"));
const AboutPage      = lazy(() => import("./pages/AboutPage"));
const RoomsPage      = lazy(() => import("./pages/RoomsPage"));
const RoomDetailPage = lazy(() => import("./pages/RoomDetailPage"));
const AmenitiesPage  = lazy(() => import("./pages/AmenitiesPage"));
const RestaurantPage = lazy(() => import("./pages/RestaurantPage"));
const EventsPage     = lazy(() => import("./pages/EventsPage"));
const GalleryPage    = lazy(() => import("./pages/GalleryPage"));
const ContactPage    = lazy(() => import("./pages/ContactPage"));
const BlogPage       = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const NotFoundPage   = lazy(() => import("./pages/NotFoundPage"));

export default function App(): React.JSX.Element {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:slug" element={<RoomDetailPage />} />
          <Route path="amenities" element={<AmenitiesPage />} />
          <Route path="restaurant" element={<RestaurantPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
