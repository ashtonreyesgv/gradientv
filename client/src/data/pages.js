// every page the site has, in one list.
// App.jsx builds the routes from it, Seo.jsx builds the canonical + language
// links from it, and scripts/prerender.js writes one HTML file per page from it.
//
// adding a page: one line here, one view in src/views, one entry in VIEWS (App.jsx),
// and one line in public/sitemap.xml if search engines should find it

import { SITE_URL } from './site.js';

/** the three languages. the language is whatever the URL starts with */
export const LOCALES = [
    { code: 'en', base: '' },
    { code: 'es', base: '/es' },
    { code: 'zh', base: '/zh' }
];

const ALL = LOCALES.map((locale) => locale.code);

export const PAGES = [
    { id: 'home', path: '', locales: ALL },
    { id: 'story', path: '/story', locales: ALL },
    { id: 'team', path: '/team', locales: ALL },
    { id: 'contact', path: '/contact', locales: ALL },
    // nothing to find on a sign-in form, so it stays out of search results
    { id: 'login', path: '/login', locales: ALL, noindex: true },
    { id: 'privacy', path: '/privacy', locales: ALL },
    { id: 'terms', path: '/terms', locales: ALL },
    { id: 'accessibility', path: '/accessibility', locales: ALL },
    // not in the nav. the page still works if you know the link
    { id: 'videos', path: '/videos', locales: ['en'], noindex: true }
];

/** pagePath('story', 'es') is '/es/story', and the English home is '/' */
export function pagePath(pageId, localeCode = 'en') {
    const page = PAGES.find((candidate) => candidate.id === pageId);
    const locale = LOCALES.find((candidate) => candidate.code === localeCode);
    return `${locale.base}${page.path}` || '/';
}

/** the full address, for the tags that need one: pageUrl('story', 'es') is 'https://gradientv.com/es/story' */
export function pageUrl(pageId, localeCode = 'en') {
    return `${SITE_URL}${pagePath(pageId, localeCode)}`;
}

/** '/zh/story' is 'zh'. anything that isn't /es or /zh is English */
export function localeFromPath(pathname) {
    const match = LOCALES.find(
        (locale) => locale.base && (pathname === locale.base || pathname.startsWith(`${locale.base}/`))
    );
    return match?.code ?? 'en';
}

/** which page a URL is, or null. used by the footer to keep you on the same page when you switch language */
export function pageFromPath(pathname) {
    const localeCode = localeFromPath(pathname);
    const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
    return PAGES.find((page) => page.locales.includes(localeCode) && pagePath(page.id, localeCode) === clean) ?? null;
}
