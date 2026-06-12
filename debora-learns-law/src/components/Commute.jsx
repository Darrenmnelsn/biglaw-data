import { useEffect, useState } from "react";

// procedurally generated city silhouette so it's different every drive
function cityPath(seed, count, base, varianceY) {
  let h = seed;
  const rand = () => {
    h = (h * 9301 + 49297) % 233280;
    return h / 233280;
  };
  const parts = ["M0," + base];
  let x = 0;
  for (let i = 0; i < count; i++) {
    const w = 20 + Math.floor(rand() * 60);
    const top = base - 30 - Math.floor(rand() * varianceY);
    parts.push(`L${x},${top}`);
    parts.push(`L${x + w},${top}`);
    x += w;
  }
  parts.push(`L${x},${base}`);
  parts.push(`L${x},200`);
  parts.push(`L0,200`);
  parts.push("Z");
  return parts.join(" ");
}

function cityWindows(seed, count, base, varianceY, lit) {
  // returns a list of rects for lit windows
  let h = seed + 7;
  const rand = () => {
    h = (h * 9301 + 49297) % 233280;
    return h / 233280;
  };
  const out = [];
  let x = 0;
  for (let i = 0; i < count; i++) {
    const w = 20 + Math.floor(rand() * 60);
    const top = base - 30 - Math.floor(rand() * varianceY);
    const rows = Math.floor((base - top) / 8);
    const cols = Math.floor(w / 6);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rand() < lit) {
          out.push({
            x: x + 2 + c * 6,
            y: top + 2 + r * 8,
            opacity: 0.6 + rand() * 0.4,
          });
        }
      }
    }
    x += w;
  }
  return out;
}

const FAR_BUILDINGS = cityPath(101, 36, 170, 70);
const MID_BUILDINGS = cityPath(202, 24, 180, 95);
const NEAR_BUILDINGS = cityPath(303, 18, 188, 60);
const FAR_WINDOWS = cityWindows(101, 36, 170, 70, 0.5);
const MID_WINDOWS = cityWindows(202, 24, 180, 95, 0.55);

export default function Commute({ onArrived }) {
  // progress 0..1; 0 = dusk, 1 = night arrival
  const [t, setT] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 5800);
      setT(p);
      if (p >= 1) clearInterval(id);
    }, 33);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (t >= 1 || skipped) {
      const id = setTimeout(onArrived, skipped ? 0 : 400);
      return () => clearTimeout(id);
    }
  }, [t, skipped, onArrived]);

  // sky colors interpolate sunset → night
  const sky1 = mix("#ff8a3d", "#0d1230", t);
  const sky2 = mix("#7a3a78", "#1a0e2a", t);
  const sky3 = mix("#1a2a5a", "#020410", t);
  const headlightsOn = t > 0.55;

  // parallax offsets — three layers + foreground road
  // each cycles via translateX driven by t plus speed
  const farX = -t * 60 - 8;
  const midX = -t * 200 - 20;
  const nearX = -t * 480 - 40;
  const roadX = -((Date.now() % 800) / 800) * 100;

  return (
    <div className="screen commute" aria-label="Driving home">
      <button
        className="skip-cutscene"
        onClick={() => setSkipped(true)}
        aria-label="Skip cutscene"
      >
        Skip ▶▶
      </button>

      <div
        className="cutscene"
        style={{
          background: `linear-gradient(180deg, ${sky1} 0%, ${sky2} 45%, ${sky3} 80%)`,
        }}
      >
        {/* sun/moon */}
        <div
          className="sun"
          style={{
            transform: `translate(${-30 + t * 90}vw, ${10 + t * 38}vh)`,
            background: t < 0.6 ? "#ffd54a" : "#e8e8f0",
            boxShadow: t < 0.6 ? "0 0 60px #ffae3d" : "0 0 24px #d4d4e8",
          }}
        />
        {/* stars (fade in) */}
        <div className="stars" style={{ opacity: Math.max(0, (t - 0.4) * 1.7) }}>
          {Array.from({ length: 60 }, (_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 19) % 55}%`,
                animationDelay: `${(i % 8) * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* parallax cities */}
        <svg
          className="city far"
          viewBox="0 0 1600 200"
          preserveAspectRatio="none"
          style={{ transform: `translateX(${farX}px)` }}
        >
          <path d={FAR_BUILDINGS} fill="#1a1730" />
          <g style={{ opacity: Math.min(1, t * 1.3) }}>
            {FAR_WINDOWS.map((w, i) => (
              <rect key={i} x={w.x} y={w.y} width="2" height="3" fill="#ffd87a" opacity={w.opacity} />
            ))}
          </g>
        </svg>

        <svg
          className="city mid"
          viewBox="0 0 1600 200"
          preserveAspectRatio="none"
          style={{ transform: `translateX(${midX}px)` }}
        >
          <path d={MID_BUILDINGS} fill="#100a22" />
          <g style={{ opacity: Math.min(1, t * 1.5) }}>
            {MID_WINDOWS.map((w, i) => (
              <rect key={i} x={w.x} y={w.y} width="3" height="4" fill="#ffe39a" opacity={w.opacity} />
            ))}
          </g>
        </svg>

        <svg
          className="city near"
          viewBox="0 0 1600 200"
          preserveAspectRatio="none"
          style={{ transform: `translateX(${nearX}px)` }}
        >
          <path d={NEAR_BUILDINGS} fill="#070414" />
        </svg>

        {/* street lights along the road */}
        <div className="streetlights">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="streetlight"
              style={{
                left: `${(i * 18 - ((Date.now() / 16) % 18)) % 100}%`,
              }}
            >
              <div className="pole" />
              <div className="bulb" style={{ opacity: headlightsOn ? 1 : 0.2 }} />
            </div>
          ))}
        </div>

        {/* road with dashes scrolling */}
        <div className="road">
          <div className="road-dashes" style={{ backgroundPositionX: `${roadX}vw` }} />
        </div>

        {/* car (foreground, centered, bobs subtly) */}
        <div className="car-wrap">
          <svg viewBox="0 0 300 130" className="car">
            {/* headlight cone */}
            <path
              d="M260 70 L320 50 L320 90 Z"
              fill="url(#headlight-cone)"
              opacity={headlightsOn ? 1 : 0}
              style={{ transition: "opacity 0.6s" }}
            />
            <defs>
              <linearGradient id="headlight-cone" x1="0" x2="1">
                <stop offset="0" stopColor="#fff4cc" stopOpacity="0.85" />
                <stop offset="1" stopColor="#fff4cc" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="carbody" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#202a4a" />
                <stop offset="0.5" stopColor="#0c1226" />
                <stop offset="1" stopColor="#040614" />
              </linearGradient>
              <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#9ec3ff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#3a5a8a" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* shadow */}
            <ellipse cx="150" cy="116" rx="120" ry="6" fill="#000" opacity="0.5" />
            {/* body */}
            <path
              d="M30 95 L60 70 Q90 55 150 55 Q210 55 250 70 L280 95 L280 110 L20 110 Z"
              fill="url(#carbody)"
              stroke="#000"
              strokeWidth="1"
            />
            {/* windshield + windows */}
            <path
              d="M75 90 L95 70 Q140 60 200 65 L240 90 Z"
              fill="url(#glass)"
              stroke="#000"
              strokeWidth="0.8"
            />
            {/* door line */}
            <line x1="150" y1="65" x2="150" y2="95" stroke="#000" strokeWidth="0.6" opacity="0.7" />
            {/* headlight */}
            <ellipse
              cx="265"
              cy="80"
              rx="6"
              ry="4"
              fill={headlightsOn ? "#fff4cc" : "#a89860"}
              style={{ transition: "fill 0.6s" }}
            />
            {/* taillight */}
            <rect x="22" y="78" width="6" height="6" fill="#c0301a" />
            {/* wheels */}
            <g className="wheel wheel-r">
              <circle cx="230" cy="106" r="14" fill="#0a0a0a" />
              <circle cx="230" cy="106" r="8" fill="#2a2a2a" />
              <path d="M222 106 H238 M230 98 V114 M224 100 L236 112 M236 100 L224 112" stroke="#777" strokeWidth="1" />
            </g>
            <g className="wheel wheel-l">
              <circle cx="80" cy="106" r="14" fill="#0a0a0a" />
              <circle cx="80" cy="106" r="8" fill="#2a2a2a" />
              <path d="M72 106 H88 M80 98 V114 M74 100 L86 112 M86 100 L74 112" stroke="#777" strokeWidth="1" />
            </g>
          </svg>
        </div>

        <div className="commute-caption">
          {t < 0.5 ? "Driving home…" : t < 0.95 ? "Almost there…" : "Home."}
        </div>
      </div>
    </div>
  );
}

function mix(a, b, t) {
  const pa = hex(a);
  const pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
