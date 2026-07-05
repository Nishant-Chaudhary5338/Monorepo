import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import CustomCursor from "./components/CustomCursor";
import { FpsMeter } from "./components/FpsMeter";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Stack from "./sections/Stack";
import About from "./sections/About";
import Writing from "./sections/Writing";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

// Article/CaseStudy are separate pages with their own top bar — lazy-load so
// their chunk (and react-markdown/remark/rehype) only downloads on navigation.
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));

const HomePage = () => (
  <>
    <Navbar />
    <FpsMeter />
    <main>
      <Hero />
      <Work />
      <Experience />
      <Stack />
      <About />
      <Writing />
      <Contact />
    </main>
    <Footer />
  </>
);

const App = () => (
  <ThemeProvider>
    <div className="noise-overlay" aria-hidden="true" />
    <CustomCursor />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/writing/:slug" element={<Suspense fallback={null}><ArticlePage /></Suspense>} />
      <Route path="/work/:slug" element={<Suspense fallback={null}><CaseStudyPage /></Suspense>} />
    </Routes>
  </ThemeProvider>
);

export default App;
