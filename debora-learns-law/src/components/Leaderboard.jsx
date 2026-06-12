import { useState } from "react";

export default function Leaderboard({ save, onClear, onHome }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="screen leaderboard">
      <h1>🏆 Leaderboard</h1>
      {save.bestScore > 0 && (
        <div className="pinned-best">
          Your best: <strong>{save.bestScore.toLocaleString()}</strong> billable hours
        </div>
      )}
      {save.scores.length === 0 ? (
        <p className="empty">No runs yet. The firm awaits.</p>
      ) : (
        <ol className="score-list">
          {save.scores.map((s, i) => (
            <li key={`${s.date}-${i}`} className={s.score === save.bestScore ? "is-best" : ""}>
              <span className="rank">#{i + 1}</span>
              <span className="score">{s.score.toLocaleString()}</span>
              <span className="meta">
                Day {s.day} · 🔥{s.streak} · {s.date}
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="lb-actions">
        <button className="btn primary" onClick={onHome}>
          Back
        </button>
        {save.scores.length > 0 &&
          (confirming ? (
            <span className="confirm-clear">
              Really clear?{" "}
              <button
                className="link danger"
                onClick={() => {
                  onClear();
                  setConfirming(false);
                }}
              >
                Yes, clear
              </button>{" "}
              <button className="link" onClick={() => setConfirming(false)}>
                No
              </button>
            </span>
          ) : (
            <button className="link danger" onClick={() => setConfirming(true)}>
              Clear scores
            </button>
          ))}
      </div>
    </div>
  );
}
