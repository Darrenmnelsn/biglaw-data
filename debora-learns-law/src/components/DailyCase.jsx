import { useEffect, useMemo, useRef, useState } from "react";
import { QUESTION_POOL } from "../game/content.js";
import { hashString, mulberry32, seededShuffle } from "../game/rng.js";
import { buildDailyShare, copyToClipboard } from "../game/share.js";
import { sfx } from "../game/sound.js";

const DAILY_COUNT = 10;
const PER_QUESTION_MS = 20000;

function dailyQuestions(date) {
  const rand = mulberry32(hashString(`dll-daily-${date}`));
  const sorted = [...QUESTION_POOL].sort((a, b) => (a.id < b.id ? -1 : 1));
  return seededShuffle(sorted, rand)
    .slice(0, DAILY_COUNT)
    .map((q) => {
      if (!q.shuffleOptions) return q;
      const order = seededShuffle(q.options.map((_, i) => i), rand);
      return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
    });
}

export default function DailyCase({ save, onComplete, onHome }) {
  const date = new Date().toISOString().slice(0, 10);
  const done = save.daily[date];
  const questions = useMemo(() => dailyQuestions(date), [date]);

  const [idx, setIdx] = useState(0);
  const [grid, setGrid] = useState([]);
  const [reveal, setReveal] = useState(null); // { pickedIdx, correct }
  const [timeLeft, setTimeLeft] = useState(PER_QUESTION_MS);
  const [copied, setCopied] = useState(false);
  const startRef = useRef(Date.now());
  const elapsedRef = useRef(0);

  const finished = done || idx >= questions.length;
  const q = questions[idx];

  // per-question countdown
  useEffect(() => {
    if (finished || reveal) return;
    const qStart = Date.now();
    const t = setInterval(() => {
      const left = PER_QUESTION_MS - (Date.now() - qStart);
      setTimeLeft(left);
      if (left <= 0) answerWith(-1); // time out counts as a miss
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, finished, reveal]);

  // keyboard answers, matching the in-game shortcuts
  useEffect(() => {
    if (finished || reveal) return;
    const onKey = (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= q.options.length) answerWith(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, finished, reveal]);

  function answerWith(i) {
    if (reveal) return;
    const correct = i === q.answer;
    correct ? sfx.correct() : sfx.wrong();
    setReveal({ pickedIdx: i, correct });
    const nextGrid = [...grid, correct ? "🟩" : "🟥"];
    setGrid(nextGrid);
    setTimeout(() => {
      setReveal(null);
      setTimeLeft(PER_QUESTION_MS);
      if (idx + 1 >= questions.length) {
        elapsedRef.current = Date.now() - startRef.current;
        onComplete(date, {
          correct: nextGrid.filter((g) => g === "🟩").length,
          total: questions.length,
          ms: elapsedRef.current,
          grid: nextGrid,
        });
      }
      setIdx((v) => v + 1);
    }, correct ? 700 : 2200);
  }

  if (finished) {
    const r = done || {
      correct: grid.filter((g) => g === "🟩").length,
      total: questions.length,
      ms: elapsedRef.current,
      grid,
    };
    const share = async () => {
      const ok = await copyToClipboard(buildDailyShare({ date, ...r }));
      setCopied(ok);
      if (ok) setTimeout(() => setCopied(false), 2000);
    };
    return (
      <div className="screen daily">
        <h1>📅 Daily Case — {date}</h1>
        <div className="daily-result">
          <div className="daily-score">
            {r.correct}/{r.total}
          </div>
          <div className="daily-time">{(r.ms / 1000).toFixed(1)}s</div>
          <div className="daily-grid">{r.grid.join("")}</div>
        </div>
        <p className="comeback">Same 10 for everyone. New case at midnight. 👀</p>
        <div className="daily-actions">
          <button className="btn primary" onClick={share}>
            {copied ? "✓ Copied!" : "📋 Share"}
          </button>
          <button className="btn ghost" onClick={onHome}>
            Home
          </button>
        </div>
      </div>
    );
  }

  const pct = Math.max(0, (timeLeft / PER_QUESTION_MS) * 100);
  return (
    <div className="screen daily">
      <h1>📅 Daily Case</h1>
      <div className="daily-progress">
        Question {idx + 1}/{questions.length} <span className="daily-grid-live">{grid.join("")}</span>
      </div>
      <div className="deadline-bar big">
        <div className="deadline-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="case-view daily-q">
        <div className="case-head">
          <span className="from">From: {q.from}</span>
          <span className="subj-pill">{q.subject}</span>
        </div>
        <p className="case-body">{q.prompt}</p>
        <div className="options">
          {q.options.map((opt, i) => {
            let cls = "option";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === reveal.pickedIdx) cls += " wrong";
            }
            return (
              <button key={i} className={cls} disabled={!!reveal} onClick={() => answerWith(i)}>
                <kbd>{i + 1}</kbd> {opt}
              </button>
            );
          })}
        </div>
        {reveal && !reveal.correct && q.rule && <div className="rule-note inline">📚 {q.rule}</div>}
      </div>
      <button className="link" onClick={onHome}>
        Abandon (no result saved)
      </button>
    </div>
  );
}
