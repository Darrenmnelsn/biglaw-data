import { useState } from "react";
import { buildRunShare, copyToClipboard } from "../game/share.js";
import propsDocs from "../art/props-docs.webp";

export default function GameOver({ run, save, onPlayAgain, onHome }) {
  const [copied, setCopied] = useState(false);
  const isBest = run.total >= save.bestScore && run.total > 0;

  const share = async () => {
    const ok = await copyToClipboard(
      buildRunShare({ day: run.day, score: run.total, bestStreak: run.bestStreak, results: run.results })
    );
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="screen gameover">
      <h1>🏚️ Firm Closed</h1>
      <p className="subtitle">The partners have lost patience. But every great lawyer fails the bar once…</p>

      {isBest && <div className="new-best">🎉 NEW PERSONAL BEST</div>}

      <div className="stat-row">
        <div className="stat">
          <span className="stat-num">{run.total.toLocaleString()}</span>
          <span className="stat-label">total billable hours</span>
        </div>
        <div className="stat">
          <span className="stat-num">{run.day}</span>
          <span className="stat-label">days survived</span>
        </div>
        <div className="stat">
          <span className="stat-num">🔥 {run.bestStreak}</span>
          <span className="stat-label">best streak</span>
        </div>
      </div>

      <div className="results-grid" aria-label="Run history">
        {run.results.slice(-30).join("")}
      </div>

      <img className="gameover-art" src={propsDocs} alt="" draggable="false" />

      <div className="gameover-actions">
        <button className="btn primary big" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="btn ghost" onClick={share}>
          {copied ? "✓ Copied!" : "📋 Share result"}
        </button>
        <button className="link" onClick={onHome}>
          Return to Home
        </button>
      </div>
    </div>
  );
}
