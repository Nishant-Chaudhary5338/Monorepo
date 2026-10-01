import { useEffect } from "react";

const SELECTOR = ".product-card-float, .exp-node--current, .hero-scroll, .mesh-bg";
const PAUSED_CLASS = "is-offscreen";

// Pauses the always-running CSS animations while they are scrolled out of
// view. Elements that mount later (route changes, lazy sections) are picked
// up by a MutationObserver on the app root.
export function usePauseOffscreenAnimations(): void {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle(PAUSED_CLASS, !entry.isIntersecting);
      }
    }, { rootMargin: "80px" });

    const observe = (root: ParentNode): void => {
      root.querySelectorAll(SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };

    const host = document.getElementById("root") ?? document.body;
    observe(host);

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(SELECTOR) && !seen.has(node)) {
            seen.add(node);
            io.observe(node);
          }
          observe(node);
        });
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          const gone = node.matches(SELECTOR) ? [node] : [];
          gone.push(...node.querySelectorAll(SELECTOR));
          for (const el of gone) {
            io.unobserve(el);
            seen.delete(el);
          }
        });
      }
    });
    mo.observe(host, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}
