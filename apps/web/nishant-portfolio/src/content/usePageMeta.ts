import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  path: string;
}

// Swaps the document title, description and canonical for a routed page and
// restores the home page values on the way out.
export function usePageMeta(meta: PageMeta | undefined): void {
  useEffect(() => {
    if (!meta) return;
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prev = {
      title: document.title,
      desc: desc?.getAttribute("content") ?? "",
      canonical: canonical?.getAttribute("href") ?? "",
    };

    document.title = `${meta.title} | Nishant Chaudhary`;
    desc?.setAttribute("content", meta.description);
    canonical?.setAttribute("href", `${import.meta.env.VITE_SITE_URL ?? ""}${meta.path}`);

    return () => {
      document.title = prev.title;
      desc?.setAttribute("content", prev.desc);
      canonical?.setAttribute("href", prev.canonical);
    };
  }, [meta]);
}
