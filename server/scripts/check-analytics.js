// one question: can i read a site's Web Analytics from Vercel's API on my plan?
//
//     npm run check-analytics -- bukascafe
//
// needs VERCEL_TOKEN in server/.env. prints the last 7 days so i can hold it up
// against the Analytics tab in the Vercel dashboard. if the numbers match, the
// portal's stats page can pull them by itself. if Vercel says no, stats get
// uploaded by hand instead
import dotenv from 'dotenv';

dotenv.config({ override: true, quiet: true });

const ENDPOINT = 'https://api.vercel.com/v1/query/web-analytics/visits/aggregate';
const DAY = 24 * 60 * 60 * 1000;

/** what each "no" from Vercel most likely means */
const HINTS = {
    401: 'the token is wrong or expired. make a new one at vercel.com > Account Settings > Tokens',
    402: 'this is probably the plan: the analytics API may not be included on Hobby',
    403: 'the token is not allowed to see that project. check VERCEL_TEAM in server/.env',
    404: 'no project with that name under VERCEL_TEAM, or Web Analytics is not turned on for it'
};

const project = process.argv[2];
const { VERCEL_TOKEN, VERCEL_TEAM } = process.env;

if (!project) {
    console.error('Which project? like this: npm run check-analytics -- bukascafe');
    process.exit(1);
}
if (!VERCEL_TOKEN) {
    console.error('VERCEL_TOKEN is missing from server/.env');
    process.exit(1);
}

const until = new Date();
const since = new Date(until.getTime() - 6 * DAY);
const params = new URLSearchParams({
    // Vercel takes the project's name here, not only its id
    projectId: project,
    by: 'day',
    since: since.toISOString().slice(0, 10),
    until: until.toISOString().slice(0, 10)
});
if (VERCEL_TEAM) params.set('slug', VERCEL_TEAM);

const response = await fetch(`${ENDPOINT}?${params}`, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
});
const body = await response.json().catch(() => null);

if (!response.ok) {
    console.error(`Vercel answered ${response.status}: ${body?.error?.message ?? 'no message'}`);
    if (body?.error?.invalidToken) {
        // Vercel says this for a token it doesn't recognize at all, whatever the status code is
        console.error('Vercel does not recognize the token. it probably lost a character when it was pasted. make a new one');
    } else if (HINTS[response.status]) {
        console.error(HINTS[response.status]);
    }
    process.exit(1);
}

let pageviews = 0;
for (const row of body.data) {
    pageviews += row.pageviews;
    console.log(`${row.timestamp.slice(0, 10)}   ${String(row.visitors).padStart(5)} visitors   ${String(row.pageviews).padStart(5)} page views`);
}
// visitors can't be added up across days (the same person on two days would count twice),
// so page views is the number to compare with the dashboard
console.log(`\n${pageviews} page views in the last 7 days for ${project}. it works!`);
