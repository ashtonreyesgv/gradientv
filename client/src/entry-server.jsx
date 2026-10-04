// the same <App /> as main.jsx, but drawn to a string of HTML instead of to the screen.
// nothing in the browser ever loads this file. `npm run build` compiles it, and
// scripts/prerender.js calls render() once for every page to make the real HTML files.
//
// StaticRouter is BrowserRouter's twin for when there is no browser: you hand it
// the address as text and it shows that page
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';

// the prerender script needs the list of pages and each language's <html lang>
export { CONTENT } from './content/index.js';
export { PAGES, pagePath } from './data/pages.js';

/** @param {string} path like '/es/story' @return {string} that page's HTML */
export function render(path) {
    return renderToString(
        <StrictMode>
            <StaticRouter location={path}>
                <App />
            </StaticRouter>
        </StrictMode>
    );
}
