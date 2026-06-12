import { useEffect, useRef, useState } from "react";
import { useGameDay, multiplierFor, INBOX_CAP } from "../game/useGameDay.js";
import CasePanel from "./CasePanel.jsx";
import Office from "./Office2D.jsx";

function fmtClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
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

  // sweep exits older than the walk-out animation length
  useEffect(() => {
    if (state.exits.length === 0) return;
    const t = setInterval(() => actions.sweepExits(Date.now() - 1600), 600);
    return () => clearInterval(t);
  }, [state.exits.length, actions]);

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
  const lobby = state.inbox.length;

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
          <span
            className={`lobby-chip ${lobby >= INBOX_CAP ? "full" : ""}`}
            title="Clients waiting"
          >
            🪑 {lobby}/{INBOX_CAP}
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

      <main className="game-main office-main">
        <Office
          inbox={state.inbox}
          exits={state.exits}
          activeUid={state.activeUid}
          now={state.now}
          onSelectClient={(uid) => actions.openCase(uid)}
          attorneyMood={state.feedback?.kind === "won" ? "won" : "neutral"}
          heartShake={shaking}
        />
        {active && (
          <CasePanel
            item={active}
            onAnswer={actions.answer}
            onClose={actions.closeCase}
            onResearch={actions.research}
            researchLeft={state.researchLeft}
          />
        )}
        {!active && state.inbox.length === 0 && (
          <div className="office-tip">
            <p>Quiet for a moment. Someone's about to walk in.</p>
            <p className="hint">Tip: click a waiting client to call them up. Keys 1–4 answer, ⚡ in &lt;8s for a rush bonus.</p>
          </div>
        )}
        {!active && state.inbox.length > 0 && (
          <div className="office-tip subtle">
            <p>📣 Click a client on the bench to call them up to your desk.</p>
          </div>
        )}
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
