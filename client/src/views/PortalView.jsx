// the page behind the login: who is signed in, a way out, and the two things
// the portal is for, the request box and the site's stats
//
// the real protection is on the server (requireAuth). this page just doesn't
// bother drawing itself for someone who isn't signed in, it sends them to the form
import { lazy, Suspense, useState } from 'react';
import { Navigate } from 'react-router';
import Seo from '../components/Seo.jsx';
import RequestBox from '../components/portal/RequestBox.jsx';
import RequestInbox from '../components/portal/RequestInbox.jsx';
import { BUTTON_STYLES } from '../components/ui/ButtonLink.jsx';
import Eyebrow from '../components/ui/Eyebrow.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocale } from '../context/LocaleContext.jsx';

const CARD_CLASS = 'rounded-[1.5rem] border border-line bg-paper-bright p-6 sm:p-8';

// the stats card brings the chart library (Recharts) with it, and that's a big file.
// lazy() makes Vite put it in a separate file that the browser only downloads when
// this card is about to show, after signing in. so someone reading the public site
// never downloads a chart library they won't see
const SiteStats = lazy(() => import('../components/portal/SiteStats.jsx'));

export default function PortalView() {
    const { t, to } = useLocale();
    const { account, status, signOut } = useAuth();
    const [isLeaving, setIsLeaving] = useState(false);
    const words = t.portal;

    if (status === 'signedOut') return <Navigate to={to('login')} replace />;

    async function handleSignOut() {
        setIsLeaving(true);
        try {
            await signOut();
        } catch {
            // the server couldn't be reached, so they are still signed in. let them try again
            setIsLeaving(false);
        }
    }

    return (
        <>
            <Seo pageId="portal" title={words.seo.title} description={words.seo.description} />

            <section className="relative">
                <div className="tx tx-waves" aria-hidden="true" />

                <div className="wrap relative py-12 md:py-20">
                    <Eyebrow>{words.label}</Eyebrow>

                    {status === 'checking' ? (
                        <p role="status" className="mt-6 text-ink-soft">{words.checking}</p>
                    ) : (
                        <>
                            <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
                                <div>
                                    <h1 className="display-lg">{account.businessName}</h1>
                                    <p className="mt-2 text-ink-soft">{words.signedInAs} {account.email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    disabled={isLeaving}
                                    className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.outline} cursor-pointer disabled:cursor-default disabled:opacity-60`}
                                >
                                    {isLeaving ? words.signingOut : words.signOut}
                                </button>
                            </div>

                            {/* i get every client's requests. a client gets their own box, and their stats next to it */}
                            {account.role === 'admin' ? (
                                <div className="mt-10">
                                    <RequestInbox />
                                </div>
                            ) : (
                                <div className="mt-10 grid items-start gap-5 md:grid-cols-2">
                                    <RequestBox />
                                    {/* what shows for the moment it takes the stats file to download */}
                                    <Suspense
                                        fallback={(
                                            <section className={CARD_CLASS}>
                                                <h2 className="display-md">{words.stats.heading}</h2>
                                                <p role="status" className="mt-6 text-ink-soft">{words.stats.loading}</p>
                                            </section>
                                        )}
                                    >
                                        <SiteStats />
                                    </Suspense>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
