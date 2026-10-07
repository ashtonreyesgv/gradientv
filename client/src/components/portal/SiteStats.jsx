// the stats card: how many people visited the client's site, a bar per day,
// which pages got looked at, and where the visitors came from.
// the numbers come from Vercel Web Analytics by way of the server (GET /api/stats).
// this file never says which site: the server works that out from who is signed in
//
// PortalView loads this file lazily, because it brings the chart library with it
import { useEffect, useState } from 'react';
import { useLocale } from '../../context/LocaleContext.jsx';
import * as api from '../../api/api.js';
import VisitorsChart, { dayLabel } from './VisitorsChart.jsx';

const SUBHEADING_CLASS = 'eyebrow text-xs font-medium uppercase tracking-[0.2em] text-ink-soft';

const count = (number) => number.toLocaleString('en-US');

// a ranked list where each row has a thin bar under it, as long as its share of the biggest row
function BarList({ rows }) {
    const biggest = Math.max(...rows.map((row) => row.value), 1);
    return (
        <ol className="mt-3 space-y-3">
            {rows.map((row) => (
                <li key={row.key}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate" title={row.label}>{row.label}</span>
                        <span className="font-medium tabular-nums">{count(row.value)}</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-paper-dim">
                        <div className="h-1 rounded-full bg-accent" style={{ width: `${(row.value / biggest) * 100}%` }} />
                    </div>
                </li>
            ))}
        </ol>
    );
}

// viewAs is only there when i'm looking at a client's portal from the admin login
export default function SiteStats({ viewAs }) {
    const { t } = useLocale();
    const words = t.portal.stats;

    const [days, setDays] = useState(7);
    const [stats, setStats] = useState(null); // null until the first answer arrives
    const [error, setError] = useState('');

    // load on arrival, and again whenever the period changes
    useEffect(() => {
        let ignore = false;
        setError('');
        api.getStats(days, viewAs)
            .then((found) => {
                if (!ignore) setStats(found);
            })
            .catch((problem) => {
                if (ignore) return;
                setStats(null);
                setError(problem.message);
            });
        return () => { ignore = true; };
    }, [days, viewAs]);

    // after switching period, the old numbers stay up (faded) until the new ones land, so nothing jumps
    const isStale = stats !== null && stats.days !== days;

    const pages = stats?.pages.map((page) => ({
        key: page.path,
        label: page.path === '/' ? words.homePage : page.path,
        value: page.pageviews
    })) ?? [];
    const sources = stats?.sources.map((source) => ({
        key: source.name,
        label: { direct: words.direct, other: words.otherSources }[source.name] ?? source.name,
        value: source.visitors
    })) ?? [];

    return (
        <section className="rounded-[1.5rem] border border-line bg-paper-bright p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="display-md">{words.heading}</h2>

                {/* ---------- 7 days or 30 ---------- */}
                <div role="group" aria-label={words.periodLabel} className="flex gap-0.5 rounded-full border border-line bg-paper p-1">
                    {Object.entries(words.periods).map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={days === Number(value)}
                            onClick={() => setDays(Number(value))}
                            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition-colors ${
                                days === Number(value) ? 'bg-ink font-medium text-paper' : 'text-ink-soft hover:bg-paper-dim hover:text-ink'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p role="alert" className="mt-6 rounded-xl border border-line bg-paper px-4 py-3 text-sm">{error}</p>}
            {stats === null && !error && <p role="status" className="mt-6 text-ink-soft">{words.loading}</p>}

            {stats !== null && (
                <div className={`transition-opacity ${isStale ? 'opacity-50' : ''}`} aria-busy={isStale}>
                    {/* ---------- the two headline numbers ---------- */}
                    <dl className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                            <dt className="text-sm text-ink-soft">{words.visitors}</dt>
                            <dd className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums">{count(stats.totals.visitors)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-ink-soft">{words.pageviews}</dt>
                            <dd className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums">{count(stats.totals.pageviews)}</dd>
                        </div>
                    </dl>

                    {/* ---------- a bar per day ---------- */}
                    <h3 className={`${SUBHEADING_CLASS} mt-8`}>{words.chartHeading}</h3>
                    <div className="mt-3">
                        <VisitorsChart daily={stats.daily} words={words} />
                    </div>
                    {/* the same numbers as a table, for anyone who can't see the bars */}
                    <table className="sr-only">
                        <caption>{words.chartHeading}</caption>
                        <thead>
                            <tr>
                                <th scope="col">{words.day}</th>
                                <th scope="col">{words.visitors}</th>
                                <th scope="col">{words.pageviews}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.daily.map((day) => (
                                <tr key={day.date}>
                                    <th scope="row">{dayLabel(day.date, { weekday: 'long' })}</th>
                                    <td>{day.visitors}</td>
                                    <td>{day.pageviews}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ---------- pages and sources ---------- */}
                    <div className="mt-8 grid gap-8 sm:grid-cols-2">
                        <div>
                            <h3 className={SUBHEADING_CLASS}>{words.pagesHeading}</h3>
                            {pages.length > 0 ? <BarList rows={pages} /> : <p className="mt-3 text-sm text-ink-soft">{words.none}</p>}
                        </div>
                        <div>
                            <h3 className={SUBHEADING_CLASS}>{words.sourcesHeading}</h3>
                            {sources.length > 0 ? <BarList rows={sources} /> : <p className="mt-3 text-sm text-ink-soft">{words.none}</p>}
                        </div>
                    </div>

                    <p className="mt-8 text-xs text-ink-soft">{words.note}</p>
                </div>
            )}
        </section>
    );
}
