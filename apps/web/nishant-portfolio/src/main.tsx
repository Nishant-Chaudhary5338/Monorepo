import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './index.css';
import App from './App';
import { articleMeta } from './articles/index';
import { caseStudyMeta } from './case-studies/index';
import { coverSet } from './case-studies/covers';

// Register GSAP plugins once at the app root — components must NOT re-register
gsap.registerPlugin(ScrollTrigger);

// Inject <link rel="preload" as="image"> for the LCP cover before React
// bootstraps, so the fetch starts ahead of the lazy route chunk and the render.
(function preloadLcpImage() {
  const path = window.location.pathname;
  const articleSlug = path.match(/^\/writing\/([^/]+)/)?.[1];
  const workSlug = path.match(/^\/work\/([^/]+)/)?.[1];

  let key: string | undefined;
  if (articleSlug && articleMeta.some((a) => a.slug === articleSlug)) key = articleSlug;
  if (workSlug && caseStudyMeta.some((c) => c.slug === workSlug)) key = `work-${workSlug}`;
  if (!key) return;

  const cover = coverSet(key);
  const link = Object.assign(document.createElement('link'), {
    rel: 'preload',
    as: 'image',
    href: cover.src,
    imageSrcset: cover.srcSet,
    imageSizes: cover.sizes,
  });
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
