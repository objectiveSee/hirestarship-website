/* global React, ReactDOM */
// Starship Studios — final rendered single-page site.
// Composes hero + selected work tiles (Timecode, Namecheap, Radio Paradise)
// using the wireframe components, in a polished layout.
//
// Excluded for now: BETA tile and the bottom sections (services / stack /
// contact) — not finalized yet.

const { useEffect, useRef, useState } = React;
const { ImgTile, CLIENTS, COPY } = window.WB;
const { NCTile_Split } = window.NC;

// Resolve an asset by id when bundled standalone, else fall back to the
// project-relative path so the dev page still works unchanged.
const _A = (id, fb) => (window.__resources && window.__resources[id]) || fb;

const TIMECODE = CLIENTS.find(c => c.name === "Timecode+");
const NAMECHEAP = CLIENTS.find(c => c.name === "Namecheap — Auctions");
const RADIO_PARADISE = CLIENTS.find(c => c.name === "Radio Paradise");

/* ───── Hero — starfield shader, floating nav, big title ─────────────────── */
function Hero() {
  const canvasRef = useRef(null);
  // Scroll cue at the bottom of the hero — fades out once the reader has
  // actually scrolled, so it never nags.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (canvasRef.current && typeof window.mountStarfield === "function") {
      window.mountStarfield(canvasRef.current);
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="ssp-hero" data-screen-label="Hero">
      <div className="ssp-hero__bg">
        <canvas ref={canvasRef} data-shader="starfield" />
      </div>
      <div className="ssp-hero__content">
        <nav className="ssp-nav">
          <div className="ssp-nav__brand">Starship Studios</div>
          <a
            className="ssp-nav__cta"
            href={`mailto:${COPY.contact}`}
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >Say hi →</a>
        </nav>
        <div className="ssp-hero__body">
          <h1 className="ssp-hero__title">Software<br/>that holds up.</h1>
          <p className="ssp-hero__intro">Mobile, web, and AI integrations, built right.</p>
          <div className="ssp-hero__ctas">
            <a className="pri" href="#work">See the work</a>
            <a className="sec" href={`mailto:${COPY.contact}`}>{COPY.contact}</a>
          </div>
        </div>
      </div>
      <a className={`ssp-hero__scrollcue${scrolled ? " is-hidden" : ""}`} href="#work" aria-label="Scroll down to the work">
        <span>Scroll</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </header>
  );
}

/* ───── Expertise band — light tan section beneath the hero with
   three areas (Mobile / Web / Design). Matches Hero Options.html B. */
function Expertise() {
  return (
    <section className="ssp-expertise" data-screen-label="Expertise" aria-label="What we do">
      <div className="ssp-expertise__grid">
        <div className="ssp-expertise__col">
          <h2 className="ssp-expertise__big">Mobile</h2>
          <p className="ssp-expertise__sub">React Native &amp; Expo. Native iOS and Android from one codebase. Live Activities, real-time, audio.</p>
        </div>
        <div className="ssp-expertise__col">
          <h2 className="ssp-expertise__big">Web</h2>
          <p className="ssp-expertise__sub">React, TypeScript, Tailwind. Marketing sites and production web apps, front-end first.</p>
        </div>
        <div className="ssp-expertise__col">
          <h2 className="ssp-expertise__big">Design</h2>
          <p className="ssp-expertise__sub">Flows, screens, brand systems. Product design that ships alongside the engineering, not before it.</p>
        </div>
        <div className="ssp-expertise__col">
          <h2 className="ssp-expertise__big">AI</h2>
          <p className="ssp-expertise__sub">Agentic workflows and AI integrations. Claude and the SDKs around it, wired into existing products and the tools teams already use.</p>
        </div>
      </div>
    </section>
  );
}

/* ───── Project chips — rendered INSIDE each tile, either as a bottom
   overlay (over the tile's dark gradient) or inline in custom tile copy. */
const ProjectChips = ({ client, variant = "overlay" }) => {
  const stack = client.stack || [];
  const features = client.features || [];
  if (stack.length === 0 && features.length === 0) return null;
  return (
    <ul className={`ssp-chips ssp-chips--${variant}`}>
      {features.map(f => <li key={f} className="is-feat">{f}</li>)}
      {stack.map(s => <li key={s}>{s}</li>)}
    </ul>
  );
};

/* ───── Store badge images (official) ────────────────────────────────────── */
const APPSTORE_BADGE = "assets/badges/appstore-white.svg";
const GOOGLEPLAY_BADGE = "assets/badges/googleplay.png";

/* ───── Radio Paradise — bespoke hero3 tile with three phones ────────────── */
const RP_SHOTS = [
  { id: 'rpShotRight',  fallback: 'assets/radio-paradise-screenshot-right.png',  alt: 'Radio Paradise — Lyrics' },
  { id: 'rpShotCenter', fallback: 'assets/radio-paradise-screenshot-center.png', alt: 'Radio Paradise — Mixes home' },
  { id: 'rpShotLeft',   fallback: 'assets/radio-paradise-screenshot-left.png',   alt: 'Radio Paradise — Now playing' },
];

function RadioParadiseTile() {
  const canvasRef = useRef(null);
  // Carousel index — only matters on mobile (CSS hides the inactive phones
  // below 700px). Defaults to 1, the desktop-center "Mixes home" shot.
  const [activeShot, setActiveShot] = useState(1);
  const last = RP_SHOTS.length - 1;
  const prev = () => setActiveShot(i => (i === 0 ? last : i - 1));
  const next = () => setActiveShot(i => (i === last ? 0 : i + 1));

  useEffect(() => {
    if (canvasRef.current && typeof window.mountCurrents === "function") {
      window.mountCurrents(canvasRef.current);
    }
  }, []);
  return (
    <div className="ssp-rp-tile" data-screen-label="Radio Paradise">
      <div className="ssp-rp-tile__shader">
        <canvas ref={canvasRef} data-shader="currents" />
      </div>
      <div className="ssp-rp-tile__content">
        <div className="ssp-rp__left">
          <div className="ssp-rp__live">On Air</div>
          <div className="ssp-rp__body">
            <h3 className="ssp-rp__name">
              <img className="ssp-rp__wordmark" src={_A('rpLogo', 'assets/radio-paradise-logo.png')} alt="Radio Paradise — Human Curated Radio" width={1000} height={1000} loading="lazy" decoding="async" />
            </h3>
            <div className="ssp-rp__sub">Radio Paradise's mobile app for ad-free, DJ-curated internet radio on iOS and Android — built in React Native + TypeScript with Expo. AVFoundation drives iOS playback, Media3/ExoPlayer handles Android, and Skia powers the cross-platform slideshow and visualizations.</div>
            <div className="ssp-rp__stores">
              <a className="ssp-rp__badge" href="https://apps.apple.com/us/app/radio-paradise/id517818306" target="_blank" rel="noopener" aria-label="Download on the App Store">
                <img src={APPSTORE_BADGE} alt="Download on the App Store" width={120} height={40} />
              </a>
            </div>
            <ProjectChips client={RADIO_PARADISE} variant="inline" />
          </div>
        </div>
        <div className="ssp-rp__shots" data-active-shot={activeShot}>
          {RP_SHOTS.map(s => (
            <div className="ssp-rp-phone" key={s.id}><img src={_A(s.id, s.fallback)} alt={s.alt} width={1170} height={2532} decoding="async" /></div>
          ))}
        </div>
        <div className="ssp-rp__shots-nav" aria-label="Screenshot carousel">
          <button className="ssp-rp__arrow" onClick={prev} aria-label="Previous screenshot">‹</button>
          <div className="ssp-rp__dots" role="tablist">
            {RP_SHOTS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === activeShot}
                aria-label={s.alt}
                className={i === activeShot ? 'is-on' : ''}
                onClick={() => setActiveShot(i)}
              />
            ))}
          </div>
          <button className="ssp-rp__arrow" onClick={next} aria-label="Next screenshot">›</button>
        </div>
      </div>
    </div>
  );
}

/* ───── Live timecode clock (signature of the Timecode+ app) ─────────────
   Counts up from page load at HH:MM:SS:FF where FF is frames at 24fps.
   Mirrors the hook used on the real timecodeplus.com site. */
const TC_FPS = 24;
function useTimecode() {
  const [parts, setParts] = useState({ h: "00", m: "00", s: "00", f: "00" });
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = () => {
      const ms = performance.now() - start;
      const totalSeconds = Math.floor(ms / 1000);
      setParts({
        h: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
        m: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
        s: String(totalSeconds % 60).padStart(2, "0"),
        f: String(Math.floor((ms % 1000) / (1000 / TC_FPS))).padStart(2, "0"),
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return parts;
}

/* ───── Timecode+ — bespoke tile with live clock + screenshot carousel ──── */
const TC_SHOTS = [
  { id: "tcMarkerList", fallback: "assets/timecode/marker-list.png", alt: "Timecode+ — marker list",                        w: 1206, h: 2622 },
  { id: "tcExport",     fallback: "assets/timecode/export.png",      alt: "Timecode+ — export to NLEs",                     w: 1206, h: 2622 },
  { id: "tcNewNote",    fallback: "assets/timecode/new-note.png",    alt: "Timecode+ — new note",                           w: 1206, h: 2622 },
  { id: "tcDictation",  fallback: "assets/timecode/dictation.png",   alt: "Timecode+ — live dictation while recording",     w: 1170, h: 2532 },
];

function TimecodeTile() {
  const tc = useTimecode();
  const [activeShot, setActiveShot] = useState(0);
  const last = TC_SHOTS.length - 1;
  const prev = () => setActiveShot(i => (i === 0 ? last : i - 1));
  const next = () => setActiveShot(i => (i === last ? 0 : i + 1));

  return (
    <div className="ssp-tc-tile" data-screen-label="Timecode+">
      <div className="ssp-tc-tile__content">
        <div className="ssp-tc__left">
          <a className="ssp-tc__head" href="https://timecodeplus.com" target="_blank" rel="noopener" aria-label="Visit timecodeplus.com">
            <img className="ssp-tc__icon" src={_A("tcAppIcon", "assets/timecode/app-icon.png")} alt="" width={56} height={56} loading="lazy" decoding="async" />
            <h3 className="ssp-tc__name">Timecode+</h3>
          </a>
          <div className="ssp-tc__kicker">iOS · Web · Swift</div>
          <div className="ssp-tc__clock" aria-label={`Live timecode ${tc.h}:${tc.m}:${tc.s}:${tc.f}`}>
            <span className="tc-seg tc-seg-1">{tc.h}</span>
            <span className="tc-colon tc-seg-1">:</span>
            <span className="tc-seg tc-seg-2">{tc.m}</span>
            <span className="tc-colon tc-seg-2">:</span>
            <span className="tc-seg tc-seg-3">{tc.s}</span>
            <span className="tc-colon tc-seg-3">:</span>
            <span className="tc-seg tc-seg-4 tc-frames">{tc.f}</span>
          </div>
          <div className="ssp-tc__sub">Timecode+ is time-coded note-taking for film and TV — an iOS app built in Swift. A live timecode generator, one-tap markers pinned to frame, on-device transcription, and exports to FCPXML, EDL, Premiere XML, and ALE.</div>
          <div className="ssp-tc__stores">
            <a className="ssp-rp__badge" href="https://apps.apple.com/us/app/timecode-cameraman/id590534084" target="_blank" rel="noopener" aria-label="Download Timecode+ on the App Store">
              <img src={APPSTORE_BADGE} alt="Download on the App Store" width={120} height={40} />
            </a>
            <a className="ssp-tc__site-link" href="https://timecodeplus.com" target="_blank" rel="noopener">timecodeplus.com →</a>
          </div>
          <ProjectChips client={TIMECODE} variant="inline" />
        </div>

        <div className="ssp-tc__right">
          <div className="ssp-tc__shots" data-active-shot={activeShot}>
            {TC_SHOTS.map(s => (
              <div className="ssp-rp-phone" key={s.id}><img src={_A(s.id, s.fallback)} alt={s.alt} width={s.w} height={s.h} decoding="async" /></div>
            ))}
          </div>
          <div className="ssp-tc__shots-nav" aria-label="Screenshot carousel">
            <button className="ssp-rp__arrow" onClick={prev} aria-label="Previous screenshot">‹</button>
            <div className="ssp-rp__dots" role="tablist">
              {TC_SHOTS.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === activeShot}
                  aria-label={s.alt}
                  className={i === activeShot ? "is-on" : ""}
                  onClick={() => setActiveShot(i)}
                />
              ))}
            </div>
            <button className="ssp-rp__arrow" onClick={next} aria-label="Next screenshot">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───── BETA Technologies — cinematic looping-video tile ──────────────────
   Background is a quiet, looping clip from BETA's own marketing reel;
   copy and chips sit on top of a dark gradient overlay. Brand vibe is
   stark monochrome aerospace, so this tile is darker and quieter than
   the others on purpose. */
const BETA_TECH = ["React Native", "Expo", "WebSockets"];

function BetaTile() {
  const videoRef = useRef(null);
  // When the page is pre-rendered, React's server markup drops the `muted`
  // attribute and hydration doesn't reapply it, so autoplay can stall. Set it
  // on the live element and nudge playback once mounted.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);
  return (
    <div className="ssp-beta-tile" data-tone="cinematic">
      <video
        ref={videoRef}
        className="ssp-beta-tile__video"
        src="assets/beta/hero-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="ssp-beta-tile__overlay" aria-hidden="true" />
      <div className="ssp-beta-tile__content">
        <h3 className="ssp-beta-tile__name">BETA<br/>Technologies</h3>
        <div className="ssp-beta-tile__kicker">React Native · iOS · Android</div>
        <div className="ssp-beta-tile__desc">
          BETA Technologies <span className="ssp-beta-tile__ticker">(NYSE: BETA)</span> shipped
          their first mobile app for iOS and Android — built in React Native + Expo.
          Real-time status across the cross-country charging network
          and live state-of-charge monitoring for an electric aircraft fleet.
        </div>
        <ul className="ssp-beta-tile__chips">
          {BETA_TECH.map(t => <li key={t}>{t}</li>)}
        </ul>
        <div className="ssp-beta-tile__stores">
          <a
            className="ssp-beta-tile__badge"
            href="https://apps.apple.com/us/app/beta-technologies/id1615477994"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download BETA Technologies on the App Store"
          >
            <img src="assets/badges/appstore-white.svg" alt="Download on the App Store" width={120} height={40} />
          </a>
          <a
            className="ssp-beta-tile__badge ssp-beta-tile__badge--play"
            href="https://play.google.com/store/apps/details?id=io.tech.beta.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get BETA Technologies on Google Play"
          >
            <img src="assets/badges/googleplay-trimmed.png" alt="Get it on Google Play" width={564} height={168} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ───── Project section wrapper ─────────────────────────────────────────── */
const Project = ({ id, label, children }) => (
  <section className="ssp-project" id={id} data-screen-label={label}>
    {children}
  </section>
);

/* ───── Floating contact pill (bottom-right, follows the page) ─────────────
   Hidden while the hero or footer is on screen; fades in once the user is
   scrolling through the work. Saves the FAB from competing with the hero
   CTA and the postcard CTA. */
function ContactFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".ssp-hero");
    const footer = document.getElementById("contact");
    if (!hero || !footer) return;

    let heroIn = true;
    let footerIn = false;
    const update = () => setVisible(!heroIn && !footerIn);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero)   heroIn   = e.isIntersecting;
        if (e.target === footer) footerIn = e.isIntersecting;
      }
      update();
    }, { threshold: 0.05 });

    io.observe(hero);
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <a
      className={`ssp-fab${visible ? " is-visible" : ""}`}
      href={`mailto:${COPY.contact}`}
      onClick={() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }}
      aria-label={`Email ${COPY.contact}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className="ssp-fab__q">Building something…</span>
      <span className="ssp-fab__btn">Say hi</span>
    </a>
  );
}

/* ───── Email + copy-to-clipboard ─────────────────────────────────────────
   The whole point of the site is to get people to email us, so make the
   address one tap to grab. Email stays a mailto: link; the button copies it
   to the clipboard and flips to a "Copied" confirmation for a beat. */
function EmailWithCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COPY.contact);
    } catch {
      // Fallback for older/insecure contexts (no async clipboard API).
      const ta = document.createElement("textarea");
      ta.value = COPY.contact;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="ssp-postcard__emailrow">
      <a className="ssp-postcard__email" href={`mailto:${COPY.contact}`}>{COPY.contact}</a>
      <button
        type="button"
        className={`ssp-copy${copied ? " is-copied" : ""}`}
        onClick={copy}
        aria-label={copied ? "Email address copied" : `Copy ${COPY.contact} to clipboard`}
      >
        <span className="ssp-copy__label">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

/* ───── Page ─────────────────────────────────────────────────────────────── */
function StarshipSite() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "paper");
    document.documentElement.style.setProperty("--u", "6px");
  }, []);

  return (
    <div className="ssp-page" data-screen-label="Starship Studios">
      <Hero />
      <main>
      <Expertise />

      <section id="work" aria-labelledby="work-title">
        <h2 id="work-title" className="ssp-sr-only">Selected work</h2>
        <div className="ssp-projects">
          {/* 1 · Radio Paradise — bespoke tile; chips rendered inline
              inside the left column (handled in RadioParadiseTile). */}
          <Project id="radio-paradise" label="Radio Paradise">
            <RadioParadiseTile />
          </Project>

          {/* 2 · Timecode+ — bespoke tile with live clock + screenshot carousel */}
          <Project id="timecode" label="Timecode+">
            <TimecodeTile />
          </Project>

          {/* 3 · Namecheap Auctions — tile already shows its tech stack
              internally (via TechRow), so no overlay chips needed. */}
          <Project id="namecheap" label="Namecheap Auctions">
            <div className="ssp-tile ssp-tile--nc">
              <NCTile_Split feedSpeed={1100} pageInterval={8000} />
            </div>
          </Project>

          {/* 4 · BETA Technologies — cinematic video-backed tile. */}
          <Project id="beta" label="BETA Technologies">
            <BetaTile />
          </Project>
        </div>
      </section>
      </main>

      <footer className="ssp-footer" id="contact" data-screen-label="Footer">
        <div className="ssp-postcard">
          <h2 className="ssp-postcard__title">Ready to<br/>build <em>something</em>?</h2>
          <p className="ssp-postcard__sub">Send us a note about your project. You'll hear back from the people who'd actually build it.</p>
          <EmailWithCopy />
          <div className="ssp-postcard__actions">
            <a className="ssp-postcard__btn" href={`mailto:${COPY.contact}`}>Send a note</a>
            <a
              className="ssp-linkedin"
              href="https://www.linkedin.com/in/dannyricciotti/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with Danny Ricciotti on LinkedIn"
            >
              <svg className="ssp-linkedin__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z"/>
              </svg>
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>
        <div className="ssp-postcard__base">
          <span>© 2026 <b>{COPY.brand}</b></span>
          <a className="ssp-postcard__social" href={`mailto:${COPY.contact}`}>{COPY.contact}</a>
          <span>Washington, DC · Worldwide</span>
        </div>
      </footer>

      <ContactFab />
    </div>
  );
}

// Deployed index.html is pre-rendered (scripts/prerender.mjs fills #root at
// deploy time), so hydrate onto that markup. The raw dev page has an empty
// #root and takes the plain render path.
const container = document.getElementById("root");
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, <StarshipSite />);
} else {
  ReactDOM.createRoot(container).render(<StarshipSite />);
}
