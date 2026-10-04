// turns the built React app into one real HTML file per page.
//
// why: a plain React app ships an empty <div id="root"> and fills it in with
// JavaScript. people never notice, but link previews (iMessage, LinkedIn, Slack)
// and most AI crawlers don't run JavaScript. they would see a blank page with no
// title. so after Vite builds the app, this draws every page once, here on the
// build machine, and saves the result:
//
//     /            dist/index.html
//     /story       dist/story.html
//     /es          dist/es/index.html
//     /es/story    dist/es/story.html      ...and so on
//
// the file names match the old hand-written site on purpose. Vercel serves
// story.html at /story and redirects /story.html to it ("cleanUrls" in vercel.json).
//
// it runs as the last step of `npm run build`, after these two:
//     build:client   the normal Vite build, into dist/
//     build:server   src/entry-server.jsx compiled for Node, into dist-server/
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(clientRoot, 'dist');

const { render, CONTENT, PAGES, pagePath } = await import(pathToFileURL(path.join(clientRoot, 'dist-server/entry-server.js')));

// dist/index.html as Vite built it: the page shell with the real script and stylesheet names
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

// React writes a page's <title>, <meta> and <link> tags first, before the page itself.
// this matches that run of tags so they can be moved up into <head>
const HEAD_TAGS = /^(?:<title>[^<]*<\/title>|<meta [^>]*\/>|<link [^>]*\/>)+/;

/** one finished HTML document for the page at urlPath */
function buildPage(urlPath, htmlLang) {
    const rendered = render(urlPath);
    const head = rendered.match(HEAD_TAGS)?.[0] ?? '';
    const body = rendered.slice(head.length);

    if (!head.includes('<title>') || body.length < 500) {
        throw new Error(`prerender: ${urlPath} came out empty or without a title`);
    }

    // the replacements are functions so a "$" in the page text can't be read as a pattern
    return template
        .replace('<html lang="en">', () => `<html lang="${htmlLang}">`)
        // the two markers fence off this page's tags, so main.jsx can clear them if it ends up drawing a different page
        .replace('<!--page-head-->', () => `<!--page-head-->${head}<!--/page-head-->`)
        // data-prerendered tells main.jsx which page this HTML is, so it knows it can hydrate
        .replace('<div id="root"><!--page-body--></div>', () => `<div id="root" data-prerendered="${urlPath}">${body}</div>`);
}

/** '/' is index.html, '/es' is es/index.html (it's a language's home), '/es/story' is es/story.html */
function fileFor(urlPath, isHome) {
    if (urlPath === '/') return 'index.html';
    return isHome ? `${urlPath.slice(1)}/index.html` : `${urlPath.slice(1)}.html`;
}

async function save(file, html) {
    const target = path.join(dist, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html, 'utf8');
    console.log(`  ${file}`);
}

console.log('prerendering:');

for (const page of PAGES) {
    for (const code of page.locales) {
        const urlPath = pagePath(page.id, code);
        await save(fileFor(urlPath, page.id === 'home'), buildPage(urlPath, CONTENT[code].htmlLang));
    }
}

// Vercel shows dist/404.html (with a 404 status) for any address that isn't a file.
// '/404' isn't a page, so the router lands on the not-found view
await save('404.html', buildPage('/404', CONTENT.en.htmlLang));
