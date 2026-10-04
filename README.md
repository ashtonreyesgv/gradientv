# gradientv.com

the GradientV website. it used to be hand-written HTML pages, now it's a React app.

React 19 + Tailwind v4 for the frontend, all in `.jsx`.
React Router handles the pages.
Vite runs and builds the app.
Vercel hosts it.

there is no backend yet. the Client login page is just the form for now.
when the client portal gets built, Express + MongoDB go in a `server/` folder next to `client/`,
same layout as the CRIZM dashboard.

---

## to run it

you need Node 20.19+.

```
npm install        # only once
npm run dev        # Vite on http://localhost:5173
```

to see exactly what Vercel will serve:

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
    api/api.js                  the one place the client will talk to the server
    components/                 the pieces: Header, Footer, ContactBand, Person...
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

client portal: right now `api.signIn()` in `client/src/api/api.js` answers "not open yet" by itself
and nothing leaves the browser. when the server exists:

1. build it in `server/` (Express + MongoDB) and add `"server"` to `workspaces` in the root `package.json`
2. flip `SERVER_IS_LIVE` in `api.js`
3. Vercel only hosts the React app, so the server runs somewhere else. add a rewrite to `vercel.json`
   that passes `/api/*` along to it. the browser then only ever talks to gradientv.com, same idea
   as the Vite proxy in the dashboard, and no CORS setup is needed
4. add the portal pages as views, behind the login
