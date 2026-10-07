// the menu at the top of my admin page: my own inbox, or one of my clients.
// picking a client shows their portal the way they see it (PortalView does that part).
//
// the list is every client login (GET /api/admin/clients). two logins can have the
// same business name, so each one shows its email too, and whether the invite was used
import { useEffect, useState } from 'react';
import { useLocale } from '../../context/LocaleContext.jsx';
import * as api from '../../api/api.js';

/**
 * @param {Object|null} client the client being looked at, or null for my inbox
 * @param {Function} onPick gets the client that was chosen, or null
 */
export default function ClientPicker({ client, onPick }) {
    const { t } = useLocale();
    const words = t.portal.viewAs;

    const [clients, setClients] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;
        api.listClients()
            .then((list) => {
                if (!ignore) setClients(list);
            })
            .catch((problem) => {
                if (!ignore) setError(problem.message);
            });
        return () => { ignore = true; };
    }, []);

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <label htmlFor="view-as" className="text-sm font-medium">{words.label}</label>
            <select
                id="view-as"
                value={client?.id ?? ''}
                onChange={(event) => onPick(clients.find((one) => one.id === event.target.value) ?? null)}
                className="max-w-full cursor-pointer rounded-full border border-line bg-paper-bright px-4 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
            >
                <option value="">{words.mine}</option>
                {clients.map((one) => (
                    <option key={one.id} value={one.id}>
                        {one.businessName} ({one.email}){one.hasSignedUp ? '' : `, ${words.notSignedUp}`}
                    </option>
                ))}
            </select>
            {error && <p role="alert" className="text-sm">{error}</p>}
        </div>
    );
}
