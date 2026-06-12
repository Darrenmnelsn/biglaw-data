import { lazy, Suspense, useState } from "react";
import bgCourthouse from "../art/bg-courthouse.webp";

// Three.js + the lawyer GLB only load when the home screen mounts.
const CharacterShowcase = lazy(() => import("./CharacterShowcase.jsx"));

export default function Home({ save, theme, onPlay, onDaily, onLeaderboard, onToggleMute, onTutorialSeen }) {
  const [showHow, setShowHow] = useState(!save.tutorialSeen);
  const today = new Date().toISOString().slice(0, 10);
  const dailyDone = !!save.daily[today];

  const start = () => {
    if (!save.tutorialSeen) onTutorialSeen();
    onPlay();
  };

  return (
    <div className="screen home art-bg" style={{ "--art-bg": `url(${bgCourthouse})` }}>
      <button className="mute" onClick={onToggleMute} aria-label="Toggle sound">
        {save.muted ? "🔇" : "🔊"}
      </button>
      <h1 className="logo">
        <span className="logo-scale">⚖️</span> Debora Learns Law
      </h1>
      <p className="tagline">Survive the BigLaw inbox. One more day. Always one more day.</p>

      <div className="theme-banner">
        🗓️ This week: <strong>{theme} Week</strong> — {theme} cases pay ×1.25
      </div>

      <div className="home-stage">
        <Suspense
          fallback={
            <div className="showcase showcase-loading">
              <div className="loading-spinner" />
            </div>
          }
        >
          <CharacterShowcase />
        </Suspense>

        <div className="home-actions">
          <button className="btn primary big" onClick={start}>
            Open Your Firm
          </button>
          <button className="btn daily" onClick={onDaily}>
            📅 Daily Case {dailyDone ? "✓ done — back tomorrow" : "— everyone gets the same 10"}
          </button>
          <button className="btn ghost" onClick={onLeaderboard}>
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {save.bestScore > 0 && (
        <p className="best">
          Personal best: <strong>{save.bestScore.toLocaleString()}</strong> billable hours
        </p>
      )}

      {showHow && (
        <div className="howto" role="dialog" aria-label="How to play">
          <h2>How it works</h2>
          <ol>
            <li>📥 Partners email you cases. Open one, pick the right answer.</li>
            <li>⏱️ Cases expire. An overflowing inbox costs you a heart.</li>
            <li>🔥 Streaks multiply your billable hours — ×1.5, ×2, ×3.</li>
            <li>🛒 Bank hours, buy firm upgrades between days.</li>
            <li>💔 Three mistakes and the firm closes.</li>
          </ol>
          <button className="btn primary" onClick={() => setShowHow(false)}>
            Got it
          </button>
        </div>
      )}
      {!showHow && (
        <button className="link" onClick={() => setShowHow(true)}>
          How to play
        </button>
      )}
    </div>
  );
}
