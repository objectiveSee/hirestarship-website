# Starship Consulting site — hirestarship.com

Marketing site for Starship Consulting. Lives at https://hirestarship.com.

## Stack

Plain static site. **No build step for local dev.** `index.html` loads React 18 + ReactDOM + Babel from CDN; `.jsx` files are transpiled in the browser at load time. This is intentional — keep it that way. Don't introduce Vite, bundlers, or TypeScript without an explicit reason.

The one deploy-time step is **pre-rendering for crawlers**: CI runs `npm run build`, which rsyncs the site into `_site/` and runs `scripts/prerender.mjs` to fill `<div id="root">` with server-rendered HTML (bots without JS — Bing, LinkedIn, most AI crawlers — otherwise see an empty page). The browser then `hydrateRoot`s onto that markup; the raw dev page (empty `#root`) takes the plain `createRoot` path. Consequences:
- First render must be deterministic (no `Math.random()`/`Date` in initial state — see the seeded feed in `namecheap-bits.jsx`). Effects are fine; they don't run on the server.
- Top-level code in the `.jsx` files can touch `window.__resources` and `document.getElementById("root")` only; anything else browser-only goes in an effect.
- `npm install && npm run build` reproduces the deploy locally; serve `_site/` to check it. `_site/` and `node_modules/` are gitignored.
- React ships as the **production** builds with SRI hashes in `index.html`. Swap to the `.development.js` files (and drop the `integrity` attrs) temporarily if you need hydration warnings.

```
index.html               entry; meta/OG/JSON-LD, loads CDN React/Babel + all jsx/css/js
scripts/prerender.mjs    deploy-time SSR of the page into #root (see above)
robots.txt, sitemap.xml, llms.txt, site.webmanifest, 404.html, apple-touch-icon.png
                         crawler/bot-facing files; keep them in sync with the copy
starship-site.jsx        main app: sections, RadioParadiseTile, TimecodeTile
starship-site.css        main stylesheet (hero, sections, RP, TC, mobile)
wireframe-bits.jsx       shared primitives (ImgTile, ProjectChips, etc.)
wireframe-styles.css     primitives styling
namecheap-bits.jsx       Namecheap tile
namecheap-preview.css    Namecheap tile styling
hero-shader.js           WebGL starfield (window.mountStarfield)
currents-shader.js       WebGL currents bg for RP tile (window.mountCurrents)
image-slot.js            shared image-slot helper
assets/                  images, badges, screenshots
```

Source of truth for the original design handoff is at `/tmp/design_extract/starship-studios/` (extracted bundle).

## Running locally

```sh
npx live-server --port=8080 --no-browser
```

Hot reloads on file save. Open `http://localhost:8080`.

## Deploying

**To deploy: `git push`.** That's it. Every push to `main` triggers `.github/workflows/deploy.yml`, which publishes to https://hirestarship.com in ~30 seconds.

**No pull requests.** This is a one-person repo: commit on `main` and push. Don't open PRs or draft PRs, don't ask for review, don't wait for approval to merge. If work happened on a branch/worktree, fast-forward `main` to it and push (`git push origin <branch>:main`), then tell Danny to `git pull` in his main checkout.

Watch the run:
```sh
gh run watch --repo objectiveSee/hirestarship-website
```

### How it's wired (don't need to know unless something breaks)

- Repo: `objectiveSee/hirestarship-website` (public)
- Workflow runs `npm ci && npm run build` and uploads `_site/` as the Pages artifact (the only "build" is the prerender described above)
- Cloudflare's managed robots.txt is on: it prepends a "Content Signals" comment block to our `robots.txt`, which itself opts in (`search=yes, ai-input=yes, ai-train=yes`)
- Pages source: GitHub Actions (not branch-based)
- Custom domain `hirestarship.com` is registered via the GH Pages API (not just the `CNAME` file)
- Cloudflare proxies (orange cloud), SSL/TLS mode **Full (strict)** — Cloudflare terminates SSL with Universal SSL; GH Pages serves valid HTTPS on the origin
- GH Pages `https_enforced` is **off** and must stay off — flipping it on conflicts with the Cloudflare proxy

Files that make deploy work — don't remove:
- `.github/workflows/deploy.yml`
- `CNAME` (contains `hirestarship.com`)
- `.nojekyll`
- `package.json` + `package-lock.json` + `scripts/prerender.mjs` (CI prerender)

## Conventions established in earlier sessions

**Mobile breakpoints:**
- `700px` — general mobile cutover (hero, expertise, footer).
- `900px` — used for RP tile and Timecode tile, because their desktop layouts get cramped before 700px.
- `1024px` — tablet adjustments (e.g. expertise 4-col → 2×2).

**Bespoke tile components** (in `starship-site.jsx`) instead of generic `ImgTile`:
- `RadioParadiseTile` — three-phone carousel; on mobile collapses to single-phone with prev/next arrows + dots.
- `TimecodeTile` — live 24fps timecode clock (`useTimecode` hook), screenshot carousel, App Store badge.

The arrow/dot button styles (`.ssp-rp__arrow`, `.ssp-rp__dots`) are **global**, not inside a media query — both tiles use them at all sizes.

**Hero height (≥1025px):** explicit `height: min(53.125vw, 1062px, 100svh - 88px)` — not `max-height` on the old `aspect-ratio` box, because a max-height on an aspect-ratio element transfers into a max-width and the hero narrows. The `- 88px` keeps the expertise band peeking in below the fold; the "Scroll ↓" cue (`.ssp-hero__scrollcue`) is hidden under 1025px where the hero is content-height.

**Semantics/SEO:** section titles are real headings (h1 hero → h2 expertise/“Selected work” (sr-only)/contact → h3 per project). Keep it that way when adding tiles; add `width`/`height` to new `<img>`s.

**Contact email** is `COPY.contact` in `wireframe-bits.jsx`; it appears in the hero, nav, FAB, footer, `index.html` meta/JSON-LD, `llms.txt`, and `404.html` — change all of them together.

**Git:**
- Never modify the global git config. Use inline `-c user.name=... -c user.email=...` flags when committing.
- User: `Danny Ricciotti <dan.ricciotti@gmail.com>`.
- Straight to `main`, no PRs (see Deploying). Push = deploy.

**Working style the user prefers:**
- Section-by-section iteration with two browser windows open (one wide, one narrow) — both must look good before moving on.
- Commit after each section lands.
- Don't pause for clarifying questions; make the reasonable call and continue.
