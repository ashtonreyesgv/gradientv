// the signups card, for a client whose site has a newsletter form: how many
// people signed up, a button to copy every address, and the list itself.
// it comes from GET /api/site-data/subscribers. their site sent each one there as it happened.
//
// this list is only ever the list. it doesn't say what else a person did on the site
import { useEffect, useState } from 'react';
import { BUTTON_STYLES } from '../ui/ButtonLink.jsx';
import { useLocale } from '../../context/LocaleContext.jsx';
import * as api from '../../api/api.js';
import { shortDate } from './StatusBadge.jsx';

const FIRST_ROWS = 6;

const count = (number) => number.toLocaleString('en-US');

// viewAs is only there when i'm looking at a client's portal from the admin login
export default function NewsletterSignups({ viewAs }) {
    const { t } = useLocale();
    const words = t.portal.subscribers;

    const [signups, setSignups] = useState(null); // { total, subscribers }, null until it arrives
    const [error, setError] = useState('');
    const [showAll, setShowAll] = useState(false);
    // { text, isError }, what the copy button has to say
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        let ignore = false;
        api.getSubscribers(viewAs)
            .then((found) => {
                if (!ignore) setSignups(found);
            })
            .catch((problem) => {
                if (!ignore) setError(problem.message);
            });
        return () => { ignore = true; };
    }, [viewAs]);

    async function handleCopy() {
        try {
            // one per line. that pastes cleanly into a spreadsheet, a mailing list import, or the Bcc of an email
            await navigator.clipboard.writeText(signups.subscribers.map((subscriber) => subscriber.email).join('\n'));
            setNotice({ text: words.copied, isError: false });
        } catch {
            // some browsers only allow copying on https, or after the user says yes
            setNotice({ text: words.copyFailed, isError: true });
        }
    }

    const list = showAll ? signups?.subscribers : signups?.subscribers.slice(0, FIRST_ROWS);

    return (
        // md:col-span-2: full width of the portal's two-column grid, same as the assessments card.
        // inside, the number and the button sit on the left and the list on the right
        <section className="grid gap-x-12 rounded-[1.5rem] border border-line bg-paper-bright p-6 sm:p-8 md:col-span-2 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
                <h2 className="display-md">{words.heading}</h2>
                <p className="mt-3 text-ink-soft">{words.intro}</p>

                {error && <p role="alert" className="mt-6 rounded-xl border border-line bg-paper px-4 py-3 text-sm">{error}</p>}
                {signups === null && !error && <p role="status" className="mt-6 text-ink-soft">{words.loading}</p>}
                {signups?.total === 0 && <p className="mt-6 text-ink-soft">{words.empty}</p>}

                {signups?.total > 0 && (
                    <>
                        <dl className="mt-6">
                            <dt className="text-sm text-ink-soft">{words.total}</dt>
                            <dd className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums">{count(signups.total)}</dd>
                        </dl>

                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <button type="button" onClick={handleCopy} className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.outline} cursor-pointer`}>
                                {words.copy}
                            </button>
                            {notice && <p role={notice.isError ? 'alert' : 'status'} className="text-sm">{notice.text}</p>}
                        </div>
                    </>
                )}
            </div>

            {signups?.total > 0 && (
                <div className="mt-9 md:mt-0">
                    <h3 className="eyebrow text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">{words.listHeading}</h3>
                    <ul className="mt-2 divide-y divide-line">
                        {list.map((subscriber) => (
                            <li key={subscriber.id} className="py-3">
                                <div className="flex items-baseline justify-between gap-3">
                                    {/* break-all: an address has no spaces, so a long one would push the card wide */}
                                    <span className="min-w-0 font-medium break-all">{subscriber.email}</span>
                                    <span className="shrink-0 text-sm text-ink-soft">{shortDate(subscriber.createdAt)}</span>
                                </div>
                                {/* which page of their site the form was on: 'quick-check' reads as 'from quick check' */}
                                {subscriber.sourcePage && (
                                    <p className="mt-0.5 text-sm text-ink-soft">{words.from} {subscriber.sourcePage.replaceAll('-', ' ')}</p>
                                )}
                            </li>
                        ))}
                    </ul>

                    {signups.subscribers.length > FIRST_ROWS && (
                        <button
                            type="button"
                            aria-expanded={showAll}
                            onClick={() => setShowAll(!showAll)}
                            className="mt-4 cursor-pointer text-sm font-medium underline underline-offset-4 hover:text-accent"
                        >
                            {showAll ? words.showFewer : `${words.showAll} ${count(signups.subscribers.length)}`}
                        </button>
                    )}
                    {/* the server sends the newest 1,000 at most */}
                    {signups.total > signups.subscribers.length && (
                        <p className="mt-4 text-xs text-ink-soft">{words.newestOnly}</p>
                    )}
                </div>
            )}
        </section>
    );
}
