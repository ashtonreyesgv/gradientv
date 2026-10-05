// the little pill that says where a request stands.
// three looks, so they can be told apart at a glance without reading:
//   new          = outlined, nothing has happened yet
//   in progress  = filled in, being worked on
//   done         = faded, finished
import { useLocale } from '../../context/LocaleContext.jsx';

const LOOKS = {
    'new': 'border-ink/70 text-ink',
    'in progress': 'border-accent bg-accent text-paper',
    'done': 'border-line bg-paper-dim text-ink-soft'
};

export default function StatusBadge({ status }) {
    const { t } = useLocale();
    return (
        <span className={`inline-block shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${LOOKS[status]}`}>
            {t.portal.requests.status[status]}
        </span>
    );
}

/** 'Oct 5, 2026' */
export function shortDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
