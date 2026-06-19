import { type ReactElement } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// CSS-only overlay wipe on route change. Pure CSS keeps GSAP/Three out of the
// article/case bundles. The initial load and back/forward are "POP" navigations —
// we skip those so the wipe never fights the preloader, and only play it on PUSH.
export function RouteTransition(): ReactElement | null {
  const location = useLocation();
  const navType = useNavigationType();

  if (navType === "POP") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  return <div className="mx-route-wipe" key={location.pathname} />;
}
