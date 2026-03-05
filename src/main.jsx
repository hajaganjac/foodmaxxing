import React from 'react';
import { createRoot } from 'react-dom/client';
import ArticleCards from './ArticleCards';
import DiscoveryCards from './DiscoveryCards';

const articleRoot = document.getElementById('article-cards-root');
if (articleRoot) {
  createRoot(articleRoot).render(
    <React.StrictMode>
      <ArticleCards />
    </React.StrictMode>
  );
}

const discoveryRoot = document.getElementById('discovery-cards-root');
if (discoveryRoot) {
  createRoot(discoveryRoot).render(
    <React.StrictMode>
      <DiscoveryCards />
    </React.StrictMode>
  );
}

// Scroll Ideas section into view and center it (from another page or in-page Ideas link)
function scrollToDiscoveries() {
  const section = document.getElementById('discoveries');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

if (window.location.hash === '#discoveries') {
  setTimeout(scrollToDiscoveries, 150);
}
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#discoveries') scrollToDiscoveries();
});
