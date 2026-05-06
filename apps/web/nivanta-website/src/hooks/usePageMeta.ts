import { useEffect } from "react";

type PageMeta = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: Record<string, unknown>;
};

const BASE_URL = "https://silvanzaresort.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

function setMeta(name: string, content: string, attr: "name" | "property" = "name"): void {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string): void {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setSchema(id: string, data: Record<string, unknown>): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeSchema(id: string): void {
  document.getElementById(id)?.remove();
}

export function usePageMeta({ title, description, canonical, ogImage, ogType = "website", schema }: PageMeta): void {
  useEffect(() => {
    const fullTitle = title.includes("Silvanza")
      ? title
      : `${title} — Silvanza Resort by Nivanta`;

    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:image", ogImage ?? DEFAULT_OG_IMAGE, "property");
    setMeta("og:url", canonical ? `${BASE_URL}${canonical}` : window.location.href, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage ?? DEFAULT_OG_IMAGE);

    if (canonical) setLink("canonical", `${BASE_URL}${canonical}`);

    if (schema) {
      setSchema("page-schema", schema);
    } else {
      removeSchema("page-schema");
    }

    return () => {
      removeSchema("page-schema");
    };
  }, [title, description, canonical, ogImage, ogType, schema]);
}
