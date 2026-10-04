// the frame every page sits in: header on top, footer at the bottom,
// and <Outlet /> is the spot where React Router puts the page for the current URL
import { Outlet } from 'react-router';
import { useLocale } from '../../context/LocaleContext.jsx';
import { useScrollOnNavigate } from '../../hooks/useScrollOnNavigate.js';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function Layout() {
    const { t } = useLocale();
    useScrollOnNavigate();

    return (
        <div className="flex min-h-screen flex-col">
            {/* invisible until someone tabs to it. lets keyboard users jump past the nav */}
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
            >
                {t.nav.skip}
            </a>

            <Header />

            {/* flex-1 keeps the footer at the bottom of the window on short pages */}
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
