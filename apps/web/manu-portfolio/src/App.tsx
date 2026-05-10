import { ThemeProvider } from "./context/ThemeContext";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Results from "./sections/Results";
import Capabilities from "./sections/Capabilities";
import Approach from "./sections/Approach";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const App = () => (
  <ThemeProvider>
    <div className="noise-overlay" aria-hidden="true" />
    <CustomCursor />
    <Navbar />

    <main>
      <Hero />
      <About />
      <Experience />
      <Results />
      <Capabilities />
      <Approach />
      <Contact />
    </main>

    <Footer />
  </ThemeProvider>
);

export default App;
