// the client login page.
// the form hands the email and password to the server (through AuthContext and api.js).
// a yes comes back with a session cookie, and the portal opens. a no comes back
// with a sentence to show under the form
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Seo from '../components/Seo.jsx';
import { BUTTON_STYLES } from '../components/ui/ButtonLink.jsx';
import Eyebrow from '../components/ui/Eyebrow.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import { PORTAL_CLOSED } from '../api/api.js';
import { pagePath } from '../data/pages.js';

const INPUT_CLASS = 'mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25';

export default function LoginView() {
    const { t, to } = useLocale();
    const { status, signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [notice, setNotice] = useState('');

    // signed in, whether just now or from an earlier visit: go straight to the portal.
    // pagePath and not to(), because the portal is English only for now
    useEffect(() => {
        if (status === 'signedIn') navigate(pagePath('portal'), { replace: true });
    }, [status, navigate]);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSending(true);
        setNotice('');
        try {
            await signIn(email, password);
        } catch (error) {
            // "the portal isn't open" gets said in the reader's language. anything else is the server's own message
            setNotice(error.status === PORTAL_CLOSED ? t.login.notOpen : error.message);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <>
            <Seo pageId="login" title={t.login.seo.title} description={t.login.seo.description} />

            <section className="relative">
                <div className="tx tx-waves" aria-hidden="true" />

                <div className="wrap relative py-12 md:py-20">
                    <div className="grid overflow-hidden rounded-[2rem] border border-line bg-paper-bright shadow-[0_24px_60px_rgba(31,26,23,0.10)] md:grid-cols-2">

                        {/* ---------- the form. first in the code so the page heading comes first,
                             but drawn on the right on wide screens ---------- */}
                        <div className="p-7 sm:p-10 md:order-2 md:p-12">
                            <h1 className="display-lg">{t.login.heading}</h1>
                            <p className="mt-2 text-ink-soft">{t.login.intro}</p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label htmlFor="login-email" className="text-sm font-medium">{t.login.email}</label>
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        autoComplete="username"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        required
                                        value={email}
                                        onChange={(event) => { setEmail(event.target.value); setNotice(''); }}
                                        aria-describedby={notice ? 'login-notice' : undefined}
                                        className={INPUT_CLASS}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="login-password" className="text-sm font-medium">{t.login.password}</label>
                                    <input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(event) => { setPassword(event.target.value); setNotice(''); }}
                                        aria-describedby={notice ? 'login-notice' : undefined}
                                        className={INPUT_CLASS}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.solid} w-full cursor-pointer py-3 disabled:cursor-default disabled:opacity-60`}
                                >
                                    {isSending ? t.login.sending : t.login.submit}
                                </button>

                                {notice && (
                                    <div id="login-notice" role="alert" className="rounded-xl border border-line bg-paper px-4 py-3 text-sm">
                                        <p>{notice}</p>
                                        <Link to={to('contact')} className="mt-2 inline-block font-medium underline underline-offset-4">
                                            {t.login.contact}
                                        </Link>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* ---------- what the portal is ---------- */}
                        <div className="on-night relative overflow-hidden bg-night p-7 text-chalk sm:p-10 md:order-1 md:p-12">
                            <div className="tx tx-oculus" aria-hidden="true" />
                            <div className="relative flex h-full flex-col">
                                <img src="/images/brand/mark_white_t.png" alt="" width="845" height="689" className="h-auto w-14" />
                                <div className="mt-10 md:mt-auto md:pt-24">
                                    <Eyebrow onNight>{t.login.label}</Eyebrow>
                                    <h2 className="display-md mt-4 max-w-[16ch]">{t.login.pitchHeading}</h2>
                                    <p className="mt-4 max-w-[34ch] text-chalk/75">{t.login.pitchText}</p>
                                    <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-xs font-medium">
                                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-chalk" />
                                        {t.login.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
