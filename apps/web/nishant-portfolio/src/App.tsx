import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Writing from "./sections/Writing";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { cn } from "./lib/cn";

// Article/CaseStudy are separate pages; lazy-load so their chunk (and the
// markdown toolchain) only downloads on navigation.
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));

// Coming back from a content page lands on "/#writing" or "/#work"; the router
// doesn't scroll to hashes on its own.
function useScrollToHash(): void {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);
}

const skipLink = cn(
  "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2",
  "focus:z-50 focus:bg-canvas focus:px-3 focus:py-2",
);

const HomePage = (): ReactNode => {
  useScrollToHash();
  return (
    <>
      <a href="#work" className={skipLink}>
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Experience />
        <Writing />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

const App = (): ReactNode => (
  <ThemeProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/writing/:slug" element={<Suspense fallback={null}><ArticlePage /></Suspense>} />
      <Route path="/work/:slug" element={<Suspense fallback={null}><CaseStudyPage /></Suspense>} />
    </Routes>
  </ThemeProvider>
);

export default App;
