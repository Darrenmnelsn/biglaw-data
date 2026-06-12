import { memo, useEffect, useRef, useState } from "react";
import { useGameDay, multiplierFor, INBOX_CAP } from "../game/useGameDay.js";

function fmtClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const InboxItem = memo(function InboxItem({ item, now, active, onOpen, index }) {
  const total = item.deadlineAt - item.arrivedAt;
  const left = Math.max(0, item.deadlineAt - now);
  const pct = (left / total) * 100;
  const urgent = pct < 30;
  return (
    <button
      className={`inbox-item ${active ? "active" : ""} ${urgent ? "urgent" : ""}`}
      onClick={onOpen}
      aria-label={`Case ${index + 1} from ${item.q.from}`}
    >
      <div className="inbox-row">
        <span className="from">📧 {item.q.from}</span>
        <span className="subj">{item.q.subject}</span>
      </div>
      <div className="deadline-bar">
        <div className="deadline-fill" style={{ width: `${pct}%` }} />
      </div>
    </button>
  );
});

function CaseView({ item, onAnswer, onClose, onResearch, researchLeft }) {
  useEffect(() => {
    const onKey = (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= item.q.options.length && !item.eliminated.includes(n - 1)) onAnswer(n - 1);
      if (e.key === "Escape") onClose();
      if (e.key.toLowerCase() === "r" && researchLeft > 0) onResearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onAnswer, onClose, onResearch, researchLeft]);

  return (
    <div className="case-view" role="dialog" aria-label="Open case">
      <div className="case-head">
        <span className="from">From: {item.q.from}</span>
        <span className="subj-pill">{item.q.subject}</span>
        <button className="close" onClick={onClose} aria-label="Back to inbox">
          ✕
        </button>
      </div>
      <p className="case-body">{item.q.prompt}</p>
      <div className="options">
        {item.q.options.map((opt, i) => (
          <button
            key={i}
            className="option"
            disabled={item.eliminated.includes(i)}
            onClick={() => onAnswer(i)}
          >
            <kbd>{i + 1}</kbd> {item.eliminated.includes(i) ? "— eliminated —" : opt}
          </button>
        ))}
      </div>
      {researchLeft > 0 && item.eliminated.length === 0 && (
        <button className="btn research" onClick={onResearch}>
          🔎 Research ({researchLeft} left) <kbd>R</kbd>
        </button>
      )}
    </div>
  );
}

function Stamp({ feedback, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, feedback.kind === "won" ? 900 : 2400);
    return () => clearTimeout(t);
  }, [feedback, onDone]);
  if (feedback.kind === "won") {
    return (
      <div className="stamp won" key={feedback.at}>
        <div className="stamp-text">CASE WON</div>
        <div className="stamp-gain">
          +{feedback.gain} {feedback.rush && "⚡"} {feedback.mult > 1 && `×${feedback.mult}`}{" "}
          {feedback.themed && "🗓️"}
        </div>
      </div>
    );
  }
  const saved = feedback.kind === "saved";
  return (
    <div className={`stamp lost ${saved ? "soft" : ""}`} key={feedback.at}>
      <div className="stamp-text">{saved ? "PARALEGAL SAVE" : "MALPRACTICE"}</div>
      {feedback.reason !== "wrong" && <div className="stamp-gain">case expired</div>}
      {feedback.rule && <div className="rule-note">📚 {feedback.rule}</div>}
    </div>
  );
}

function Confetti({ at }) {
  if (!at) return null;
  return (
    <div className="confetti" key={at} aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 41) % 100}%`,
            animationDelay: `${(i % 8) * 60}ms`,
            background: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"][i % 4],
          }}
        />
      ))}
    </div>
  );
}

export default function GameDay({ day, theme, upgrades, weakSpots, onMiss, onHit, onDayEnd, onGameOver }) {
  const [state, actions] = useGameDay({ day, upgrades, theme, weakSpots, onMiss, onHit });
  const [shaking, setShaking] = useState(false);
  const reported = useRef(false);

  // screen shake on any heart loss
  const hearts = state.hearts;
  const prevHearts = useRef(hearts);
  useEffect(() => {
    if (hearts < prevHearts.current) setShaking(true);
    prevHearts.current = hearts;
  }, [hearts]);

  useEffect(() => {
    if (reported.current) return;
    const stats = {
      billables: state.billables,
      bestStreak: state.bestStreak,
      casesWon: state.casesWon,
      casesLost: state.casesLost,
      results: state.results,
      day,
    };
    if (state.status === "dayEnd") {
      reported.current = true;
      onDayEnd(stats);
    } else if (state.status === "gameOver") {
      reported.current = true;
      onGameOver(stats);
    }
  }, [state.status, state.billables, state.bestStreak, state.casesWon, state.casesLost, state.results, day, onDayEnd, onGameOver]);

  const active = state.inbox.find((c) => c.uid === state.activeUid);
  const mult = multiplierFor(state.streak);

  return (
    <div
      className={`screen game ${shaking ? "shake" : ""}`}
      onAnimationEnd={(e) => e.animationName === "shake" && setShaking(false)}
    >
      <header className="hud">
        <div className="hud-left">
          <span className="day-chip">Day {day}</span>
          <span className="clock" aria-live="off">
            ⏱️ {fmtClock(state.endsAt - state.now)}
          </span>
          <span className="hearts" aria-label={`${state.hearts} hearts left`}>
            {"❤️".repeat(state.hearts)}
            {"🖤".repeat(Math.max(0, state.maxHearts - state.hearts))}
          </span>
        </div>
        <div className="hud-right">
          <span className={`streak ${state.streak >= 3 ? "hot" : ""}`}>
            🔥 {state.streak} {mult > 1 && <em>×{mult}</em>}
          </span>
          <span className="billables">💼 {state.billables.toLocaleString()}</span>
        </div>
      </header>

      {state.status === "paused" && <div className="paused-veil">Paused — come back!</div>}

      <main className="game-main">
        <section className={`inbox ${state.inbox.length >= INBOX_CAP ? "full" : ""}`} aria-label="Inbox">
          <h2>
            📥 Inbox {state.inbox.length}/{INBOX_CAP}
            {state.inbox.length >= INBOX_CAP && <span className="overflow-warn"> — FULL!</span>}
          </h2>
          {state.inbox.length === 0 && <p className="empty">Quiet… too quiet.</p>}
          {state.inbox.map((item, i) => (
            <InboxItem
              key={item.uid}
              item={item}
              index={i}
              now={state.now}
              active={item.uid === state.activeUid}
              onOpen={() => actions.openCase(item.uid)}
            />
          ))}
        </section>

        <section className="desk">
          {active ? (
            <CaseView
              item={active}
              onAnswer={actions.answer}
              onClose={actions.closeCase}
              onResearch={actions.research}
              researchLeft={state.researchLeft}
            />
          ) : (
            <div className="desk-empty">
              <p>Open a case from your inbox.</p>
              <p className="hint">Tip: answer in under 8s for a ⚡ rush bonus. Keys 1–4 answer.</p>
            </div>
          )}
        </section>
      </main>

      {state.feedback && <Stamp feedback={state.feedback} onDone={actions.clearFeedback} />}
      {state.toast && (
        <div className="assoc-toast" onAnimationEnd={actions.clearToast}>
          🤝 Your senior associate handled one
        </div>
      )}
      <Confetti at={state.confettiAt} />

      <footer className="game-foot">
        <button className="link" onClick={actions.endEarly}>
          End day early
        </button>
      </footer>
    </div>
  );
}
