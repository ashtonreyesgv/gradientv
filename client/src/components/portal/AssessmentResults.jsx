// the assessments card, for a client whose site has self-assessments on it:
// how many were finished, how each assessment tends to come out, and the latest results.
// the numbers come from GET /api/site-data/assessments. their site sent them there, one
// at a time, as visitors finished.
//
// the results are anonymous all the way down: the site never sends who took one,
// so there's nothing about that here to show
import { useEffect, useState } from 'react';
import { useLocale } from '../../context/LocaleContext.jsx';
import * as api from '../../api/api.js';
import { shortDate } from './StatusBadge.jsx';

const SUBHEADING_CLASS = 'eyebrow text-xs font-medium uppercase tracking-[0.2em] text-ink-soft';
const FIRST_ROWS = 6;
const RISKS = ['low', 'medium', 'high'];

// three looks, so the levels can be told apart at a glance. the loudest one is the one that matters most
const RISK_PILLS = {
    low: 'border-line bg-paper-dim text-ink-soft',
    medium: 'border-ink/70 text-ink',
    high: 'border-accent bg-accent text-paper'
};
// the same three as the pieces of the thin bar under each assessment
const RISK_FILLS = { low: 'bg-line', medium: 'bg-ink-mute', high: 'bg-accent' };

const count = (number) => number.toLocaleString('en-US');

/** 'hospital-quick-check' -> 'Hospital quick check', for an assessment the site hasn't sent a name for */
function nameFromType(type) {
    const words = type.replaceAll('-', ' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
}

// viewAs is only there when i'm looking at a client's portal from the admin login
export default function AssessmentResults({ viewAs }) {
    const { t } = useLocale();
    const words = t.portal.assessments;

    const [summary, setSummary] = useState(null); // null until the answer arrives
    const [error, setError] = useState('');
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        let ignore = false;
        api.getAssessments(viewAs)
            .then((found) => {
                if (!ignore) setSummary(found);
            })
            .catch((problem) => {
                if (!ignore) setError(problem.message);
            });
        return () => { ignore = true; };
    }, [viewAs]);

    // not every site that sends things here has assessments. so this card stays out of
    // the way until it knows there's something to put in it (or something went wrong)
    if (!error && (summary === null || summary.total === 0)) return null;

    const names = new Map(summary?.byType.map((row) => [row.type, row.label ?? nameFromType(row.type)]));
    const results = showAll ? summary?.recent : summary?.recent.slice(0, FIRST_ROWS);

    return (
        // md:col-span-2: on a wide screen this card takes the full width of the portal's
        // two-column grid. there's a lot in it, and half the width made it very tall
        <section className="rounded-[1.5rem] border border-line bg-paper-bright p-6 sm:p-8 md:col-span-2">
            <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
                <div className="max-w-xl">
                    <h2 className="display-md">{words.heading}</h2>
                    <p className="mt-3 text-ink-soft">{words.intro}</p>
                </div>

                {/* ---------- the two headline numbers ---------- */}
                {summary !== null && (
                    <dl className="grid grid-cols-2 gap-x-10 gap-y-4">
                        <div>
                            <dt className="text-sm text-ink-soft">{words.total}</dt>
                            <dd className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums">{count(summary.total)}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-ink-soft">{words.last30}</dt>
                            <dd className="mt-1 font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums">{count(summary.last30)}</dd>
                        </div>
                    </dl>
                )}
            </div>

            {error && <p role="alert" className="mt-6 rounded-xl border border-line bg-paper px-4 py-3 text-sm">{error}</p>}

            {summary !== null && (
                <>
                    {/* ---------- one block per assessment ---------- */}
                    <h3 className={`${SUBHEADING_CLASS} mt-9`}>{words.byTypeHeading}</h3>
                    <ul className="mt-4 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                        {summary.byType.map((row) => (
                            <li key={row.type}>
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className="min-w-0 font-medium">{names.get(row.type)}</span>
                                    <span className="shrink-0 text-sm text-ink-soft tabular-nums">{count(row.count)} {words.completed}</span>
                                </div>
                                <p className="mt-0.5 text-sm text-ink-soft">
                                    {words.averageScore} <span className="font-medium text-ink tabular-nums">{row.averageScore}</span>
                                </p>
                                {/* how the risk levels split, as a bar. the list under it says the same in numbers */}
                                <div className="mt-2.5 flex h-1.5 gap-0.5" aria-hidden="true">
                                    {RISKS.filter((level) => row[level] > 0).map((level) => (
                                        <div key={level} className={`rounded-full ${RISK_FILLS[level]}`} style={{ flex: row[level] }} />
                                    ))}
                                </div>
                                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                                    {RISKS.map((level) => (
                                        <li key={level} className="flex items-center gap-1.5">
                                            <span className={`size-2 rounded-full ${RISK_FILLS[level]}`} aria-hidden="true" />
                                            {words.risk[level]}
                                            <span className="font-medium text-ink tabular-nums">{count(row[level])}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>

                    {/* ---------- the latest ones, one per row ---------- */}
                    <h3 className={`${SUBHEADING_CLASS} mt-9`}>{words.recentHeading}</h3>
                    <table className="mt-2 w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-ink-soft">
                                <th scope="col" className="py-2 pr-3 font-normal">{words.date}</th>
                                <th scope="col" className="py-2 pr-3 font-normal">{words.assessment}</th>
                                <th scope="col" className="py-2 pr-3 text-right font-normal">{words.score}</th>
                                <th scope="col" className="py-2 text-right font-normal">{words.riskLevel}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line border-t border-line">
                            {results.map((result) => (
                                <tr key={result.id}>
                                    {/* the day, not the time of day. the signups card does the same,
                                        so neither one gives a way to line a result up against a signup */}
                                    <td className="py-3 pr-3 whitespace-nowrap text-ink-soft">{shortDate(result.createdAt)}</td>
                                    <td className="py-3 pr-3">{names.get(result.type)}</td>
                                    <td className="py-3 pr-3 text-right font-medium tabular-nums">{result.score}</td>
                                    <td className="py-3 text-right">
                                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${RISK_PILLS[result.riskLevel]}`}>
                                            {words.risk[result.riskLevel]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {summary.recent.length > FIRST_ROWS && (
                        <button
                            type="button"
                            aria-expanded={showAll}
                            onClick={() => setShowAll(!showAll)}
                            className="mt-4 cursor-pointer text-sm font-medium underline underline-offset-4 hover:text-accent"
                        >
                            {showAll ? words.showFewer : `${words.showAll} ${count(summary.recent.length)}`}
                        </button>
                    )}
                    {/* the server sends the latest 50 at most */}
                    {showAll && summary.total > summary.recent.length && (
                        <p className="mt-4 text-xs text-ink-soft">{words.latestOnly}</p>
                    )}
                </>
            )}
        </section>
    );
}
