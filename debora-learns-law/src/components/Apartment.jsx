import { useMemo, useState } from "react";
import { FURNITURE, HOME_TIERS } from "../game/save.js";
import { sfx } from "../game/sound.js";

// --- furniture SVG renderers, positioned in the room ----------------------
function Furniture({ id }) {
  switch (id) {
    case "rug":
      return (
        <g key={id} className="furn rug">
          <ellipse cx="50" cy="83" rx="36" ry="2.5" fill="#7a2a2a" />
          <ellipse cx="50" cy="83" rx="32" ry="2" fill="#5a1f1f" />
        </g>
      );
    case "couch":
      return (
        <g key={id} className="furn couch">
          <rect x="22" y="74" width="32" height="10" rx="2" fill="#3a4a6a" />
          <rect x="22" y="68" width="32" height="8" rx="2" fill="#4a5a7a" />
          <rect x="20" y="68" width="4" height="16" rx="1" fill="#2a3a5a" />
          <rect x="52" y="68" width="4" height="16" rx="1" fill="#2a3a5a" />
          <rect x="26" y="76" width="9" height="6" rx="1" fill="#5a6a8a" />
          <rect x="36" y="76" width="9" height="6" rx="1" fill="#5a6a8a" />
        </g>
      );
    case "lamp":
      return (
        <g key={id} className="furn lamp">
          <rect x="80" y="62" width="2" height="22" fill="#2a1810" />
          <path d="M76 56 L86 56 L84 64 L78 64 Z" fill="#dab84a" />
          <ellipse cx="81" cy="84" rx="5" ry="1.2" fill="#1a0e08" />
          <ellipse cx="81" cy="62" rx="10" ry="6" fill="#ffeb99" opacity="0.4" />
        </g>
      );
    case "plant":
      return (
        <g key={id} className="furn plant">
          <path d="M12 76 Q6 64 9 56 Q13 60 14 68 Q16 60 20 56 Q22 64 16 76 Z" fill="#2d8b4a" />
          <path d="M12 72 Q8 62 12 54 Q14 60 14 68 Q15 60 18 54 Q20 62 16 72 Z" fill="#3da85d" />
          <path d="M9 76 L19 76 L17 84 L11 84 Z" fill="#7a3a18" />
        </g>
      );
    case "art":
      return (
        <g key={id} className="furn art">
          <rect x="34" y="20" width="20" height="14" fill="#2a1810" />
          <rect x="35" y="21" width="18" height="12" fill="#dab84a" />
          <rect x="36" y="22" width="16" height="10" fill="#0e2244" />
          <circle cx="48" cy="25" r="1.6" fill="#fbe7b3" />
          <path d="M36 30 Q42 26 48 28 T52 27 L52 32 L36 32 Z" fill="#1a3a5a" />
        </g>
      );
    case "tv":
      return (
        <g key={id} className="furn tv">
          <rect x="58" y="46" width="22" height="14" rx="1" fill="#0a0a0a" />
          <rect x="59" y="47" width="20" height="12" fill="#1a2a4a" />
          <rect x="60" y="48" width="18" height="10" fill="#2a5a7a" opacity="0.6" />
          <rect x="67" y="60" width="4" height="2" fill="#0a0a0a" />
        </g>
      );
    case "bookshelf":
      return (
        <g key={id} className="furn bookshelf">
          <rect x="62" y="48" width="18" height="36" fill="#3a2418" />
          <line x1="62" y1="56" x2="80" y2="56" stroke="#1a0e08" strokeWidth="0.6" />
          <line x1="62" y1="64" x2="80" y2="64" stroke="#1a0e08" strokeWidth="0.6" />
          <line x1="62" y1="72" x2="80" y2="72" stroke="#1a0e08" strokeWidth="0.6" />
          {[
            ["#7a2a2a", 63, 49],
            ["#2a4a7a", 65, 49],
            ["#4a6e2a", 67, 49],
            ["#7a5a2a", 70, 49],
            ["#5a2a5a", 72, 49],
            ["#7a2a2a", 75, 49],
            ["#2a4a7a", 77, 49],
            ["#4a6e2a", 63, 57],
            ["#7a5a2a", 65, 57],
            ["#7a2a2a", 67, 57],
            ["#2a4a7a", 70, 57],
            ["#5a2a5a", 72, 57],
            ["#7a5a2a", 75, 57],
            ["#4a6e2a", 77, 57],
            ["#7a2a2a", 63, 65],
            ["#7a5a2a", 65, 65],
            ["#2a4a7a", 67, 65],
            ["#4a6e2a", 70, 65],
            ["#7a2a2a", 72, 65],
            ["#5a2a5a", 75, 65],
            ["#2a4a7a", 77, 65],
          ].map(([c, x, y], i) => (
            <rect key={i} x={x} y={y} width="1.8" height="6.5" fill={c} />
          ))}
        </g>
      );
    case "cat":
      return (
        <g key={id} className="furn cat">
          {/* body */}
          <ellipse cx="44" cy="80" rx="6" ry="3" fill="#3a2a18" />
          {/* head */}
          <circle cx="40" cy="77" r="3" fill="#3a2a18" />
          <path d="M38 75 L37.5 73 L39 74.5 Z" fill="#3a2a18" />
          <path d="M41 75 L41.5 73 L40 74.5 Z" fill="#3a2a18" />
          {/* tail */}
          <path
            d="M49 80 Q54 76 52 72"
            stroke="#3a2a18"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* eyes */}
          <circle cx="39" cy="77" r="0.4" fill="#dab84a" />
          <circle cx="41" cy="77" r="0.4" fill="#dab84a" />
        </g>
      );
    case "fireplace":
      return (
        <g key={id} className="furn fireplace">
          <rect x="6" y="46" width="22" height="38" fill="#3a2a1f" />
          <rect x="8" y="48" width="18" height="34" fill="#1a0e08" />
          <rect x="10" y="58" width="14" height="22" fill="#000" />
          {/* fire */}
          <path
            className="flame"
            d="M14 78 Q17 70 14 64 Q21 68 19 76 Q23 70 21 64 Q26 72 22 80 Z"
            fill="#ff8a3d"
          />
          <path
            className="flame inner"
            d="M16 78 Q18 72 16 68 Q20 72 18 78 Z"
            fill="#ffd54a"
          />
          {/* mantle */}
          <rect x="4" y="44" width="26" height="3" fill="#5a3a22" />
        </g>
      );
    case "piano":
      return (
        <g key={id} className="furn piano">
          <path d="M24 78 L60 78 L58 88 L26 88 Z" fill="#0a0a0a" />
          <rect x="26" y="76" width="32" height="4" fill="#1a1a1a" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={27 + i * 2.5} y="78" width="2" height="3" fill="white" />
          ))}
          {[1, 2, 4, 5, 6, 8, 9, 11].map((i, k) => (
            <rect key={k} x={28.2 + i * 2.5} y="78" width="1" height="2" fill="#0a0a0a" />
          ))}
          <rect x="28" y="86" width="2" height="6" fill="#0a0a0a" />
          <rect x="54" y="86" width="2" height="6" fill="#0a0a0a" />
        </g>
      );
    case "gym":
      return (
        <g key={id} className="furn gym">
          <rect x="62" y="78" width="20" height="6" fill="#2a2a2a" />
          <circle cx="64" cy="75" r="3.5" fill="#1a1a1a" />
          <circle cx="80" cy="75" r="3.5" fill="#1a1a1a" />
          <rect x="66" y="74" width="12" height="2" fill="#5a5a5a" />
        </g>
      );
    case "chandelier":
      return (
        <g key={id} className="furn chandelier">
          <line x1="50" y1="10" x2="50" y2="22" stroke="#2a2a2a" strokeWidth="0.5" />
          <ellipse cx="50" cy="24" rx="10" ry="3" fill="#dab84a" />
          <circle cx="42" cy="28" r="2" fill="#fff4cc" opacity="0.9" />
          <circle cx="50" cy="30" r="2" fill="#fff4cc" opacity="0.9" />
          <circle cx="58" cy="28" r="2" fill="#fff4cc" opacity="0.9" />
          <circle cx="46" cy="32" r="1.4" fill="#fff4cc" opacity="0.7" />
          <circle cx="54" cy="32" r="1.4" fill="#fff4cc" opacity="0.7" />
        </g>
      );
    case "hottub":
      return (
        <g key={id} className="furn hottub">
          <ellipse cx="74" cy="84" rx="14" ry="3.5" fill="#5a3a18" />
          <ellipse cx="74" cy="82" rx="13" ry="3" fill="#1f4a7a" />
          <ellipse cx="74" cy="81.5" rx="11" ry="2" fill="#3a7aaa" opacity="0.8" />
          <circle cx="70" cy="79" r="0.6" fill="white" opacity="0.7" />
          <circle cx="76" cy="80" r="0.5" fill="white" opacity="0.7" />
          <circle cx="80" cy="79.5" r="0.6" fill="white" opacity="0.7" />
        </g>
      );
    case "skyline":
      return null; // rendered as window content via the room
    default:
      return null;
  }
}

function Room({ tier, owned }) {
  const t = HOME_TIERS[tier];
  const hasSkyline = !!owned.skyline;
  const wallTone = ["#5a3a22", "#6a3a22", "#6a4030", "#5a4a4a", "#1a1a2a"][tier];
  const floorTone = ["#3a2010", "#4a2818", "#4a3018", "#2a2010", "#1a1a2a"][tier];

  return (
    <svg className="room" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* back wall */}
      <rect x="0" y="0" width="100" height="84" fill={wallTone} />
      {/* tier 2+ gets a subtle wallpaper stripe */}
      {tier >= 2 && (
        <g opacity="0.15">
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={i * 7.2} y="0" width="0.5" height="84" fill="white" />
          ))}
        </g>
      )}
      {/* window — bigger and view nicer per tier */}
      <g>
        <rect
          x={tier >= 3 ? 14 : 18}
          y="14"
          width={tier >= 3 ? 30 : tier >= 1 ? 22 : 16}
          height={tier >= 3 ? 40 : tier >= 1 ? 32 : 22}
          fill="#2a1810"
        />
        <rect
          x={tier >= 3 ? 16 : 20}
          y="16"
          width={tier >= 3 ? 26 : tier >= 1 ? 18 : 12}
          height={tier >= 3 ? 36 : tier >= 1 ? 28 : 18}
          fill={hasSkyline ? "#040b1c" : tier >= 4 ? "#040b1c" : "#1f3a5a"}
        />
        {/* skyline view */}
        {(hasSkyline || tier === 4) && (
          <g>
            <rect x={20} y={36} width="3" height="14" fill="#0a0a14" />
            <rect x={24} y={30} width="4" height="20" fill="#08080f" />
            <rect x={29} y={26} width="5" height="24" fill="#06060c" />
            <rect x={35} y={32} width="3" height="18" fill="#08080f" />
            <rect x={39} y={28} width="4" height="22" fill="#06060c" />
            <g opacity="0.9">
              {Array.from({ length: 28 }, (_, i) => (
                <rect
                  key={i}
                  x={21 + (i * 0.8) % 22}
                  y={32 + (i * 1.4) % 16}
                  width="0.7"
                  height="1"
                  fill="#ffd87a"
                  opacity={0.4 + ((i * 7) % 10) / 10}
                />
              ))}
            </g>
            <circle cx={36} cy={20} r="2" fill="#e8e8f0" opacity="0.9" />
          </g>
        )}
        {/* day view */}
        {!hasSkyline && tier < 4 && (
          <>
            <circle cx={tier >= 3 ? 32 : 26} cy="22" r="3" fill="#ffd54a" opacity="0.9" />
            <path
              d={`M${tier >= 3 ? 16 : 20} 34 Q ${tier >= 3 ? 26 : 24} 30 ${tier >= 3 ? 36 : 30} 34 T ${tier >= 3 ? 42 : 32} 34 L ${tier >= 3 ? 42 : 32} ${tier >= 3 ? 50 : 32} L ${tier >= 3 ? 16 : 20} ${tier >= 3 ? 50 : 32} Z`}
              fill="#1a3a5a"
            />
          </>
        )}
        {/* mullions */}
        <line
          x1={tier >= 3 ? 29 : tier >= 1 ? 29 : 26}
          y1="16"
          x2={tier >= 3 ? 29 : tier >= 1 ? 29 : 26}
          y2={tier >= 3 ? 52 : tier >= 1 ? 44 : 34}
          stroke="#2a1810"
          strokeWidth="0.8"
        />
        <line
          x1={tier >= 3 ? 16 : 20}
          y1={tier >= 3 ? 34 : tier >= 1 ? 30 : 25}
          x2={tier >= 3 ? 42 : tier >= 1 ? 38 : 32}
          y2={tier >= 3 ? 34 : tier >= 1 ? 30 : 25}
          stroke="#2a1810"
          strokeWidth="0.8"
        />
      </g>
      {/* second floor outline for townhouse/penthouse */}
      {tier >= 3 && (
        <g opacity="0.6">
          <line x1="0" y1="60" x2="100" y2="60" stroke="#2a1810" strokeWidth="0.6" />
        </g>
      )}
      {/* baseboard */}
      <rect x="0" y="82" width="100" height="2" fill="#2a1810" />
      {/* floor */}
      <rect x="0" y="84" width="100" height="16" fill={floorTone} />
      {tier >= 1 && (
        <g opacity="0.25">
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1={i * 8.5}
              y1="84"
              x2={i * 8.5}
              y2="100"
              stroke="#000"
              strokeWidth="0.4"
            />
          ))}
        </g>
      )}
      {/* Debora at home — small avatar near the right */}
      <g className="home-debora">
        <ellipse cx="91" cy="83" rx="3" ry="0.6" fill="#000" opacity="0.5" />
        <rect x="89" y="72" width="4" height="10" fill="#1f2a3a" />
        <rect x="89.5" y="78" width="1.2" height="5" fill="#2a1c12" />
        <rect x="91.5" y="78" width="1.2" height="5" fill="#2a1c12" />
        <circle cx="91" cy="69" r="2.4" fill="#e8c0a0" />
        <path d="M88.6 69 Q88.6 65 91 65 Q93.4 65 93.4 69 Q92.6 66.5 91 66.5 Q89.4 66.5 88.6 69 Z" fill="#2a1810" />
      </g>
      {/* render owned furniture */}
      {Object.keys(owned)
        .filter((k) => owned[k] && k !== "skyline")
        .map((k) => (
          <Furniture key={k} id={k} />
        ))}
    </svg>
  );
}

export default function Apartment({ save, day, theme, onBuyHome, onNextDay }) {
  const tier = save.home.tier;
  const owned = save.home.furniture;
  const tierInfo = HOME_TIERS[tier];
  const nextTier = HOME_TIERS[tier + 1];
  const [tab, setTab] = useState("furniture");

  const available = useMemo(
    () => FURNITURE.filter((f) => f.tier <= tier),
    [tier]
  );

  function buyFurniture(item) {
    if (owned[item.id] || save.bank < item.cost) return;
    sfx.buy();
    onBuyHome({ kind: "furniture", id: item.id, cost: item.cost });
  }

  function buyTier() {
    if (!nextTier || save.bank < nextTier.cost) return;
    sfx.buy();
    onBuyHome({ kind: "tier", cost: nextTier.cost });
  }

  return (
    <div className="screen apartment">
      <header className="apt-head">
        <div>
          <h1>🏠 {tierInfo.name}</h1>
          <p className="apt-sub">{tierInfo.desc}</p>
        </div>
        <div className="apt-bank">
          💼 {save.bank.toLocaleString()} <span>banked</span>
        </div>
      </header>

      <div className="room-wrap">
        <Room tier={tier} owned={owned} />
      </div>

      <nav className="apt-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "furniture"}
          className={tab === "furniture" ? "on" : ""}
          onClick={() => setTab("furniture")}
        >
          🪑 Furnish
        </button>
        <button
          role="tab"
          aria-selected={tab === "upgrade"}
          className={tab === "upgrade" ? "on" : ""}
          onClick={() => setTab("upgrade")}
        >
          🏗️ Move Up
        </button>
      </nav>

      {tab === "furniture" && (
        <div className="furn-grid">
          {available.map((f) => {
            const haveIt = !!owned[f.id];
            const affordable = save.bank >= f.cost;
            return (
              <button
                key={f.id}
                className={`furn-card ${haveIt ? "owned" : ""}`}
                disabled={haveIt || !affordable}
                onClick={() => buyFurniture(f)}
              >
                <div className="furn-icon">{f.icon}</div>
                <div className="furn-name">{f.name}</div>
                <div className="furn-cost">
                  {haveIt ? "✓ Owned" : `${f.cost.toLocaleString()} hrs`}
                </div>
              </button>
            );
          })}
          {FURNITURE.filter((f) => f.tier > tier).length > 0 && (
            <p className="furn-locked">
              🔒 More furniture unlocks when you move up.
            </p>
          )}
        </div>
      )}

      {tab === "upgrade" && (
        <div className="upgrade-panel">
          {nextTier ? (
            <>
              <h3>Next: {nextTier.name}</h3>
              <p>{nextTier.desc}</p>
              <button
                className="btn primary big"
                disabled={save.bank < nextTier.cost}
                onClick={buyTier}
              >
                Move in — {nextTier.cost.toLocaleString()} hrs
              </button>
            </>
          ) : (
            <p className="apt-sub">You've reached the top. The view's pretty good.</p>
          )}
        </div>
      )}

      <div className="apt-actions">
        <button className="btn primary big" onClick={onNextDay}>
          Sleep — Start Day {day + 1} →
        </button>
      </div>
    </div>
  );
}
