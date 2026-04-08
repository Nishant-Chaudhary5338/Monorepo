import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Process from "./sections/Process";
import Work from "./sections/Work";
import Creative from "./sections/Creative";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import CaseStudy from "./pages/CaseStudy";

const HomePage = () => (
  <main>
    <Hero />
    <About />
    <Work />
    <Creative />
    <Skills />
    <Process />
    <Experience />
    <Contact />
  </main>
);

const App = () => (
  <ThemeProvider>
    <div className="noise-overlay" aria-hidden="true" />
    <CustomCursor />
    <Navbar />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work/:id" element={<CaseStudy />} />
    </Routes>

    <Footer />
  </ThemeProvider>
);

export default App;
