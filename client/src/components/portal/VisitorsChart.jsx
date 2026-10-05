// visitors per day, as bars. hover a bar (or tab to the chart and use the arrow keys)
// for that day's numbers.
// one bar color and one axis on purpose: page views show up in the hover box as a
// number instead of as a second set of bars on a second scale
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// the same colors as the @theme in gradientv.css. the chart is drawn as SVG, and
// SVG attributes can't use Tailwind classes, so they're written out here
const ACCENT = '#234b63';
const LINE = '#d8d1c7';
const LABEL = '#44403a';

/** '2026-10-05' -> 'Oct 5'. the dates are UTC days, so they're read as UTC or they'd slide back a day here */
export function dayLabel(date, options = {}) {
    return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC', ...options });
}

// the hover box. Recharts hands it { active, payload } whenever the mouse is over a bar
function DayTooltip({ active, payload, words }) {
    if (!active || !payload?.length) return null;
    const day = payload[0].payload;

    return (
        <div className="rounded-xl border border-line bg-paper-bright px-3 py-2 text-sm shadow-lg">
            <div className="font-medium">{dayLabel(day.date, { weekday: 'long' })}</div>
            <div className="mt-1 flex items-center gap-2 text-ink-soft">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: ACCENT }} />
                <span>{words.visitors}:</span>
                <span className="font-medium text-ink tabular-nums">{day.visitors.toLocaleString('en-US')}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-ink-soft">
                <span className="h-2 w-2" />
                <span>{words.pageviews}:</span>
                <span className="font-medium text-ink tabular-nums">{day.pageviews.toLocaleString('en-US')}</span>
            </div>
        </div>
    );
}

/** @param {Object[]} daily [{ date, visitors, pageviews }], oldest first */
export default function VisitorsChart({ daily, words, height = 200 }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={daily} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke={LINE} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(date) => dayLabel(date)}
                    tick={{ fill: LABEL, fontSize: 12 }}
                    axisLine={{ stroke: LINE }}
                    tickLine={false}
                    // with 30 bars there isn't room for 30 dates. Recharts skips some,
                    // but always keeps the first and the last so the range is readable
                    interval="preserveStartEnd"
                    minTickGap={12}
                />
                <YAxis allowDecimals={false} width={34} tick={{ fill: LABEL, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(31, 26, 23, 0.06)' }} content={<DayTooltip words={words} />} />
                <Bar isAnimationActive={false} dataKey="visitors" name={words.visitors} fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
