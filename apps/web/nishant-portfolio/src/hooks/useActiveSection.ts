import { useEffect, useState } from "react";

// A section counts as current once its top passes the upper third of the
// viewport, so the highlight changes as you read into it, not as it peeks in.
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState("");
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[visible.length - 1].target.id);
      },
      { rootMargin: "0px 0px -66% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
