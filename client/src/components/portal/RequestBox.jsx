// the request box: a client writes what they want changed, and under it sees
// everything they've sent with where each one stands.
// they can't see anyone else's. the server only ever hands back the ones that are theirs
import { useEffect, useState } from 'react';
import { BUTTON_STYLES } from '../ui/ButtonLink.jsx';
import { useLocale } from '../../context/LocaleContext.jsx';
import * as api from '../../api/api.js';
import StatusBadge, { shortDate } from './StatusBadge.jsx';

// the server stops at the same number (server/src/models/ChangeRequest.js)
const MESSAGE_MAX = 2000;

export default function RequestBox() {
    const { t } = useLocale();
    const words = t.portal.requests;

    const [requests, setRequests] = useState(null); // null until the list arrives
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    // { text, isError }. errors are read out right away, "sent" politely
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        let ignore = false;
        api.listRequests()
            .then((list) => {
                if (!ignore) setRequests(list);
            })
            .catch((error) => {
                if (ignore) return;
                setRequests([]);
                setNotice({ text: error.message, isError: true });
            });
        return () => { ignore = true; };
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSending(true);
        setNotice(null);
        try {
            const created = await api.createRequest(message);
            // newest goes on top, same order the server uses
            setRequests((list) => [created, ...list]);
            setMessage('');
            setNotice({ text: words.sent, isError: false });
        } catch (error) {
            setNotice({ text: error.message, isError: true });
        } finally {
            setIsSending(false);
        }
    }

    return (
        <section className="rounded-[1.5rem] border border-line bg-paper-bright p-6 sm:p-8">
            <h2 className="display-md">{words.heading}</h2>
            <p className="mt-3 text-ink-soft">{words.intro}</p>

            <form onSubmit={handleSubmit} className="mt-6">
                <label htmlFor="request-message" className="text-sm font-medium">{words.label}</label>
                <textarea
                    id="request-message"
                    name="message"
                    rows={4}
                    required
                    maxLength={MESSAGE_MAX}
                    placeholder={words.placeholder}
                    value={message}
                    onChange={(event) => { setMessage(event.target.value); setNotice(null); }}
                    className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-ink outline-none placeholder:text-ink-mute focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <button
                        type="submit"
                        disabled={isSending}
                        className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.solid} cursor-pointer disabled:cursor-default disabled:opacity-60`}
                    >
                        {isSending ? words.sending : words.submit}
                    </button>
                    {notice && (
                        <p role={notice.isError ? 'alert' : 'status'} className="text-sm">{notice.text}</p>
                    )}
                </div>
            </form>

            <h3 className="eyebrow mt-9 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">{words.listHeading}</h3>
            {requests === null && <p role="status" className="mt-3 text-ink-soft">{words.loading}</p>}
            {requests?.length === 0 && <p className="mt-3 text-ink-soft">{words.empty}</p>}
            {requests?.length > 0 && (
                <ul className="mt-2 divide-y divide-line">
                    {requests.map((request) => (
                        <li key={request.id} className="py-4">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-ink-soft">{shortDate(request.createdAt)}</span>
                                <StatusBadge status={request.status} />
                            </div>
                            {/* pre-line keeps the line breaks they typed. break-words stops a long link from pushing the card wide */}
                            <p className="mt-2 break-words whitespace-pre-line">{request.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
