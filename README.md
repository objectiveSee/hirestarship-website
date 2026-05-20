# hirestarship.com

Marketing site for Starship Consulting. Live at https://hirestarship.com.

## Deploy a new version

```sh
git push
```

That's it. Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes to https://hirestarship.com in ~30 seconds.

Watch the deploy:
```sh
gh run watch --repo objectiveSee/hirestarship-website
```

## Run locally

```sh
npx live-server --port=8080 --no-browser
```

Open http://localhost:8080. Hot-reloads on save.

## Stack

Plain static site — no build step. `index.html` loads React 18 + Babel from CDN; `.jsx` files transpile in the browser.

See `CLAUDE.md` for full project conventions, file layout, and deploy internals.
