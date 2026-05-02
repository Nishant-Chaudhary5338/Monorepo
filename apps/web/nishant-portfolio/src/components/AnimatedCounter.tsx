import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { counterItems } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = () => {
  const counterRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    countersRef.current.forEach((counter, index) => {
      if (!counter) return;
      const numberElement = counter.querySelector(".counter-number") as HTMLElement | null;
      if (!numberElement) return;
      const item = counterItems[index];

      gsap.set(numberElement, { innerText: "0" });

      gsap.to(numberElement, {
        innerText: item.value,
        duration: 2.5,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: "#counter",
          start: "top center",
        },
        onComplete: () => {
          numberElement.textContent = `${item.value}${item.suffix}`;
        },
      });
    });
  }, []);

  return (
    <div id="counter" ref={counterRef} className="numbers-strip">
      {counterItems.map((item, index) => (
        <div
          key={index}
          ref={(el) => { countersRef.current[index] = el; }}
          className="num-cell"
        >
          <div className="impact-number">
            <span className="counter-number">0</span>
            <span className="impact-number" style={{ fontSize: "0.45em", verticalAlign: "super", color: "var(--text-primary)" }}>
              {item.suffix}
            </span>
          </div>
          <div className="mono-label" style={{ marginTop: "0.6rem" }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedCounter;
