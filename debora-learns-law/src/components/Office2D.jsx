import { memo, useEffect, useRef, useState } from "react";
import bgLawOffice from "../art/bg-lawoffice.webp";
import charAssistant from "../art/char-assistant.webp";
import charPartner from "../art/char-partner.webp";
import charAssociate from "../art/char-associate.webp";
import charReceptionist from "../art/char-receptionist.webp";
import clientSuit from "../art/client-suit.webp";
import clientBlonde from "../art/client-blonde.webp";
import clientGrey from "../art/client-grey.webp";
import clientGreen from "../art/client-green.webp";

// player avatar is the assistant-with-folder; everyone else can walk in
const CLIENT_SPRITES = [
  clientSuit,
  clientBlonde,
  clientGrey,
  clientGreen,
  charPartner,
  charAssociate,
  charReceptionist,
];

const DOOR_X = -8;
const WAIT_X = [16, 26, 36, 46, 56]; // standing row along the floor
const DESK_CONSULT_X = 72;
const EXIT_HAPPY_X = 112;
const EXIT_ANGRY_X = -14;

function spriteFor(uid) {
  let h = uid * 2654435761;
  h ^= h >>> 13;
  h = (h * 0x85ebca6b) | 0;
  h ^= h >>> 16;
  return CLIENT_SPRITES[Math.abs(h) % CLIENT_SPRITES.length];
}

function urgencyClass(item, now) {
  const total = item.deadlineAt - item.arrivedAt;
  const pct = Math.max(0, (item.deadlineAt - now) / total);
  if (pct < 0.25) return "urgent";
  if (pct < 0.5) return "warn";
  return "";
}

function Actor({ item, from, target, mood, onClick, urgency, now, isActive, label }) {
  const [x, setX] = useState(from);

  useEffect(() => {
    const id = requestAnimationFrame(() => setX(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const walking = Math.abs(x - target) > 1 || Math.abs(from - target) > 2;
  const facingLeft = target < from;

  const deadlinePct =
    item.deadlineAt > item.arrivedAt
      ? Math.max(0, ((item.deadlineAt - now) / (item.deadlineAt - item.arrivedAt)) * 100)
      : null;

  return (
    <button
      className={`actor2 ${walking ? "walking" : ""} ${isActive ? "active" : ""} ${urgency} mood-${mood}`}
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
      <div className="sprite-rocker">
        <img
          src={spriteFor(item.uid)}
          alt=""
          draggable="false"
          style={facingLeft ? { transform: "scaleX(-1)" } : undefined}
        />
      </div>
      <div className="actor-shadow" />
      <div className="actor-label">{item?.q?.from}</div>
    </button>
  );
}

function Office2D({ inbox, exits, activeUid, now, onSelectClient, attorneyMood, heartShake }) {
  const slotForUid = useRef(new Map());
  const lastXForUid = useRef(new Map());
  const taken = new Set();

  for (const item of inbox) {
    if (slotForUid.current.has(item.uid)) taken.add(slotForUid.current.get(item.uid));
  }
  for (const item of inbox) {
    if (!slotForUid.current.has(item.uid)) {
      let slot = 0;
      while (taken.has(slot) && slot < WAIT_X.length - 1) slot += 1;
      slotForUid.current.set(item.uid, slot);
      taken.add(slot);
    }
  }
  const live = new Set([...inbox.map((i) => i.uid), ...exits.map((e) => e.uid)]);
  for (const uid of Array.from(slotForUid.current.keys())) {
    if (!live.has(uid)) {
      slotForUid.current.delete(uid);
      lastXForUid.current.delete(uid);
    }
  }

  return (
    <div
      className={`office2d ${heartShake ? "shake" : ""}`}
      style={{ backgroundImage: `url(${bgLawOffice})` }}
      aria-label="The firm"
    >
      <div className="office2d-vignette" />

      {/* Debora — the player, standing by the desk */}
      <div className={`attorney2 ${activeUid ? "consulting" : ""} ${attorneyMood === "won" ? "won" : ""}`}>
        <img src={charAssistant} alt="Debora, your attorney" draggable="false" />
        <div className="actor-shadow wide" />
      </div>

      <div className="actors2">
        {inbox.map((item) => {
          const isActive = item.uid === activeUid;
          const slot = slotForUid.current.get(item.uid) ?? 0;
          const target = isActive ? DESK_CONSULT_X : WAIT_X[Math.min(slot, WAIT_X.length - 1)];
          const from = lastXForUid.current.get(item.uid) ?? DOOR_X;
          lastXForUid.current.set(item.uid, target);
          return (
            <Actor
              key={item.uid}
              item={item}
              from={from}
              target={target}
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
          const from = lastXForUid.current.get(e.uid) ?? WAIT_X[2];
          return (
            <Actor
              key={`x-${e.uid}`}
              item={{ uid: e.uid, q: e.q, arrivedAt: 0, deadlineAt: 0 }}
              from={from}
              target={target}
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

export default memo(Office2D);
