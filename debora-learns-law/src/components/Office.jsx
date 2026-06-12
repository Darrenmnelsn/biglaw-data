import { memo, useEffect, useRef, useState } from "react";
import Person from "./Person.jsx";

// horizontal coords in the scene (percentages)
const DOOR_X = 4;
const BENCH_X = [22, 30, 38, 46, 54];
const DESK_CONSULT_X = 67; // where the client stands across from the attorney
const EXIT_HAPPY_X = 110;
const EXIT_ANGRY_X = -12;
const FLOOR_Y = 70; // baseline %

function urgencyClass(item, now) {
  const total = item.deadlineAt - item.arrivedAt;
  const pct = Math.max(0, (item.deadlineAt - now) / total);
  if (pct < 0.25) return "urgent";
  if (pct < 0.5) return "warn";
  return "";
}

// A client component that handles its own entrance animation.
// It mounts at the door and walks to its target on the next frame.
function Actor({ item, from, target, walking, mood, onClick, urgency, now, isActive, label }) {
  const [x, setX] = useState(from);

  useEffect(() => {
    // next frame after mount/prop change, transition toward target
    const id = requestAnimationFrame(() => setX(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const deadlinePct = item
    ? Math.max(
        0,
        ((item.deadlineAt - now) / (item.deadlineAt - item.arrivedAt)) * 100
      )
    : null;

  return (
    <button
      className={`actor ${walking ? "walking" : "standing"} ${
        isActive ? "active" : ""
      } ${urgency}`}
      style={{ left: `${x}%` }}
      onClick={onClick}
      aria-label={label}
      tabIndex={onClick ? 0 : -1}
    >
      {deadlinePct != null && !isActive && (
        <div className="patience">
          <div className="patience-fill" style={{ width: `${deadlinePct}%` }} />
        </div>
      )}
      <Person
        seed={item ? item.uid * 2654435761 : 0}
        subject={item?.q?.subject}
        mood={mood}
        walking={walking}
        bandaged={item?.q?.subject === "Torts" && (item.uid % 2 === 0)}
      />
      <div className="actor-label">{item?.q?.from}</div>
    </button>
  );
}

const Bookshelf = memo(function Bookshelf() {
  // generate book spines once
  const shelves = 3;
  const booksPerShelf = 18;
  const colors = [
    "#7a2a2a",
    "#4a6e2a",
    "#2a4a7a",
    "#7a5a2a",
    "#5a2a5a",
    "#2a5a5a",
    "#6e2a4a",
    "#3a3a3a",
  ];
  return (
    <svg className="bookshelf" viewBox="0 0 220 220" preserveAspectRatio="none">
      <rect x="0" y="0" width="220" height="220" fill="#3d2a1c" />
      <rect x="2" y="2" width="216" height="216" fill="#5a3a22" />
      {Array.from({ length: shelves }, (_, s) => {
        const y = 10 + s * 70;
        return (
          <g key={s}>
            <rect x="6" y={y - 4} width="208" height="62" fill="#1a0f08" />
            {Array.from({ length: booksPerShelf }, (_, i) => {
              const c = colors[(s * 7 + i * 3) % colors.length];
              const w = 8 + ((i * 5) % 5);
              const h = 50 + ((i * 3) % 8);
              const x = 8 + i * 11.4;
              return (
                <g key={i}>
                  <rect x={x} y={y + (58 - h)} width={w} height={h} fill={c} />
                  <rect
                    x={x + 1}
                    y={y + (58 - h) + 4}
                    width={w - 2}
                    height="3"
                    fill="#ffffff66"
                  />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
});

const Diploma = memo(function Diploma() {
  return (
    <svg className="diploma" viewBox="0 0 100 80">
      <rect x="0" y="0" width="100" height="80" fill="#8a6a3a" />
      <rect x="4" y="4" width="92" height="72" fill="#f4ead2" />
      <text x="50" y="22" textAnchor="middle" fontSize="11" fill="#3a2a18" fontWeight="700">
        UVA LAW
      </text>
      <text x="50" y="40" textAnchor="middle" fontSize="6.5" fill="#3a2a18">
        Juris Doctor
      </text>
      <line x1="20" y1="50" x2="80" y2="50" stroke="#3a2a18" strokeWidth="0.5" />
      <line x1="20" y1="56" x2="80" y2="56" stroke="#3a2a18" strokeWidth="0.5" />
      <line x1="20" y1="62" x2="80" y2="62" stroke="#3a2a18" strokeWidth="0.5" />
      <circle cx="78" cy="68" r="6" fill="#b89230" stroke="#7a5a18" />
      <path d="M75 68 L78 71 L82 65" stroke="#3a2a18" strokeWidth="1" fill="none" />
    </svg>
  );
});

const Plaque = memo(function Plaque({ name }) {
  return (
    <svg className="plaque" viewBox="0 0 220 60">
      <rect x="0" y="0" width="220" height="60" fill="#1f1410" />
      <rect x="3" y="3" width="214" height="54" fill="#b8902f" />
      <rect x="6" y="6" width="208" height="48" fill="#dab84a" />
      <text
        x="110"
        y="38"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="#3a2410"
        letterSpacing="2"
      >
        {name}
      </text>
    </svg>
  );
});

const Attorney = memo(function Attorney({ active, heartLost, won }) {
  // sits behind the desk — head + shoulders visible
  return (
    <div
      className={`attorney ${active ? "lean" : ""} ${heartLost ? "shake-head" : ""} ${
        won ? "thumbs" : ""
      }`}
    >
      <svg viewBox="0 0 120 110">
        {/* chair back */}
        <rect x="20" y="30" width="80" height="80" rx="10" fill="#2a1c12" />
        <rect x="24" y="34" width="72" height="72" rx="8" fill="#3a2818" />
        {/* shoulders / blazer */}
        <path
          d="M16 95 Q16 70 36 64 H84 Q104 70 104 95 Z"
          fill="#1f2a3a"
        />
        <path d="M50 64 L60 92 L70 64 Z" fill="#f4f1ea" />
        <path d="M58 66 L60 78 L62 66 Z" fill="#6b1f1f" />
        {/* neck */}
        <rect x="54" y="50" width="12" height="14" fill="#e8c0a0" />
        {/* head */}
        <circle cx="60" cy="42" r="18" fill="#e8c0a0" />
        {/* hair — a polished bob */}
        <path
          d="M42 42 Q42 22 60 22 Q78 22 78 42 Q78 36 74 33 L72 50 L70 36 Q60 30 50 36 L48 50 L46 33 Q42 36 42 42 Z"
          fill="#2a1810"
        />
        {/* eyes */}
        <circle className="eye eye-l" cx="54" cy="42" r="1.2" fill="#0a0a0a" />
        <circle className="eye eye-r" cx="66" cy="42" r="1.2" fill="#0a0a0a" />
        {/* mouth */}
        <path
          className="att-mouth"
          d="M54 50 Q60 53 66 50"
          stroke="#5a2a20"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
    </div>
  );
});

function Office({ inbox, exits, activeUid, now, onSelectClient, attorneyMood, heartShake }) {
  // assign each inbox uid a stable bench slot for the duration of its wait
  const slotForUid = useRef(new Map());
  // remember last on-screen x for every uid, so exits start from the right place
  const lastXForUid = useRef(new Map());
  const taken = new Set();

  // first reclaim slots for items still here
  for (const item of inbox) {
    if (slotForUid.current.has(item.uid)) {
      taken.add(slotForUid.current.get(item.uid));
    }
  }
  // then place new items in the lowest free slot
  for (const item of inbox) {
    if (!slotForUid.current.has(item.uid)) {
      let slot = 0;
      while (taken.has(slot) && slot < BENCH_X.length - 1) slot += 1;
      slotForUid.current.set(item.uid, slot);
      taken.add(slot);
    }
  }
  // garbage-collect slot reservations once the client has fully walked off
  const liveUids = new Set([
    ...inbox.map((i) => i.uid),
    ...exits.map((e) => e.uid),
  ]);
  for (const uid of Array.from(slotForUid.current.keys())) {
    if (!liveUids.has(uid)) {
      slotForUid.current.delete(uid);
      lastXForUid.current.delete(uid);
    }
  }

  return (
    <div className="office" aria-label="The firm">
      {/* back wall */}
      <div className="wall">
        <div className="moulding top" />
        <div className="moulding bottom" />
        <div className="window-light" />
        <div className="bookshelf-wrap">
          <Bookshelf />
        </div>
        <div className="diploma-wrap">
          <Diploma />
        </div>
        <div className="plaque-wrap">
          <Plaque name="STUDI LAW" />
        </div>
        <div className="wall-clock" aria-hidden="true">
          <svg viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="#0a0a0a" />
            <circle cx="30" cy="30" r="25" fill="#fbf5e1" />
            <circle cx="30" cy="30" r="25" fill="none" stroke="#8a6a3a" strokeWidth="2" />
            <text x="30" y="11" textAnchor="middle" fontSize="6" fill="#2a1810">XII</text>
            <text x="48" y="33" textAnchor="middle" fontSize="6" fill="#2a1810">III</text>
            <text x="30" y="55" textAnchor="middle" fontSize="6" fill="#2a1810">VI</text>
            <text x="12" y="33" textAnchor="middle" fontSize="6" fill="#2a1810">IX</text>
            <line className="hand hour" x1="30" y1="30" x2="30" y2="18" stroke="#2a1810" strokeWidth="2" strokeLinecap="round" />
            <line className="hand minute" x1="30" y1="30" x2="30" y2="10" stroke="#2a1810" strokeWidth="1.5" strokeLinecap="round" />
            <line className="hand second" x1="30" y1="30" x2="30" y2="8" stroke="#7a2a2a" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="30" cy="30" r="1.6" fill="#2a1810" />
          </svg>
        </div>
        <div className="potted-plant" aria-hidden="true">
          <svg viewBox="0 0 60 100">
            <path d="M30 70 Q12 50 16 30 Q26 36 30 50 Q34 36 44 30 Q48 50 30 70 Z" fill="#1d6b3a" />
            <path d="M30 60 Q20 44 24 28 Q30 36 30 50 Q30 36 36 28 Q40 44 30 60 Z" fill="#2d8b4a" />
            <path d="M30 56 Q22 42 26 26 Q30 34 30 50 Q30 34 34 26 Q38 42 30 56 Z" fill="#3da85d" />
            <path d="M16 68 L44 68 L40 96 L20 96 Z" fill="#7a3a18" />
            <ellipse cx="30" cy="68" rx="14" ry="3" fill="#5a2410" />
          </svg>
        </div>
        <div className="painting" aria-hidden="true">
          <svg viewBox="0 0 100 70">
            <rect x="0" y="0" width="100" height="70" fill="#3a2410" />
            <rect x="3" y="3" width="94" height="64" fill="#dab84a" />
            <rect x="6" y="6" width="88" height="58" fill="#0e2244" />
            <circle cx="80" cy="20" r="8" fill="#fbe7b3" opacity="0.9" />
            <path d="M0 50 Q25 38 50 46 T100 42 L100 70 L0 70 Z" fill="#1a3a5a" />
            <path d="M0 58 Q30 50 60 55 T100 52 L100 70 L0 70 Z" fill="#0a1f3a" />
          </svg>
        </div>
        <div className="door" aria-hidden="true">
          <div className="door-pane left" />
          <div className="door-pane right" />
          <div className="door-knob" />
        </div>
        <div className="bench" aria-hidden="true">
          <div className="bench-back" />
          <div className="bench-seat" />
          <div className="bench-legs" />
        </div>
        <div className="desk" aria-hidden="true">
          <div className="desk-top" />
          <div className="desk-front" />
          <div className="lamp">
            <div className="lamp-shade" />
            <div className="lamp-arm" />
            <div className="lamp-base" />
            <div className="lamp-glow" />
          </div>
          <div className="computer">
            <div className="screen" />
            <div className="stand" />
          </div>
          <div className="nameplate">DEBORA, ESQ.</div>
          <div className="papers" aria-hidden="true">
            <div className="paper-stack" />
            <div className="paper-loose" />
          </div>
          <div className="coffee" aria-hidden="true">
            <div className="steam s1" />
            <div className="steam s2" />
            <div className="steam s3" />
            <div className="cup" />
            <div className="cup-handle" />
          </div>
        </div>
        <div className="floor" />
      </div>

      {/* attorney sits behind the desk */}
      <div className="attorney-wrap">
        <Attorney
          active={!!activeUid}
          heartLost={heartShake}
          won={attorneyMood === "won"}
        />
      </div>

      {/* waiting clients + active + exits */}
      <div className="actors">
        {inbox.map((item) => {
          const isActive = item.uid === activeUid;
          const slot = slotForUid.current.get(item.uid) ?? 0;
          const target = isActive ? DESK_CONSULT_X : BENCH_X[Math.min(slot, BENCH_X.length - 1)];
          const from = lastXForUid.current.get(item.uid) ?? DOOR_X;
          lastXForUid.current.set(item.uid, target);
          // walking when moving more than a couple percent
          const walking = Math.abs(target - from) > 2;
          return (
            <Actor
              key={item.uid}
              item={item}
              from={from}
              target={target}
              walking={walking}
              mood="neutral"
              urgency={isActive ? "" : urgencyClass(item, now)}
              isActive={isActive}
              now={now}
              onClick={!isActive ? () => onSelectClient(item.uid) : undefined}
              label={`Invite ${item.q.from} (${item.q.subject}) to your desk`}
            />
          );
        })}
        {exits.map((e) => {
          const target = e.mood === "happy" ? EXIT_HAPPY_X : EXIT_ANGRY_X;
          const from = lastXForUid.current.get(e.uid) ?? BENCH_X[2];
          // don't overwrite — they're on their way out
          return (
            <Actor
              key={`x-${e.uid}`}
              item={{ uid: e.uid, q: e.q, arrivedAt: 0, deadlineAt: 0 }}
              from={from}
              target={target}
              walking={true}
              mood={e.mood}
              urgency=""
              isActive={false}
              now={now}
              onClick={undefined}
              label=""
            />
          );
        })}
      </div>
    </div>
  );
}

export default memo(Office);
