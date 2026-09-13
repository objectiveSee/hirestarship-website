#!/usr/bin/env node
// Pre-renders the React page into <div id="root"> as static HTML so crawlers
// that don't execute JavaScript (Bing, LinkedIn, most AI bots) still see the
// content. Browsers load React + Babel as before and hydrate on top of it.
//
//   node scripts/prerender.mjs [--out _site/index.html]
//
// Runs in .github/workflows/deploy.yml before the Pages upload. Not needed for
// local dev — the un-rendered index.html works exactly as it always has.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transformSync } from "@babel/core";
import React from "react";
import { renderToString } from "react-dom/server";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT = path.resolve(ROOT, outIdx >= 0 ? args[outIdx + 1] : "_site/index.html");

// Same order as the <script type="text/babel"> tags in index.html.
const JSX_FILES = ["wireframe-bits.jsx", "namecheap-bits.jsx", "starship-site.jsx"];

// Minimal browser globals. The .jsx files only touch window/document at the
// top level to read window.__resources and to find #root; everything else
// (shaders, observers, timers) lives in effects, which never run on the server.
let rendered = null;
globalThis.window = globalThis;
globalThis.document = { getElementById: () => ({ hasChildNodes: () => false }) };
globalThis.React = React;
globalThis.ReactDOM = {
  createRoot: () => ({ render(el) { rendered = el; } }),
  hydrateRoot: (_container, el) => { rendered = el; },
};

for (const file of JSX_FILES) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  const { code } = transformSync(src, {
    filename: file,
    babelrc: false,
    configFile: false,
    presets: [["@babel/preset-react", { runtime: "classic" }]],
  });
  // Babel-standalone runs each script tag in its own function scope, which is
  // why the files can each declare `const _A`. Mirror that here.
  new Function(code)();
}
if (!rendered) throw new Error("starship-site.jsx never called ReactDOM.createRoot / hydrateRoot");

const html = renderToString(rendered);

for (const must of ["hello@hirestarship.com", "Radio Paradise", "Timecode+", "Namecheap", "BETA"]) {
  if (!html.includes(must)) throw new Error(`prerender output is missing "${must}"`);
}

const MARK = '<div id="root"></div>';
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
if (!index.includes(MARK)) throw new Error(`index.html has no ${MARK} to fill`);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, index.replace(MARK, `<div id="root">${html}</div>`));
console.log(`prerendered ${(html.length / 1024).toFixed(1)} KB of markup → ${path.relative(ROOT, OUT)}`);
