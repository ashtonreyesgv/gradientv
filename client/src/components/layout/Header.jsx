// the bar at the top of every page: the logo, the nav, and the client login button.
// it sticks to the top and is see-through, so the page texture shows behind it.
// on a phone the nav links fold into a menu that opens under the bar
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useLocale } from '../../context/LocaleContext.jsx';
import ButtonLink from '../ui/ButtonLink.jsx';
import { CloseIcon, MenuIcon } from '../ui/Icons.jsx';

export default function Header() {
    const { t, to } = useLocale();
    const { pathname, hash } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // picking a link closes the phone menu
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname, hash]);

    // Clients isn't its own page, it's a section of the home page
    const links = [
        { label: t.nav.clients, to: `${to('home')}#clients` },
        { label: t.nav.story, to: to('story') },
        { label: t.nav.team, to: to('team') },
        { label: t.nav.contact, to: to('contact') }
    ];

    const isCurrent = (link) => link.to === pathname;

    return (
        <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
            <div className="wrap flex h-[4.75rem] items-center justify-between gap-4">
                <Link to={to('home')} aria-label={t.nav.home} className="shrink-0">
                    <img src="/images/brand/stacked_black_t.png" alt="" width="1174" height="1106" className="h-11 w-auto" />
                </Link>

                {/* ---------- wide screens: the links sit in one pill ---------- */}
                <nav aria-label={t.nav.label} className="hidden md:block">
                    <ul className="flex items-center gap-0.5 rounded-full border border-line bg-paper-bright/60 p-1">
                        {links.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    aria-current={isCurrent(link) ? 'page' : undefined}
                                    // the page you're on is filled in. hover only tints, so you can't
                                    // mistake the one you're hovering for the one you're on
                                    className={`block rounded-full px-4 py-1.5 text-sm transition-colors ${
                                        isCurrent(link)
                                            ? 'bg-ink font-medium text-paper'
                                            : 'text-ink-soft hover:bg-paper-dim hover:text-ink'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    {/* stays in the bar on a phone too: a client checking their portal shouldn't have to dig for it */}
                    <ButtonLink to={to('login')} aria-current={pathname === to('login') ? 'page' : undefined}>
                        {t.nav.login}
                    </ButtonLink>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-expanded={isMenuOpen}
                        aria-controls="phone-menu"
                        aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper-bright/60 md:hidden"
                    >
                        {isMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* ---------- phones: the same links, stacked ---------- */}
            {isMenuOpen && (
                <nav id="phone-menu" aria-label={t.nav.label} className="border-t border-line bg-paper md:hidden">
                    <ul className="wrap pb-4">
                        {links.map((link) => (
                            <li key={link.to} className="border-b border-line/70 last:border-b-0">
                                <Link
                                    to={link.to}
                                    aria-current={isCurrent(link) ? 'page' : undefined}
                                    className="block py-3.5 font-display text-xl font-medium"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}
