import { useEffect } from "react";

export default function CasePanel({ item, onAnswer, onClose, onResearch, researchLeft }) {
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
    <div className="case-panel" role="dialog" aria-label="Open case">
      <div className="case-paper">
        <div className="case-paper-tab" />
        <div className="case-head">
          <span className="from">📁 {item.q.from}</span>
          <span className="subj-pill">{item.q.subject}</span>
          <button className="close" onClick={onClose} aria-label="Send them back to the bench">
            ✕
          </button>
        </div>
        <p className="case-body">"{item.q.prompt}"</p>
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
    </div>
  );
}
