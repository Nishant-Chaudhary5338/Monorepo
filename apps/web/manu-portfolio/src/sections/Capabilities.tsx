import { useEffect, useRef } from "react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";
import { capabilitiesCol1, capabilitiesCol2 } from "../constants/capabilities";
import type { CapabilityGroup } from "../constants/capabilities";

const CapabilityGroupBlock = ({ group }: { group: CapabilityGroup }) => (
  <div style={{ marginBottom: "0.5rem" }}>
    <p className="cap-category-header">{group.category}</p>
    {group.items.map((item, idx) => (
      <div
        key={item.name}
        className="cap-row"
        style={idx === 0 ? { borderTop: "1px solid var(--border-subtle)" } : undefined}
      >
        <span className="cap-name">{item.name}</span>
        <span className="cap-years">{item.years}</span>
      </div>
    ))}
  </div>
);

const Capabilities = () => {
  const colsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cap-row", {
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        scrollTrigger: { trigger: colsRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="capabilities" className="section">
      <div className="section-wrap">
        <TitleHeader
          num="05"
          label="CAPABILITIES"
          title="What I bring to the table."
          className="mb-10"
        />

        <div
          ref={colsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "0 4rem",
          }}
          className="lg:grid-cols-2"
        >
          <div>
            {capabilitiesCol1.map((group) => (
              <CapabilityGroupBlock key={group.category} group={group} />
            ))}
          </div>
          <div>
            {capabilitiesCol2.map((group) => (
              <CapabilityGroupBlock key={group.category} group={group} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
