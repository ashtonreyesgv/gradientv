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
  scripts/check-analytics.js    asks Vercel for a site's page views, to check the API works
  src/
    server.js                   starts the server on my laptop
    app.js                      builds the Express app: the middleware chain and the routes
    db.js                       the one MongoDB connection
    models/                     Account (a business and its login), Session (a signed-in browser),
                                ChangeRequest (one thing a client asked for)
    routes/                     which function answers which URL
    controllers/                those functions
    services/                   passwords, sessions, invites, the Slack message, asking Vercel for
                                a site's analytics: what the controllers lean on
    dto/                        what gets sent to the browser (never the password hash)
    middleware/                 requireAuth, requireDatabase, the request logger, errors into JSON
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
                                SiteStats and its chart
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

how login works, short version:
- a password is never saved, only bcrypt's hash of it
- signing in makes a Session in MongoDB and puts a random token in a cookie the page's
  JavaScript can't read. the server looks the session up on every request (`requireAuth`)
- a route never asks the browser which client it is. it reads `req.account`
- five wrong passwords in a row pauses that login for 15 minutes
- the portal pages are English only for now

before a real client logs in:
- move MongoDB to Atlas and set `MONGODB_URI` on Vercel. until then a deployed login page
  says the portal isn't open, because the server has no database to check against
- set `VERCEL_TOKEN` (a new one, named for production) and `VERCEL_TEAM` on Vercel for the stats,
  and `SLACK_WEBHOOK_URL` if i want the Slack message
- move the Vercel account to Pro, since the free plan is for non-commercial projects
- reword the login page (`login.status`, `login.pitchText`, `login.notOpen` in the content
  files still say the portal is being built)
