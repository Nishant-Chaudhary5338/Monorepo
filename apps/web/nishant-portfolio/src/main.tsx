import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import Cursor from './components/Cursor';
import { ThemeProvider } from './context/ThemeContext';
import { articleMeta } from './articles/index';
import { caseStudyCoverImages } from './case-studies/covers';

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

// Lazy-load all route components so Three.js/GSAP only load when actually needed
const App            = lazy(() => import('./App'));
const ArticlePage    = lazy(() => import('./pages/ArticlePage'));
const CaseStudyPage  = lazy(() => import('./pages/CaseStudyPage'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Cursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Suspense fallback={null}><App /></Suspense>} />
          <Route path="/writing/:slug" element={<Suspense fallback={null}><ArticlePage /></Suspense>} />
          <Route path="/work/:slug"    element={<Suspense fallback={null}><CaseStudyPage /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
