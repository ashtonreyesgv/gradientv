// what the admin login sees in place of the request box: every client's
// requests in one list, newest first, each with a menu to move it along.
// a client's browser can't use that menu even if it tried, the server checks the role (requireAdmin)
import { useEffect, useState } from 'react';
import { useLocale } from '../../context/LocaleContext.jsx';
import * as api from '../../api/api.js';
import { shortDate } from './StatusBadge.jsx';

export default function RequestInbox() {
    const { t } = useLocale();
    const words = t.portal.requests;

    const [requests, setRequests] = useState(null); // null until the list arrives
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;
        api.listRequests()
            .then((list) => {
                if (!ignore) setRequests(list);
            })
            .catch((problem) => {
                if (ignore) return;
                setRequests([]);
                setError(problem.message);
            });
        return () => { ignore = true; };
    }, []);

    async function handleStatus(id, status) {
        setError('');
        try {
            const updated = await api.setRequestStatus(id, status);
            setRequests((list) => list.map((request) => (request.id === id ? updated : request)));
        } catch (problem) {
            // nothing changed in the list, so the menu snaps back to what the server still has
            setError(problem.message);
        }
    }

    return (
        <section className="rounded-[1.5rem] border border-line bg-paper-bright p-6 sm:p-8">
            <h2 className="display-md">{words.inboxHeading}</h2>

            {error && <p role="alert" className="mt-4 rounded-xl border border-line bg-paper px-4 py-3 text-sm">{error}</p>}
            {requests === null && <p role="status" className="mt-4 text-ink-soft">{words.loading}</p>}
            {requests?.length === 0 && !error && <p className="mt-4 text-ink-soft">{words.inboxEmpty}</p>}

            {requests?.length > 0 && (
                <ul className="mt-4 divide-y divide-line">
                    {requests.map((request) => (
                        // a finished one fades back so the open ones stand out
                        <li key={request.id} className={`py-5 ${request.status === 'done' ? 'opacity-60' : ''}`}>
                            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                <p>
                                    <span className="font-medium">{request.businessName}</span>
                                    <span className="ml-2 text-sm text-ink-soft">{shortDate(request.createdAt)}</span>
                                </p>
                                <select
                                    aria-label={`${words.statusLabel}: ${request.businessName}, ${shortDate(request.createdAt)}`}
                                    value={request.status}
                                    onChange={(event) => handleStatus(request.id, event.target.value)}
                                    className="cursor-pointer rounded-full border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                                >
                                    {Object.entries(words.status).map(([status, label]) => (
                                        <option key={status} value={status}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="mt-2 max-w-[75ch] break-words whitespace-pre-line">{request.message}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
