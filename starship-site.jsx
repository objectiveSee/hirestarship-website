/* global React, ReactDOM */
// Starship Studios — final rendered single-page site.
// Composes hero + selected work tiles (Timecode, Namecheap, Radio Paradise)
// using the wireframe components, in a polished layout.
//
// Excluded for now: BETA tile and the bottom sections (services / stack /
// contact) — not finalized yet.

const { useEffect, useRef } = React;
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
  useEffect(() => {
    if (canvasRef.current && typeof window.mountStarfield === "function") {
      window.mountStarfield(canvasRef.current);
    }
  }, []);
  return (
    <header className="ssp-hero" data-screen-label="Hero">
      <div className="ssp-hero__bg">
        <canvas ref={canvasRef} data-shader="starfield" />
      </div>
      <div className="ssp-hero__content">
        <nav className="ssp-nav">
          <div className="ssp-nav__brand">Starship Studios</div>
          <div className="ssp-nav__links">
            <span className="is-active">Work</span>
            <span>About</span>
            <span>Stack</span>
            <span>Contact</span>
          </div>
          <div className="ssp-nav__cta">Say hi →</div>
        </nav>
        <div className="ssp-hero__body">
          <div className="ssp-hero__kicker">A small studio · since 2005</div>
          <h1 className="ssp-hero__title">Software<br/>that holds up.</h1>
          <p className="ssp-hero__intro">Mobile, web, and AI for a handful of clients we know well.</p>
          <div className="ssp-hero__ctas">
            <span className="pri">See the work</span>
            <span className="sec">{COPY.contact}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ───── Expertise band — light tan section beneath the hero with
   three areas (Mobile / Web / Design). Matches Hero Options.html B. */
function Expertise() {
  return (
    <section className="ssp-expertise" data-screen-label="Expertise">
      <div className="ssp-expertise__grid">
        <div className="ssp-expertise__col">
          <span className="ssp-expertise__num">01</span>
          <div className="ssp-expertise__big">Mobile</div>
          <div className="ssp-expertise__sub">React Native &amp; Expo. Native iOS and Android from one codebase. Live Activities, real-time, audio.</div>
        </div>
        <div className="ssp-expertise__col">
          <span className="ssp-expertise__num">02</span>
          <div className="ssp-expertise__big">Web</div>
          <div className="ssp-expertise__sub">React, Next.js, TypeScript. Marketing sites and production web apps, front-end first.</div>
        </div>
        <div className="ssp-expertise__col">
          <span className="ssp-expertise__num">03</span>
          <div className="ssp-expertise__big">Design</div>
          <div className="ssp-expertise__sub">Flows, screens, brand systems. Product design that ships alongside the engineering, not before it.</div>
        </div>
        <div className="ssp-expertise__col">
          <span className="ssp-expertise__num">04</span>
          <div className="ssp-expertise__big">AI</div>
          <div className="ssp-expertise__sub">Practical AI consulting — evals, RAG, agents, fine-tuning. We help teams ship features that actually work in production.</div>
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
function RadioParadiseTile() {
  const canvasRef = useRef(null);
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
            <img className="ssp-rp__wordmark" src={_A('rpLogo', 'assets/radio-paradise-logo.png')} alt="Radio Paradise — Human Curated Radio" />
            <div className="ssp-rp__sub">Hand-picked, ad-free, lossless internet radio. On iOS now — Android coming.</div>
            <div className="ssp-rp__stores">
              <a className="ssp-rp__badge" href="https://apps.apple.com/us/app/radio-paradise/id517818306" target="_blank" rel="noopener" aria-label="Download on the App Store">
                <img src={APPSTORE_BADGE} alt="Download on the App Store" />
              </a>
              <span className="ssp-rp__badge ssp-rp__badge--soon" aria-label="Google Play — coming soon">
                <img src={GOOGLEPLAY_BADGE} alt="" />
                <span className="ssp-rp__badge-tag">Coming soon</span>
              </span>
            </div>
            <ProjectChips client={RADIO_PARADISE} variant="inline" />
          </div>
        </div>
        <div className="ssp-rp__shots">
          <div className="ssp-rp-phone"><img src={_A('rpShotRight', 'assets/radio-paradise-screenshot-right.png')} alt="Radio Paradise — Lyrics" /></div>
          <div className="ssp-rp-phone"><img src={_A('rpShotCenter', 'assets/radio-paradise-screenshot-center.png')} alt="Radio Paradise — Mixes home" /></div>
          <div className="ssp-rp-phone"><img src={_A('rpShotLeft', 'assets/radio-paradise-screenshot-left.png')} alt="Radio Paradise — Now playing" /></div>
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

/* ───── Page ─────────────────────────────────────────────────────────────── */
function StarshipSite() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "paper");
    document.documentElement.style.setProperty("--u", "6px");
  }, []);

  return (
    <div className="ssp-page" data-screen-label="Starship Studios">
      <Hero />
      <Expertise />

      <div id="work">
        <div className="ssp-projects">
          {/* 1 · Radio Paradise — bespoke tile; chips rendered inline
              inside the left column (handled in RadioParadiseTile). */}
          <Project id="radio-paradise" label="Radio Paradise">
            <RadioParadiseTile />
          </Project>

          {/* 2 · Timecode+ — chips overlay inside the tile bottom-left */}
          <Project id="timecode" label="Timecode+">
            <div className="ssp-tile">
              <ImgTile
                client={TIMECODE}
                tone="dark"
                aspect="16 / 9"
                layout="card"
                speed={22}
                iconPosition="stacked"
                nameSize={72}
              />
              <ProjectChips client={TIMECODE} variant="overlay" />
            </div>
          </Project>

          {/* 3 · Namecheap Auctions — tile already shows its tech stack
              internally (via TechRow), so no overlay chips needed. */}
          <Project id="namecheap" label="Namecheap Auctions">
            <div className="ssp-tile" style={{ aspectRatio: "16 / 9" }}>
              <NCTile_Split feedSpeed={1100} pageInterval={8000} />
            </div>
          </Project>
        </div>
      </div>

      <footer className="ssp-footer" data-screen-label="Footer">
        <div className="ssp-postcard">
          <div className="ssp-postcard__left">
            <span className="ssp-postcard__stamp">↳ Contact us</span>
            <h2 className="ssp-postcard__title">Ready to<br/>build <em>something</em>?</h2>
            <p className="ssp-postcard__sub">A paragraph is plenty. We pick projects carefully, and the people who reply are the people who do the work.</p>
          </div>
          <div className="ssp-postcard__right">
            <div>
              <span className="ssp-postcard__email-label">Write to</span>
              <a className="ssp-postcard__email" href={`mailto:${COPY.contact}`}>hello@<br/>starshipstudios.example</a>
            </div>
            <a className="ssp-postcard__btn" href={`mailto:${COPY.contact}`}>Send a note</a>
          </div>
        </div>
        <div className="ssp-postcard__base">
          <span>© <b>{COPY.brand}</b> · since 2005</span>
          <span>Brooklyn &nbsp;·&nbsp; remote-friendly</span>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<StarshipSite />);
