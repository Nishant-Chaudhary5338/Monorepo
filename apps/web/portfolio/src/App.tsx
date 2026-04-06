import { ThemeProvider } from "./context/ThemeContext";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Process from "./sections/Process";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const marqueeItems = [
  "Figma", "User Research", "Procreate", "Persuasive UX · IIT Delhi",
  "Design Systems", "After Effects", "Usability Testing", "Storybook",
  "ProtoPie", "Motion Graphics", "AI-Augmented Design", "Illustrator",
  // repeat for seamless loop
  "Figma", "User Research", "Procreate", "Persuasive UX · IIT Delhi",
  "Design Systems", "After Effects", "Usability Testing", "Storybook",
  "ProtoPie", "Motion Graphics", "AI-Augmented Design", "Illustrator",
];

const App = () => (
  <ThemeProvider>
    {/* Noise texture overlay */}
    <div className="noise-overlay" aria-hidden="true" />

    {/* Custom cursor */}
    <CustomCursor />

    {/* Navigation */}
    <Navbar />

    <main>
      <Hero />

      {/* Marquee strip */}
      <div
        style={{
          background: "var(--bg-1)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "1.1rem 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "6rem",
            background: "linear-gradient(90deg, var(--bg-1), transparent)",
            zIndex: 10, pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "6rem",
            background: "linear-gradient(-90deg, var(--bg-1), transparent)",
            zIndex: 10, pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex", gap: "3rem",
            animation: "marqueeScroll 30s linear infinite",
            whiteSpace: "nowrap", width: "max-content",
          }}
        >
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color:
                  i % 3 === 0 ? "var(--purple)"
                  : i % 3 === 1 ? "var(--gold)"
                  : "var(--rose)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <About />
      <Skills />
      <Process />
      <Work />
      <Experience />
      <Contact />
    </main>

    <Footer />
  </ThemeProvider>
);

export default App;
