import { useRef, type ReactElement } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useGeoCV } from "../../hooks/useGeoCV";
import { MagneticButton } from "../MagneticButton";

export function Hero(): ReactElement {
  const { downloadCV, status } = useGeoCV();
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
    tl.from(".mx-hero__top > *", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 })
      .from(".mx-hero__head h1", { yPercent: 18, opacity: 0, duration: 1.1 }, "-=0.3")
      .from(".mx-hero__bot .mx-lede", { y: 24, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".mx-hero__bot .mx-cta > *", { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.5");
  }, { scope: ref });

  return (
    <section id="hero" data-morph="0" className="mx-section mx-hero" ref={ref}>
      <div className="mx-hero__top">
        <span className="mx-status"><i /> Available — Senior &amp; Staff Frontend · Remote</span>
        <span className="mx-hint">move your cursor · drag the field</span>
      </div>

      <div className="mx-hero__head">
        <h1 className="mx-display">
          Frontend that<br />feels <em>considered.</em>
        </h1>
      </div>

      <div className="mx-hero__bot">
        <p className="mx-lede">
          Senior Frontend Engineer at <b>Samsung</b> — I build product interfaces in
          React &amp; TypeScript, the design systems behind them, and the MCP tooling
          that keeps a large codebase moving fast.
        </p>
        <div className="mx-cta">
          <MagneticButton className="mx-btn mx-btn--solid" onClick={downloadCV} disabled={status === "loading"}>
            {status === "loading" ? "Detecting region…" : status === "done" ? "✓ Downloaded" : "Download CV"}
          </MagneticButton>
          <MagneticButton as="a" className="mx-btn" href="#contact">Get in touch →</MagneticButton>
        </div>
      </div>
    </section>
  );
}
