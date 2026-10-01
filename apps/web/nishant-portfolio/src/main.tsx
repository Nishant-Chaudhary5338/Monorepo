import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { articleMeta } from './articles/index';
import { caseStudyCoverImages } from './case-studies/covers';

// Preload the LCP cover image before React boots, so the Unsplash fetch starts
// hundreds of ms before the lazy chunk would render the <img>.
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
