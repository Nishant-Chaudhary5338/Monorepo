import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './index.css';
import App from './App';
import { articleMeta } from './articles/index';
import { caseStudyCoverImages } from './case-studies/covers';

// Register GSAP plugins once at the app root — components must NOT re-register
gsap.registerPlugin(ScrollTrigger);

// Inject <link rel="preload" as="image"> for the LCP cover image before React
// bootstraps — this starts the Unsplash fetch hundreds of ms earlier than waiting
// for the lazy chunk to load and React to render the <img> tag.
(function preloadLcpImage() {
  const path = window.location.pathname;
  let imgUrl: string | undefined;

  const articleSlug = path.match(/^\/writing\/([^/]+)/)?.[1];
  if (articleSlug) {
    imgUrl = articleMeta.find((a) => a.slug === articleSlug)?.coverImage;
  }

  const workSlug = path.match(/^\/work\/([^/]+)/)?.[1];
  if (workSlug) {
    imgUrl = caseStudyCoverImages[workSlug];
  }

  if (imgUrl) {
    const link = Object.assign(document.createElement('link'), {
      rel: 'preload',
      as: 'image',
      href: imgUrl,
    });
    document.head.appendChild(link);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
