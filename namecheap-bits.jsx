/* global React, WB */
// Namecheap Auctions tile — split-column desktop + vertical mobile.
// Live (fake) auction feed + scope-of-work copy block + store buttons.

const { useState, useEffect, useMemo, useRef } = React;
const { DeviceFrame, COPY } = WB;

// Resolve an asset by id when bundled standalone, else fall back to the
// project-relative path so the dev page still works unchanged.
const _A = (id, fb) => (window.__resources && window.__resources[id]) || fb;

/* ─── Fake auction data ────────────────────────────────────────────────── */
const DOMAINS = [
  "north.io", "gravity.studio", "flora.com", "ember.app",
  "coast.co", "pivot.io", "atlas.com", "nimbus.app",
  "folio.studio", "meridian.co", "harvest.io", "vault.app",
  "stellar.com", "compass.studio", "haven.co", "river.io",
  "summit.co", "lantern.app", "pebble.studio", "drift.io",
  "veil.com", "sable.co", "fern.app", "mosaic.studio",
  "azimuth.io", "anchor.app", "fjord.studio", "marrow.co",
  "alabaster.com", "tundra.io", "lumen.app", "bramble.co"
];

let __idSeq = 0;
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const randomDomain = () => DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

const makeAuction = () => {
  const h = randInt(0, 23), m = randInt(0, 59), s = randInt(0, 59);
  return {
    id: ++__idSeq,
    domain: randomDomain(),
    bid: randInt(2, 220) * 50,
    bidders: randInt(2, 28),
    time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    flash: null,
    delta: null
  };
};

const AuctionFeed = ({ count = 8, interval = 1100, density = "comfortable", style }) => {
  const [items, setItems] = useState(() =>
    Array.from({ length: count }, () => makeAuction())
  );

  useEffect(() => {
    const t = setInterval(() => {
      setItems(prev => {
        const cleared = prev.map(it => ({ ...it, flash: null, delta: null }));
        const idx = Math.floor(Math.random() * cleared.length);
        const item = cleared[idx];
        const roll = Math.random();
        if (roll < 0.62) {
          const delta = randInt(1, 16) * 50;
          cleared[idx] = { ...item, bid: item.bid + delta, bidders: item.bidders + 1, flash: "up", delta: `+$${delta}` };
        } else if (roll < 0.80) {
          cleared[idx] = { ...item, flash: "outbid", delta: "OUTBID" };
        } else if (roll < 0.92) {
          cleared[idx] = { ...makeAuction(), flash: "new", delta: "NEW" };
        } else {
          const delta = randInt(1, 6) * 50;
          cleared[idx] = { ...item, bid: item.bid + delta, bidders: item.bidders + 1, flash: "up", delta: `+$${delta}` };
        }
        return cleared;
      });
    }, interval);
    return () => clearInterval(t);
  }, [interval]);

  return (
    <div className={`nc-feed nc-feed--${density}`} style={style} aria-hidden="true">
      {items.map(it => (
        <div key={it.id} className={`nc-feed__row ${it.flash ? `is-${it.flash}` : ""}`}>
          <div className="nc-feed__main">
            <span className="nc-feed__domain">{it.domain}</span>
            <span className="nc-feed__meta">{it.bidders} bidders · {it.time}</span>
          </div>
          <div className="nc-feed__right">
            <span className="nc-feed__bid">${it.bid.toLocaleString()}</span>
            {it.delta && (
              <span className={`nc-feed__delta nc-feed__delta--${it.flash}`}>{it.delta}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Store buttons ────────────────────────────────────────────────────────
   Placeholders shaped like the standard Apple App Store / Google Play badges
   (black pill, small caption + big platform name). Glyphs are intentionally
   generic — the OFFICIAL badge PNGs from Apple/Google should drop in here
   before this goes anywhere public. */
const PlaceholderGlyph = ({ shape }) => (
  <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true">
    {shape === "ios" ? (
      // Generic rounded-square placeholder
      <>
        <rect x="4" y="4" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <line x1="9" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="14" y1="9" x2="14" y2="19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ) : (
      // Generic right-triangle placeholder
      <polygon points="8,5 8,23 22,14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    )}
  </svg>
);

const StoreButton = ({ platform, label, sublabel, href, size = "md" }) => (
  <a
    href={href || "#"}
    className={`nc-storebtn nc-storebtn--${size} nc-storebtn--${platform}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="nc-storebtn__icon"><PlaceholderGlyph shape={platform} /></span>
    <span className="nc-storebtn__text">
      <span className="nc-storebtn__small">{sublabel}</span>
      <span className="nc-storebtn__big">{label}</span>
    </span>
  </a>
);

const StoreButtonRow = ({ size = "md" }) => (
  <div className="nc-storerow">
    <StoreButton
      platform="ios"
      sublabel="Download on the"
      label="App Store"
      size={size}
      href="https://apps.apple.com/us/app/namecheap-auctions/id6743634772"
    />
    <StoreButton
      platform="android"
      sublabel="GET IT ON"
      label="Google Play"
      size={size}
      href="https://play.google.com/store/apps/details?id=marketplace.com.namecheap"
    />
  </div>
);

/* ─── Tech chips ───────────────────────────────────────────────────────── */
const TechRow = ({ items }) => (
  <ul className="nc-techrow">
    {items.map(t => <li key={t} className="nc-techchip">{t}</li>)}
  </ul>
);

const NC_TECH = ["React Native", "Expo", "Live Activities", "Dynamic Island", "Push"];

/* ─── Namecheap wordmark (from uploaded asset) ─────────────────────────── */
const NamecheapMark = ({ height = 34 }) => (
  <img
    src={_A('ncWordmark', 'assets/namecheap/wordmark.svg')}
    alt="Namecheap"
    className="nc-wordmark"
    style={{ height, width: "auto", display: "block", alignSelf: "flex-start" }}
  />
);

/* ─── Screen pager ─────────────────────────────────────────────────────────
   The five App Store promo images already include their own iPhone bezel +
   caption + gradient, so we don't wrap them in another DeviceFrame — that
   would be a phone inside a phone. Instead, we treat them like pages in a
   horizontal UIScrollView: auto-advance every `interval` ms with a smooth
   slide. Distinct from the marquee `MultiShot/CarouselShot` in wireframe-bits
   above — that one scrolls continuously; this one snaps page-by-page. */
const NC_SCREENS = [
  _A('ncScreen1', 'assets/namecheap/screens/01-market.webp'),
  _A('ncScreen2', 'assets/namecheap/screens/02-details.webp'),
  _A('ncScreen3', 'assets/namecheap/screens/03-filters.webp'),
  _A('ncScreen4', 'assets/namecheap/screens/04-stats.webp'),
  _A('ncScreen5', 'assets/namecheap/screens/05-bid.webp')
];

const NCScreenPager = ({ srcs = NC_SCREENS, interval = 8000, className = "" }) => {
  const [i, setI] = useState(0);
  const n = srcs.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI(x => (x + 1) % n), interval);
    return () => clearInterval(t);
  }, [n, interval]);

  return (
    <div className={`nc-pager ${className}`} aria-roledescription="carousel">
      <div
        className="nc-pager__track"
        style={{
          width: `${n * 100}%`,
          transform: `translateX(-${(i * 100) / n}%)`
        }}
      >
        {srcs.map((src, idx) => (
          <div
            key={src}
            className="nc-pager__page"
            style={{ width: `${100 / n}%` }}
            aria-hidden={idx !== i}
          >
            <img src={src} alt="" draggable="false" />
          </div>
        ))}
      </div>
      <div className="nc-pager__dots" aria-hidden="true">
        {srcs.map((_, idx) => (
          <span
            key={idx}
            className={`nc-pager__dot ${idx === i ? "is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── Scope-of-work copy block (reused by both layouts) ────────────────── */
const NCScopeCopy = ({ compact = false }) => (
  <>
    <NamecheapMark height={compact ? 26 : 34} />
    <div className="nc-tile__kicker">Native iOS + Android · v1 · 2025</div>
    <div className={`nc-tile__name${compact ? " nc-tile__name--compact" : ""}`}>
      Namecheap<br/>Auctions
    </div>
    <div className="nc-tile__desc">
      Owned v1 of Namecheap's mobile app for the domain marketplace, end&#8209;to&#8209;end —
      architecture, screens, auth, bidding, and ship. Built in React Native + Expo.
      iOS Live Activities surface in&#8209;flight auctions on the lock screen and
      Dynamic Island in real time. Released on the App Store and Google Play.
    </div>
    <TechRow items={NC_TECH} />
    <StoreButtonRow size={compact ? "sm" : "md"} />
  </>
);

/* ─── Desktop: three-column split ──────────────────────────────────────── */
const NCTile_Split = ({ feedSpeed = 1100, pageInterval = 8000 }) => (
  <div className="nc-tile nc-tile--split" data-tone="warm">
    <div className="nc-tile__bg" />
    <div className="nc-tile__col nc-tile__col--copy">
      <NCScopeCopy />
    </div>
    <div className="nc-tile__col nc-tile__col--feed">
      <div className="nc-tile__feed-label">Live · last few seconds</div>
      <AuctionFeed count={9} interval={feedSpeed} density="comfortable" />
      <div className="nc-tile__feed-fade" />
    </div>
    <div className="nc-tile__col nc-tile__col--phone">
      <NCScreenPager interval={pageInterval} />
    </div>
  </div>
);

/* ─── Mobile: vertical version of the same idea ────────────────────────── */
const NCTile_Mobile = ({ feedSpeed = 1100, pageInterval = 8000 }) => (
  <div className="nc-tile nc-tile--mobile" data-tone="warm">
    <div className="nc-tile__bg" />
    <div className="nc-tile__row nc-tile__row--copy">
      <NCScopeCopy compact />
    </div>
    <div className="nc-tile__row nc-tile__row--feed">
      <div className="nc-tile__feed-label">Live · last few seconds</div>
      <AuctionFeed count={5} interval={feedSpeed} density="dense" />
    </div>
    <div className="nc-tile__row nc-tile__row--phone">
      <NCScreenPager interval={pageInterval} />
    </div>
  </div>
);

window.NC = {
  AuctionFeed,
  StoreButton,
  StoreButtonRow,
  NCScreenPager,
  NCTile_Split,
  NCTile_Mobile
};
