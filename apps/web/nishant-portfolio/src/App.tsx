import { lazy, Suspense } from "react";
import Navbar from "./components/NavBar";
import Hero from "./sections/Hero";
import SiteBackground from "./components/SiteBackground";
import Cursor from "./components/Cursor";
import LogoShowcase from "./sections/LogoShowcase";
import FeatureCards from "./sections/FeatureCards";
import ShowcaseSection from "./sections/ShowcaseSection";
import Experience from "./sections/Experience";
import TechStack from "./sections/TechStack";
import Writing from "./sections/Writing";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const ArchitectureSection = lazy(() => import("./sections/ArchitectureSection"));
const NowPlayingSection = lazy(() => import("./sections/NowPlayingSection"));
const ProcessPrinciples = lazy(() => import("./sections/ProcessPrinciples"));

const App = () => (
  <>
    <Cursor />
    <SiteBackground />
    <div className="dot-grid" style={{ position: "relative", zIndex: 1 }}>
    <div className="noise" aria-hidden="true" />
    <Navbar />
    <Hero />
    <LogoShowcase />
    <FeatureCards />
    <Suspense fallback={null}>
      <ArchitectureSection />
      <NowPlayingSection />
    </Suspense>
    <ShowcaseSection />
    <Experience />
    <Suspense fallback={null}>
      <ProcessPrinciples />
    </Suspense>
    <TechStack />
    <Writing />
    <Testimonials />
    <Contact />
    <Footer />
  </div>
  </>
);

export default App;
