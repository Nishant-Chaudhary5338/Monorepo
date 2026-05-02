import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App';

const ArticlePage    = lazy(() => import('./pages/ArticlePage'));
const CaseStudyPage  = lazy(() => import('./pages/CaseStudyPage'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/writing/:slug" element={<Suspense fallback={null}><ArticlePage /></Suspense>} />
        <Route path="/work/:slug"    element={<Suspense fallback={null}><CaseStudyPage /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
