// asking Vercel for a site's Web Analytics, and tidying the answer for the portal
// every client site is a project on my Vercel account, and Vercel already counts
// their visitors. so there's nothing to track or store here: this asks Vercel's API
// (the same numbers as the Analytics tab in the dashboard) and shapes what comes back.
//
// VERCEL_TOKEN can read my whole Vercel account. that's why this lives on the
// server: the browser never sees the token, only one site's numbers
import { HttpError } from '../middleware/errorHandlers.js';

const API = 'https://api.vercel.com/v1/query/web-analytics';
const DAY = 24 * 60 * 60 * 1000;
const TOP_PAGES = 6;
const TOP_SOURCES = 6;

// the same question within ten minutes gets the same answer back without asking Vercel again.
// it's just a Map at the top of the file, so it lasts as long as this server stays awake
const CACHE_LENGTH = 10 * 60 * 1000;
const cache = new Map();

async function ask(endpoint, project, params) {
    const token = process.env.VERCEL_TOKEN;
    if (!token) throw new HttpError(503, 'Site stats are not set up yet.');

    const query = new URLSearchParams({ projectId: project, ...params });
    if (process.env.VERCEL_TEAM) query.set('slug', process.env.VERCEL_TEAM);

    let response;
    try {
        response = await fetch(`${API}/${endpoint}?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(8000)
        });
    } catch (error) {
        console.error(`Could not reach Vercel for ${project}: ${error.message}`);
        throw new HttpError(502, 'The stats could not be loaded right now. Try again in a minute.');
    }

    if (response.status === 404) {
        // no project by that name, or Web Analytics isn't turned on for it
        throw new HttpError(404, 'There are no stats for this site yet.');
    }
    if (!response.ok) {
        // 401/403 here means the token ran out or was revoked. that's mine to fix, not the client's
        console.error(`Vercel answered ${response.status} for ${project}`);
        throw new HttpError(502, 'The stats could not be loaded right now. Try again in a minute.');
    }
    return (await response.json()).data;
}

/**
 * @param {string} project the site's project name on Vercel
 * @param {number} days how far back, counting today
 * @return {Promise<Object>} { days, totals, daily, pages, sources }
 */
export async function getSiteStats(project, days) {
    const key = `${project}:${days}`;
    const saved = cache.get(key);
    if (saved && Date.now() - saved.at < CACHE_LENGTH) return saved.stats;

    // Vercel cuts days at midnight UTC, so the range runs from one UTC midnight to another:
    // the start of the first day to the end of today. (the end can't be "right now". the totals
    // question rounds that down to this morning and leaves today out, while the others round it up,
    // and then the big number doesn't match the bars)
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const start = new Date(today - (days - 1) * DAY);
    const range = { since: start.toISOString(), until: new Date(today + DAY).toISOString() };

    // four questions, asked at the same time
    const [totals, byDay, byPage, bySource] = await Promise.all([
        ask('visits/count', project, range),
        ask('visits/aggregate', project, { ...range, by: 'day' }),
        ask('visits/aggregate', project, { ...range, by: 'requestPath', limit: '20' }),
        ask('visits/aggregate', project, { ...range, by: 'referrerHostname', limit: '20' })
    ]);

    const stats = {
        days,
        totals: { visitors: totals.visitors, pageviews: totals.pageviews },
        daily: fillDays(start, days, byDay),
        pages: topPages(byPage),
        sources: topSources(bySource)
    };
    cache.set(key, { at: Date.now(), stats });
    return stats;
}

// -------------------- helpers --------------------

// one row per day, including the quiet days Vercel leaves out
function fillDays(start, days, rows) {
    const byDate = new Map(rows.map((row) => [row.timestamp.slice(0, 10), row]));
    return Array.from({ length: days }, (unused, i) => {
        const date = new Date(start.getTime() + i * DAY).toISOString().slice(0, 10);
        const row = byDate.get(date);
        return { date, visitors: row?.visitors ?? 0, pageviews: row?.pageviews ?? 0 };
    });
}

// '/index.html' and '/' are the same page to a client, so they get added together.
// page views (not visitors) because views can be added up: one person opening both would count twice
function topPages(rows) {
    const views = new Map();
    for (const row of rows) {
        if (row.requestPath === 'Others') continue;
        const path = row.requestPath.replace(/\/index\.html$/, '/');
        views.set(path, (views.get(path) ?? 0) + row.pageviews);
    }
    return [...views]
        .map(([path, pageviews]) => ({ path, pageviews }))
        .sort((a, b) => b.pageviews - a.pageviews)
        .slice(0, TOP_PAGES);
}

// where people came from. 'l.instagram.com' and 'm.facebook.com' are just Instagram and
// Facebook's link pages, so the prefix comes off and they merge with the plain name.
// '' means there was no site before this one: typed in, a bookmark, or an app that doesn't say
function topSources(rows) {
    const visitors = new Map();
    for (const row of rows) {
        const host = row.referrerHostname;
        const name = host === '' ? 'direct' : host === 'Others' ? 'other' : host.replace(/^(l|m|www)\./, '');
        visitors.set(name, (visitors.get(name) ?? 0) + row.visitors);
    }
    return [...visitors]
        .map(([name, count]) => ({ name, visitors: count }))
        // 'other' is a leftover pile, not a place. it goes last no matter its size
        .sort((a, b) => (a.name === 'other') - (b.name === 'other') || b.visitors - a.visitors)
        .slice(0, TOP_SOURCES);
}
