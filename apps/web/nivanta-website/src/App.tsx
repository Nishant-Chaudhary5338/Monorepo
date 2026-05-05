import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Overview from "./sections/Overview";
import Rooms from "./sections/Rooms";
import Amenities from "./sections/Amenities";
import GallerySection from "./sections/GallerySection";
import Testimonials from "./sections/Testimonials";
import Events from "./sections/Events";
import Blog from "./sections/Blog";
import Newsletter from "./sections/Newsletter";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function App(): React.JSX.Element {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Rooms />
        <Amenities />
        <GallerySection />
        <Testimonials />
        <Events />
        <Blog />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
