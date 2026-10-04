// which language the page is in, shared with every component.
// the language isn't saved anywhere, it comes from the URL: /es/... is Spanish,
// /zh/... is Chinese, everything else is English. so a link always opens in
// the language it was shared in, and each language is its own page for Google
//
// any component inside <LocaleProvider> calls useLocale() and gets:
//   locale   'en' | 'es' | 'zh'
//   t        all the words for that language (src/content)
//   to       to('story') is the link to the Story page in this language
import { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router';
import { CONTENT } from '../content/index.js';
import { localeFromPath, pagePath } from '../data/pages.js';

const LocaleContext = createContext(null);

export function useLocale() {
    const value = useContext(LocaleContext);
    if (value === null) throw new Error('useLocale must be used inside a <LocaleProvider>');
    return value;
}

export function LocaleProvider({ children }) {
    const { pathname } = useLocation();
    const locale = localeFromPath(pathname);
    const t = CONTENT[locale];

    // the footer switches language without a real page load, so <html lang> has to be kept right by hand.
    // screen readers pick their voice from it, and the Chinese font rules in gradientv.css look at it
    useEffect(() => {
        document.documentElement.lang = t.htmlLang;
    }, [t.htmlLang]);

    const value = {
        locale,
        t,
        to: (pageId) => pagePath(pageId, locale)
    };

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
