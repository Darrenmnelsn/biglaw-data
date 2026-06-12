import { memo } from "react";

const SKIN = ["#f0c8a0", "#d8a878", "#a87856", "#6f4a32", "#e8b890", "#c08858"];
const HAIR = ["#1a1310", "#3a2818", "#6b3a14", "#a87038", "#caa860", "#d8d4cc"];
const PANTS = ["#1f2433", "#2a2218", "#3a3030", "#1a2a3a"];

// outfit tint per subject = which kind of person walked in
const OUTFIT_BY_SUBJECT = {
  Torts: ["#7c3326", "#2d5a3c", "#1f3e6b"], // bandaged civilians, varied
  Contracts: ["#0f2a4a", "#1a2a3a", "#373040"], // business suits, navy/charcoal
  "Criminal Law": ["#d97706", "#7a3322", "#2a2a2a"], // jumpsuit orange + civilians
  "Civil Procedure": ["#3a4a6a", "#4a5468", "#5a4030"], // mixed pros
  "Bar Review": ["#475569", "#4a4a40", "#3a3045"], // business casual
};

const FOLDER_BY_SUBJECT = {
  Torts: "#e74c3c",
  Contracts: "#1e88e5",
  "Criminal Law": "#f59e0b",
  "Civil Procedure": "#10b981",
  "Bar Review": "#a855f7",
};

function pick(arr, seed, salt) {
  // simple stable hash
  let h = seed * 2654435761 + salt;
  h ^= h >>> 13;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 16;
  return arr[Math.abs(h) % arr.length];
}

function PersonSVG({ seed, subject, mood, walking, bandaged }) {
  const skin = pick(SKIN, seed, 1);
  const hair = pick(HAIR, seed, 2);
  const outfits = OUTFIT_BY_SUBJECT[subject] || ["#3a3a4a"];
  const suit = pick(outfits, seed, 3);
  const pants = pick(PANTS, seed, 4);
  const folder = FOLDER_BY_SUBJECT[subject] || "#888";

  return (
    <svg viewBox="0 0 60 110" className={`person-svg ${walking ? "walking" : ""} mood-${mood}`}>
      <ellipse className="shadow" cx="30" cy="106" rx="16" ry="2.2" />

      <g className="legs">
        <rect className="leg leg-l" x="18" y="64" width="9" height="38" fill={pants} rx="2" />
        <rect className="leg leg-r" x="33" y="64" width="9" height="38" fill={pants} rx="2" />
        <rect className="shoe shoe-l" x="16" y="100" width="13" height="5" fill="#0a0a0a" rx="2" />
        <rect className="shoe shoe-r" x="31" y="100" width="13" height="5" fill="#0a0a0a" rx="2" />
      </g>

      {/* torso */}
      <path
        d="M11 33 Q11 28 16 28 H44 Q49 28 49 33 V66 H11 Z"
        fill={suit}
      />
      {/* lapel/shirt v */}
      <path d="M22 28 L30 46 L38 28 Z" fill="#f4f1ea" />
      <path d="M28.5 30 L30 38 L31.5 30 Z" fill={pants} />

      {/* arms */}
      <g className="arms">
        <rect className="arm arm-l" x="3" y="33" width="9" height="30" fill={suit} rx="2" />
        <rect className="arm arm-r" x="48" y="33" width="9" height="30" fill={suit} rx="2" />
      </g>
      <circle cx="7.5" cy="64" r="3.5" fill={skin} />
      <circle cx="52.5" cy="64" r="3.5" fill={skin} />

      {/* folder under one arm */}
      <g className="folder">
        <rect x="44" y="50" width="14" height="16" rx="1.5" fill={folder} stroke="#00000055" />
        <line x1="46" y1="54" x2="56" y2="54" stroke="#ffffff90" strokeWidth="0.6" />
        <line x1="46" y1="57" x2="55" y2="57" stroke="#ffffff90" strokeWidth="0.6" />
        <line x1="46" y1="60" x2="56" y2="60" stroke="#ffffff90" strokeWidth="0.6" />
      </g>

      {/* neck */}
      <rect x="26" y="22" width="8" height="7" fill={skin} />

      {/* head */}
      <circle cx="30" cy="16" r="11" fill={skin} />
      {/* hair shapes — vary a touch with seed */}
      {seed % 3 === 0 ? (
        <path d="M19 14 Q19 5 30 4 Q41 5 41 14 L41 9 Q30 2 19 9 Z" fill={hair} />
      ) : seed % 3 === 1 ? (
        <path d="M20 13 Q20 4 30 4 Q42 4 42 16 Q40 11 36 10 Q34 6 30 6 Q24 6 20 13 Z" fill={hair} />
      ) : (
        <path d="M21 10 Q26 3 34 4 Q42 6 41 14 Q35 11 30 11 Q25 11 21 14 Z" fill={hair} />
      )}

      {/* face */}
      <circle cx="26.5" cy="16" r="0.9" fill="#000" className="eye eye-l" />
      <circle cx="33.5" cy="16" r="0.9" fill="#000" className="eye eye-r" />
      {/* mouth: shape depends on mood, swapped via CSS classes */}
      <path className="mouth mouth-neutral" d="M26 21 H34" stroke="#000" strokeWidth="1" fill="none" />
      <path className="mouth mouth-happy" d="M25 20 Q30 24 35 20" stroke="#000" strokeWidth="1" fill="none" />
      <path className="mouth mouth-angry" d="M25 22 Q30 19 35 22" stroke="#000" strokeWidth="1" fill="none" />
      {/* angry brows */}
      <path className="brow brow-l" d="M23 12 L28 14" stroke="#000" strokeWidth="1.1" fill="none" />
      <path className="brow brow-r" d="M37 12 L32 14" stroke="#000" strokeWidth="1.1" fill="none" />

      {bandaged && (
        <g>
          <rect x="22" y="9" width="16" height="3" fill="#f8f5ec" stroke="#00000033" strokeWidth="0.4" />
          <line x1="22" y1="10.5" x2="38" y2="10.5" stroke="#d4cdb8" strokeWidth="0.5" />
        </g>
      )}
    </svg>
  );
}

export default memo(PersonSVG);
