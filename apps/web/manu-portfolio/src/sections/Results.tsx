import { useEffect, useRef } from "react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";
import AnimatedCounter from "../components/AnimatedCounter";
import { results } from "../constants/results";

const Results = () => {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".result-item", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        scrollTrigger: { trigger: stripRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="results" className="section section-alt">
      <div className="section-wrap">
        <TitleHeader
          num="04"
          label="SELECTED RESULTS"
          title="Numbers earned. Not numbers borrowed."
          className="mb-6"
        />

        <p
          className="section-body"
          style={{ maxWidth: "60ch", marginBottom: "3rem" }}
        >
          A handful of headline outcomes from the last 5 years across DTC, B2B,
          and personal brand work. Specific clients are protected by NDA — happy
          to walk through campaign mechanics on a call.
        </p>

        <div ref={stripRef} className="results-row">
          {results.map((item) => (
            <div key={item.value} className="result-item">
              <span className="result-context">{item.context}</span>
              <span className="result-value">
                {/* prefix sign stays static, counter animates the number, suffix stays static */}
                {item.value.startsWith("+") ? "+" : ""}
                <AnimatedCounter
                  to={item.numericPart}
                  suffix={item.suffix}
                  duration={1500}
                />
              </span>
              <span className="result-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
