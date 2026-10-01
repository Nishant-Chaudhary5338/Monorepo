import { useEffect, useRef, type CSSProperties, type ReactElement } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 3D word-by-word reveal — each word starts rotated back in space
// (translate3d + rotateY/rotateX) and settles flat as it scrolls into
// view. Real CSS 3D transforms, animating only transform/opacity, so it
// stays on the compositor. Reverses when scrolled back up.
export function AnimatedTitle({ title, className, style }: { title: string; className?: string; style?: CSSProperties }): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = title.split(" ");

  useEffect(() => {
    const wordEls = Array.from(ref.current?.querySelectorAll<HTMLElement>(".mx-anim-word") ?? []);
    // Promote the words only while they animate; once settled, drop the 3D
    // transform so the text re-rasterises crisp instead of sitting in a layer.
    const promote = (on: boolean): void => {
      wordEls.forEach((el) => {
        el.style.willChange = on ? "transform, opacity" : "auto";
      });
    };
    const ctx = gsap.context(() => {
      gsap.to(".mx-anim-word", {
        opacity: 1,
        transform: "translate3d(0,0,0) rotateY(0deg) rotateX(0deg)",
        ease: "power2.inOut",
        stagger: 0.02,
        onStart: () => promote(true),
        onReverseComplete: () => promote(false),
        onComplete: () => {
          promote(false);
          wordEls.forEach((el) => { el.style.transform = "none"; });
        },
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [title]);

  return (
    <h2 ref={ref} className={`section-title mx-anim-title ${className ?? ""}`} style={style}>
      {words.map((word, i) => <span className="mx-anim-word" key={`${word}-${i}`}>{word}</span>)}
    </h2>
  );
}
