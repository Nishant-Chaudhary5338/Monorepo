import Testimonials from "./sections/Testimonials";
import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Writing from "./sections/Writing";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import Navbar from "./components/NavBar";

const App = () => (
  <>
    <Navbar />
    <Hero />
    <TechStack />
    <ShowcaseSection />
    <Experience />
    <Writing />
    <Testimonials />
    <Contact />
    <Footer />
  </>
);

export default App;
