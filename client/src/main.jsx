import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import '@fontsource-variable/funnel-display'; // headlines. served by Vite from node_modules
import '@fontsource-variable/funnel-sans';    // everything else
import './css/gradientv.css';

const container = document.getElementById('root');

const app = (
    // StrictMode is just a development helper wrapped around the app. it draws nothing
    // on the screen and does nothing in the published version
    <StrictMode>
        {/* BrowserRouter is what lets the URL change without a real page load */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);

// two ways to start, depending on what's already in the page:
//
// on Vercel, the HTML for this exact page is already sitting inside #root, because
// scripts/prerender.js drew it at build time and stamped the div with which page it is.
// hydrate = keep that HTML and just wire up the clicks, so nothing flashes.
//
// with `npm run dev` nothing is prerendered, so React draws the page from scratch.
// same for the 404 page: its stamp never matches the address someone actually typed
const here = window.location.pathname.replace(/(.)\/$/, '$1');

if (container.dataset.prerendered === here) {
    hydrateRoot(container, app);
} else {
    clearPrerenderedHead();
    createRoot(container).render(app);
}

/**
 * When the HTML that arrived is for a different page than the one about to be
 * drawn (the 404 page), its <title> and <meta> tags are for the wrong page too.
 * prerender.js fences them between two comment markers, and this takes out
 * whatever is between them. React then adds the right ones.
 */
function clearPrerenderedHead() {
    const nodes = [...document.head.childNodes];
    const isMarker = (node, text) => node.nodeType === Node.COMMENT_NODE && node.data === text;
    const start = nodes.findIndex((node) => isMarker(node, 'page-head'));
    const end = nodes.findIndex((node) => isMarker(node, '/page-head'));
    if (start === -1 || end === -1) return;
    nodes.slice(start + 1, end).forEach((node) => node.remove());
}
