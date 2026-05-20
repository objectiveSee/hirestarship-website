# Starship Consulting site — hirestarship.com

Marketing site for Starship Consulting. Lives at https://hirestarship.com.

## Stack

Plain static site. **No build step.** `index.html` loads React 18 + ReactDOM + Babel from CDN; `.jsx` files are transpiled in the browser at load time. This is intentional — keep it that way. Don't introduce Vite, bundlers, or TypeScript without an explicit reason.

```
index.html               entry; loads CDN React/Babel + all jsx/css/js
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

Watch the run:
```sh
gh run watch --repo objectiveSee/hirestarship-website
```

### How it's wired (don't need to know unless something breaks)

- Repo: `objectiveSee/hirestarship-website` (public)
- Workflow uploads the repo root as a Pages artifact (no build step)
- Pages source: GitHub Actions (not branch-based)
- Custom domain `hirestarship.com` is registered via the GH Pages API (not just the `CNAME` file)
- Cloudflare proxies (orange cloud), SSL/TLS mode **Full (strict)** — Cloudflare terminates SSL with Universal SSL; GH Pages serves valid HTTPS on the origin
- GH Pages `https_enforced` is **off** and must stay off — flipping it on conflicts with the Cloudflare proxy

Files that make deploy work — don't remove:
- `.github/workflows/deploy.yml`
- `CNAME` (contains `hirestarship.com`)
- `.nojekyll`

## Conventions established in earlier sessions

**Mobile breakpoints:**
- `700px` — general mobile cutover (hero, expertise, footer).
- `900px` — used for RP tile and Timecode tile, because their desktop layouts get cramped before 700px.
- `1024px` — tablet adjustments (e.g. expertise 4-col → 2×2).

**Bespoke tile components** (in `starship-site.jsx`) instead of generic `ImgTile`:
- `RadioParadiseTile` — three-phone carousel; on mobile collapses to single-phone with prev/next arrows + dots.
- `TimecodeTile` — live 24fps timecode clock (`useTimecode` hook), screenshot carousel, App Store badge.

The arrow/dot button styles (`.ssp-rp__arrow`, `.ssp-rp__dots`) are **global**, not inside a media query — both tiles use them at all sizes.

**Git:**
- Never modify the global git config. Use inline `-c user.name=... -c user.email=...` flags when committing.
- User: `Danny Ricciotti <dan.ricciotti@gmail.com>`.

**Working style the user prefers:**
- Section-by-section iteration with two browser windows open (one wide, one narrow) — both must look good before moving on.
- Commit after each section lands.
- Don't pause for clarifying questions; make the reasonable call and continue.
