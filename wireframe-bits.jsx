/* global React */
// Shared wireframe primitives. Sketchy but legible. All elements scale with --u (density unit).

// Resolve an asset by id when bundled standalone, else fall back to the
// project-relative path so the dev page still works unchanged.
const _A = (id, fb) => (window.__resources && window.__resources[id]) || fb;

const Note = ({ children, style }) => (
  <div className="ws-note" style={style}>{children}</div>
);

const Box = ({ children, style, dashed, label, fill, className = "" }) => (
  <div
    className={`ws-box ${dashed ? "ws-box--dashed" : ""} ${fill ? "ws-box--fill" : ""} ${className}`}
    style={style}
  >
    {label && <span className="ws-box__label">{label}</span>}
    {children}
  </div>
);

const HandLine = ({ width = "100%", style }) => (
  <svg className="ws-handline" viewBox="0 0 200 6" preserveAspectRatio="none" style={{ width, ...style }}>
    <path d="M1 3 Q 30 1, 60 3 T 120 3 T 198 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const Scribble = ({ lines = 3, width = "100%", spacing = 10, style }) => (
  <div className="ws-scribble" style={{ width, ...style }}>
    {Array.from({ length: lines }).map((_, i) => {
      const w = 100 - (i === lines - 1 ? 35 : Math.random() * 12);
      return <div key={i} className="ws-scribble__line" style={{ width: `${w}%`, marginTop: i ? spacing : 0 }} />;
    })}
  </div>
);

const Header = ({ children, size = 1, style, className = "" }) => {
  const Tag = `h${size}`;
  return <Tag className={`ws-h ws-h--${size} ${className}`} style={style}>{children}</Tag>;
};

const Tag = ({ children }) => <span className="ws-tag">{children}</span>;

// Phone mockup with a sketchy app screenshot inside
const PhoneMockup = ({ app = "BETA", screen, size = "md", tilt = 0, style }) => {
  const dims = { sm: [120, 240], md: [160, 320], lg: [200, 400], xl: [240, 480] }[size];
  return (
    <div
      className={`ws-phone ws-phone--${size}`}
      style={{ width: dims[0], height: dims[1], transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
    >
      <div className="ws-phone__notch" />
      <div className="ws-phone__screen">
        {screen || <DefaultScreen app={app} />}
      </div>
      <div className="ws-phone__home" />
    </div>
  );
};

const DefaultScreen = ({ app }) => {
  // Per-client sketchy screen layouts (no real branding — generic shapes)
  if (app === "BETA") return (
    <div className="ws-screen ws-screen--beta">
      <div className="ws-screen__bar" />
      <div className="ws-screen__hero" />
      <div className="ws-screen__rowset">
        {[0,1,2,3].map(i => <div key={i} className="ws-screen__row" />)}
      </div>
      <div className="ws-screen__tabs" />
    </div>
  );
  if (app === "Namecheap") return (
    <div className="ws-screen ws-screen--nc">
      <div className="ws-screen__bar" />
      <div className="ws-screen__search" />
      <div className="ws-screen__list">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className="ws-screen__listitem">
            <span className="ws-screen__chip" />
            <span className="ws-screen__chip ws-screen__chip--narrow" />
          </div>
        ))}
      </div>
    </div>
  );
  if (app === "Timecode") return (
    <div className="ws-screen ws-screen--tc">
      <div className="ws-screen__bar" />
      <div className="ws-screen__timecode">00:14:22:08</div>
      <div className="ws-screen__waveform">
        {Array.from({length: 22}).map((_, i) => (
          <span key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 0.9)) * 60}%` }} />
        ))}
      </div>
      <div className="ws-screen__controls">
        <span /><span /><span />
      </div>
    </div>
  );
  if (app === "Radio Paradise") return (
    <div className="ws-screen ws-screen--rp">
      <div className="ws-screen__bar" />
      <div className="ws-screen__art" />
      <div className="ws-screen__track" />
      <div className="ws-screen__sub" />
      <div className="ws-screen__player">
        <span /><span className="ws-screen__play" /><span />
      </div>
    </div>
  );
  return <div className="ws-screen ws-screen--blank" />;
};

// Annotation arrow (sketch callouts)
const Callout = ({ children, dir = "right", style }) => (
  <div className={`ws-callout ws-callout--${dir}`} style={style}>
    <svg viewBox="0 0 80 24" className="ws-callout__arrow" preserveAspectRatio="none">
      <path d="M2 12 Q 30 2, 60 14 L 60 14 M 60 14 L 52 8 M 60 14 L 52 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
    <span className="ws-callout__text">{children}</span>
  </div>
);

// Tiny constellation / star motif (subtle space accent)
const Constellation = ({ width = 220, height = 120, seed = 1, style }) => {
  const pts = [
    [12, 80], [55, 30], [90, 70], [140, 25], [180, 90], [200, 50]
  ].map(([x, y]) => [x + (seed * 7) % 20, y + (seed * 5) % 15]);
  return (
    <svg width={width} height={height} viewBox="0 0 220 120" className="ws-constellation" style={style}>
      {pts.map(([x, y], i) => i < pts.length - 1 && (
        <line key={`l${i}`} x1={x} y1={y} x2={pts[i+1][0]} y2={pts[i+1][1]} stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      ))}
      {pts.map(([x, y], i) => (
        <g key={`p${i}`}>
          <circle cx={x} cy={y} r={i === 1 ? 2.4 : 1.6} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
};

const ContactInput = ({ label, placeholder, lines = 1 }) => (
  <label className="ws-input">
    <span className="ws-input__label">{label}</span>
    {lines === 1
      ? <div className="ws-input__field" data-placeholder={placeholder} />
      : <div className="ws-input__field ws-input__field--area" data-placeholder={placeholder} style={{ height: lines * 18 }} />}
  </label>
);

const TechChip = ({ children }) => <span className="ws-techchip">{children}</span>;

// Section header — no numbers per latest direction. Just kicker + title.
const SectionHead = ({ kicker, title, style, id }) => (
  <div className="ws-secthead" style={style} id={id}>
    <div>
      <div className="ws-secthead__kicker">{kicker}</div>
      <div className="ws-secthead__title">{title}</div>
    </div>
  </div>
);

// Device frame — composites a screenshot inside a real iPhone bezel.
const FRAME_GEOM = {
  portrait:  { aspect: "1109 / 2294", inset: { top: 2.7, right: 3.1, bottom: 2.7, left: 3.1 }, src: _A('iphonePortrait',  'assets/frames/iphone-portrait.png'),  radius: "12.5% / 6.1%" },
  landscape: { aspect: "2294 / 1109", inset: { top: 3.1, right: 2.7, bottom: 3.1, left: 2.7 }, src: _A('iphoneLandscape', 'assets/frames/iphone-landscape.png'), radius: "6.1% / 12.5%" }
};
const DeviceFrame = ({ src, orientation = "portrait", style, className = "", placeholder = "screenshot" }) => {
  const g = FRAME_GEOM[orientation];
  return (
    <div className={`ws-device ws-device--${orientation} ${className}`} style={{ aspectRatio: g.aspect, ...style }}>
      <div
        className={`ws-device__screen ${!src ? "ws-device__screen--empty" : ""}`}
        style={{
          top: `${g.inset.top}%`,
          right: `${g.inset.right}%`,
          bottom: `${g.inset.bottom}%`,
          left: `${g.inset.left}%`,
          borderRadius: g.radius
        }}
        data-placeholder={placeholder}
      >
        {src && <img src={src} alt="" />}
      </div>
      <img className="ws-device__frame" src={g.src} alt="" />
    </div>
  );
};

// Image tile — wide card with phone right and copy stack left, OR earlier
// centered/hang variants. App icon can sit top-right or inline above the name.
//
// When the client has `heroImages` (array of portrait shots):
//   - desktop `card` layout shows a ROW of `shots` phones (1, 2, or 3) on the
//     right with prev/next arrows to page through if there are more
//   - mobile `card-mobile` layout always shows a single phone with carousel
//     dots + arrows so all shots can be tapped through
const MultiShot = ({ images, speed = 22 }) => {
  // For a seamless infinite loop we render the list twice and animate the
  // track from translate(0) to translate(-50%) — at the boundary the second
  // copy lines up exactly with where the first started.
  const doubled = React.useMemo(() => [...images, ...images], [images]);
  return (
    <div className="ws-multishot">
      <div className="ws-multishot__viewport">
        <div className="ws-multishot__track" style={{ animationDuration: `${speed}s` }}>
          {doubled.map((src, i) => (
            <div key={i} className="ws-multishot__cell" aria-hidden={i >= images.length}>
              <DeviceFrame src={src} orientation="portrait" placeholder={`screenshot ${(i % images.length) + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CarouselShot = ({ images, speed = 18 }) => {
  const doubled = React.useMemo(() => [...images, ...images], [images]);
  return (
    <div className="ws-carousel">
      <div className="ws-carousel__viewport">
        <div className="ws-carousel__track" style={{ animationDuration: `${speed}s` }}>
          {doubled.map((src, i) => (
            <div key={i} className="ws-carousel__cell" aria-hidden={i >= images.length}>
              <DeviceFrame src={src} orientation="portrait" placeholder={`screenshot ${(i % images.length) + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ImgTile = ({ client, tone, aspect = "16 / 9", nameSize, ctaLabel, showDesc = true, showIcon = true, iconPosition = "stacked", layout = "card", speed, style }) => {
  const images = (client.heroImages && client.heroImages.length)
    ? client.heroImages
    : (client.heroImage ? [client.heroImage] : []);
  const hasImage = images.length > 0;
  const t = tone || client.tone || "warm";
  const iconStacked = iconPosition === "stacked" && client.appIcon && showIcon;
  const useMulti = images.length > 1 && layout === "card";
  const useCarousel = images.length > 1 && layout === "card-mobile";
  return (
    <div
      className={`ws-imgtile ${hasImage ? "ws-imgtile--hasimage" : ""} ${useMulti ? "ws-imgtile--multi" : ""} ${useCarousel ? "ws-imgtile--carousel" : ""}`}
      data-tone={t}
      data-layout={layout}
      style={{ aspectRatio: aspect, ...style }}
    >
      <div className="ws-imgtile__bg" data-label={`${client.name} · imagery`} />
      {useMulti ? (
        <div className="ws-imgtile__shot ws-imgtile__shot--multi">
          <MultiShot images={images} speed={speed || 22} />
        </div>
      ) : useCarousel ? (
        <div className="ws-imgtile__shot ws-imgtile__shot--carousel">
          <CarouselShot images={images} speed={speed || 18} />
        </div>
      ) : (
        <DeviceFrame
          src={images[0]}
          orientation="portrait"
          className="ws-imgtile__shot"
          placeholder={`${client.name} screenshot`}
        />
      )}
      {showIcon && iconPosition === "top-right" && client.appIcon && (
        <div className="ws-imgtile__icon"><img src={client.appIcon} alt="" /></div>
      )}
      <div className="ws-imgtile__overlay">
        {iconStacked && (
          <div className="ws-imgtile__icon ws-imgtile__icon--stacked"><img src={client.appIcon} alt="" /></div>
        )}
        <div className="ws-imgtile__kicker">{client.role}</div>
        <div className="ws-imgtile__name" style={nameSize ? { fontSize: nameSize } : undefined}>{client.name}</div>
        {showDesc && (
          <div style={{ fontFamily: "Inter, var(--sans)", fontSize: 15, lineHeight: 1.4, color: "var(--paper)", opacity: 0.92, maxWidth: 380, marginTop: 8 }}>
            {client.desc}
          </div>
        )}
        <div className="ws-imgtile__cta">{ctaLabel || client.linkLabel || "Read more"}</div>
      </div>
    </div>
  );
};

// Shared, intentionally-modest copy. We're a small studio with a handful of
// clients — let the writing reflect that. No "end-to-end" puffery.
const COPY = {
  brand: "Starship Studios",
  kicker: "independent · since 2005",
  taglineShort: "A small studio.",
  taglineLong: "Two decades, a handful of clients, software that holds up.",
  intro: "Mobile and web work for a small set of clients we know well. We mostly build iOS apps. Sometimes web. We stick around.",
  services: [
    { k: "Mobile", v: "Native iOS — Swift, SwiftUI. React Native when it fits." },
    { k: "Web", v: "React, Next.js, TypeScript. Front-end first." },
    { k: "How we work", v: "Long engagements. We don't take many projects." }
  ],
  contact: "hello@starshipstudios.example"
};

const CLIENTS = [
  {
    name: "Timecode+",
    app: "Timecode",
    role: "iOS · Web",
    desc: "App and marketing site for Timecode+ — production tooling for film & TV.",
    link: "https://timecodeplus.com",
    linkLabel: "timecodeplus.com ↗",
    appIcon: _A('tcAppIcon', 'assets/timecode/app-icon.png'),
    heroImage: _A('tcMarkerList', 'assets/timecode/marker-list.png'),
    altImage: _A('tcExport', 'assets/timecode/export.png'),
    // Multiple portrait screenshots — used by multi-shot / carousel modes.
    // We have 2 real ones; the nulls below stand in for "one or two more
    // screenshots you'll add" so the wireframe communicates the intent.
    heroImages: [
      _A('tcMarkerList', 'assets/timecode/marker-list.png'),
      _A('tcExport', 'assets/timecode/export.png'),
      null,
      null
    ],
    tone: "dark",
    stack:    ["Swift", "SwiftUI", "Next.js", "TypeScript"],
    features: ["Frame-accurate timecode", "Marker sync", "Project export"]
  },
  {
    name: "Namecheap — Auctions",
    app: "Namecheap",
    role: "Web · Mobile",
    desc: "Front-end work on Namecheap Auctions, the domain marketplace.",
    link: "https://apps.apple.com/us/app/namecheap-auctions/id6743634772",
    altLink: "https://play.google.com/store/apps/details?id=marketplace.com.namecheap",
    linkLabel: "App Store ↗",
    altLinkLabel: "Google Play ↗",
    stack:    ["React Native", "Expo", "TypeScript"],
    features: ["iOS Live Activities", "Dynamic Island", "Real-time bidding", "Push notifications"]
  },
  {
    name: "Radio Paradise",
    app: "Radio Paradise",
    role: "Mobile · Audio",
    desc: "Ongoing mobile work for the listener-supported radio station.",
    link: "https://apps.apple.com/us/app/radio-paradise/id517818306",
    linkLabel: "App Store ↗",
    stack:    ["React Native", "Expo", "AVFoundation", "Media3 (ExoPlayer)"],
    features: ["Gapless audio playback", "Lossless streaming"]
  },
  {
    name: "BETA",
    app: "BETA",
    role: "Mobile · Web",
    desc: "Mobile and web work on the BETA platform.",
    link: null,                       // App no longer available
    linkLabel: "Screenshots →",
    stack:    ["Swift", "React", "TypeScript"],
    features: []
  }
];

// Renders the Stack + Features chip strip beneath a project tile. Mirrors
// the .meta block on Radio Paradise Promo.html so portfolio metadata reads
// consistently across the site.
const MetaStrip = ({ client, style }) => {
  const hasStack = client.stack && client.stack.length > 0;
  const hasFeatures = client.features && client.features.length > 0;
  if (!hasStack && !hasFeatures) return null;
  return (
    <div className="ws-projmeta" style={style}>
      {hasStack && (
        <div className="ws-projmeta__col">
          <div className="ws-projmeta__label">Stack</div>
          <ul className="ws-projmeta__chips">
            {client.stack.map(t => <li key={t}>{t}</li>)}
          </ul>
        </div>
      )}
      {hasFeatures && (
        <div className="ws-projmeta__col">
          <div className="ws-projmeta__label">Features</div>
          <ul className="ws-projmeta__chips">
            {client.features.map(f => <li key={f} className="is-feat">{f}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

const TECH = {
  Mobile: ["Swift", "SwiftUI", "React Native"],
  Web: ["TypeScript", "React", "Next.js"],
  Other: ["Performance", "Release eng.", "Accessibility"]
};

// Mobile phone frame outline — wraps a mobile-width design so it reads as a phone.
const MobileFrame = ({ children, width = 360, height, style }) => (
  <div className="ws-mframe" style={{ width, height, ...style }}>
    <div className="ws-mframe__notch" />
    <div className="ws-mframe__screen">{children}</div>
  </div>
);

/* ---------- StarfieldBG ----------------------------------------------------
   Full-bleed WebGL starfield (option 01 · Particles from Hero Shader Options).
   Mounts a <canvas> and hands it to window.mountStarfield (hero-shader.js).
--------------------------------------------------------------------------- */
function StarfieldBG({ className = "", style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && typeof window.mountStarfield === "function") {
      window.mountStarfield(ref.current);
    }
  }, []);
  return (
    <canvas
      ref={ref}
      data-shader="starfield"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", background: "#060912", ...style }}
    />
  );
}

window.WB = { Note, Box, HandLine, Scribble, Header, Tag, PhoneMockup, Callout, Constellation, ContactInput, TechChip, SectionHead, ImgTile, DeviceFrame, MobileFrame, StarfieldBG, MetaStrip, COPY, CLIENTS, TECH };
