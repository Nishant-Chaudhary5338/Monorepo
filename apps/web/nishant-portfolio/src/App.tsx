import "./redesign/redesign.css";
import { useEffect, type ReactElement } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "./redesign/useLenis";
import { useMorph } from "./redesign/useMorph";
import { useReveal } from "./redesign/useReveal";
import { MorphField } from "./redesign/MorphField";
import { Preloader } from "./redesign/Preloader";
import { ScrollProgress } from "./redesign/ScrollProgress";
import { Nav } from "./redesign/Nav";
import { Hero } from "./redesign/sections/Hero";
import { Work } from "./redesign/sections/Work";
import { Experience } from "./redesign/sections/Experience";
import { Stack } from "./redesign/sections/Stack";
import { About } from "./redesign/sections/About";
import { Writing } from "./redesign/sections/Writing";
import { Contact } from "./redesign/sections/Contact";
import { Footer } from "./redesign/sections/Footer";

const App = (): ReactElement => {
  const lenis = useLenis();
  useMorph();
  useReveal();

  // trigger positions depend on final layout — settle them after first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mx-root">
      <Preloader />
      <ScrollProgress />
      <MorphField />
      <Nav lenis={lenis} />
      <main className="mx-content">
        <Hero />
        <Work />
        <Experience />
        <Stack />
        <About />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
