// the dark footer on every page: the logo, three columns of links
// (the site, the legal pages, the languages) and the copyright line
import { Link, useLocation } from 'react-router';
import { useLocale } from '../../context/LocaleContext.jsx';
import { CONTENT } from '../../content/index.js';
import { LOCALES, pageFromPath, pagePath } from '../../data/pages.js';

const HEADING_CLASS = 'eyebrow text-xs font-medium uppercase tracking-[0.2em] text-chalk/50';
const LINK_CLASS = 'text-[0.95rem] text-chalk/75 transition-colors hover:text-chalk';

export default function Footer() {
    const { locale, t, to } = useLocale();
    const { pathname } = useLocation();
    const page = pageFromPath(pathname);

    /** the page you're on, in another language. if it isn't translated, that language's home page */
    function inLanguage(code) {
        return page?.locales.includes(code) ? pagePath(page.id, code) : pagePath('home', code);
    }

    const siteLinks = [
        { label: t.nav.clients, to: `${to('home')}#clients` },
        { label: t.nav.story, to: to('story') },
        { label: t.nav.team, to: to('team') },
        { label: t.nav.contact, to: to('contact') },
        { label: t.nav.login, to: to('login') }
    ];

    const legalLinks = [
        { label: t.footer.privacy, to: to('privacy') },
        { label: t.footer.terms, to: to('terms') },
        { label: t.footer.accessibility, to: to('accessibility') }
    ];

    return (
        <footer className="on-night relative overflow-hidden bg-night-warm text-chalk">
            <div className="tx tx-footer" aria-hidden="true" />

            <div className="wrap relative grid gap-10 py-14 sm:grid-cols-3 lg:grid-cols-12">
                <div className="sm:col-span-3 lg:col-span-5">
                    <Link to={to('home')} aria-label={t.nav.home} className="inline-block">
                        <img src="/images/brand/stacked_white_t.png" alt="" width="1196" height="1128" loading="lazy" className="h-24 w-auto" />
                    </Link>
                </div>

                <nav aria-label={t.footer.site} className="lg:col-span-2">
                    <h2 className={HEADING_CLASS}>{t.footer.site}</h2>
                    <ul className="mt-4 space-y-2.5">
                        {siteLinks.map((link) => (
                            <li key={link.to}><Link to={link.to} className={LINK_CLASS}>{link.label}</Link></li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label={t.footer.legal} className="lg:col-span-3">
                    <h2 className={HEADING_CLASS}>{t.footer.legal}</h2>
                    <ul className="mt-4 space-y-2.5">
                        {legalLinks.map((link) => (
                            <li key={link.to}><Link to={link.to} className={LINK_CLASS}>{link.label}</Link></li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label={t.footer.language} className="lg:col-span-2">
                    <h2 className={HEADING_CLASS}>{t.footer.language}</h2>
                    <ul className="mt-4 space-y-2.5">
                        {LOCALES.map(({ code }) => (
                            <li key={code}>
                                <Link
                                    to={inLanguage(code)}
                                    lang={CONTENT[code].htmlLang}
                                    hrefLang={CONTENT[code].hreflang}
                                    aria-current={code === locale ? 'true' : undefined}
                                    // the language you're reading is underlined as well as brighter,
                                    // so it isn't shown by color alone
                                    className={code === locale
                                        ? 'text-[0.95rem] text-chalk underline underline-offset-4'
                                        : LINK_CLASS}
                                >
                                    {CONTENT[code].languageName}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="relative border-t border-white/10">
                <p className="wrap py-5 text-sm text-chalk/60">{t.footer.copyright}</p>
            </div>
        </footer>
    );
}
