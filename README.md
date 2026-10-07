# gradientv.com

the GradientV website, plus the start of the client portal.

React 19 + Tailwind v4 for the frontend, all in `.jsx`.
React Router handles the pages.
Vite runs and builds the app.
Express + MongoDB for the server, in `server/` next to `client/`, same layout as the CRIZM dashboard.
Vercel hosts both.

the portal: a client sets a password from an invite link, signs in, sends requests for
changes to their site, and sees their site's visitors and page views. i sign in with an
admin login and see everyone's requests in one list.

a client's own website can also send things here, and that client sees them in their portal.
InfoReporting Solutions is the first: the self-assessments finished on their site, and their newsletter signups.

---

## to run it

you need Node 20.19+ and MongoDB running.

```
npm install        # only once
npm run dev        # Express on http://localhost:4000 and Vite on http://localhost:5173
```

the server reads its settings from `server/.env`. copy `server/.env.example` to make one.

is it alive? open http://localhost:5173/api/health and you get `{"ok":true,"database":true}`.
`database` is `false` when the server is up but can't reach MongoDB.

to make a login (for a client, or a test one for me):

```
npm run add-client -- "Bukas Cafe" owner@bukascafe.com bukascafe
```

it prints a link. whoever opens it picks their own password and lands in the portal.
the link works once and dies after 7 days. run the same command again for a fresh one,
which is also the fix for a forgotten password.

the last word is their site's project name on Vercel (for the stats page). leave it off for
a login with no site. add `--admin` to make my own login, the one that sees every client's requests:

```
npm run add-client -- "GradientV" me@example.com --admin
```

all of that makes logins in the database on my laptop, for testing. for a real one, add `--live`:

```
npm run add-client -- "Bukas Cafe" owner@bukascafe.com bukascafe --live
```

`--live` reads `server/.env.production` in place of `server/.env`: the Atlas address (`MONGODB_URI`)
and the real site's address (`SITE_URL`). it says which database it used before it prints the link.

to let a client's website send things to the portal, give their login a site key:

```
npm run site-key -- owner@inforeportingsolutions.com --live
```

it prints the key once. it goes in that client's own project on Vercel as `PORTAL_SITE_KEY`
(Settings > Environment Variables), then their site needs a redeploy. the key can only add
things for that one client. it can't read anything. a login that already has a key keeps it
unless `--replace` is added, and the old key stops working that second.

to bring over rows from the database a client's site used before (a CSV export of the old table):

```
npm run import-site-data -- owner@inforeportingsolutions.com assessments "C:\path\to\assessment_results_rows.csv" --live
npm run import-site-data -- owner@inforeportingsolutions.com subscribers "C:\path\to\subscribers_rows.csv" --live
```

by itself it only says what it would do. add `--save` at the end to do it. it only ever adds,
and running it twice doesn't double anything.

to get a Slack message when a client sends a request, make an Incoming Webhook at
api.slack.com/apps and put its address after `SLACK_WEBHOOK_URL=` in `server/.env`
(and in Vercel's environment variables). without it the request box works the same.

to see exactly what Vercel will serve (the pages, not the server):

```
npm run build      # makes client/dist
npm run preview    # serves client/dist on http://localhost:5173
```

---

## how it gets to Vercel

nothing to set up in the Vercel dashboard, `vercel.json` tells it everything:

- `buildCommand` runs `npm run build`
- `outputDirectory` is `client/dist`
- `cleanUrls` makes `/story` work and sends the old `/story.html` links to it, so nothing that was shared before breaks
- `headers` are the same security headers the old site had
- `rewrites` sends every `/api/...` request to `api/index.js`, which is the Express app

the server rides along with the site. Vercel turns `api/index.js` into a function and runs the
Express app inside it, so one push ships both, and they share a domain: the browser only ever
talks to gradientv.com, same idea as the Vite proxy, and no CORS setup is needed.

the settings the server needs (`MONGODB_URI`, `VERCEL_TOKEN`, `VERCEL_TEAM`) go in Vercel under
Project Settings > Environment Variables. `server/.env` is only for my laptop and never gets committed.

`npm run build` does three things in a row:

```
build:client    the normal Vite build                     -> client/dist
build:server    the same app, compiled so Node can run it -> client/dist-server
prerender       draws every page once and saves it        -> client/dist/story.html, es/story.html ...
```

the last step is the important one. a plain React app sends the browser an empty page
and fills it in with JavaScript. people never notice, but link previews (iMessage, LinkedIn)
and most AI crawlers don't run JavaScript, so they would see nothing. prerendering gives
every page real HTML with its own title and description, and React takes over once it loads.
the script is `client/scripts/prerender.js` and it's commented top to bottom.

safest way to ship a change: push it to a branch first. Vercel builds a preview link for
every branch, so you can click through it before it touches the real site, then merge to `main`.

---

## where things live

```
vercel.json                     how Vercel builds and serves the site
api/index.js                    the door Vercel uses to reach the server
server/
  .env.example                  the settings the server needs. copy it to .env
  scripts/add-client.js         makes a login and prints its invite link
  scripts/site-key.js           makes the key a client's website uses to send things here
  scripts/import-site-data.js   brings a client's old rows over from a CSV file
  scripts/check-analytics.js    asks Vercel for a site's page views, to check the API works
  scripts/settings.js           what those scripts share: --live, and saying which database out loud
  src/
    server.js                   starts the server on my laptop
    app.js                      builds the Express app: the middleware chain and the routes
    db.js                       the one MongoDB connection
    models/                     Account (a business and its login), Session (a signed-in browser),
                                ChangeRequest (one thing a client asked for), AssessmentResult and
                                Subscriber (things a client's own website sent here)
    routes/                     which function answers which URL
    controllers/                those functions
    services/                   passwords, sessions, invites, site keys, the Slack message, asking Vercel
                                for a site's analytics, checking what a site sends: what the controllers lean on
    dto/                        what gets sent to the browser (never the password hash)
    middleware/                 requireAuth (a signed-in browser), requireSiteKey (a client's website),
                                requireDatabase, the request logger, errors into JSON
client/
  index.html                    the page shell
  public/                       images, videos, robots.txt, sitemap.xml (served as-is)
  scripts/prerender.js          makes the real HTML files at build time
  src/
    main.jsx                    starts the app in the browser
    App.jsx                     the routes: which view shows for which URL
    css/gradientv.css           the Tailwind theme (colors, fonts) + the textures
    content/en.js, es.js, zh.js every word on the site, one file per language
    content/legal/              privacy, terms, accessibility (3 languages each)
    data/pages.js               the list of pages. routes, SEO tags and prerender all read it
    data/team.js                the team: names, photos, links, order
    data/site.js                phone, email, the client logos
    data/schema.js              the structured data search engines read
    context/LocaleContext.jsx   which language the page is in (it comes from the URL)
    context/AuthContext.jsx     who is signed in (it asks the server)
    api/api.js                  the one place the client talks to the server
    components/                 the pieces: Header, Footer, ContactBand, Person...
    components/portal/          the pieces behind the login: RequestBox (a client's), RequestInbox (mine),
                                SiteStats and its chart, AssessmentResults and NewsletterSignups
                                (only for a client whose website sends those)
    views/                      one file per page
legacy/                         the old HTML site, kept for reference. not deployed
design/stock/                   the original photos the textures were cut from. not deployed
```

---

## how do i...

**change some wording:** `client/src/content/en.js` (and the same key in `es.js` and `zh.js`).

**add a team member:** add them to `TEAM` in `client/src/data/team.js`, then add their role and
bio under `team.members` in the three content files. no photo yet? use `size: 'small'` and they
get a slim row with their initials. when the photo comes in, drop it in
`client/public/images/team/`, set `photo`, and change `size` to `'card'`.

**add a client logo:** put the image in `client/public/images/clients/` and add it to `CLIENTS`
in `client/src/data/site.js`.

**add a page:** one line in `PAGES` (`client/src/data/pages.js`), a view in `client/src/views/`,
one entry in `VIEWS` (`client/src/App.jsx`), and a line in `client/public/sitemap.xml`.

---

## what's next

the client portal. one login per business, and each client sees two things: a box to request
changes to their site, and their site's visitors and page views.

1. ~~the skeleton: `server/`, MongoDB, `/api/health`, the Vercel wiring~~ done
2. ~~login: invite links, passwords, sessions, the first page behind the login~~ done
3. ~~the request box, and the admin login that sees everyone's requests~~ done
4. ~~the stats card, pulled from Vercel Web Analytics~~ done
5. later: an admin page, saving daily numbers (Hobby only keeps a month), and fields clients can edit themselves

how the stats work, short version:
- every client site is a project on my Vercel account, and Vercel already counts its visitors.
  the server asks Vercel's API for one project's numbers and passes them on. nothing is tracked or stored here
- which project comes from the login (`vercelProject` on the Account, the last word of `npm run add-client`),
  never from the browser
- `VERCEL_TOKEN` can read the whole Vercel account, so it only lives in `server/.env` and on Vercel
- answers are remembered for 10 minutes, so reloading the portal doesn't keep asking Vercel
- the chart library (Recharts) is in its own file that only downloads inside the portal.
  the public pages don't load it
- days are UTC days, because that's how Vercel cuts them

how a client's website sends things here, short version:
- their site keeps its own small functions (for InfoReporting: `api/submit-assessment.js` and `api/subscribe.js`).
  those check what the visitor sent, then pass it on to `/api/collect/...` here, with the site key in a header
- the key says which client it is (`requireSiteKey` puts the account on `req.account`, like `requireAuth` does
  for a browser). there is no field for naming a client, so one site can't write into another's
- the key lives in that site's Vercel settings, never in a page or a browser. only a hash of it is saved here
- it can add and nothing else. reading happens in the portal, signed in, through `/api/site-data/...`
- an assessment result is anonymous: which assessment, the score, the risk level, the date. nothing about
  who took it, and no link to a newsletter signup. InfoReporting's privacy policy promises exactly that,
  so don't add a field that joins the two
- each client can save 500 of each kind a day. that's a flood stopper, not a real limit
- the two cards show up by themselves for a login that has a site key (`siteSendsData` on the account the browser gets)

how login works, short version:
- a password is never saved, only bcrypt's hash of it
- signing in makes a Session in MongoDB and puts a random token in a cookie the page's
  JavaScript can't read. the server looks the session up on every request (`requireAuth`)
- a route never asks the browser which client it is. it reads `req.account`
- five wrong passwords in a row pauses that login for 15 minutes
- the portal pages are English only for now

what the deployed site runs on (all set up, under the gradientv project on Vercel):
- the database is MongoDB Atlas, free tier, made through Vercel's Storage tab. Vercel keeps its
  address in `MONGODB_URI`. my laptop has its own local database, so testing never touches real data
- `VERCEL_TOKEN` and `VERCEL_TEAM` in Environment Variables are for the stats. the token
  expires after a year: make a new one and paste it in, or the stats card stops loading
- `SLACK_WEBHOOK_URL` there too, if i want the Slack message
- a changed variable only reaches the site on the next build (push, or Redeploy in the dashboard)

still to do:
- move the Vercel account to Pro, since the free plan is for non-commercial projects
- the free Atlas tier has no backups. write a small export script and run it now and then
- the privacy policy doesn't mention client logins or requests yet, or that i hold what clients' sites collect
- the stats chart cuts days in UTC, so in the evening it shows an empty bar for "tomorrow"
- there's no command to change a login's email. the results and signups hang off the login,
  so making a second login with the new email would start it empty
