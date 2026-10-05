// where an invite link lands: /set-password#<a long token>
// the client picks their own password here, so i never see it or choose it.
//
// the token sits after the # on purpose. everything after a # stays in the browser,
// it's never sent when the page is requested, so it can't end up in a server log.
// this page reads it and hands it to the server in the body of a request instead
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Seo from '../components/Seo.jsx';
import { BUTTON_STYLES } from '../components/ui/ButtonLink.jsx';
import Eyebrow from '../components/ui/Eyebrow.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocale } from '../context/LocaleContext.jsx';
import * as api from '../api/api.js';
import { pagePath } from '../data/pages.js';

const INPUT_CLASS = 'mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25';
// the server checks this too (server/src/services/passwords.js). here it just saves a round trip
const PASSWORD_MIN = 10;

export default function SetPasswordView() {
    const { t, to } = useLocale();
    const { setPassword } = useAuth();
    const { hash } = useLocation();
    const navigate = useNavigate();
    const words = t.setPassword;
    const token = hash.slice(1);

    const [invite, setInvite] = useState(null);             // { businessName, email } once the link checks out
    const [linkStatus, setLinkStatus] = useState('checking'); // 'checking' | 'good' | 'bad'
    const [password, setPasswordText] = useState('');
    const [confirm, setConfirm] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [notice, setNotice] = useState('');

    // ask the server whose link this is before showing a form
    useEffect(() => {
        // start clean, in case this is a second link opened in the same tab
        setNotice('');
        if (!token) {
            setLinkStatus('bad');
            return;
        }
        setLinkStatus('checking');
        let ignore = false;
        api.getInvite(token)
            .then((found) => {
                if (ignore) return;
                setInvite(found);
                setLinkStatus('good');
            })
            .catch((error) => {
                if (ignore) return;
                // a dead link gets the full explanation. anything else (the server is down) says what the server said
                setNotice(error.status === 404 ? words.badLink : error.message);
                setLinkStatus('bad');
            });
        return () => { ignore = true; };
    }, [token, words.badLink]);

    async function handleSubmit(event) {
        event.preventDefault();
        if (password !== confirm) {
            setNotice(words.mismatch);
            return;
        }
        setIsSending(true);
        setNotice('');
        try {
            await setPassword(token, password);
            navigate(pagePath('portal'), { replace: true });
        } catch (error) {
            setNotice(error.message);
            setIsSending(false);
        }
    }

    return (
        <>
            <Seo pageId="setPassword" title={words.seo.title} description={words.seo.description} />

            <section className="relative">
                <div className="tx tx-waves" aria-hidden="true" />

                <div className="wrap relative py-12 md:py-20">
                    <div className="mx-auto max-w-xl rounded-[2rem] border border-line bg-paper-bright p-7 shadow-[0_24px_60px_rgba(31,26,23,0.10)] sm:p-10 md:p-12">
                        <Eyebrow>{words.label}</Eyebrow>
                        <h1 className="display-lg mt-4">{words.heading}</h1>

                        {linkStatus === 'checking' && (
                            <p role="status" className="mt-6 text-ink-soft">{words.checking}</p>
                        )}

                        {linkStatus === 'bad' && (
                            <div role="alert" className="mt-6 rounded-xl border border-line bg-paper px-4 py-3 text-sm">
                                <p>{notice || words.badLink}</p>
                                <Link to={to('contact')} className="mt-2 inline-block font-medium underline underline-offset-4">
                                    {words.contact}
                                </Link>
                            </div>
                        )}

                        {linkStatus === 'good' && (
                            <>
                                <p className="mt-2 text-ink-soft">
                                    {words.introFor} <strong className="font-medium text-ink">{invite.businessName}</strong>.
                                </p>

                                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                    {/* they can't change it, but showing it as a field lets a password manager save the pair */}
                                    <div>
                                        <label htmlFor="set-email" className="text-sm font-medium">{words.email}</label>
                                        <input
                                            id="set-email"
                                            name="email"
                                            type="email"
                                            autoComplete="username"
                                            readOnly
                                            value={invite.email}
                                            className={`${INPUT_CLASS} text-ink-soft`}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="set-password" className="text-sm font-medium">{words.password}</label>
                                        <input
                                            id="set-password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            minLength={PASSWORD_MIN}
                                            value={password}
                                            onChange={(event) => { setPasswordText(event.target.value); setNotice(''); }}
                                            aria-describedby="set-hint"
                                            className={INPUT_CLASS}
                                        />
                                        <p id="set-hint" className="mt-1.5 text-sm text-ink-soft">{words.hint}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="set-confirm" className="text-sm font-medium">{words.confirm}</label>
                                        <input
                                            id="set-confirm"
                                            name="confirm"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={confirm}
                                            onChange={(event) => { setConfirm(event.target.value); setNotice(''); }}
                                            aria-describedby={notice ? 'set-notice' : undefined}
                                            className={INPUT_CLASS}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.solid} w-full cursor-pointer py-3 disabled:cursor-default disabled:opacity-60`}
                                    >
                                        {isSending ? words.sending : words.submit}
                                    </button>

                                    {notice && (
                                        <p id="set-notice" role="alert" className="rounded-xl border border-line bg-paper px-4 py-3 text-sm">
                                            {notice}
                                        </p>
                                    )}
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
