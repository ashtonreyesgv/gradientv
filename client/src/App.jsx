// the whole site in one screenful.
// React Router looks at the URL and picks which view goes inside <Layout>.
// the routes aren't typed out by hand: they're built from PAGES (src/data/pages.js),
// one for every page in every language it's translated into, so /story, /es/story
// and /zh/story all land on the same <StoryView /> and it reads its words by language
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LocaleProvider } from './context/LocaleContext.jsx';
import { PAGES, pagePath } from './data/pages.js';
import ContactView from './views/ContactView.jsx';
import HomeView from './views/HomeView.jsx';
import LegalView from './views/LegalView.jsx';
import LoginView from './views/LoginView.jsx';
import NotFoundView from './views/NotFoundView.jsx';
import PortalView from './views/PortalView.jsx';
import SetPasswordView from './views/SetPasswordView.jsx';
import StoryView from './views/StoryView.jsx';
import TeamView from './views/TeamView.jsx';
import VideosView from './views/VideosView.jsx';

/** which view draws each page id */
const VIEWS = {
    home: <HomeView />,
    story: <StoryView />,
    team: <TeamView />,
    contact: <ContactView />,
    login: <LoginView />,
    setPassword: <SetPasswordView />,
    portal: <PortalView />,
    privacy: <LegalView doc="privacy" />,
    terms: <LegalView doc="terms" />,
    accessibility: <LegalView doc="accessibility" />,
    videos: <VideosView />
};

/** one <Route> for every language each of these pages is in */
function routesFor(pages) {
    return pages.flatMap((page) => page.locales.map((code) => (
        <Route key={`${code}:${page.id}`} path={pagePath(page.id, code)} element={VIEWS[page.id]} />
    )));
}

/**
 * Anything that isn't a page. The old site's addresses ended in .html
 * (/story.html, /es/index.html), so those get sent to the new address instead
 * of a 404. On Vercel this never runs, vercel.json redirects them first.
 */
function UnknownPath() {
    const { pathname } = useLocation();
    if (pathname.endsWith('.html')) {
        return <Navigate to={pathname.replace(/(\/index)?\.html$/, '') || '/'} replace />;
    }
    return <NotFoundView />;
}

export default function App() {
    return (
        <LocaleProvider>
            <Routes>
                <Route element={<Layout />}>
                    {routesFor(PAGES.filter((page) => !page.auth))}

                    {/* the pages that need to know who is signed in share one AuthProvider, so going
                        from the login page to the portal doesn't ask the server all over again.
                        everything else stays outside it: someone reading the Story page shouldn't
                        cost a trip to the server to find out they aren't a client */}
                    <Route element={<AuthProvider><Outlet /></AuthProvider>}>
                        {routesFor(PAGES.filter((page) => page.auth))}
                    </Route>

                    <Route path="*" element={<UnknownPath />} />
                </Route>
            </Routes>
        </LocaleProvider>
    );
}
