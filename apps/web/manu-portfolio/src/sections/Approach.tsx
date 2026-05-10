import { useEffect, useRef } from "react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";
import { approachSteps } from "../constants/approach";

const Approach = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".approach-step", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="approach" className="section section-alt">
      <div className="section-wrap">
        <TitleHeader
          num="06"
          label="APPROACH"
          title="How I run growth programs."
          className="mb-4"
        />

        <p
          className="section-body"
          style={{ maxWidth: "65ch", marginBottom: "3rem" }}
        >
          A four-step rhythm I've refined across agency, in-house, and consulting
          work. Same approach scales from a single landing-page sprint to a full
          quarterly retainer.
        </p>

        <div ref={gridRef} className="approach-grid">
          {approachSteps.map((step) => (
            <div key={step.num} className="approach-step">
              <p className="approach-step-num">{step.num}.</p>
              <p className="approach-step-title">{step.title}</p>
              <p className="approach-step-timing">{step.timing}</p>
              <p className="approach-step-body">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
