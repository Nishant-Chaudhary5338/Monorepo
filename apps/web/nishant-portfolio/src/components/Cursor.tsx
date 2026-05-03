import { useEffect, useRef, useState } from "react";

const isPointerFine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  // Refs mirror state so the rAF closure always reads the latest value without stale captures
  const enlargedRef = useRef(false);
  const pos = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!isPointerFine) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const onEnter = () => { enlargedRef.current = true;  setEnlarged(true); };
    const onLeave = () => { enlargedRef.current = false; setEnlarged(false); };

    const attach = () => {
      document.querySelectorAll<HTMLElement>(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor-enlarge]"
      ).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    const detach = () => {
      document.querySelectorAll<HTMLElement>(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor-enlarge]"
      ).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };

    // rAF: only sets transform — never touched by JSX style, so no re-render conflict
    const animate = () => {
      if (dotRef.current) {
        const half = enlargedRef.current ? 16 : 4;
        dotRef.current.style.transform = `translate(${pos.current.x - half}px, ${pos.current.y - half}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    attach();

    const observer = new MutationObserver(() => { detach(); attach(); });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      detach();
      observer.disconnect();
    };
  }, []);

  if (!isPointerFine) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: enlarged ? "32px" : "8px",
        height: enlarged ? "32px" : "8px",
        borderRadius: "50%",
        backgroundColor: "var(--accent-warm)",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: visible ? (enlarged ? 0.5 : 0.85) : 0,
        mixBlendMode: enlarged ? "difference" : "normal",
        /* NO transform here — rAF owns it exclusively */
        transition: [
          "width 0.18s cubic-bezier(0.25,0.46,0.45,0.94)",
          "height 0.18s cubic-bezier(0.25,0.46,0.45,0.94)",
          "opacity 0.25s ease",
        ].join(", "),
        willChange: "transform",
      }}
    />
  );
};

export default Cursor;
